<script lang="ts">
  import type { PageData } from './$types';
  import MovieCard from '$lib/components/MovieCard.svelte';
  let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>My favorites · khfullhd</title></svelte:head>

<h1 class="mb-6 text-2xl font-bold">My favorites</h1>

{#if data.movies.length}
  <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
    {#each data.movies as movie (movie.movie_id)}
      <div>
        <MovieCard {movie} />
        <form method="POST" action="?/unfavorite" class="mt-1">
          <input type="hidden" name="movie_id" value={movie.movie_id} />
          <button class="w-full rounded bg-surface-2 px-2 py-1 text-xs text-muted hover:text-text">Remove</button>
        </form>
      </div>
    {/each}
  </div>
{:else}
  <p class="py-16 text-center text-muted">No favorites yet. Open a movie and tap ♡ Save.</p>
{/if}
