<script>
  let { project, projectIndex, agents, i18n, copyToClipboard } = $props();

  let wordPercent = $derived(
    project.target_words > 0
      ? Math.min(100, Math.round(project.total_words / project.target_words * 100))
      : 0
  );
  let chapPercent = $derived(
    project.total_chapters > 0
      ? Math.min(100, Math.round(project.completed_chapters / project.total_chapters * 100))
      : 0
  );
  let currentPhase = $derived(project.phase_status?.[project.current_phase]);
  let currentPhasePct = $derived(currentPhase ? currentPhase.percent : 0);
  let currentPhaseName = $derived(currentPhase ? i18n.t('phase.' + currentPhase.name.toLowerCase().replace(/\s+/g, '-')) || currentPhase.name : '—');

  const QUICK_CMDS = [
    { cmd: '/book-init',    icon: 'rocket_launch',        labelKey: 'cmd.init.label',    descKey: 'cmd.init.desc' },
    { cmd: '/book-outline', icon: 'format_list_bulleted', labelKey: 'cmd.outline.label', descKey: 'cmd.outline.desc' },
    { cmd: '/book-draft',   icon: 'edit_note',            labelKey: 'cmd.draft.label',   descKey: 'cmd.draft.desc' },
    { cmd: '/book-edit',    icon: 'history_edu',          labelKey: 'cmd.edit.label',    descKey: 'cmd.edit.desc' },
    { cmd: '/book-status',  icon: 'analytics',            labelKey: 'cmd.status.label',  descKey: 'cmd.status.desc' },
    { cmd: '/book-publish', icon: 'publish',              labelKey: 'cmd.publish.label', descKey: 'cmd.publish.desc' },
  ];
</script>

