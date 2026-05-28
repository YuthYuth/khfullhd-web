<script lang="ts">
  let { title = '' }: { title?: string } = $props();
</script>

<div class="flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-surface-2 text-muted">
  <span class="px-2 text-center text-sm">{title || 'No poster'}</span>
</div>
