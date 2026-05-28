<script lang="ts">
  import type { PageData } from './$types';
  import PosterRow from '$lib/components/PosterRow.svelte';
  let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>khfullhd — movies & series</title></svelte:head>

<section class="mb-12 rounded-2xl bg-gradient-to-br from-surface-2 to-bg p-8 md:p-12">
  <h1 class="text-3xl font-extrabold md:text-4xl">Discover 8,700+ movies &amp; series</h1>
  <p class="mt-3 max-w-xl text-muted">Browse, search, and explore the khfullhd catalog.</p>
  <a href="/movies" class="mt-6 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-white">
    Browse the catalog
  </a>
</section>

<PosterRow title="Top rated" movies={data.topRated} />
<PosterRow title="Newest" movies={data.newest} />
