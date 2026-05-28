<script lang="ts">
  import type { Movie } from '$lib/types';
  import MovieCard from './MovieCard.svelte';
  let { title, movies }: { title: string; movies: Movie[] } = $props();
</script>

<section class="mb-10">
  <h2 class="mb-4 text-xl font-bold text-text">{title}</h2>
  <div class="flex gap-4 overflow-x-auto pb-2">
    {#each movies as movie (movie.movie_id)}
      <div class="w-32 shrink-0 sm:w-36"><MovieCard {movie} /></div>
    {/each}
  </div>
</section>
