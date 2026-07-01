<script>
  // Shared cover renderer: shows the cover image when `src` is set and loads,
  // and falls back to the `menu_book` placeholder on any load/decode failure.
  // One implementation used by both the project list card (App.svelte) and
  // the Overview banner, so robustness can't drift between the two.
  //
  // `bust` is a monotonically increasing counter appended as `?v=` to HTTP
  // cover URLs so a freshly uploaded cover bypasses the browser cache (the
  // /cover/<index> URL is path-stable). It is NOT appended to `data:` URIs,
  // which RFC 2397 forbids query strings on (used by the ?example demo).
  //
  // The failure flag is scoped to the current source: when `resolved`
  // changes (project switch, re-upload), the $effect resets `failed` so a
  // stale failure from the previous source can't suppress a valid cover.
  let { src, alt, bust = 0, iconClass = 'text-2xl text-outline' } = $props();

  let failed = $state(false);

  let resolved = $derived(
    src
      ? (src.startsWith('data:') ? src : bust > 0 ? `${src}?v=${bust}` : src)
      : null
  );

  // Reset the failure flag whenever the resolved source changes. Reading
  // `resolved` makes it a dependency, so this runs on project switch and
  // on every re-upload (bust increments → resolved changes).
  $effect(() => {
    // Touch resolved so this effect is bound to source changes.
    void resolved;
    failed = false;
  });
</script>

{#if resolved && !failed}
  <img src={resolved} {alt} class="w-full h-full object-cover"
    onerror={() => { failed = true; }} />
{:else}
  <span class="material-symbols-outlined {iconClass}">menu_book</span>
{/if}

