<script lang="ts">
  import { browser } from '$app/environment';
  import type { Snippet } from 'svelte';

  let {
    open = $bindable(false),
    label = 'Menu',
    children
  }: { open?: boolean; label?: string; children: Snippet } = $props();

  let panel = $state<HTMLElement | null>(null);

  function close() {
    open = false;
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  // Lock body scroll, wire Escape, and move focus into the panel while open.
  $effect(() => {
    if (!browser) return;
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKeydown);
      panel?.focus();
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onKeydown);
      };
    }
  });
</script>

{#if open}
  <!-- Backdrop -->
  <button
    type="button"
    aria-label="Close menu"
    onclick={close}
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm sm:hidden"
  ></button>

  <!-- Panel -->
  <div
    bind:this={panel}
    tabindex="-1"
    role="dialog"
    aria-modal="true"
    aria-label={label}
    class="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80vw] flex-col gap-1 border-l border-surface-2 bg-bg p-4 shadow-2xl outline-none sm:hidden"
  >
    <div class="mb-2 flex items-center justify-between">
      <span class="text-sm font-semibold text-muted">{label}</span>
      <button
        type="button"
        aria-label="Close menu"
        onclick={close}
        class="flex min-h-11 min-w-11 items-center justify-center rounded-full text-2xl text-muted hover:text-text"
      >
        ×
      </button>
    </div>
    {@render children()}
  </div>
{/if}
