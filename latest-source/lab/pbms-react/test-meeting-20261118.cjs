const {chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');
const out=process.env.PBMS_TEST_OUTPUT||'evidence/meeting-20261118';fs.mkdirSync(out,{recursive:true});
if(!process.env.PBMS_APPROVAL_ACCOUNTS_FILE||!process.env.PBMS_BASE_URL)throw Error('Set PBMS_APPROVAL_ACCOUNTS_FILE and PBMS_BASE_URL for your isolated test deployment.');
const accounts=JSON.parse(fs.readFileSync(process.env.PBMS_APPROVAL_ACCOUNTS_FILE,'utf8'));
const base=process.env.PBMS_BASE_URL.replace(/\/?$/,'/');
const local=process.env.PBMS_TEST_DEPLOYED!=='1';
async function rpc(p,model,method,args=[],kwargs={}){return p.evaluate(async({model,method,args,kwargs})=>{const x=await fetch('/web/dataset/call_kw/'+model+'/'+method,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',params:{model,method,args,kwargs}})}).then(r=>r.json());if(x.error)throw Error(x.error.data?.message||x.error.message);return x.result;},{model,method,args,kwargs});}
(async()=>{const browser=await chromium.launch({...(process.env.PBMS_BROWSER_CHANNEL?{channel:process.env.PBMS_BROWSER_CHANNEL}:{}),headless:true});const results=[];try{
 for(const role of (process.env.PBMS_TEST_ROLE?[process.env.PBMS_TEST_ROLE]:['admin','payment','finance','audit','ceo'])){
  const ctx=await browser.newContext({viewport:{width:1440,height:1000}}),p=await ctx.newPage();p.setDefaultTimeout(25000);
  if(local)for(const ext of ['js','css'])await p.route('**/pbms-ui/app.'+ext,r=>r.fulfill({path:'dist/app.'+ext,contentType:ext==='js'?'application/javascript':'text/css'}));
  const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'#programmes');await p.getByLabel('Email',{exact:true}).fill(accounts[role].login);await p.getByLabel('Password',{exact:true}).fill(accounts[role].password);await p.getByRole('button',{name:'Sign in →'}).click();await p.getByRole('button',{name:'Sign out',exact:true}).waitFor();
  await p.getByRole('button',{name:'Open →',exact:true}).first().waitFor();
  const programmes=await rpc(p,'g2p.program.definition','search_read',[[]],{fields:['program_mnemonic','nsipa_flow','benefit_code_ids'],order:'id desc'});assert(programmes.length>=2);
  const target=programmes.find(x=>x.id===Number(process.env.PBMS_TEST_PROGRAM_ID))||programmes.find(x=>x.nsipa_flow)||programmes[0];assert(target.nsipa_flow,'Choose an approval-flow programme fixture');
  const hidden=['lists','eligibility','entitlements','benefits','programme-benefits'];for(const key of hidden)assert.equal(await p.locator('.sidebar nav a[href="#'+key+'"]').count(),0,key);
  for(const key of ['enrollment','disbursement','programmes','programme-flow','approvals','payments'])assert.equal(await p.locator('.sidebar nav a[href="#'+key+'"]').count(),1,key);
  await p.getByRole('button',{name:'Open →',exact:true}).first().click();await p.getByRole('navigation',{name:'Programme sections'}).waitFor();assert(p.url().includes('programme-detail?program_id='));
  await p.goto(base+'#programme-detail?program_id='+target.id);await p.getByRole('navigation',{name:'Programme sections'}).waitFor();
  const expected={};
  for(const [key,label] of [['programme-benefits','Programme benefits'],['benefits','Benefit codes'],['eligibility','Eligibility rules'],['entitlements','Entitlement rules'],['lists','Beneficiary lists'],['enrollment-workflow','Enrollment workflow'],['disbursement-workflow','Disbursement workflow']]){
   await p.getByRole('navigation',{name:'Programme sections'}).getByRole('link',{name:label,exact:true}).click();await p.getByRole('navigation',{name:'Programme sections'}).waitFor();
   await p.waitForFunction(key=>document.querySelector('.programme-tabs a[aria-current="page"]')?.getAttribute('href').startsWith('#'+key+'?')&&document.querySelector('.table-wrap[aria-busy="false"]')&&!document.querySelector('main').textContent.includes('Loading records'),key);
   const alerts=await p.getByRole('alert').allTextContents();assert.equal(alerts.length,0,role+' '+key+' '+alerts.join(';'));
   assert.equal(await p.getByLabel('Workspace programme',{exact:true}).inputValue(),String(target.id));
   const model=key==='benefits'?'g2p.benefit.codes':key==='programme-benefits'?'g2p.program.benefit.codes':key==='eligibility'?'g2p.eligibility.rule.definition':key==='entitlements'?'g2p.entitlement.rule.definition':'g2p.beneficiary.list';
   const domain=key==='benefits'?[['id','in',target.benefit_code_ids]]:[['program_id','=',target.id],...key.endsWith('workflow')?[['list_stage','=',key.startsWith('enrollment')?'enrollment':'disbursement']]:[]];
   expected[key]=await rpc(p,model,'search_count',[domain]);
   const body=await p.locator('main').innerText();assert(body.includes(expected[key]+' records'),key+' count '+expected[key]+' '+body.slice(-400));
   if(role==='admin'&&key==='eligibility'){
    const create=p.getByRole('button',{name:'+ New record',exact:true});if(await create.count()){
     await create.click();const dialog=p.getByRole('dialog');await dialog.getByRole('button',{name:'Save record',exact:true}).waitFor();
     const select=dialog.getByLabel('Program',{exact:true});if(await select.count())assert(await select.isDisabled());
     const disabledPrograms=await dialog.locator('select:disabled').count();assert(disabledPrograms>=1,'Scoped programme must be locked');await dialog.getByRole('button',{name:'Cancel',exact:true}).click();
    }
   }
   if(role==='admin'&&key==='disbursement-workflow')await p.screenshot({path:out+'/workflow-desktop.png',fullPage:true});
   if(key.endsWith('workflow')&&expected[key]>0){await p.getByRole('button',{name:'Open →',exact:true}).first().click();await p.getByRole('button',{name:'Close list',exact:true}).waitFor();await p.getByRole('heading',{name:/^Beneficiaries/}).waitFor().catch(async()=>{await p.screenshot({path:out+'/failed-review.png',fullPage:true});throw Error(role+' '+key+' list review: '+(await p.getByRole('alert').allTextContents()).join(';')+' at '+p.url()+' headings '+(await p.locator('main h1,main h2,main h3').allTextContents()).join('|'));});await p.getByRole('button',{name:'Close list',exact:true}).click();await p.getByRole('link',{name:'Programme workspace',exact:false}).click();await p.getByRole('navigation',{name:'Programme sections'}).waitFor();}
  }
  const other=programmes.find(x=>x.id!==target.id);await p.getByLabel('Workspace programme',{exact:true}).selectOption(String(other.id));await p.getByRole('navigation',{name:'Programme sections'}).waitFor();assert(p.url().includes('program_id='+other.id));await p.reload();await p.getByRole('navigation',{name:'Programme sections'}).waitFor();assert.equal(await p.getByLabel('Workspace programme',{exact:true}).inputValue(),String(other.id));
  if(role==='admin'){
   await p.goto(base+'#eligibility');await p.getByLabel('Workspace programme',{exact:true}).waitFor();assert.equal(await p.locator('table').count(),0,'Unscoped old link must request a programme');
   await p.goto(base+'#programme-detail?program_id='+target.id);await p.getByRole('navigation',{name:'Programme sections'}).waitFor();
   await p.screenshot({path:out+'/programme-desktop.png',fullPage:true});await p.setViewportSize({width:390,height:844});await p.screenshot({path:out+'/programme-mobile.png',fullPage:true});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().right>innerWidth).slice(0,8).map(e=>({tag:e.tagName,class:e.className,width:e.getBoundingClientRect().width,text:e.textContent.slice(0,50)})))));
  }
  const groups=await Promise.all(['base.group_erp_manager','base.group_system'].map(g=>rpc(p,'res.users','has_group',[g])));
  assert.equal(await p.getByRole('link',{name:'User access settings ↗',exact:true}).count(),groups[0]?1:0);assert.equal(await p.getByRole('link',{name:'Developer apps ↗',exact:true}).count(),groups[1]?1:0);
  assert.equal(errors.length,0,errors.join(';'));results.push({role,status:'passed',programmeSections:expected,adminLinksMatchNativeGroups:true,noJavascriptErrors:true});await ctx.close();console.log('PASS '+role);
 }
 fs.writeFileSync(out+'/'+(local?'candidate':'deployed')+'-verification.json',JSON.stringify({status:'passed',readOnly:true,roles:results},null,2));
 }finally{await browser.close();}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
