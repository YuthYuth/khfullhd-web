<script lang="ts">
  import type { PageData } from './$types';
  import MovieGrid from '$lib/components/MovieGrid.svelte';
  import SortSelect from '$lib/components/SortSelect.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Browse · khfullhd</title></svelte:head>

<div class="mb-6 flex items-center justify-between">
  <h1 class="text-2xl font-bold">Browse</h1>
  <SortSelect sort={data.sort} />
</div>

{#if data.movies.length}
  <MovieGrid movies={data.movies} />
  <Pagination current={data.page} total={data.total} limit={data.limit} />
{:else}
  <p class="py-16 text-center text-muted">No movies on this page.</p>
{/if}
