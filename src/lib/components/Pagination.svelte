<script lang="ts">
  import { page as pageState } from '$app/state';
  import { pageCount } from '$lib/utils';
  let { current, total, limit }: { current: number; total: number; limit: number } = $props();
  const pages = $derived(pageCount(total, limit));

  function href(p: number): string {
    const url = new URL(pageState.url);
    url.searchParams.set('page', String(p));
    return url.pathname + url.search;
  }
</script>

<nav class="mt-8 flex items-center justify-center gap-4 text-sm">
  {#if current > 1}
    <a href={href(current - 1)} class="rounded bg-surface-2 px-3 py-2 hover:bg-surface">← Prev</a>
  {/if}
  <span class="text-muted">Page {current} of {pages}</span>
  {#if current < pages}
    <a href={href(current + 1)} class="rounded bg-surface-2 px-3 py-2 hover:bg-surface">Next →</a>
  {/if}
</nav>
