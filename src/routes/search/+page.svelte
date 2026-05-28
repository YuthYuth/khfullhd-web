<script lang="ts">
  import type { PageData } from './$types';
  import MovieGrid from '$lib/components/MovieGrid.svelte';
  let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>{data.q ? `Search: ${data.q}` : 'Search'} · khfullhd</title></svelte:head>

<h1 class="mb-6 text-2xl font-bold">Search</h1>

{#if data.tooShort}
  <p class="py-16 text-center text-muted">Type at least 2 characters to search.</p>
{:else if data.unavailable}
  <p class="py-16 text-center text-muted">Search is temporarily unavailable. Try again shortly.</p>
{:else if data.movies.length}
  <p class="mb-4 text-sm text-muted">{data.count} result{data.count === 1 ? '' : 's'} for "{data.q}"</p>
  <MovieGrid movies={data.movies} />
{:else}
  <p class="py-16 text-center text-muted">No results for "{data.q}".</p>
{/if}
