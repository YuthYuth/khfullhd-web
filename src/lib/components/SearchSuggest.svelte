<script lang="ts">
  import { goto } from '$app/navigation';

  interface Suggestion {
    movie_id: number;
    title: string | null;
    release_year: number | null;
  }

  let {
    initial = '',
    inputClass = '',
    autofocus = false,
    onnavigate = () => {}
  }: {
    initial?: string;
    inputClass?: string;
    autofocus?: boolean;
    onnavigate?: () => void;
  } = $props();

  // seed once from the URL; after that the user owns the input
  // svelte-ignore state_referenced_locally
  let q = $state(initial);
  let items = $state<Suggestion[]>([]);
  let open = $state(false);
  let active = $state(-1);
  let timer: ReturnType<typeof setTimeout> | undefined;

  function refresh() {
    clearTimeout(timer);
    const value = q.trim();
    if (value.length < 2) {
      items = [];
      open = false;
      return;
    }
    timer = setTimeout(async () => {
      try {
        const r = await fetch(`/api/suggest?q=${encodeURIComponent(value)}`);
        const data = (await r.json()) as { items: Suggestion[] };
        items = data.items;
        active = -1;
        open = items.length > 0;
      } catch {
        items = [];
        open = false;
      }
    }, 200);
  }

  function pick(id: number) {
    open = false;
    onnavigate();
    goto(`/movies/${id}`);
  }

  function onKeydown(e: KeyboardEvent) {
    if (!open || !items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      active = (active + 1) % items.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      active = (active - 1 + items.length) % items.length;
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      pick(items[active].movie_id);
    } else if (e.key === 'Escape') {
      open = false;
    }
  }
</script>

<div class="relative">
  <form action="/search" autocomplete="off">
    <!-- svelte-ignore a11y_autofocus -->
    <input
      name="q"
      bind:value={q}
      oninput={refresh}
      onkeydown={onKeydown}
      onfocus={refresh}
      onblur={() => setTimeout(() => (open = false), 150)}
      {autofocus}
      placeholder="Search movies & series…"
      minlength="2"
      role="combobox"
      aria-expanded={open}
      aria-controls="search-suggestions"
      class={inputClass}
    />
    <button type="submit" class="sr-only">Search</button>
  </form>

  {#if open}
    <ul
      id="search-suggestions"
      role="listbox"
      class="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-surface-2 bg-surface shadow-2xl"
    >
      {#each items as m, i (m.movie_id)}
        <li role="option" aria-selected={i === active}>
          <button
            type="button"
            onmousedown={(e) => e.preventDefault()}
            onclick={() => pick(m.movie_id)}
            onmouseenter={() => (active = i)}
            class="flex w-full items-baseline gap-2 px-4 py-2.5 text-left text-sm {i === active
              ? 'bg-surface-2 text-text'
              : 'text-text/90'}"
          >
            <span class="truncate">{m.title ?? 'Untitled'}</span>
            {#if m.release_year}<span class="shrink-0 text-xs text-muted">{m.release_year}</span>{/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
