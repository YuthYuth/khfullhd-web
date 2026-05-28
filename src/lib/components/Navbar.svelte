<script lang="ts">
  import { page } from '$app/state';
</script>

<header class="sticky top-0 z-50 border-b border-surface-2 bg-bg/80 backdrop-blur">
  <nav class="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
    <a href="/" class="text-lg font-extrabold tracking-wide text-text">KH<span class="text-accent">•</span>FULLHD</a>
    <a href="/movies" class="text-sm text-muted hover:text-text">Browse</a>
    <form action="/search" class="ml-auto">
      <input
        name="q"
        value={page.url.searchParams.get('q') ?? ''}
        placeholder="Search movies & series…"
        minlength="2"
        class="w-44 rounded-full bg-surface-2 px-4 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent sm:w-64"
      />
      <button type="submit" class="sr-only">Search</button>
    </form>
  </nav>
</header>
