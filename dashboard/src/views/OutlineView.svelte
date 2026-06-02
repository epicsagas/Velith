<script>
  let { project, i18n, copyToClipboard } = $props();
  let chapters = $derived(project.chapter_details ?? []);
  let totalWords = $derived(chapters.reduce((s, c) => s + c.words, 0));

  function statusClass(s) {
    if (s === 'edit') return 'border-primary text-primary bg-primary/5';
    if (s === 'draft') return 'border-secondary text-secondary';
    return 'border-outline-variant text-on-surface-variant';
  }
</script>

<div class="space-y-4">

  <!-- Header -->
  <div class="flex items-center justify-between">
    <p class="text-sm font-mono font-semibold text-on-surface">
      {totalWords.toLocaleString()} / {project.target_words.toLocaleString()} {i18n.t('outline.words').toUpperCase()}
    </p>
    <div class="flex gap-2">
      <button
        class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-outline-variant text-xs font-semibold uppercase tracking-wider text-secondary hover:bg-surface-container transition-colors"
        onclick={() => copyToClipboard('/book-outline sync PRD')}
      >
        <span class="material-symbols-outlined text-sm">sync</span>
        <span class="font-mono">/book-outline</span>
        <span class="text-on-surface-variant normal-case font-normal">sync PRD</span>
      </button>
      <button
        class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-outline-variant text-xs font-semibold uppercase tracking-wider text-secondary hover:bg-surface-container transition-colors"
        onclick={() => copyToClipboard('/book-outline add chapter')}
      >
        <span class="material-symbols-outlined text-sm">add</span>
        <span class="font-mono">/book-outline</span>
        <span class="text-on-surface-variant normal-case font-normal">add chapter</span>
      </button>
    </div>
  </div>

  {#if chapters.length === 0}
    <div class="text-center py-16">
      <span class="material-symbols-outlined text-5xl text-outline">format_list_bulleted</span>
      <p class="mt-2 text-sm uppercase tracking-wider text-secondary">{i18n.t('outline.noChapters')}</p>
      <p class="text-xs text-on-surface-variant mt-1">{i18n.t('outline.noChaptersHint')}</p>
    </div>
  {:else}
    <div class="space-y-1.5">
      {#each chapters as ch, i}
        {@const pct = project.target_words > 0 ? Math.min(100, Math.round(ch.words / (project.target_words / chapters.length) * 100)) : 0}
        <button
          class="w-full flex items-center gap-0 rounded border border-outline-variant bg-surface-container-lowest hover:bg-surface-container transition-colors overflow-hidden text-left"
          onclick={() => {
            const key = ch.status === 'wait' ? 'cmd.redraftWait' : ch.status === 'edit' ? 'cmd.editChapter' : 'cmd.redraft';
            copyToClipboard(i18n.t(key, { file: ch.filename }));
          }}
        >
          <!-- Number block -->
          <div class="w-12 h-full bg-surface-container flex items-center justify-center shrink-0 self-stretch border-r border-outline-variant">
            <span class="text-sm font-bold font-mono text-secondary">{String(i + 1).padStart(2, '0')}</span>
          </div>
          <!-- Content -->
          <div class="flex-1 min-w-0 px-3 py-2.5">
            <div class="flex items-center justify-between gap-2">
              <p class="text-sm font-bold uppercase tracking-wide truncate">{ch.title}</p>
              <div class="flex items-center gap-3 shrink-0">
                <div class="text-right">
                  <span class="text-sm font-semibold font-mono text-on-surface">{ch.words.toLocaleString()}</span>
                  <span class="text-xs text-secondary ml-1">{i18n.t('outline.words')}</span>
                </div>
                <span class="inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border {statusClass(ch.status)}">
                  {i18n.t('chStatus.' + ch.status)}
                </span>
              </div>
            </div>
            <p class="text-xs text-on-surface-variant font-mono mt-0.5">{ch.filename}</p>
            <div class="mt-2 h-1 bg-surface-container rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full" style="width:{pct}%"></div>
            </div>
          </div>
        </button>
      {/each}
    </div>
  {/if}

</div>
