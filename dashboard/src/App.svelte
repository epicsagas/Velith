<script>
  import { i18n, locale } from './lib/i18n.js';
  import { NAV_ITEMS, VALID_VIEWS, SAMPLE_DATA } from './lib/data.js';
  import { initAccent, accentColor, initFont, fontId, setFont } from './lib/theme.js';
  import { get } from 'svelte/store';
  import OverviewView from './views/OverviewView.svelte';
  import StatusView from './views/StatusView.svelte';
  import OutlineView from './views/OutlineView.svelte';
  import DraftsView from './views/DraftsView.svelte';
  import EditsView from './views/EditsView.svelte';
  import PublishView from './views/PublishView.svelte';
  import SettingsView from './views/SettingsView.svelte';
  import HelpView from './views/HelpView.svelte';

  let dataState = $state({ kind: 'loading' });
  let bookIndex = $state(null);
  let activeView = $state('overview');
  let isDark = $state(document.documentElement.classList.contains('dark'));
  let mobileMenuOpen = $state(false);
  let showToast = $state(false);
  let autoRefresh = $state(true);

  let currentI18n = $state(get(i18n));
  $effect(() => {
    const unsub = i18n.subscribe(val => { currentI18n = val; });
    return unsub;
  });

  const isExample = new URLSearchParams(window.location.search).has('example');

  function parsePath() {
    const parts = window.location.pathname.replace(/^\//, '').split('/');
    if (parts[0] !== '') {
      const idx = parseInt(parts[0], 10);
      if (!isNaN(idx)) bookIndex = idx;
    }
    if (parts[1] && VALID_VIEWS.has(parts[1])) activeView = parts[1];
  }

  function syncUrl() {
    const path = bookIndex !== null ? `/${bookIndex}/${activeView}` : '/';
    history.replaceState(null, '', path + (isExample ? '?example' : ''));
  }

  function setActiveView(id) {
    activeView = id;
    mobileMenuOpen = false;
    syncUrl();
  }

  async function fetchData() {
    if (isExample) return;
    try {
      const res = await fetch('/status.json?t=' + Date.now());
      if (res.status === 404) { dataState = { kind: 'empty' }; return; }
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      dataState = { kind: 'ok', data };
    } catch (e) {
      if (dataState.kind === 'ok') {
        dataState = { ...dataState, refreshError: e.message };
      } else {
        dataState = { kind: 'error', error: e.message };
      }
    }
  }

  let statusData = $derived(
    isExample ? SAMPLE_DATA :
    dataState.kind === 'ok' ? dataState.data : null
  );
  let projects = $derived(statusData?.projects ?? []);
  let agents  = $derived(statusData?.agents ?? []);
  let project = $derived(bookIndex !== null ? projects[bookIndex] ?? null : null);

  $effect(() => {
    parsePath();
    if (isExample) {
      dataState = { kind: 'ok', data: SAMPLE_DATA };
    } else {
      fetchData();
    }
    const onPop = () => parsePath();
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  });

  $effect(() => {
    if (!autoRefresh || isExample) return;
    const id = setInterval(() => { if (!document.hidden) fetchData(); }, 5000);
    return () => clearInterval(id);
  });

  // 초기 액센트·폰트 적용
  let currentAccent = $state(initAccent(isDark));
  let currentFont = $state(initFont());
  $effect(() => {
    const unsub = fontId.subscribe(v => { currentFont = v; });
    return unsub;
  });
  $effect(() => {
    const unsub = accentColor.subscribe(v => { currentAccent = v; });
    return unsub;
  });

  function toggleTheme() {
    isDark = !isDark;
    document.documentElement.classList.toggle('dark', isDark);
    try { localStorage.setItem('velith-theme', isDark ? 'dark' : 'light'); } catch {}
    // 테마 전환 시 해당 모드의 저장된 액센트 복원
    currentAccent = initAccent(isDark);
  }

  async function copyToClipboard(text) {
    try { await navigator.clipboard.writeText(text); } catch {}
    showToast = true;
    setTimeout(() => { showToast = false; }, 1500);
  }

  function relativeTime(iso) {
    if (!iso) return null;
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1)  return { label: currentI18n.t('app.justNow'), warn: false };
    if (mins < 60) return { label: currentI18n.t('app.minutesAgo', { n: mins }), warn: mins >= 10 };
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return { label: currentI18n.t('app.hoursAgo', { n: hrs }), warn: true };
    return { label: currentI18n.t('app.hoursAgo', { n: Math.floor(hrs / 24) * 24 }), warn: true };
  }
