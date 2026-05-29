<script>
  let { agents, i18n } = $props();

  let runningCount  = $derived(agents.filter(a => a.status === 'running').length);
  let idleCount     = $derived(agents.filter(a => a.status === 'idle').length);
  let completeCount = $derived(agents.filter(a => a.status === 'complete').length);

  function iconBg(s) {
    if (s === 'running')  return 'bg-primary border-primary text-on-primary';
    if (s === 'complete') return 'bg-inverse-surface border-inverse-surface text-inverse-on-surface';
    if (s === 'error')    return 'bg-error border-error text-on-primary';
    return 'bg-surface-container border-outline-variant text-secondary';
  }
  function badgeClass(s) {
    if (s === 'running')  return 'border-primary text-primary';
    if (s === 'complete') return 'border-inverse-surface text-inverse-on-surface bg-inverse-surface';
    if (s === 'error')    return 'border-error text-error';
    return 'border-outline-variant text-secondary';
  }
</script>

<div class="space-y-4">

  <!-- Summary -->
  <div class="grid grid-cols-3 gap-3">
    <div class="border {runningCount > 0 ? 'border-primary' : 'border-outline-variant'} rounded bg-surface-container-lowest p-4 text-center">
      <p class="text-[10px] uppercase tracking-widest text-secondary mb-1 font-semibold">Running</p>
      <p class="text-4xl font-bold {runningCount > 0 ? 'text-primary' : 'text-on-surface-variant'}">{runningCount}</p>
    </div>
    <div class="border border-outline-variant rounded bg-surface-container-lowest p-4 text-center">
      <p class="text-[10px] uppercase tracking-widest text-secondary mb-1 font-semibold">Idle</p>
      <p class="text-4xl font-bold text-on-surface-variant">{idleCount}</p>
    </div>
    <div class="border border-outline-variant rounded bg-surface-container-lowest p-4 text-center">
      <p class="text-[10px] uppercase tracking-widest text-secondary mb-1 font-semibold">Complete</p>
      <p class="text-4xl font-bold text-on-surface">{completeCount}</p>
    </div>
  </div>

  {#if agents.length === 0}
    <div class="text-center py-16">
      <span class="material-symbols-outlined text-5xl text-outline">smart_toy</span>
      <p class="mt-2 text-sm uppercase tracking-wider text-secondary">{i18n.t('status.noAgents')}</p>
      <p class="text-xs text-on-surface-variant mt-1">{i18n.t('status.noAgentsHint')}</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {#each agents as agent}
        <div class="border border-outline-variant rounded bg-surface-container-lowest p-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded border-2 flex items-center justify-center shrink-0 {iconBg(agent.status)}">
              <span class="material-symbols-outlined text-base">{agent.icon}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold uppercase tracking-wide truncate">{agent.name}</p>
              <p class="text-[10px] text-secondary mt-0.5 truncate">{agent.role}</p>
            </div>
          </div>

          <div class="mt-3 flex items-center justify-between gap-2">
            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border {badgeClass(agent.status)}">
              {#if agent.status === 'running'}
                <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              {/if}
              {i18n.t('status.' + agent.status) ?? agent.status}
            </span>
            {#if agent.last_run}
              <span class="text-[10px] text-on-surface-variant font-mono">{i18n.fmtDate(agent.last_run)}</span>
            {/if}
          </div>

          {#if agent.task}
            <div class="mt-2 bg-surface-container rounded px-2.5 py-1.5">
              <p class="text-[10px] text-secondary uppercase tracking-wider mb-0.5 font-semibold">Current Task</p>
              <p class="text-xs text-on-surface truncate">{agent.task}</p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

</div>
