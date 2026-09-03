<script>
  let { project, projectIndex, i18n, copyToClipboard } = $props();

  let files = $derived(project.output_files ?? []);
  let readyCount = $derived(files.filter(f => f.exists).length);

  const FORMAT_META = {
    'book.epub': { icon: 'menu_book',      label: 'EPUB', descKey: 'publish.fmt.epub' },
    'book.pdf':  { icon: 'picture_as_pdf', label: 'PDF',  descKey: 'publish.fmt.pdf' },
    'book.mobi': { icon: 'devices',        label: 'MOBI', descKey: 'publish.fmt.mobi' },
    'book.txt':  { icon: 'article',        label: 'TXT',  descKey: 'publish.fmt.txt' },
    'book.md':   { icon: 'code',           label: 'MD',   descKey: 'publish.fmt.md' },
  };

  function fmtSize(bytes) {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  let checks = $derived([
    { key: 'publish.check.wordTarget',    ok: project.target_words > 0 && project.total_words >= project.target_words },
    { key: 'publish.check.allDrafts',     ok: (project.chapter_details ?? []).every(c => c.status !== 'wait') },
    { key: 'publish.check.editingDone',   ok: (project.chapter_details ?? []).every(c => c.edit_stage === 'proofread') },
    { key: 'publish.check.outlineDone',   ok: project.phase_status?.[2]?.status === 'complete' },
    { key: 'publish.check.editingPhaseDone', ok: project.phase_status?.[4]?.status === 'complete' },
  ]);
</script>

<div class="space-y-4">

  <!-- Header -->
  <div class="flex items-center justify-between">
    <p class="text-sm font-bold uppercase tracking-wider">{i18n.t('publish.filesReady', { ready: readyCount, total: files.length })}</p>
    <button
      class="flex items-center gap-2 px-3 py-2 rounded border border-outline-variant text-xs font-semibold uppercase tracking-wider text-secondary hover:bg-surface-container transition-colors"
      onclick={() => copyToClipboard('/book-publish')}
    >
      <span class="material-symbols-outlined text-sm">publish</span>
      /book-publish
    </button>
  </div>

  <!-- File cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {#each files as f}
      {@const meta = FORMAT_META[f.name] ?? { icon: 'description', label: f.name, descKey: '' }}
      <div class="border {f.exists ? 'border-primary' : 'border-outline-variant'} rounded bg-surface-container-lowest p-4">
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-2xl {f.exists ? 'text-primary' : 'text-outline'} mt-0.5">{meta.icon}</span>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold uppercase tracking-wider">{meta.label}</p>
            <p class="text-xs text-secondary mt-0.5">{meta.descKey ? i18n.t(meta.descKey) : ''}</p>
          </div>
        </div>
        <div class="mt-3 flex items-center justify-between">
          <span class="text-xs font-mono text-on-surface-variant">{fmtSize(f.size_bytes)}</span>
          {#if f.exists}
            <span class="text-xs font-bold uppercase tracking-wider border border-primary text-primary px-2 py-0.5 rounded">{i18n.t('publish.ready')}</span>
          {:else}
            <span class="text-xs font-bold uppercase tracking-wider border border-outline-variant text-secondary px-2 py-0.5 rounded">{i18n.t('publish.pending')}</span>
          {/if}
        </div>
        {#if f.exists && projectIndex != null}
          <a
            href="/download/{projectIndex}/{f.name}"
            class="mt-2 flex items-center gap-1 text-xs text-primary font-semibold uppercase tracking-wider hover:underline"
          >
            <span class="material-symbols-outlined text-sm">download</span>
            {i18n.t('publish.download')}
          </a>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Checklist -->
  <div class="border border-outline-variant rounded bg-surface-container-lowest p-4">
    <p class="text-xs uppercase tracking-widest text-secondary mb-3 font-semibold">{i18n.t('publish.checklist')}</p>
    <div class="space-y-2.5">
      {#each checks as check}
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-lg {check.ok ? 'text-primary' : 'text-outline'}">
            {check.ok ? 'check_circle' : 'radio_button_unchecked'}
          </span>
          <span class="text-sm {check.ok ? 'text-on-surface' : 'text-secondary'}">{i18n.t(check.key)}</span>
        </div>
      {/each}
    </div>
  </div>

</div>