</script>

<!-- Example banner -->
{#if isExample}
  <div class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-primary-container px-4 py-1.5 text-xs font-medium text-on-primary-container border-b border-primary">
    <span>⬆ {currentI18n.t('app.exampleBanner')}</span>
    <a href={window.location.pathname} class="flex items-center gap-1 hover:underline">
      <span class="material-symbols-outlined text-sm">arrow_upward</span>
      {currentI18n.t('app.backToLive')}
    </a>
  </div>
{/if}

{#if mobileMenuOpen}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="fixed inset-0 bg-black/50 z-30 md:hidden" onclick={() => mobileMenuOpen = false} role="presentation"></div>
{/if}

<div class="flex min-h-screen bg-background {isExample ? 'pt-8' : ''}">

  <!-- Sidebar -->
  <aside class="fixed left-0 bottom-0 w-52 bg-sidebar-bg text-sidebar-text flex flex-col z-40 shadow-xl
    {isExample ? 'top-8' : 'top-0'}
    {mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    transition-transform duration-200">

    <!-- Logo -->
    <div class="px-4 py-3 border-b border-sidebar-border shrink-0">
      <button class="flex items-center gap-2.5" onclick={() => { bookIndex = null; syncUrl(); }}>
        <span class="material-symbols-outlined fill-icon text-xl text-sidebar-accent">book_2</span>
        <div class="text-left">
          <p class="font-bold text-base leading-none text-sidebar-text" style="font-family:'Newsreader',serif;">Velith</p>
          <p class="text-xs text-sidebar-muted tracking-widest uppercase mt-0.5">Writing Dashboard</p>
        </div>
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto py-1">
      {#each NAV_ITEMS as item}
        {@const active = activeView === item.id && (bookIndex !== null || item.id === 'help')}
        {@const enabled = bookIndex !== null || item.id === 'help'}
        <button
          class="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left
            {active ? 'bg-sidebar-active text-sidebar-text' : 'text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-text'}
            {!enabled ? 'opacity-30 cursor-not-allowed' : ''}"
          onclick={() => enabled && setActiveView(item.id)}
          aria-current={active ? 'page' : undefined}
        >
          <span class="material-symbols-outlined text-base {active ? 'text-sidebar-accent' : ''}">{item.icon}</span>
          <span class="text-xs tracking-widest uppercase font-semibold">{currentI18n.t(item.labelKey)}</span>
        </button>
      {/each}

      {#if projects.length > 1}
        <div class="border-t border-sidebar-border mt-1 pt-2 px-3">
          <p class="text-xs text-sidebar-muted mb-1 uppercase tracking-widest px-1">Projects</p>
          {#each projects as p, i}
            <button
              class="w-full text-left px-2 py-1.5 rounded text-xs transition-colors
                {bookIndex === i ? 'bg-sidebar-active text-sidebar-text' : 'text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-text'}"
              onclick={() => { bookIndex = i; setActiveView('overview'); syncUrl(); }}
            >{p.name}</button>
          {/each}
        </div>
      {/if}
    </nav>

    <!-- Bottom: project info -->
    <div class="px-4 py-2.5 border-t border-sidebar-border shrink-0">
      {#if project}
        <button class="flex items-center gap-1 text-xs text-sidebar-muted hover:text-sidebar-text mb-1 uppercase tracking-wider"
          onclick={() => { bookIndex = null; syncUrl(); }}>
          <span class="material-symbols-outlined text-xs">arrow_back</span>
          Select a project
        </button>
        <p class="text-xs text-sidebar-text font-medium truncate">{project.name}</p>
        <p class="text-xs text-sidebar-muted truncate capitalize">{project.genre} · {project.language ?? 'ko'}</p>
      {:else}
        <p class="text-xs text-sidebar-muted">No project</p>
      {/if}
    </div>
  </aside>

  <!-- Main -->
  <div class="md:ml-52 flex flex-col flex-1 min-h-screen">

    <!-- Header -->
    <header class="sticky z-20 h-11 bg-surface border-b border-outline-variant flex items-center px-4 gap-2
      {isExample ? 'top-8' : 'top-0'}">
      <button class="md:hidden p-1 rounded hover:bg-surface-container" onclick={() => mobileMenuOpen = !mobileMenuOpen}>
        <span class="material-symbols-outlined text-sm">menu</span>
      </button>
      <div class="flex-1"></div>

      <a
        href="https://github.com/epicsagas/Velith"
        target="_blank"
        rel="noopener noreferrer"
        class="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border border-outline-variant text-secondary hover:bg-surface-container transition-colors uppercase tracking-wider"
      >
        <span class="material-symbols-outlined text-sm">star</span>
        Star
      </a>
      <a
        href="https://github.com/sponsors/epicsagas"
        target="_blank"
        rel="noopener noreferrer"
        class="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border border-outline-variant text-secondary hover:bg-surface-container transition-colors uppercase tracking-wider"
      >
        <span class="material-symbols-outlined text-sm">favorite</span>
        Sponsor
      </a>
      <button
        class="p-1.5 rounded border border-outline-variant text-secondary hover:bg-surface-container transition-colors"
        onclick={toggleTheme}
        aria-label="Toggle theme"
      >
        <span class="material-symbols-outlined text-sm">{isDark ? 'light_mode' : 'dark_mode'}</span>
      </button>
      <div class="relative">
        <select
          class="appearance-none bg-surface text-on-surface rounded pl-2 pr-7 py-1 text-xs font-semibold border border-outline-variant uppercase tracking-wider cursor-pointer"
          value={currentI18n.locale}
          onchange={(e) => locale.set(e.target.value)}
        >
          {#each currentI18n.allLocales as loc}
            <option value={loc}>{loc.toUpperCase()}</option>
          {/each}
        </select>
        <span class="pointer-events-none material-symbols-outlined text-secondary" style="position:absolute;right:4px;top:50%;transform:translateY(-50%);font-size:14px;line-height:1;display:block;vertical-align:unset">expand_more</span>
      </div>
    </header>

    <!-- Content -->
    <main id="main-content" class="flex-1 p-4 md:p-6">

      {#if dataState.kind === 'loading'}
        <div class="flex items-center justify-center h-64">
          <div class="flex flex-col items-center gap-3 text-secondary">
            <span class="material-symbols-outlined text-4xl" style="animation:spin 1s linear infinite">autorenew</span>
            <p class="text-sm tracking-wider uppercase">{currentI18n.t('app.loading')}</p>
          </div>
        </div>

      {:else if dataState.kind === 'empty'}
        <div class="flex flex-col items-center justify-center h-64 text-center space-y-4">
          <span class="material-symbols-outlined text-6xl text-outline">menu_book</span>
          <p class="text-sm font-semibold uppercase tracking-wider">{currentI18n.t('app.noData')}</p>
          <p class="text-xs text-secondary max-w-sm">{currentI18n.t('app.noDataHint')}</p>
          <code class="text-primary font-mono text-sm bg-surface-container px-3 py-1 rounded">{currentI18n.t('app.noDataCmd')}</code>
          <a href="?example" class="text-primary underline text-xs">{currentI18n.t('app.viewExample')}</a>
        </div>

      {:else if activeView === 'help'}
        <HelpView {agents} i18n={currentI18n} {copyToClipboard} />

      {:else if project === null}
        <!-- Project selection landing -->
        <div class="flex flex-col items-center justify-center min-h-[65vh]">
          <div class="flex items-center gap-3 mb-1">
            <span class="material-symbols-outlined fill-icon text-5xl text-primary">book_2</span>
            <h1 class="text-5xl font-bold text-on-surface" style="font-family:'Newsreader',serif;">Velith</h1>
          </div>
          <p class="text-xs tracking-widest uppercase text-secondary mb-10">Select a Project</p>
          <div class="w-full max-w-lg space-y-2">
            {#each projects as p, i}
              <button
                class="w-full flex items-center gap-4 p-4 rounded border border-outline-variant bg-surface-container-lowest hover:bg-surface-container transition-colors text-left"
                onclick={() => { bookIndex = i; setActiveView('overview'); syncUrl(); }}
              >
                <div class="w-12 h-16 bg-surface-container rounded flex items-center justify-center shrink-0 border border-outline-variant">
                  <span class="material-symbols-outlined text-2xl text-outline">menu_book</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-bold uppercase tracking-wide text-sm truncate">{p.name}</p>
                  <p class="text-xs text-secondary capitalize mt-0.5">{p.genre} · {p.language ?? 'ko'}</p>
                  <p class="text-xs text-on-surface-variant mt-1 font-mono">
                    {(p.total_words ?? 0).toLocaleString()}w · {p.completed_chapters ?? 0}/{p.total_chapters ?? 0} chapters
                  </p>
                </div>
                <span class="material-symbols-outlined text-secondary">chevron_right</span>
              </button>
            {/each}
          </div>
        </div>

      {:else if activeView === 'overview'}
        <OverviewView {project} projectIndex={bookIndex} {agents} i18n={currentI18n} {copyToClipboard} />
      {:else if activeView === 'status'}
        <StatusView {agents} i18n={currentI18n} />
      {:else if activeView === 'outline'}
        <OutlineView {project} i18n={currentI18n} {copyToClipboard} />
      {:else if activeView === 'drafts'}
        <DraftsView {project} i18n={currentI18n} {copyToClipboard} />
      {:else if activeView === 'edits'}
        <EditsView {project} i18n={currentI18n} {copyToClipboard} />
      {:else if activeView === 'publish'}
        <PublishView {project} projectIndex={bookIndex} i18n={currentI18n} {copyToClipboard} />
      {:else if activeView === 'settings'}
        <SettingsView {project} {agents} i18n={currentI18n} {copyToClipboard} {isDark} accent={currentAccent} font={currentFont} />
      {/if}
    </main>

    <!-- Footer -->
    <footer class="sticky bottom-0 z-10 bg-surface border-t border-outline-variant px-4 py-1.5 flex items-center gap-4 text-xs text-secondary">
      {#if project}
        {@const rt = relativeTime(project.last_updated)}
        <span class="{rt?.warn ? 'text-error' : ''}">
          Generated: {currentI18n.fmtDate(project.last_updated)}
          {#if rt} ({rt.label}{rt.warn ? ' ⚠' : ''}){/if}
        </span>
      {:else}
        <span>No project</span>
      {/if}
      <span class="flex-1 text-center hidden sm:block">{currentI18n.t('app.clickHint')}</span>
      <button class="flex items-center gap-1 hover:text-on-surface uppercase tracking-wider font-semibold" onclick={toggleTheme}>
        <span class="material-symbols-outlined text-xs">{isExample ? 'science' : 'live_tv'}</span>
        {isExample ? 'Example Mode' : 'Live Data'}
      </button>
    </footer>
  </div>
</div>

<!-- Toast -->
{#if showToast}
  <div class="animate-fade-in fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded shadow-xl flex items-center gap-2 text-xs pointer-events-none uppercase tracking-wider font-semibold">
    <span class="material-symbols-outlined text-sm">check_circle</span>
    {currentI18n.t('app.copied')}
  </div>
{/if}

<style>
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fade-in {
    from { opacity: 0; transform: translate(-50%) translateY(8px); }
    to   { opacity: 1; transform: translate(-50%) translateY(0); }
  }
  .animate-fade-in { animation: fade-in 0.15s ease-out; }
</style>
