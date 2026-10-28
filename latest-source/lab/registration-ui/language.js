(() => {
  'use strict';
  const storageKey = 'iqs-display-language';
  const labels = {
    en: { language: 'Language', home: 'Registration & enrollment', services: 'All services', signin: 'Staff sign in', signout: 'Sign out', notice: '' },
    ha: { language: 'Harshe', home: 'Rajista', services: 'Dukkan ayyuka', signin: 'Shiga na ma’aikata', signout: 'Fita', notice: 'Preview: some navigation is translated. Forms, guidance and decisions remain in English. Translations require review.' },
    yo: { language: 'Èdè', home: 'Ìforúkọsílẹ̀', services: 'Gbogbo iṣẹ́', signin: 'Ìwọlé oṣiṣẹ́', signout: 'Jade', notice: 'Preview: some navigation is translated. Forms, guidance and decisions remain in English. Translations require review.' },
    ig: { language: 'Asụsụ', home: 'Ndebanye aha', services: 'Ọrụ niile', signin: 'Nbanye ndị ọrụ', signout: 'Pụọ', notice: 'Preview: some navigation is translated. Forms, guidance and decisions remain in English. Translations require review.' }
  };
  const selector = document.getElementById('display-language');
  if (!selector) return;
  const change = (language) => {
    const selected = Object.hasOwn(labels, language) ? language : 'en';
    const translations = labels[selected];
    selector.value = selected;
    document.querySelectorAll('[data-i18n]').forEach(node => {
      const value = translations[node.dataset.i18n];
      if (value !== undefined) { node.textContent = value; node.lang = selected; }
    });
    const notice = document.getElementById('language-preview-notice');
    notice.textContent = translations.notice;
    notice.hidden = !translations.notice;
    // Only navigation is translated; keep the document language English for assistive technology.
    try { localStorage.setItem(storageKey, selected); } catch (_) { /* storage may be unavailable */ }
  };
  let saved = 'en';
  try { saved = localStorage.getItem(storageKey) || 'en'; } catch (_) { /* use English */ }
  selector.addEventListener('change', () => change(selector.value));
  change(saved);
})();

