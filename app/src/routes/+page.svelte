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

		window.addEventListener('hashchange', onHashChange);
		return () => window.removeEventListener('hashchange', onHashChange);
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

	<FiltersBar activeFilter={activeFilter} onChange={setFilter} />

	<section class="layout">
		<TopicSidebar
			categories={visibleCategories}
			selectedTopic={selectedTopic}
			doneTopicSlugs={doneTopicSlugs}
			collapsedByCategory={collapsedByCategory}
			onToggleCategory={toggleCategory}
			onSelectTopic={selectTopic}
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
	}

	@media (max-width: 980px) {
		.layout {
			grid-template-columns: 1fr;
		}
	}
</style>