<div class="space-y-4">

  <!-- Project banner -->
  <div class="border border-outline-variant rounded bg-surface-container-lowest p-4 flex gap-4">
    <label class="w-28 h-36 bg-surface-container border border-outline-variant rounded flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors shrink-0 group">
      <span class="material-symbols-outlined text-4xl text-outline group-hover:text-secondary transition-colors">menu_book</span>
      <span class="text-xs text-outline uppercase tracking-widest mt-1">Cover</span>
      <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden"
        onchange={async (e) => {
          const file = e.target.files?.[0];
          if (!file || projectIndex == null) return;
          const ext = file.name.split('.').pop() || 'jpg';
          await fetch(`/api/cover/${projectIndex}?filename=cover.${ext}`, { method: 'POST', body: file });
          window.location.reload();
        }}
      />
    </label>
    <div class="flex-1 min-w-0 flex flex-col justify-between">
      <div>
        <h2 class="text-2xl font-bold uppercase tracking-wide truncate" style="font-family:'Newsreader',serif;">{project.name}</h2>
        <p class="text-xs text-secondary mt-1 uppercase tracking-wider">
          {project.genre} · {project.language}
          {#if project.last_updated} · {i18n.t('overview.updated')} {i18n.fmtDate(project.last_updated)}{/if}
        </p>
      </div>
    </div>
    <div class="text-right shrink-0">
      <p class="text-xs text-secondary uppercase tracking-widest">{i18n.t('overview.currentPhase')}</p>
      <p class="text-3xl font-bold text-primary mt-0.5" style="font-family:'Newsreader',serif;">{currentPhaseName}</p>
      <p class="text-lg font-bold text-on-surface-variant">{currentPhasePct}%</p>
    </div>
  </div>

  <!-- Writing Pipeline -->
  {#if project.phase_status}
    <div>
      <p class="text-xs text-secondary uppercase tracking-widest mb-2">{i18n.t('overview.pipeline')}</p>
      <div class="flex gap-1">
        {#each project.phase_status as phase}
          <div class="flex-1 relative overflow-hidden rounded border
            {phase.status === 'complete' ? 'bg-primary/15 border-primary' :
             phase.status === 'in_progress' ? 'bg-primary border-primary' :
             'bg-surface-container border-outline-variant'}">
            <div class="py-2 px-1 text-center">
              <p class="text-xs font-semibold uppercase tracking-wide leading-none
                {phase.status === 'complete' ? 'text-primary' :
                 phase.status === 'in_progress' ? 'text-on-primary' : 'text-secondary'}">
                {i18n.t('phase.' + phase.name.toLowerCase().replace(/\s+/g, '-')) || phase.name}
              </p>
              <p class="text-sm font-bold mt-0.5
                {phase.status === 'complete' ? 'text-primary' :
                 phase.status === 'in_progress' ? 'text-on-primary' : 'text-on-surface-variant'}">
                {phase.percent}%
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Stats -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <!-- Word Count -->
    <div class="border border-outline-variant rounded bg-surface-container-lowest p-4">
      <p class="text-xs text-secondary uppercase tracking-widest mb-2">{i18n.t('overview.words')}</p>
      <p class="text-3xl font-bold text-on-surface">{project.total_words.toLocaleString()}</p>
      <p class="text-xs text-secondary mt-0.5">{i18n.t('overview.wordOf', { n: project.target_words.toLocaleString() })}</p>
      <div class="mt-3 h-1.5 bg-surface-container rounded-full overflow-hidden">
        <div class="h-full bg-primary rounded-full" style="width:{wordPercent}%"></div>
      </div>
      <p class="text-xs text-secondary text-right mt-1">{wordPercent}%</p>
    </div>
    <!-- Chapters -->
    <div class="border border-outline-variant rounded bg-surface-container-lowest p-4">
      <p class="text-xs text-secondary uppercase tracking-widest mb-2">{i18n.t('overview.chapters')}</p>
      <p class="text-3xl font-bold text-on-surface">{project.completed_chapters}</p>
      <p class="text-xs text-secondary mt-0.5">{i18n.t('overview.chapterOf', { n: project.total_chapters })}</p>
      <div class="mt-3 h-1.5 bg-surface-container rounded-full overflow-hidden">
        <div class="h-full bg-primary rounded-full" style="width:{chapPercent}%"></div>
      </div>
      <p class="text-xs text-secondary text-right mt-1">{chapPercent}%</p>
    </div>
    <!-- Current Phase -->
    <div class="border border-outline-variant rounded bg-surface-container-lowest p-4">
      <p class="text-xs text-secondary uppercase tracking-widest mb-2">{i18n.t('overview.currentPhase')}</p>
      <p class="text-3xl font-bold text-on-surface" style="font-family:'Newsreader',serif;">{currentPhaseName}</p>
      <p class="text-xs text-secondary mt-0.5">{i18n.t('help.phase', { n: project.current_phase })} / {(project.phase_status?.length ?? 1) - 1}</p>
      <div class="mt-3 h-1.5 bg-surface-container rounded-full overflow-hidden">
        <div class="h-full bg-primary rounded-full" style="width:{currentPhasePct}%"></div>
      </div>
      <p class="text-xs text-secondary text-right mt-1">{currentPhasePct}%</p>
    </div>
  </div>

  <!-- Quick Commands -->
  <div>
    <p class="text-xs text-secondary uppercase tracking-widest mb-2">{i18n.t('overview.commands')}</p>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {#each QUICK_CMDS as c}
        <button
          class="flex items-center gap-3 p-3 rounded border border-outline-variant bg-surface-container-lowest hover:bg-surface-container transition-colors text-left"
          onclick={() => copyToClipboard(c.cmd)}
        >
          <span class="material-symbols-outlined text-lg text-primary shrink-0">{c.icon}</span>
          <div class="min-w-0">
            <p class="text-xs font-bold uppercase tracking-wider truncate">{i18n.t(c.labelKey)}</p>
            <p class="text-xs text-secondary truncate">{i18n.t(c.descKey)}</p>
          </div>
        </button>
      {/each}
    </div>
  </div>

</div>
