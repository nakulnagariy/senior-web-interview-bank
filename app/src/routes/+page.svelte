<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ALL_TOPICS,
		MUST_KNOW_TOPICS,
		TOPIC_BY_SLUG,
		TOPIC_CATEGORIES,
		type Topic
	} from '$lib/data/topics';
	import { loadAsset, type LoadedAsset } from '$lib/content/loaders';
	import StatsHero from '$lib/components/StatsHero.svelte';
	import FiltersBar from '$lib/components/FiltersBar.svelte';
	import TopicSidebar from '$lib/components/TopicSidebar.svelte';
	import TopicViewer from '$lib/components/TopicViewer.svelte';

	type FilterValue = 'all' | 'js' | 'react' | 'ts' | 'css' | 'perf' | 'test' | 'angular' | 'design';

	const DONE_STORAGE_KEY = 'bench_done_topics';

	let selectedSlug = $state(ALL_TOPICS[0].slug);
	let activeFilter = $state<FilterValue>('all');
	let selectedAssetIndex = $state(0);
	let loadedAsset = $state<LoadedAsset | null>(null);
	let loadingAsset = $state(false);
	let doneTopicSlugs = $state<Record<string, boolean>>({});
	let collapsedByCategory = $state<Record<string, boolean>>({});
	let sidebarCollapsed = $state(false);
	let mobileSidebarOpen = $state(false);

	function toggleSidebar(): void {
		sidebarCollapsed = !sidebarCollapsed;
	}

	function toggleMobileSidebar(): void {
		mobileSidebarOpen = !mobileSidebarOpen;
	}

	const visibleCategories = $derived(
		TOPIC_CATEGORIES.filter((category) => activeFilter === 'all' || category.cat === activeFilter)
	);
	const selectedTopic = $derived.by(() => TOPIC_BY_SLUG[selectedSlug] ?? ALL_TOPICS[0]);
	const selectedTopicIndex = $derived.by(() =>
		ALL_TOPICS.findIndex((topic) => topic.slug === selectedTopic.slug)
	);
	const hasPrevTopic = $derived(selectedTopicIndex > 0);
	const hasNextTopic = $derived(selectedTopicIndex < ALL_TOPICS.length - 1);
	const doneCount = $derived(Object.values(doneTopicSlugs).filter(Boolean).length);
	const progressPct = $derived(Math.round((doneCount / ALL_TOPICS.length) * 100));

	function setHashForTopic(topicSlug: string): void {
		window.location.hash = `/${topicSlug}`;
	}

	function readHash(): string | null {
		const hash = window.location.hash.replace(/^#\/?/, '');
		if (!hash) return null;
		return TOPIC_BY_SLUG[hash] ? hash : null;
	}

	function selectTopic(topicSlug: string): void {
		selectedSlug = topicSlug;
		selectedAssetIndex = 0;
		setHashForTopic(topicSlug);
		mobileSidebarOpen = false;
	}

	function selectPrevTopic(): void {
		if (!hasPrevTopic) return;
		const prev = ALL_TOPICS[selectedTopicIndex - 1];
		if (prev) selectTopic(prev.slug);
	}

	function selectNextTopic(): void {
		if (!hasNextTopic) return;
		const next = ALL_TOPICS[selectedTopicIndex + 1];
		if (next) selectTopic(next.slug);
	}

	function toggleDone(topicSlug: string): void {
		doneTopicSlugs = {
			...doneTopicSlugs,
			[topicSlug]: !doneTopicSlugs[topicSlug]
		};
		localStorage.setItem(DONE_STORAGE_KEY, JSON.stringify(doneTopicSlugs));
	}

	function toggleCategory(categoryId: string): void {
		collapsedByCategory = {
			...collapsedByCategory,
			[categoryId]: !collapsedByCategory[categoryId]
		};
	}

	function setFilter(next: FilterValue): void {
		activeFilter = next;
	}

	async function loadSelectedAsset(topic: Topic, assetIndex: number): Promise<void> {
		if (!topic.assets[assetIndex]) {
			loadedAsset = null;
			return;
		}

		loadingAsset = true;
		loadedAsset = await loadAsset(topic.assets[assetIndex]);
		loadingAsset = false;
	}

	onMount(() => {
		const saved = localStorage.getItem(DONE_STORAGE_KEY);
		if (saved) {
			try {
				doneTopicSlugs = JSON.parse(saved) as Record<string, boolean>;
			} catch {
				doneTopicSlugs = {};
			}
		}

		collapsedByCategory = Object.fromEntries(TOPIC_CATEGORIES.map((category) => [category.id, false]));
		selectedSlug = readHash() ?? ALL_TOPICS[0].slug;

		const onHashChange = () => {
			const hashTopic = readHash();
			if (hashTopic) {
				selectedSlug = hashTopic;
				selectedAssetIndex = 0;
			}
		};

		const onKeyDown = (e: KeyboardEvent) => {
			const tag = (e.target as HTMLElement)?.tagName;
			// Skip if typing inside an input/textarea
			if (tag === 'INPUT' || tag === 'TEXTAREA') return;
			// [ key  OR  Ctrl/Cmd + B
			if (e.key === '[' || ((e.ctrlKey || e.metaKey) && e.key === 'b')) {
				e.preventDefault();
				toggleSidebar();
			}
		};

		window.addEventListener('hashchange', onHashChange);
		window.addEventListener('keydown', onKeyDown);
		return () => {
			window.removeEventListener('hashchange', onHashChange);
			window.removeEventListener('keydown', onKeyDown);
		};
	});

	$effect(() => {
		void loadSelectedAsset(selectedTopic, selectedAssetIndex);
	});
</script>

<svelte:head>
	<title>Interview Topic Navigator</title>
	<meta
		name="description"
		content="Connected interview preparation navigator with all roadmap topics, existing content, and placeholders."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main class="app-shell">
	<StatsHero
		totalTopics={ALL_TOPICS.length}
		doneCount={doneCount}
		mustKnowTopics={MUST_KNOW_TOPICS}
		progressPct={progressPct}
	/>

	<div class="mobile-topbar">
		<button class="mobile-menu-btn" onclick={toggleMobileSidebar}>☰ Topics</button>
	</div>

	<FiltersBar activeFilter={activeFilter} onChange={setFilter} />

	{#if mobileSidebarOpen}
		<div class="mobile-backdrop" onclick={toggleMobileSidebar} aria-hidden="true"></div>
	{/if}

	<section class="layout" class:sidebar-collapsed={sidebarCollapsed}>
		<TopicSidebar
			categories={visibleCategories}
			selectedTopic={selectedTopic}
			doneTopicSlugs={doneTopicSlugs}
			collapsedByCategory={collapsedByCategory}
			onToggleCategory={toggleCategory}
			onSelectTopic={selectTopic}
			collapsed={sidebarCollapsed}
			onToggleCollapse={toggleSidebar}
			mobileOpen={mobileSidebarOpen}
			onMobileClose={toggleMobileSidebar}
		/>
		<TopicViewer
			topic={selectedTopic}
			done={Boolean(doneTopicSlugs[selectedTopic.slug])}
			loading={loadingAsset}
			loadedAsset={loadedAsset}
			selectedAssetIndex={selectedAssetIndex}
			onSelectAsset={(index) => (selectedAssetIndex = index)}
			onToggleDone={() => toggleDone(selectedTopic.slug)}
			onPrev={selectPrevTopic}
			onNext={selectNextTopic}
			hasPrev={hasPrevTopic}
			hasNext={hasNextTopic}
		/>
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
		color: #20202a;
		background:
			radial-gradient(circle at 5% 0%, rgba(239, 121, 27, 0.3), transparent 34%),
			radial-gradient(circle at 100% 0%, rgba(35, 121, 185, 0.2), transparent 34%),
			#f7f5f0;
		overflow-x: hidden;
	}

	.app-shell {
		max-width: 1320px;
		margin: 0 auto;
		padding: 1.2rem;
		display: grid;
		gap: 1rem;
	}

	.layout {
		display: grid;
		grid-template-columns: minmax(280px, 420px) minmax(0, 1fr);
		gap: 1rem;
		transition: grid-template-columns 0.2s ease;
	}

	.layout.sidebar-collapsed {
		grid-template-columns: 44px minmax(0, 1fr);
		gap: 0.5rem;
	}

	.mobile-topbar {
		display: none;
	}

	.mobile-menu-btn {
		font-family: inherit;
		background: #1a2437;
		color: #fff;
		border: none;
		border-radius: 10px;
		padding: 0.55rem 1rem;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
	}

	.mobile-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.45);
		z-index: 800;
		cursor: pointer;
	}

	@media (max-width: 980px) {
		.layout {
			grid-template-columns: 1fr;
		}

		.layout.sidebar-collapsed {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.app-shell {
			padding: 0.75rem;
			gap: 0.75rem;
		}

		.mobile-topbar {
			display: flex;
			align-items: center;
		}
	}
</style>
