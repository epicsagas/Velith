<script>
  import { PIPELINE_COMMANDS, AGENT_DEFS } from '../lib/data.js';
  let { project, agents, i18n, copyToClipboard } = $props();

  function phaseStatusClass(s) {
    if (s === 'complete') return 'border-inverse-surface text-inverse-on-surface bg-inverse-surface';
    if (s === 'in_progress') return 'border-primary text-primary bg-primary/10';
    return 'border-outline-variant text-secondary';
  }
</script>

<div class="space-y-4 max-w-3xl">

  <!-- Project Info -->
  <div class="border border-outline-variant rounded overflow-hidden">
    <div class="px-4 py-2 border-b border-outline-variant bg-surface-container">
      <p class="text-[10px] font-bold uppercase tracking-widest text-secondary">Project Info</p>
    </div>
    <div class="p-4 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
      <div>
        <p class="text-[10px] text-secondary uppercase tracking-widest mb-0.5">Title</p>
        <p class="font-medium">{project.name}</p>
      </div>
      <div>
        <p class="text-[10px] text-secondary uppercase tracking-widest mb-0.5">Genre</p>
        <p class="font-medium capitalize">{project.genre}</p>
      </div>
      <div>
        <p class="text-[10px] text-secondary uppercase tracking-widest mb-0.5">Language</p>
        <p class="font-medium uppercase">{project.language}</p>
      </div>
      <div>
        <p class="text-[10px] text-secondary uppercase tracking-widest mb-0.5">Last Updated</p>
        <p class="font-medium">{i18n.fmtDate(project.last_updated)}</p>
      </div>
      <div class="col-span-2">
        <p class="text-[10px] text-secondary uppercase tracking-widest mb-0.5">Path</p>
        <p class="font-mono text-xs truncate">{project.path}</p>
      </div>
    </div>
  </div>

  <!-- Targets -->
  <div class="border border-outline-variant rounded overflow-hidden">
    <div class="px-4 py-2 border-b border-outline-variant bg-surface-container">
      <p class="text-[10px] font-bold uppercase tracking-widest text-secondary">Targets</p>
    </div>
    <table class="w-full text-sm">
      <tbody>
        <tr class="border-b border-outline-variant">
          <td class="px-4 py-2.5 text-[10px] uppercase tracking-widest text-secondary font-semibold">Word Target</td>
          <td class="px-4 py-2.5 text-right font-bold font-mono text-lg text-on-surface">{project.target_words.toLocaleString()}</td>
        </tr>
        <tr class="border-b border-outline-variant">
          <td class="px-4 py-2.5 text-[10px] uppercase tracking-widest text-secondary font-semibold">Total Chapters</td>
          <td class="px-4 py-2.5 text-right font-bold font-mono">{project.total_chapters}</td>
        </tr>
        <tr class="border-b border-outline-variant">
          <td class="px-4 py-2.5 text-[10px] uppercase tracking-widest text-secondary font-semibold">Completed Chapters</td>
          <td class="px-4 py-2.5 text-right font-bold font-mono">{project.completed_chapters}</td>
        </tr>
        <tr>
          <td class="px-4 py-2.5 text-[10px] uppercase tracking-widest text-secondary font-semibold">Current Phase</td>
          <td class="px-4 py-2.5 text-right font-bold">Phase {project.current_phase}: {project.phase_status?.[project.current_phase]?.name ?? '—'}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Phase Status -->
  {#if project.phase_status}
    <div class="border border-outline-variant rounded overflow-hidden">
      <div class="px-4 py-2 border-b border-outline-variant bg-surface-container">
        <p class="text-[10px] font-bold uppercase tracking-widest text-secondary">Phase Status</p>
      </div>
      <div class="divide-y divide-outline-variant">
        {#each project.phase_status as phase}
          <div class="px-4 py-3 flex items-center gap-4">
            <span class="text-xs text-secondary font-mono w-4">{phase.phase}</span>
            <span class="text-[10px] font-semibold uppercase tracking-widest text-secondary w-24">{phase.name}</span>
            <div class="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all
                {phase.status === 'complete' ? 'bg-inverse-surface' :
                 phase.status === 'in_progress' ? 'bg-primary' : 'bg-outline-variant'}"
                style="width:{Math.min(100, phase.percent)}%"></div>
            </div>
            <span class="text-xs text-secondary font-mono w-8 text-right">{phase.percent}%</span>
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border w-24 text-center {phaseStatusClass(phase.status)}">
              {phase.status === 'complete' ? 'Complete' : phase.status === 'in_progress' ? 'In Progress' : 'Pending'}
            </span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Available Commands -->
  <div class="border border-outline-variant rounded overflow-hidden">
    <div class="px-4 py-2 border-b border-outline-variant bg-surface-container">
      <p class="text-[10px] font-bold uppercase tracking-widest text-secondary">Available Commands</p>
    </div>
    <div class="divide-y divide-outline-variant">
      {#each PIPELINE_COMMANDS as cmd}
        <button
          class="w-full flex items-center gap-4 px-4 py-3 hover:bg-surface-container transition-colors text-left"
          onclick={() => copyToClipboard(cmd.cmd)}
        >
          <code class="text-xs font-bold text-primary font-mono w-32 shrink-0">{cmd.cmd}</code>
          <span class="text-xs text-secondary">
            {i18n.t('cmd.' + cmd.cmd.replace('/book-', '') + '.long') || i18n.t('cmd.' + cmd.cmd.replace('/book-', '') + '.desc') || ''}
          </span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Registered Agents -->
  <div class="border border-outline-variant rounded overflow-hidden">
    <div class="px-4 py-2 border-b border-outline-variant bg-surface-container">
      <p class="text-[10px] font-bold uppercase tracking-widest text-secondary">Registered Agents</p>
    </div>
    <div class="divide-y divide-outline-variant">
      {#each AGENT_DEFS as agent}
        <div class="flex items-center gap-4 px-4 py-3">
          <span class="material-symbols-outlined text-base text-secondary shrink-0">{agent.icon}</span>
          <code class="text-xs font-bold font-mono w-36 shrink-0">{agent.id}</code>
          <span class="text-xs text-secondary flex-1">{i18n.t('agent.' + agent.id) || ''}</span>
          <span class="text-[10px] uppercase tracking-wider text-on-surface-variant border border-outline-variant px-2 py-0.5 rounded">{agent.genre}</span>
        </div>
      {/each}
    </div>
  </div>

</div>
