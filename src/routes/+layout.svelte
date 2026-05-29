<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  let { children, data } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen flex-col bg-bg text-text">
  <Navbar user={data.user} />
  <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{@render children()}</main>
  <Footer />
</div>
