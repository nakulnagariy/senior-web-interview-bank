<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	let online = $state(true);
	let offlineReady = $state(false);
	let showReadyToast = $state(false);

	onMount(() => {
		online = navigator.onLine;
		const setOnline = () => (online = true);
		const setOffline = () => (online = false);
		window.addEventListener('online', setOnline);
		window.addEventListener('offline', setOffline);

		// The service worker precaches the whole app on first visit. Tell the user once it is done.
		// Registered only in production: in dev mode there's no literal /index.html to precache
		// (SvelteKit serves "/" dynamically), and a cache-first SW conflicts with Vite's dev module graph.
		if (!dev && 'serviceWorker' in navigator) {
			navigator.serviceWorker.register('/service-worker.js', { type: 'module' });
			navigator.serviceWorker.ready.then(() => {
				offlineReady = true;
				let seen = false;
				try {
					seen = localStorage.getItem('bench_offline_ready_seen') === '1';
					localStorage.setItem('bench_offline_ready_seen', '1');
				} catch {
					/* storage blocked */
				}
				if (!seen) {
					showReadyToast = true;
					setTimeout(() => (showReadyToast = false), 4000);
				}
			});
		}

		return () => {
			window.removeEventListener('online', setOnline);
			window.removeEventListener('offline', setOffline);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

{#if !online}
	<div class="net-pill offline" role="status">
		{offlineReady ? 'Offline — everything still works' : 'Offline'}
	</div>
{:else if showReadyToast}
	<div class="net-pill ready" role="status">✓ Ready for offline use</div>
{/if}

<style>
	.net-pill {
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		top: calc(0.6rem + env(safe-area-inset-top));
		z-index: 1000;
		padding: 0.45rem 0.9rem;
		border-radius: 999px;
		font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
		font-size: 0.82rem;
		font-weight: 600;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.22);
		pointer-events: none;
		max-width: calc(100vw - 2rem);
		text-align: center;
	}

	.offline {
		background: #1a2437;
		color: #fff;
	}

	.ready {
		background: #2e9a52;
		color: #fff;
	}
</style>
