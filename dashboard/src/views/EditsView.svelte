<script>
  let { project, i18n, copyToClipboard } = $props();

  const STAGES = [
    { id: 'assessment',    icon: 'search',       file: '01-assessment.md',    labelKey: 'edit.stage.assessment' },
    { id: 'developmental', icon: 'account_tree', file: '02-developmental.md', labelKey: 'edit.stage.developmental' },
    { id: 'line-edit',     icon: 'format_paint', file: '03-line-edit.md',     labelKey: 'edit.stage.lineEdit' },
    { id: 'copy-edit',     icon: 'spellcheck',   file: '04-copy-edit.md',     labelKey: 'edit.stage.copyEdit' },
    { id: 'proofread',     icon: 'verified',     file: '05-proofread.md',     labelKey: 'edit.stage.proofread' },
  ];

  let chapters = $derived(project.chapter_details ?? []);
  let editingChapters = $derived(chapters.filter(c => c.status === 'edit' || c.status === 'draft' || c.status === 'wait'));

  function stageDotClass(ch, stageIdx) {
    const stageOrder = ['assessment','developmental','line-edit','copy-edit','proofread'];
    const chStageIdx = stageOrder.indexOf(ch.edit_stage ?? '');
    if (ch.status !== 'edit' && ch.status !== 'done') return 'bg-outline-variant';
    if (chStageIdx === -1) return ch.status === 'edit' ? 'bg-primary' : 'bg-outline-variant';
    if (stageIdx < chStageIdx) return 'bg-primary/40';
    if (stageIdx === chStageIdx) return 'bg-primary';
    return 'bg-outline-variant';
  }

  function statusClass(s) {
    if (s === 'edit') return 'border-primary text-primary';
    if (s === 'draft') return 'border-secondary text-secondary';
    return 'border-outline-variant text-on-surface-variant';
  }
</script>

<div class="space-y-4">

  <!-- Header -->
  <div class="flex items-center justify-between">
    <p class="text-sm font-bold uppercase tracking-wider">
      {i18n.t('edits.inPipeline', { n: editingChapters.length })}
    </p>
    <button
      class="flex items-center gap-2 px-3 py-2 rounded border border-outline-variant text-xs font-semibold uppercase tracking-wider text-secondary hover:bg-surface-container transition-colors"
      onclick={() => copyToClipboard('/book-edit')}
    >
      <span class="material-symbols-outlined text-sm">history_edu</span>
      /book-edit
    </button>
  </div>

  <!-- Stage columns header -->
  <div class="grid grid-cols-5 gap-1">
    {#each STAGES as stage}
      {@const count = chapters.filter(c => c.edit_stage === stage.id).length}
      <div class="border border-outline-variant rounded bg-surface-container-lowest p-2.5 text-center">
        <div class="flex items-center justify-between mb-1">
          <span class="material-symbols-outlined text-sm text-secondary">{stage.icon}</span>
          <span class="text-xs font-bold text-on-surface-variant">{count}</span>
        </div>
        <p class="text-xs font-bold uppercase tracking-wider text-secondary leading-tight">{i18n.t(stage.labelKey)}</p>
        <p class="text-xs text-on-surface-variant font-mono mt-0.5 truncate">{stage.file}</p>
      </div>
    {/each}
  </div>

  <!-- Chapter Edit Stages -->
  {#if chapters.length > 0}
    <div>
      <p class="text-xs uppercase tracking-widest text-secondary mb-2 font-semibold">{i18n.t('edits.stageProgress')}</p>
      <div class="border border-outline-variant rounded bg-surface-container-lowest overflow-hidden">
        {#each chapters as ch}
          <button
            class="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition-colors text-left border-b border-outline-variant last:border-b-0"
            onclick={() => {
              copyToClipboard(`/book-edit ${ch.filename}`);
            }}
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold uppercase tracking-wide truncate">{ch.title}</p>
            </div>
            <p class="text-xs font-mono text-secondary shrink-0 hidden sm:block">{ch.filename}</p>
            <div class="flex gap-1 shrink-0">
              {#each STAGES as stage, si}
                <span class="w-3 h-3 rounded-full {stageDotClass(ch, si)}"></span>
              {/each}
            </div>
            <span class="inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border shrink-0 {statusClass(ch.status)}">
              {i18n.t('chStatus.' + ch.status)}
            </span>
          </button>
        {/each}
      </div>
    </div>
  {:else}
    <div class="text-center py-16">
      <span class="material-symbols-outlined text-5xl text-outline">history_edu</span>
      <p class="mt-2 text-sm uppercase tracking-wider text-secondary">{i18n.t('edits.inPipeline', { n: 0 })}</p>
    </div>
  {/if}

</div>
