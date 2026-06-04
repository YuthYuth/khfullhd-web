<script lang="ts">
  import type { PageData } from './$types';
  import { posterUrl, parseGenres } from '$lib/utils';
  import PosterPlaceholder from '$lib/components/PosterPlaceholder.svelte';
  let { data }: { data: PageData } = $props();
  const m = $derived(data.movie);
  const poster = $derived(posterUrl(m.poster_url, 'w500'));
  const backdrop = $derived(posterUrl(m.poster_url, 'w780'));
  const genres = $derived(parseGenres(m.genres));
</script>

<svelte:head><title>{m.title ?? 'Movie'} · khfullhd</title></svelte:head>

<div class="relative">
  {#if backdrop}
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl opacity-20 blur-2xl">
      <img src={backdrop} alt="" class="h-full w-full object-cover" />
    </div>
  {/if}

  <div class="flex flex-col gap-8 py-6 md:flex-row">
    <div class="w-full max-w-[260px] shrink-0">
      {#if poster}
        <img src={poster} alt={m.title ?? 'Untitled'} class="w-full rounded-lg shadow-2xl" />
      {:else}
        <PosterPlaceholder title={m.title ?? ''} />
      {/if}
    </div>

    <div class="flex-1">
      <h1 class="text-3xl font-extrabold">{m.title ?? 'Untitled'}</h1>
      <div class="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
        {#if m.release_year}<span>{m.release_year}</span>{/if}
        {#if m.imdb_rating}<span class="rounded bg-rating px-1.5 py-0.5 font-bold text-black">★ {m.imdb_rating}</span>{/if}
      </div>

      {#if data.signedIn}
        <form method="POST" action={data.favorited ? '?/unfavorite' : '?/favorite'} class="mt-4">
          <button class="inline-flex min-h-11 items-center rounded-full border border-surface-2 px-5 text-sm hover:border-accent">
            {data.favorited ? '♥ Saved' : '♡ Save'}
          </button>
        </form>
      {:else}
        <p class="mt-4 text-sm text-muted">Sign in to save this movie.</p>
      {/if}

      {#if genres.length}
        <div class="mt-4 flex flex-wrap gap-2">
          {#each genres as g (g)}<span class="rounded-full bg-surface-2 px-3 py-1 text-xs">{g}</span>{/each}
        </div>
      {/if}

      {#if m.description}<p class="mt-6 max-w-2xl leading-relaxed text-text/90">{m.description}</p>{/if}

      {#if m.url}
        <a href={m.url} target="_blank" rel="noopener noreferrer"
          class="mt-8 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-white">
          Watch on source ↗
        </a>
      {/if}
    </div>
  </div>
</div>
