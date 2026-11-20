<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ALL_TOPICS,
		AUTHORED_TOPIC_COUNT,
		MUST_KNOW_TOPICS,
		TOPIC_BY_SLUG,
		TOPIC_CATEGORIES,
		type Topic
	} from '$lib/data/topics';
	import { loadAsset, type LoadedAsset } from '$lib/content/loaders';
	import { STUDY_GUIDES } from '$lib/data/studyGuides';
	import StatsHero from '$lib/components/StatsHero.svelte';
	import TopicSidebar from '$lib/components/TopicSidebar.svelte';
	import TopicViewer from '$lib/components/TopicViewer.svelte';
	import ClientInterviews from '$lib/components/ClientInterviews.svelte';
	import McqPractice from '$lib/components/McqPractice.svelte';
	import InterviewBank from '$lib/components/InterviewBank.svelte';
	import StudyGuides from '$lib/components/StudyGuides.svelte';
	import Footer from '$lib/components/Footer.svelte';

	const DONE_STORAGE_KEY = 'bench_done_topics';

	let selectedSlug = $state(ALL_TOPICS[0].slug);
	let selectedAssetIndex = $state(ALL_TOPICS[0].assets.findIndex((asset) => !asset.generated));
	let loadedAsset = $state<LoadedAsset | null>(null);
	let loadingAsset = $state(false);
	let doneTopicSlugs = $state<Record<string, boolean>>({});
	let collapsedByCategory = $state<Record<string, boolean>>(
		Object.fromEntries(
			TOPIC_CATEGORIES.map((category) => [category.id, category.id !== ALL_TOPICS[0].slug.split('/')[0]])
		)
	);
	let sidebarCollapsed = $state(false);
	let mobileSidebarOpen = $state(false);
	let showBackToTop = $state(false);
	let activeView = $state<'learn' | 'practice' | 'interviews'>('learn');
	let learnSection = $state<'topics' | 'guides'>('topics');
	let practiceSection = $state<'mcq' | 'bank'>('mcq');

	function toggleSidebar(): void {
		sidebarCollapsed = !sidebarCollapsed;
	}

	function toggleMobileSidebar(): void {
		mobileSidebarOpen = !mobileSidebarOpen;
	}

	function scrollToTop(): void {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

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
		const nextTopic = TOPIC_BY_SLUG[topicSlug] ?? ALL_TOPICS[0];
		selectedAssetIndex = nextTopic.assets.findIndex((asset) => !asset.generated);
		const categoryId = topicSlug.split('/')[0];
		collapsedByCategory = { ...collapsedByCategory, [categoryId]: false };
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

	let loadToken = 0;

	async function loadSelectedAsset(topic: Topic, assetIndex: number): Promise<void> {
		const asset = topic.assets[assetIndex];
		if (!asset) {
			loadedAsset = null;
			return;
		}

		// Keep showing the previous asset while this one loads (TopicViewer just dims it) —
		// a stale-while-revalidate token guard so a slower, superseded fetch can't clobber
		// a newer selection if the user switches topics again before it resolves.
		const token = ++loadToken;
		loadingAsset = true;
		const result = await loadAsset(asset);
		if (token !== loadToken) return;
		loadedAsset = result;
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

		selectedSlug = readHash() ?? ALL_TOPICS[0].slug;
		const selectedCategoryId = selectedSlug.split('/')[0];
		selectedAssetIndex = (TOPIC_BY_SLUG[selectedSlug] ?? ALL_TOPICS[0]).assets.findIndex(
			(asset) => !asset.generated
		);
		collapsedByCategory = Object.fromEntries(
			TOPIC_CATEGORIES.map((category) => [category.id, category.id !== selectedCategoryId])
		);

		const onHashChange = () => {
			const hashTopic = readHash();
			if (hashTopic) {
				selectedSlug = hashTopic;
				const nextTopic = TOPIC_BY_SLUG[hashTopic];
				selectedAssetIndex = nextTopic?.assets.findIndex((asset) => !asset.generated) ?? -1;
				const categoryId = hashTopic.split('/')[0];
				collapsedByCategory = { ...collapsedByCategory, [categoryId]: false };
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

		const onScroll = () => {
			showBackToTop = window.scrollY > 400;
		};

		window.addEventListener('hashchange', onHashChange);
		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			window.removeEventListener('hashchange', onHashChange);
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('scroll', onScroll);
		};
	});

	$effect(() => {
		void loadSelectedAsset(selectedTopic, selectedAssetIndex);
	});
</script>

<svelte:head>
	<title>Frontend Interview Prep | JavaScript, React &amp; System Design</title>
	<meta
		name="description"
		content="Prepare for frontend and web developer interviews with practical questions and 100+ topics in JavaScript, React, TypeScript, CSS, and system design."
	/>
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://senior-web-interview-bank.vercel.app/" />

	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "WebSite",
					"@id": "https://senior-web-interview-bank.vercel.app/#website",
					"name": "Frontend Interview Prep",
					"alternateName": "Bench Interview Preparation Navigator",
					"url": "https://senior-web-interview-bank.vercel.app/"
				},
				{
					"@type": "WebApplication",
					"@id": "https://senior-web-interview-bank.vercel.app/#application",
					"name": "Frontend Interview Prep",
					"url": "https://senior-web-interview-bank.vercel.app/",
					"description": "Prepare for frontend and web developer interviews with practical questions and 100+ topics in JavaScript, React, TypeScript, CSS, and system design.",
					"applicationCategory": "EducationalApplication",
					"operatingSystem": "Web"
				}
			]
		}
	</script>

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://senior-web-interview-bank.vercel.app/" />
	<meta property="og:title" content="Frontend Interview Prep | JavaScript, React &amp; System Design" />
	<meta
		property="og:description"
		content="Prepare for frontend and web developer interviews with practical questions and 100+ topics in JavaScript, React, TypeScript, CSS, and system design."
	/>
	<meta property="og:site_name" content="Frontend Interview Prep" />
	<meta property="og:image" content="https://senior-web-interview-bank.vercel.app/icons/icon-512.png" />
	<meta property="og:image:width" content="512" />
	<meta property="og:image:height" content="512" />
	<meta property="og:image:alt" content="Frontend Interview Prep app icon" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:image" content="https://senior-web-interview-bank.vercel.app/icons/icon-512.png" />
	<meta name="twitter:image:alt" content="Frontend Interview Prep app icon" />
	<meta name="twitter:title" content="Frontend Interview Prep | JavaScript, React &amp; System Design" />
	<meta
		name="twitter:description"
		content="Prepare for frontend and web developer interviews with practical questions and 100+ topics in JavaScript, React, TypeScript, CSS, and system design."
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
		authoredTopicCount={AUTHORED_TOPIC_COUNT}
		guideCount={STUDY_GUIDES.length}
		doneCount={doneCount}
		mustKnowTopics={MUST_KNOW_TOPICS}
		progressPct={progressPct}
	/>

	<nav class="view-tabs" aria-label="Main application views">
		<button
			class="view-tab"
			class:active={activeView === 'learn'}
			aria-pressed={activeView === 'learn'}
			onclick={() => (activeView = 'learn')}
		>
			📚 Learn
		</button>
		<button
			class="view-tab"
			class:active={activeView === 'practice'}
			aria-pressed={activeView === 'practice'}
			onclick={() => (activeView = 'practice')}
		>
			📝 Practice
		</button>
		<button
			class="view-tab"
			class:active={activeView === 'interviews'}
			aria-pressed={activeView === 'interviews'}
			onclick={() => (activeView = 'interviews')}
		>
			💼 Interview Log
		</button>
	</nav>

	{#if activeView === 'learn'}
		<nav class="view-subtabs" aria-label="Learn sections">
			<button class:active={learnSection === 'topics'} aria-pressed={learnSection === 'topics'} onclick={() => (learnSection = 'topics')}>
				Topics
			</button>
			<button class:active={learnSection === 'guides'} aria-pressed={learnSection === 'guides'} onclick={() => (learnSection = 'guides')}>
				Study guides <span>{STUDY_GUIDES.length}</span>
			</button>
		</nav>
		{#if learnSection === 'topics'}
			<div class="mobile-topbar">
				<button class="mobile-menu-btn" onclick={toggleMobileSidebar}>&#9776; Subjects &amp; topics</button>
			</div>
			{#if mobileSidebarOpen}
				<div class="mobile-backdrop" onclick={toggleMobileSidebar} aria-hidden="true"></div>
			{/if}
			<section class="layout" class:sidebar-collapsed={sidebarCollapsed}>
				<TopicSidebar
					categories={TOPIC_CATEGORIES}
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
		{:else}
			<StudyGuides />
		{/if}
	{:else if activeView === 'practice'}
		<nav class="view-subtabs" aria-label="Practice sections">
			<button class:active={practiceSection === 'mcq'} aria-pressed={practiceSection === 'mcq'} onclick={() => (practiceSection = 'mcq')}>
				MCQ practice
			</button>
			<button class:active={practiceSection === 'bank'} aria-pressed={practiceSection === 'bank'} onclick={() => (practiceSection = 'bank')}>
				Interview questions
			</button>
		</nav>
		{#if practiceSection === 'mcq'}
			<McqPractice />
		{:else}
			<InterviewBank />
		{/if}
	{:else}
		<ClientInterviews />
	{/if}

	<Footer />
</main>

{#if showBackToTop}
	<button class="back-to-top" onclick={scrollToTop} aria-label="Back to top">↑</button>
{/if}

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
		grid-template-columns: minmax(0, 1fr);
		gap: 1rem;
		min-width: 0;
		width: 100%;
		box-sizing: border-box;
	}

	.layout {
		display: grid;
		grid-template-columns: minmax(280px, 420px) minmax(0, 1fr);
		gap: 1rem;
		transition: grid-template-columns 0.2s ease;
		align-items: start;
		min-width: 0;
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

	.back-to-top {
		position: fixed;
		bottom: 1.75rem;
		right: 1.75rem;
		z-index: 500;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: none;
		background: #1a2437;
		color: #fff;
		font-size: 1.4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.22);
		transition:
			background 0.15s,
			transform 0.15s;
		line-height: 1;
	}

	.back-to-top:hover {
		background: #ef791b;
		transform: translateY(-3px);
	}

	/* ── View tab switcher ── */
	.view-tabs {
		position: sticky;
		top: max(0.5rem, env(safe-area-inset-top));
		z-index: 20;
		display: flex;
		align-self: start;
		flex-wrap: nowrap;
		gap: 0.5rem;
		padding: 0.3rem;
		background: rgba(255, 255, 255, 0.7);
		border: 1px solid #d8dee7;
		border-radius: 16px;
		width: fit-content;
		max-width: 100%;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		backdrop-filter: blur(12px);
		scrollbar-width: thin;
	}

	.view-subtabs {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		width: fit-content;
		max-width: 100%;
		padding: 0.2rem;
		border: 1px solid #d8dee7;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.65);
		overflow-x: auto;
	}

	.view-subtabs button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		min-height: 2.25rem;
		padding: 0.45rem 0.75rem;
		border: 0;
		border-radius: 6px;
		background: transparent;
		color: #586476;
		font: inherit;
		font-size: 0.84rem;
		font-weight: 600;
		white-space: nowrap;
		cursor: pointer;
	}

	.view-subtabs button.active {
		background: #fff;
		color: #1a2437;
		box-shadow: 0 1px 4px rgba(26, 36, 55, 0.16);
	}

	.view-subtabs button span {
		color: #738095;
		font-size: 0.72rem;
	}

	.view-tab {
		flex: 0 0 auto;
		font-family: inherit;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: transparent;
		border: none;
		border-radius: 12px;
		padding: 0.55rem 1.1rem;
		font-size: 0.92rem;
		font-weight: 600;
		color: #657389;
		cursor: pointer;
		transition: background 0.18s, color 0.18s;
		white-space: nowrap;
	}

	.view-tab:hover {
		background: rgba(26, 36, 55, 0.06);
		color: #1a2437;
	}

	.view-tab.active {
		background: #1a2437;
		color: #fff;
		box-shadow: 0 2px 10px rgba(26, 36, 55, 0.25);
	}

	/* ── Tablet + smaller: single-column layout (≤ 1024px) ── */
	@media (max-width: 1024px) {
		.layout {
			grid-template-columns: 1fr;
		}

		.layout.sidebar-collapsed {
			grid-template-columns: 1fr;
		}
	}

	/* ── Phablets & phones (≤ 768px): show mobile topbar & drawer ── */
	@media (max-width: 768px) {
		.app-shell {
			padding: 0.9rem;
			gap: 0.9rem;
		}

		.mobile-topbar {
			display: flex;
			align-items: center;
		}

		/* sidebar is position:fixed on mobile — remove phantom grid gap */
		.layout {
			gap: 0;
		}

		.view-tabs {
			width: 100%;
			justify-content: flex-start;
		}

		.view-tab {
			flex: 1;
			justify-content: center;
			font-size: 0.85rem;
			padding: 0.5rem 0.6rem;
		}
	}

	/* ── Small phones (≤ 480px) ── */
	@media (max-width: 480px) {
		.app-shell {
			padding: 0.75rem;
			gap: 0.75rem;
		}

		.mobile-menu-btn {
			font-size: 0.88rem;
		}

		.view-tabs {
			gap: 0.25rem;
			padding: 0.25rem;
		}

		.view-tab {
			flex: 0 0 auto;
			gap: 0.35rem;
			padding: 0.45rem 0.4rem;
			font-size: 0.8rem;
			white-space: nowrap;
		}

	}

	/* ── Extra small phones (≤ 360px) ── */
	@media (max-width: 360px) {
		.app-shell {
			padding: 0.5rem;
			gap: 0.5rem;
		}

		.mobile-menu-btn {
			font-size: 0.82rem;
			padding: 0.45rem 0.7rem;
		}
	}
</style>
