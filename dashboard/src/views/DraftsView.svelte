<script>
  let { project, i18n, copyToClipboard } = $props();

  let chapters = $derived(project.chapter_details ?? []);
  let totalWords = $derived(chapters.reduce((s, c) => s + c.words, 0));
  let totalLines = $derived(chapters.reduce((s, c) => s + c.lines, 0));
  let wordPercent = $derived(
    project.target_words > 0
      ? Math.min(100, Math.round(project.total_words / project.target_words * 100))
      : 0
  );

  function statusClass(s) {
    if (s === 'edit') return 'border-green-500 text-green-600 dark:text-green-400 dark:border-green-500';
    if (s === 'draft') return 'border-primary text-primary';
    return 'border-outline-variant text-on-surface-variant';
  }
  function statusLabel(s) {
    if (s === 'edit') return 'DONE';
    if (s === 'draft') return 'DRAFT';
    return 'WAIT';
  }
</script>

<div class="space-y-4">

  <!-- Overall Progress -->
  <div class="border border-outline-variant rounded bg-surface-container-lowest p-4">
    <div class="flex items-center justify-between mb-1">
      <p class="text-[10px] uppercase tracking-widest text-secondary font-semibold">Overall Progress</p>
      <p class="text-sm font-mono font-bold">
        {project.total_words.toLocaleString()} / {project.target_words.toLocaleString()} words
      </p>
    </div>
    <div class="h-2 bg-surface-container rounded-full overflow-hidden">
      <div class="h-full bg-primary rounded-full transition-all" style="width:{wordPercent}%"></div>
    </div>
    <p class="text-xs text-secondary text-right mt-1">{wordPercent}%</p>
  </div>

  <!-- Action buttons -->
  <div class="flex gap-2">
    <button
      class="flex items-center gap-2 px-3 py-2 rounded border border-outline-variant text-[11px] font-semibold uppercase tracking-wider text-secondary hover:bg-surface-container transition-colors"
      onclick={() => copyToClipboard('/book-outline')}
    >
      <span class="material-symbols-outlined text-sm">format_list_bulleted</span>
      /book-outline
    </button>
    <button
      class="flex items-center gap-2 px-3 py-2 rounded border border-outline-variant text-[11px] font-semibold uppercase tracking-wider text-secondary hover:bg-surface-container transition-colors"
      onclick={() => copyToClipboard('/book-draft')}
    >
      <span class="material-symbols-outlined text-sm">edit_note</span>
      /book-draft
    </button>
  </div>

  <!-- Table -->
  <div class="overflow-x-auto border border-outline-variant rounded bg-surface-container-lowest">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-outline-variant">
          <th class="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-secondary">File</th>
          <th class="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-secondary">Title</th>
          <th class="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-widest text-secondary">Words</th>
          <th class="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-widest text-secondary">Lines</th>
          <th class="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-secondary">Status</th>
        </tr>
      </thead>
      <tbody>
        {#each chapters as ch}
          <tr
            class="border-b border-outline-variant hover:bg-surface-container cursor-pointer transition-colors"
            onclick={() => {
              const key = ch.status === 'wait' ? 'cmd.redraftWait' : ch.status === 'edit' ? 'cmd.editChapter' : 'cmd.redraft';
              copyToClipboard(i18n.t(key, { file: ch.filename }));
            }}
          >
            <td class="px-3 py-2.5 font-mono text-xs text-secondary whitespace-nowrap">{ch.filename}</td>
            <td class="px-3 py-2.5 text-sm font-medium">{ch.title}</td>
            <td class="px-3 py-2.5 text-right font-bold font-mono">{ch.words > 0 ? ch.words.toLocaleString() : '0'}</td>
            <td class="px-3 py-2.5 text-right font-mono text-secondary">{ch.lines > 0 ? ch.lines.toLocaleString() : '0'}</td>
            <td class="px-3 py-2.5">
              <span class="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border {statusClass(ch.status)}">
                {statusLabel(ch.status)}
              </span>
            </td>
          </tr>
        {/each}
      </tbody>
      <tfoot>
        <tr class="border-t-2 border-inverse-surface">
          <td class="px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-secondary" colspan="2">Total</td>
          <td class="px-3 py-2.5 text-right font-bold font-mono">{totalWords.toLocaleString()}</td>
          <td class="px-3 py-2.5 text-right font-mono text-secondary">{totalLines.toLocaleString()}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>

</div>
