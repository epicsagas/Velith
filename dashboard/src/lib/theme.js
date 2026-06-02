import { writable } from 'svelte/store';

// Light/dark 각각 독립 액센트 색상 저장
const STORAGE_KEY_LIGHT = 'velith-accent-light';
const STORAGE_KEY_DARK  = 'velith-accent-dark';

const DEFAULT_LIGHT = '#e8650a';
const DEFAULT_DARK  = '#ff8c3a';

// 사이드바 액센트는 primary보다 약간 밝게
function sidebarAccent(hex) {
  return hex; // 동일하게 사용, 필요시 밝기 조정 가능
}

// primary에서 파생 색상 계산 (on-primary는 항상 흰색, container는 투명도)
function applyAccent(hex, isDark) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', hex);
  root.style.setProperty('--sidebar-accent', sidebarAccent(hex));
  // primary-container: 라이트는 연한 버전, 다크는 어두운 버전
  root.style.setProperty('--color-primary-container', isDark ? darken(hex, 0.5) : lighten(hex, 0.75));
  try {
    localStorage.setItem(isDark ? STORAGE_KEY_DARK : STORAGE_KEY_LIGHT, hex);
  } catch {}
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return [r, g, b];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

function lighten(hex, amount) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255-r)*amount, g + (255-g)*amount, b + (255-b)*amount);
}

function darken(hex, amount) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1-amount), g * (1-amount), b * (1-amount));
}

function getSaved(isDark) {
  try {
    return localStorage.getItem(isDark ? STORAGE_KEY_DARK : STORAGE_KEY_LIGHT) || (isDark ? DEFAULT_DARK : DEFAULT_LIGHT);
  } catch {
    return isDark ? DEFAULT_DARK : DEFAULT_LIGHT;
  }
}

export function initAccent(isDark) {
  const saved = getSaved(isDark);
  applyAccent(saved, isDark);
  return saved;
}

export function setAccent(hex, isDark) {
  applyAccent(hex, isDark);
  accentColor.set(hex);
}

export const accentColor = writable(DEFAULT_LIGHT);

// ── Font ─────────────────────────────────────────────────────────────────────

const FONT_STORAGE_KEY = 'velith-font';

export const FONT_OPTIONS = [
  {
    id: 'system',
    label: 'System',
    stack: "system-ui, -apple-system, 'Segoe UI', sans-serif",
    googleFont: null,
  },
  {
    id: 'geist',
    label: 'Geist',
    stack: "'Geist', system-ui, sans-serif",
    googleFont: 'Geist:wght@100..900',
  },
  {
    id: 'noto-sans',
    label: 'Noto Sans KR',
    stack: "'Noto Sans KR', 'Noto Sans JP', 'Noto Sans SC', 'Noto Sans', sans-serif",
    googleFont: 'Noto+Sans+KR:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700',
  },
  {
    id: 'noto-serif',
    label: 'Noto Serif KR',
    stack: "'Noto Serif KR', 'Noto Serif', serif",
    googleFont: 'Noto+Serif+KR:wght@400;500;600;700',
  },
  {
    id: 'inter',
    label: 'Inter',
    stack: "'Inter', system-ui, sans-serif",
    googleFont: 'Inter:wght@100..900',
  },
  {
    id: 'ibm-plex',
    label: 'IBM Plex Sans',
    stack: "'IBM Plex Sans', 'IBM Plex Sans KR', system-ui, sans-serif",
    googleFont: 'IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Sans+KR:wght@400;500;600;700',
  },
  {
    id: 'pretendard',
    label: 'Pretendard',
    stack: "'Pretendard Variable', 'Pretendard', system-ui, sans-serif",
    googleFont: null,
    cdnUrl: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css',
  },
];

const loadedFonts = new Set();

function loadGoogleFont(font) {
  if (!font.googleFont && !font.cdnUrl) return;
  const id = 'velith-font-' + font.id;
  if (loadedFonts.has(font.id) || document.getElementById(id)) {
    loadedFonts.add(font.id);
    return;
  }
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = font.cdnUrl
    ? font.cdnUrl
    : `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`;
  document.head.appendChild(link);
  loadedFonts.add(font.id);
}

export const fontId = writable('geist');

export function initFont() {
  try {
    const saved = localStorage.getItem(FONT_STORAGE_KEY) || 'geist';
    const font = FONT_OPTIONS.find(f => f.id === saved) || FONT_OPTIONS[1];
    applyFont(font);
    return font.id;
  } catch {
    return 'geist';
  }
}

export function setFont(id) {
  const font = FONT_OPTIONS.find(f => f.id === id);
  if (!font) return;
  applyFont(font);
  fontId.set(id);
  try { localStorage.setItem(FONT_STORAGE_KEY, id); } catch {}
}

function applyFont(font) {
  loadGoogleFont(font);
  document.body.style.fontFamily = font.stack;
}

export const PRESET_COLORS = [
  { label: 'Orange',  light: '#e8650a', dark: '#ff8c3a' },
  { label: 'Red',     light: '#c0392b', dark: '#e74c3c' },
  { label: 'Pink',    light: '#c0185a', dark: '#e91e8c' },
  { label: 'Purple',  light: '#7b2fa0', dark: '#ab47bc' },
  { label: 'Indigo',  light: '#3949ab', dark: '#7986cb' },
  { label: 'Blue',    light: '#1565c0', dark: '#42a5f5' },
  { label: 'Teal',    light: '#00695c', dark: '#26a69a' },
  { label: 'Green',   light: '#2e7d32', dark: '#66bb6a' },
];
