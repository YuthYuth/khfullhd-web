<script lang="ts">
  import { page } from '$app/state';
  import { signIn, signOut } from '@auth/sveltekit/client';
  import { userLabel, type SessionUser } from '$lib/user';
  import MobileDrawer from './MobileDrawer.svelte';
  import SearchSuggest from './SearchSuggest.svelte';

  let { user = null }: { user?: SessionUser | null } = $props();
  const label = $derived(userLabel(user));

  let menuOpen = $state(false);
  let searchOpen = $state(false);
  const query = $derived(page.url.searchParams.get('q') ?? '');
</script>

<header class="sticky top-0 z-40 border-b border-surface-2 bg-bg/80 backdrop-blur">
  <nav class="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
    <a href="/" class="text-lg font-extrabold tracking-wide text-text">KH<span class="text-accent">•</span>FULLHD</a>

    <!-- Desktop nav (unchanged at sm+) -->
    <a href="/movies" class="hidden text-sm text-muted hover:text-text sm:inline">Browse</a>
    <div class="ml-auto hidden sm:block">
      <SearchSuggest
        initial={query}
        inputClass="w-44 rounded-full bg-surface-2 px-4 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent sm:w-64"
      />
    </div>
    <div class="hidden items-center gap-3 sm:flex">
      {#if label}
        <a href="/favorites" class="text-sm text-muted hover:text-text">Favorites</a>
        <span class="text-sm text-muted">{label}</span>
        <button onclick={() => signOut()} class="rounded-full bg-surface-2 px-4 py-2 text-sm text-text hover:bg-surface">Sign out</button>
      {:else}
        <button onclick={() => signIn('authentik')} class="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">Sign in</button>
      {/if}
    </div>

    <!-- Mobile controls (<sm) -->
    <div class="ml-auto flex items-center gap-1 sm:hidden">
      <button
        type="button"
        aria-label="Open search"
        aria-expanded={searchOpen}
        onclick={() => (searchOpen = !searchOpen)}
        class="flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted hover:text-text"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
      </button>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={menuOpen}
        onclick={() => (menuOpen = true)}
        class="flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted hover:text-text"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>
    </div>
  </nav>

  <!-- Mobile tap-to-reveal search -->
  {#if searchOpen}
    <div class="border-t border-surface-2 px-4 py-3 sm:hidden">
      <SearchSuggest
        initial={query}
        autofocus
        onnavigate={() => (searchOpen = false)}
        inputClass="min-h-11 w-full rounded-full bg-surface-2 px-4 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
      />
    </div>
  {/if}
</header>

<!-- Mobile drawer menu -->
<MobileDrawer bind:open={menuOpen} label="Menu">
  <a href="/movies" onclick={() => (menuOpen = false)} class="flex min-h-11 items-center rounded-lg px-3 text-text hover:bg-surface-2">Browse</a>
  {#if label}
    <a href="/favorites" onclick={() => (menuOpen = false)} class="flex min-h-11 items-center rounded-lg px-3 text-text hover:bg-surface-2">Favorites</a>
    <span class="flex min-h-11 items-center px-3 text-sm text-muted">{label}</span>
    <button onclick={() => signOut()} class="mt-1 flex min-h-11 items-center rounded-lg bg-surface-2 px-3 text-text hover:bg-surface">Sign out</button>
  {:else}
    <button onclick={() => signIn('authentik')} class="mt-1 flex min-h-11 items-center rounded-lg bg-accent px-3 font-semibold text-white">Sign in</button>
  {/if}
</MobileDrawer>
