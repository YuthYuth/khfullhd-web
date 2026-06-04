<script lang="ts">
  import type { Movie } from '$lib/types';
  import { posterUrl } from '$lib/utils';
  import PosterPlaceholder from './PosterPlaceholder.svelte';

  let { movie }: { movie: Movie } = $props();
  const poster = $derived(posterUrl(movie.poster_url));
</script>

<a href="/movies/{movie.movie_id}" class="group block">
  <div class="poster relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 active:scale-95">
    {#if poster}
      <img src={poster} alt={movie.title ?? 'Untitled'} class="aspect-[2/3] w-full object-cover" loading="lazy" />
    {:else}
      <PosterPlaceholder title={movie.title ?? ''} />
    {/if}
    {#if movie.imdb_rating}
      <span class="absolute left-2 top-2 rounded bg-rating px-1.5 py-0.5 text-xs font-bold text-black">
        {movie.imdb_rating}
      </span>
    {/if}
  </div>
  <div class="mt-2">
    <p class="truncate text-sm font-semibold text-text">{movie.title ?? 'Untitled'}</p>
    {#if movie.release_year}<p class="text-xs text-muted">{movie.release_year}</p>{/if}
  </div>
</a>

<style>
  /* Only scale on devices that truly hover — avoids sticky-hover after tap on touch. */
  @media (hover: hover) {
    .group:hover .poster {
      transform: scale(1.05);
    }
  }
</style>
