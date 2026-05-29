import { writable, derived } from 'svelte/store';
import en from '../locales/en.js';
import ko from '../locales/ko.js';
import ja from '../locales/ja.js';
import zh from '../locales/zh.js';
import es from '../locales/es.js';
import fr from '../locales/fr.js';
import de from '../locales/de.js';
import pt from '../locales/pt.js';
import it from '../locales/it.js';
import ru from '../locales/ru.js';

const LOCALES = { en, ko, ja, zh, es, fr, de, pt, it, ru };
const VALID = new Set(Object.keys(LOCALES));

const DISPLAY = {
  ko: '한국어', en: 'English', ja: '日本語', zh: '中文', es: 'Español',
  fr: 'Français', de: 'Deutsch', pt: 'Português', it: 'Italiano', ru: 'Русский',
};

const DATE_LOCALE = {
  ko: 'ko-KR', en: 'en-US', ja: 'ja-JP', zh: 'zh-CN', es: 'es-ES',
  fr: 'fr-FR', de: 'de-DE', pt: 'pt-BR', it: 'it-IT', ru: 'ru-RU',
};

function getInitial() {
  try {
    const s = localStorage.getItem('bf-locale');
    if (s && VALID.has(s)) return s;
  } catch {}
  return 'ko';
}

export const locale = writable(getInitial());
locale.subscribe((v) => {
  try { localStorage.setItem('bf-locale', v); } catch {}
});

export const i18n = derived(locale, ($locale) => {
  const dict = LOCALES[$locale];
  return {
    locale: $locale,
    t(key, params) {
      let val = dict[key] ?? en[key] ?? key;
      if (params) val = val.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
      return val;
    },
    fmtDate(iso) {
      if (!iso) return '—';
      try { return new Date(iso).toLocaleString(DATE_LOCALE[$locale]); }
      catch { return iso; }
    },
    displayNames: DISPLAY,
    allLocales: Object.keys(LOCALES),
  };
});
