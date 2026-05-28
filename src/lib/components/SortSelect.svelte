<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  let { sort }: { sort: string } = $props();

  const options = [
    { value: 'release_year_desc', label: 'Newest' },
    { value: 'release_year_asc', label: 'Oldest' },
    { value: 'rating_desc', label: 'Top rated' },
    { value: 'title_asc', label: 'Title A–Z' }
  ];

  function onChange(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    const url = new URL(page.url);
    url.searchParams.set('sort', value);
    url.searchParams.set('page', '1');
    goto(url, { keepFocus: true });
  }
</script>

<select value={sort} onchange={onChange} class="rounded bg-surface-2 px-3 py-2 text-sm text-text">
  {#each options as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
</select>
