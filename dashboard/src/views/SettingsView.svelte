<script>
  import { PIPELINE_COMMANDS, AGENT_DEFS } from '../lib/data.js';
  import { setAccent, PRESET_COLORS, setFont, FONT_OPTIONS } from '../lib/theme.js';
  let { project, agents, i18n, copyToClipboard, isDark = false, accent = '#e8650a', font = 'geist' } = $props();

  function phaseStatusClass(s) {
    if (s === 'complete') return 'border-primary text-on-primary bg-primary';
    if (s === 'in_progress') return 'border-primary text-primary bg-primary/10';
    return 'border-outline-variant text-secondary';
  }
  function phaseStatusLabel(s) {
    if (s === 'complete') return i18n.t('status.complete');
    if (s === 'in_progress') return i18n.t('status.running');
    return 'Pending';
  }
</script>

<div class="space-y-4 max-w-3xl">

  <!-- Project Info -->
  <div class="border border-outline-variant rounded overflow-hidden">
    <div class="px-4 py-2 border-b border-outline-variant bg-surface-container">
      <p class="text-xs font-bold uppercase tracking-widest text-secondary">{i18n.t('settings.projectInfo')}</p>
    </div>
    <div class="p-4 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
      <div>
        <p class="text-xs text-secondary uppercase tracking-widest mb-0.5">{i18n.t('settings.fieldTitle')}</p>
        <p class="font-medium">{project.name}</p>
      </div>
      <div>
        <p class="text-xs text-secondary uppercase tracking-widest mb-0.5">{i18n.t('settings.fieldGenre')}</p>
        <p class="font-medium capitalize">{project.genre}</p>
      </div>
      <div>
        <p class="text-xs text-secondary uppercase tracking-widest mb-0.5">{i18n.t('settings.fieldLanguage')}</p>
        <p class="font-medium uppercase">{project.language}</p>
      </div>
      <div>
        <p class="text-xs text-secondary uppercase tracking-widest mb-0.5">{i18n.t('settings.fieldUpdated')}</p>
        <p class="font-medium">{i18n.fmtDate(project.last_updated)}</p>
      </div>
      <div class="col-span-2">
        <p class="text-xs text-secondary uppercase tracking-widest mb-0.5">{i18n.t('settings.fieldPath')}</p>
        <p class="font-mono text-xs truncate">{project.path}</p>
      </div>
    </div>
  </div>

  <!-- Targets -->
  <div class="border border-outline-variant rounded overflow-hidden">
    <div class="px-4 py-2 border-b border-outline-variant bg-surface-container">
      <p class="text-xs font-bold uppercase tracking-widest text-secondary">{i18n.t('settings.targets')}</p>
    </div>
    <table class="w-full text-sm">
      <tbody>
        <tr class="border-b border-outline-variant">
          <td class="px-4 py-2.5 text-xs uppercase tracking-widest text-secondary font-semibold">{i18n.t('settings.targetWords')}</td>
          <td class="px-4 py-2.5 text-right font-bold font-mono text-lg text-on-surface">{project.target_words.toLocaleString()}</td>
        </tr>
        <tr class="border-b border-outline-variant">
          <td class="px-4 py-2.5 text-xs uppercase tracking-widest text-secondary font-semibold">{i18n.t('settings.totalChapters')}</td>
          <td class="px-4 py-2.5 text-right font-bold font-mono">{project.total_chapters}</td>
        </tr>
        <tr class="border-b border-outline-variant">
          <td class="px-4 py-2.5 text-xs uppercase tracking-widest text-secondary font-semibold">{i18n.t('settings.completedChapters')}</td>
          <td class="px-4 py-2.5 text-right font-bold font-mono">{project.completed_chapters}</td>
        </tr>
        <tr>
          <td class="px-4 py-2.5 text-xs uppercase tracking-widest text-secondary font-semibold">{i18n.t('settings.currentPhase')}</td>
          <td class="px-4 py-2.5 text-right font-bold">Phase {project.current_phase}: {project.phase_status?.[project.current_phase] ? (i18n.t('phase.' + project.phase_status[project.current_phase].name.toLowerCase()) || project.phase_status[project.current_phase].name) : '—'}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Phase Status -->
  {#if project.phase_status}
    <div class="border border-outline-variant rounded overflow-hidden">
      <div class="px-4 py-2 border-b border-outline-variant bg-surface-container">
        <p class="text-xs font-bold uppercase tracking-widest text-secondary">{i18n.t('settings.phaseStatus')}</p>
      </div>
      <div class="divide-y divide-outline-variant">
        {#each project.phase_status as phase}
          <div class="px-4 py-3 flex items-center gap-4">
            <span class="text-xs text-secondary font-mono w-4">{phase.phase}</span>
            <span class="text-xs font-semibold uppercase tracking-widest text-secondary w-24">{i18n.t('phase.' + phase.name.toLowerCase()) || phase.name || ''}</span>
            <div class="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all
                {phase.status === 'complete' ? 'bg-primary' :
                 phase.status === 'in_progress' ? 'bg-primary' : 'bg-outline-variant'}"
                style="width:{Math.min(100, phase.percent)}%"></div>
            </div>
            <span class="text-xs text-secondary font-mono w-8 text-right">{phase.percent}%</span>
            <span class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border w-24 text-center {phaseStatusClass(phase.status)}">
              {phaseStatusLabel(phase.status)}
            </span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Available Commands -->
  <div class="border border-outline-variant rounded overflow-hidden">
    <div class="px-4 py-2 border-b border-outline-variant bg-surface-container">
      <p class="text-xs font-bold uppercase tracking-widest text-secondary">{i18n.t('settings.commands')}</p>
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
      <p class="text-xs font-bold uppercase tracking-widest text-secondary">{i18n.t('settings.agents')}</p>
    </div>
    <div class="divide-y divide-outline-variant">
      {#each AGENT_DEFS as agent}
        <div class="flex items-center gap-4 px-4 py-3">
          <span class="material-symbols-outlined text-base text-secondary shrink-0">{agent.icon}</span>
          <code class="text-xs font-bold font-mono w-36 shrink-0">{agent.id}</code>
          <span class="text-xs text-secondary flex-1">{i18n.t('agent.' + agent.id) || ''}</span>
          <span class="text-xs uppercase tracking-wider text-on-surface-variant border border-outline-variant px-2 py-0.5 rounded">{agent.genre}</span>
        </div>
      {/each}
    </div>
  </div>

  <!-- Font -->
  <div class="border border-outline-variant rounded overflow-hidden">
    <div class="px-4 py-2 border-b border-outline-variant bg-surface-container">
      <p class="text-xs font-bold uppercase tracking-widest text-secondary">{i18n.t('settings.font')}</p>
    </div>
    <div class="divide-y divide-outline-variant">
      {#each FONT_OPTIONS as opt}
        <button
          class="w-full flex items-center gap-4 px-4 py-3 hover:bg-surface-container transition-colors text-left"
          onclick={() => setFont(opt.id)}
        >
          <span class="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center
            {font === opt.id ? 'border-primary' : 'border-outline-variant'}">
            {#if font === opt.id}
              <span class="w-2 h-2 rounded-full bg-primary"></span>
            {/if}
          </span>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold" style="font-family:{opt.stack}">{opt.label}</p>
            <p class="text-xs text-secondary font-mono truncate">{opt.stack.split(',')[0].replace(/'/g, '')}</p>
          </div>
          <span class="text-sm text-secondary shrink-0" style="font-family:{opt.stack}">가Aa123</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Accent Color -->
  <div class="border border-outline-variant rounded overflow-hidden">
    <div class="px-4 py-2 border-b border-outline-variant bg-surface-container">
      <p class="text-xs font-bold uppercase tracking-widest text-secondary">{i18n.t('settings.accentColor')}</p>
    </div>
    <div class="p-4 space-y-4">
      <!-- Presets -->
      <div class="flex flex-wrap gap-2">
        {#each PRESET_COLORS as preset}
          {@const hex = isDark ? preset.dark : preset.light}
          <button
            class="w-8 h-8 rounded-full border-2 transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style="background-color:{hex}; border-color:{accent === hex ? hex : 'transparent'}; box-shadow:{accent === hex ? '0 0 0 2px white, 0 0 0 4px ' + hex : 'none'}"
            title={preset.label}
            onclick={() => setAccent(hex, isDark)}
          ></button>
        {/each}
      </div>
      <!-- Custom picker -->
      <div class="flex items-center gap-3">
        <label class="relative w-10 h-10 rounded-lg border border-outline-variant overflow-hidden cursor-pointer hover:border-primary transition-colors shrink-0">
          <input
            type="color"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            value={accent}
            oninput={(e) => setAccent(e.target.value, isDark)}
          />
          <div class="w-full h-full rounded-lg" style="background-color:{accent}"></div>
          <span class="absolute bottom-0 right-0 material-symbols-outlined text-white" style="font-size:12px; text-shadow:0 0 3px rgba(0,0,0,0.5)">colorize</span>
        </label>
        <div class="flex-1">
          <p class="text-xs font-semibold text-on-surface">{i18n.t('settings.customColor')}</p>
          <p class="text-xs text-secondary font-mono">{accent}</p>
        </div>
        <button
          class="text-xs text-secondary hover:text-on-surface border border-outline-variant px-3 py-1.5 rounded transition-colors"
          onclick={() => setAccent(isDark ? '#ff8c3a' : '#e8650a', isDark)}
        >{i18n.t('settings.resetColor')}</button>
      </div>
    </div>
  </div>

</div>
