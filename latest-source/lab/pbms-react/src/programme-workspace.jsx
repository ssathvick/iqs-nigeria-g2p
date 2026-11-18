import React,{useEffect,useState} from 'react';
import {call} from './api';
import {catalog,programmeFields} from './catalog';
import {fieldLabel} from './labels';
import './programme-workspace.css';

export const programmeSections=['programme-benefits','benefits','eligibility','entitlements','lists','enrollment-workflow','disbursement-workflow'];
const tabs=[['overview','Programme information'],['programme-benefits','Programme benefits'],['benefits','Benefit codes'],['eligibility','Eligibility rules'],['entitlements','Entitlement rules'],['lists','Beneficiary lists'],['enrollment-workflow','Enrollment workflow'],['disbursement-workflow','Disbursement workflow']];
const display=v=>v===true?'Yes':v===false?'No':Array.isArray(v)?v[1]:String(v??'—');

export function ProgrammeWorkspace({programId,initialTab='overview',scope={},onNavigate,Records,ProgrammeForm}){
 const[program,P]=useState(null),[fields,F]=useState({}),[programs,PS]=useState([]),[error,E]=useState(''),[edit,ED]=useState(false),[canEdit,CE]=useState(false),[revision,R]=useState(0),[stages,ST]=useState([]),[shared,SH]=useState(false);
 const tab=tabs.some(([key])=>key===initialTab)?initialTab:'overview';
 useEffect(()=>{let live=true;E('');P(null);(async()=>{try{
  const options=await call('g2p.program.definition','search_read',[[]],{fields:['program_mnemonic'],order:'program_mnemonic',limit:10000});if(live)PS(options);
  if(!programId)return;
  const meta=await call('g2p.program.definition','fields_get',[],{attributes:['string','type','selection','relation','required','readonly','help']});
  const names=[...programmeFields,'nsipa_flow','nsipa_setup_ready','benefit_code_ids'].filter(k=>meta[k]);
  const [row]=await call('g2p.program.definition','read',[[Number(programId)]],{fields:names});
  if(!row)throw Error('This programme is unavailable to your account. Select another programme.');
  const rights=await Promise.all([call('g2p.program.definition','check_access_rights',['write',false]),call('res.users','has_group',['g2p_pbms.group_program_editor']),call('res.users','has_group',['g2p_pbms.group_program_super_administration'])]);
  if(live){P(row);F(meta);CE(rights[0]&&(rights[1]||rights[2]));}
  if(row.nsipa_flow){const workspace=await call('g2p.program.definition','nsipa_workspace',[[Number(programId)]]);if(live)ST(workspace.stages||[]);}
 }catch(e){if(live)E(e.message);}})();return()=>{live=false;};},[programId,revision]);
 const choose=id=>onNavigate(tab==='overview'?'programme-detail':tab,{program_id:Number(id)});
 const context={program_id:Number(programId),...Object.fromEntries(Object.entries(scope).filter(([k])=>['enrollment_cycle_id','disbursement_cycle_id'].includes(k)))};
 const workflow=tab.endsWith('-workflow'),enrollment=tab==='enrollment-workflow';
 let item=catalog.find(c=>c.key===tab);
 if(workflow)item={...catalog.find(c=>c.key==='lists'),key:tab,label:enrollment?'Enrollment lists and workflow':'Disbursement lists and workflow',description:'Open a list to review its calculation, evidence and approval history. Create new lists from the corresponding cycle.',workflowOnly:true,domain:[['list_stage','=',enrollment?'enrollment':'disbursement']]};
 if(item&&tab!=='benefits')item={...item,columns:item.columns.filter(k=>k!=='program_id'&&(!workflow||k!=='list_stage'))};
 if(tab==='benefits'&&program&&!shared)item={...item,domain:[['id','in',program.benefit_code_ids||[]]]};
 return <section className="programme-workspace">
  <a href="#programmes">← All programmes</a>
  <div className="page-heading"><div><p className="eyebrow">PROGRAMME WORKSPACE</p><h1>{program?.program_mnemonic||'Select a programme'}</h1><p>Programme information, benefits, rules and workflows in one place.</p></div><button onClick={()=>R(v=>v+1)}>Refresh programme</button></div>
  <label className="programme-selector">Programme<select aria-label="Workspace programme" value={programId||''} onChange={e=>e.target.value&&choose(e.target.value)}><option value="">Select a programme</option>{programs.map(p=><option key={p.id} value={p.id}>{p.program_mnemonic}</option>)}</select></label>
  {error&&<p role="alert" className="error">{error}</p>}
  {!programId&&<p>Select a programme to view its {tabs.find(([k])=>k===tab)?.[1].toLowerCase()}.</p>}
  {programId&&!program&&!error&&<p role="status">Loading programme…</p>}
  {program&&<>
   <div className="programme-context" role="status">Programme: <strong>{program.program_mnemonic}</strong> · {program.program_status} · {program.target_registry} registry</div>
   <nav className="programme-tabs" aria-label="Programme sections">{tabs.map(([key,label])=><a key={key} href={'#'+(key==='overview'?'programme-detail':key)+'?program_id='+programId} aria-current={tab===key?'page':undefined}>{label}</a>)}</nav>
   {tab==='overview'?<section className="panel programme-information"><div className="section-head"><h2>Programme information</h2>{canEdit&&<button onClick={()=>ED(true)}>Edit programme settings</button>}</div><dl className="details-grid">{programmeFields.filter(k=>fields[k]).map(k=><div key={k}><dt>{fieldLabel(k,fields[k])}</dt><dd>{fields[k].selection?.find(([v])=>v===program[k])?.[1]||display(program[k])}</dd></div>)}</dl><div className="actions"><a href={'#enrollment?program_id='+programId}>Enrollment cycles →</a><a href={'#disbursement?program_id='+programId}>Disbursement cycles →</a><a href={'#programme-analytics?program_id='+programId}>Programme analytics →</a>{program.nsipa_flow&&<a href={'#programme-flow?program_id='+programId}>Programme setup and approval overview →</a>}</div></section>:<>
    {workflow&&<section className="panel programme-information"><div className="section-head"><h2>{enrollment?'Enrollment workflow':'Disbursement workflow'}</h2>{canEdit&&<button onClick={()=>ED(true)}>Edit workflow settings</button>}</div><dl className="details-grid"><div><dt>Frequency</dt><dd>{display(program[enrollment?'enrollment_frequency':'disbursement_frequency'])}</dd></div><div><dt>Required verifications</dt><dd>{display(program[enrollment?'verifications_for_enrolment':'verifications_for_disbursement'])}</dd></div><div><dt>Automatic approval</dt><dd>{display(program[enrollment?'auto_approve_enrolment':'auto_approve_disbursement'])}</dd></div></dl>{program.nsipa_flow&&<><p>{enrollment?'Eligible enrollment lists are approved automatically after processing.':'Payment submits the list, then Finance, Audit and CEO approve in sequence. Payment proceeds after CEO approval.'}</p>{!enrollment&&<ol>{stages.map(s=><li key={s.id}>{s.name} · {s.group_id[1]}</li>)}</ol>}<p>Monthly approval-flow policies and locks are enforced by PBMS.</p><a href={'#programme-flow?program_id='+programId}>Open programme setup and approval history →</a></>}<p><a href={'#'+(enrollment?'enrollment':'disbursement')+'?program_id='+programId}>Open {enrollment?'enrollment':'disbursement'} cycles →</a></p></section>}
    {tab==='benefits'&&<div className="programme-information"><p>Benefit codes are shared master data. Programme benefits controls which codes are assigned to this programme.</p><button onClick={()=>SH(v=>!v)}>{shared?'Show assigned benefit codes':'Manage shared benefit catalogue'}</button>{shared&&<p role="status">Shared catalogue across programmes. Changes to a code affect every programme using it.</p>}</div>}
    {item&&<Records key={tab+programId+shared+revision} item={item} scope={tab==='benefits'?{}:context} embedded onNavigate={onNavigate}/>}
   </>}
   {edit&&<ProgrammeForm item={catalog[0]} record={program} fields={fields} onClose={()=>ED(false)} onSaved={()=>{ED(false);R(v=>v+1);}}/>}
  </>}
 </section>;
}
