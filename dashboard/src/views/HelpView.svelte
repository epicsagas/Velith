<script>
  import { GENRE_WORKFLOWS, AGENT_DEFS, PIPELINE_COMMANDS, GENRE_ICONS } from '../lib/data.js';
  let { agents, i18n, copyToClipboard } = $props();

  let activeGenre = $state(GENRE_WORKFLOWS[0].id);
  let selectedGenre = $derived(GENRE_WORKFLOWS.find(g => g.id === activeGenre) ?? GENRE_WORKFLOWS[0]);
</script>

<div class="space-y-6 max-w-4xl">

  <!-- Header -->
  <div class="border border-outline-variant rounded bg-surface-container-lowest p-4 flex items-start gap-3">
    <span class="material-symbols-outlined text-2xl text-primary mt-0.5">help_outline</span>
    <div>
      <h2 class="text-lg font-bold" style="font-family:'Newsreader',serif;">{i18n.t('help.title')}</h2>
      <p class="text-xs text-secondary mt-0.5">{i18n.t('help.subtitle')}</p>
    </div>
  </div>

  <!-- Genre Workflow -->
  <div>
    <p class="text-[10px] uppercase tracking-widest text-secondary mb-2 font-semibold">{i18n.t('help.genreWorkflow')}</p>
    <!-- Genre tabs -->
    <div class="flex flex-wrap gap-1 mb-3">
      {#each GENRE_WORKFLOWS as g}
        <button
          class="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border transition-colors
            {activeGenre === g.id
              ? 'bg-primary border-primary text-on-primary'
              : 'border-outline-variant text-secondary hover:bg-surface-container'}"
          onclick={() => activeGenre = g.id}
        >{g.name}</button>
      {/each}
    </div>
    <!-- Selected genre panel -->
    <div class="border border-outline-variant rounded bg-surface-container-lowest p-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="material-symbols-outlined text-lg text-primary">{GENRE_ICONS[selectedGenre.id] ?? 'book'}</span>
        <h3 class="font-bold uppercase tracking-wide text-sm">{selectedGenre.name}</h3>
      </div>
      <div class="mb-2">
        <p class="text-[10px] uppercase tracking-widest text-secondary mb-1 font-semibold">{i18n.t('help.structure')}</p>
        <p class="text-xs text-on-surface bg-surface-container px-3 py-2 rounded font-mono">{selectedGenre.structure}</p>
      </div>
      <div class="mb-2">
        <p class="text-[10px] uppercase tracking-widest text-secondary mb-1 font-semibold">{i18n.t('help.keyFeatures')}</p>
        <div class="flex flex-wrap gap-1.5">
          {#each selectedGenre.highlights as h}
            <span class="px-2 py-0.5 text-[11px] rounded border border-primary text-primary bg-primary/5 font-medium">{h}</span>
          {/each}
        </div>
      </div>
      <p class="text-xs text-secondary italic">💡 {selectedGenre.tip}</p>
    </div>
  </div>

  <!-- Skill Reference -->
  <div>
    <p class="text-[10px] uppercase tracking-widest text-secondary mb-2 font-semibold">{i18n.t('help.skills')}</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {#each PIPELINE_COMMANDS as cmd}
        <button
          class="flex items-center gap-3 p-3 rounded border border-outline-variant bg-surface-container-lowest hover:bg-surface-container transition-colors text-left"
          onclick={() => copyToClipboard(cmd.cmd)}
        >
          <span class="material-symbols-outlined text-lg text-primary shrink-0">{cmd.icon}</span>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold font-mono text-primary">{cmd.cmd}</p>
            <p class="text-[10px] text-secondary mt-0.5 truncate">
              {i18n.t('cmd.' + cmd.cmd.replace('/book-', '') + '.long') || i18n.t('cmd.' + cmd.cmd.replace('/book-', '') + '.desc') || ''}
            </p>
          </div>
          {#if cmd.phase >= 0}
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-primary text-primary shrink-0">Phase {cmd.phase}</span>
          {:else}
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-outline-variant text-secondary shrink-0">Utility</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <!-- Agent Reference -->
  <div>
    <p class="text-[10px] uppercase tracking-widest text-secondary mb-2 font-semibold">{i18n.t('help.agents')}</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {#each AGENT_DEFS as agent}
        <div class="flex items-center gap-3 p-3 rounded border border-outline-variant bg-surface-container-lowest">
          <span class="material-symbols-outlined text-lg text-secondary shrink-0">{agent.icon}</span>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold font-mono">{agent.id}</p>
            <p class="text-[10px] text-secondary mt-0.5">{i18n.t('agent.' + agent.id) || ''}</p>
          </div>
          <span class="text-[10px] uppercase tracking-wider text-on-surface-variant border border-outline-variant px-2 py-0.5 rounded shrink-0">{agent.genre}</span>
        </div>
      {/each}
    </div>
  </div>

  <!-- Pipeline Overview -->
  <div>
    <p class="text-[10px] uppercase tracking-widest text-secondary mb-2 font-semibold">{i18n.t('help.pipelineOverview')}</p>
    <div class="border border-outline-variant rounded bg-surface-container-lowest p-4">
      <div class="flex items-center gap-1">
        {#each [i18n.t('phase.onboarding'),i18n.t('phase.ideation'),i18n.t('phase.outlining'),i18n.t('phase.drafting'),i18n.t('phase.editing'),i18n.t('phase.publishing')] as phase, i}
          <div class="flex-1 text-center py-3 rounded border
            {i === 3 ? 'bg-primary border-primary text-on-primary' : 'bg-surface-container border-outline-variant text-secondary'}">
            <p class="text-[10px] font-bold uppercase tracking-wider leading-none">{phase}</p>
            <p class="text-[10px] text-current opacity-60 mt-0.5">Phase {i}</p>
          </div>
          {#if i < 5}
            <span class="text-outline text-xs">›</span>
          {/if}
        {/each}
      </div>
      <p class="text-[10px] text-on-surface-variant mt-3">{i18n.t('help.pipelineTip')}</p>
    </div>
  </div>

  <!-- Quick Start -->
  <div>
    <p class="text-[10px] uppercase tracking-widest text-secondary mb-2 font-semibold">{i18n.t('help.quickStart')}</p>
    <div class="border border-outline-variant rounded bg-surface-container-lowest overflow-hidden">
      {#each [
        { cmd: '/book-init',      icon: 'rocket_launch',        key: 'help.qs.init' },
        { cmd: '/book-ideation',  icon: 'lightbulb',            key: 'help.qs.ideation' },
        { cmd: '/book-outline',   icon: 'format_list_bulleted', key: 'help.qs.outline' },
        { cmd: '/book-draft',     icon: 'edit_note',            key: 'help.qs.draft' },
        { cmd: '/book-edit',      icon: 'history_edu',          key: 'help.qs.edit' },
        { cmd: '/book-publish',   icon: 'publish',              key: 'help.qs.publish' },
      ] as step, i}
        <button
          class="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition-colors text-left border-b border-outline-variant last:border-b-0"
          onclick={() => copyToClipboard(step.cmd)}
        >
          <span class="w-6 h-6 rounded-full bg-primary text-on-primary text-[11px] flex items-center justify-center font-bold shrink-0">{i + 1}</span>
          <span class="material-symbols-outlined text-base text-secondary shrink-0">{step.icon}</span>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold font-mono text-primary">{step.cmd}</p>
            <p class="text-[10px] text-secondary">{i18n.t(step.key)}</p>
          </div>
        </button>
      {/each}
    </div>
  </div>

</div>
