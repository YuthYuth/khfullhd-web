<script lang="ts">
  import { page } from '$app/state';
</script>

<div class="py-24 text-center">
  <h1 class="text-6xl font-extrabold text-accent">{page.status}</h1>
  <p class="mt-4 text-muted">{page.error?.message ?? 'Something went wrong.'}</p>
  <a href="/" class="mt-8 inline-block rounded-full bg-surface-2 px-6 py-3 hover:bg-surface">Back home</a>
</div>
