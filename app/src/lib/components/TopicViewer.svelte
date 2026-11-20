<script lang="ts">
	import { CATEGORY_BY_ID, type Topic, type TopicAsset, type TopicCategory } from '$lib/data/topics';
	import type { LoadedAsset } from '$lib/content/loaders';
	import Flashcard from '$lib/components/Flashcard.svelte';

	let {
		topic,
		done,
		loading,
		loadedAsset,
		selectedAssetIndex,
		onSelectAsset,
		onToggleDone,
		onPrev,
		onNext,
		hasPrev,
		hasNext
	} = $props<{
		topic: Topic;
		done: boolean;
		loading: boolean;
		loadedAsset: LoadedAsset | null;
		selectedAssetIndex: number;
		onSelectAsset: (index: number) => void;
		onToggleDone: () => void;
		onPrev: () => void;
		onNext: () => void;
		hasPrev: boolean;
		hasNext: boolean;
	}>();
	let showGenerated = $state(false);

	$effect(() => {
		topic.slug;
		showGenerated = false;
	});

	const categoryId = $derived.by(() => topic.slug.split('/')[0]);
	const categoryName = $derived.by(
		() => (CATEGORY_BY_ID[categoryId] as TopicCategory | undefined)?.label ?? categoryId
	);

	function safeAssetLabel(label: string, type: string): string {
		return `${label} (${type})`;
	}

	const visibleAssets: { asset: TopicAsset; index: number }[] = $derived(
		topic.assets.flatMap((asset: TopicAsset, index: number) =>
			showGenerated || !asset.generated ? [{ asset, index }] : []
		)
	);
	const selectedAssetVisible = $derived(
		visibleAssets.some(({ index }: { index: number }) => index === selectedAssetIndex)
	);

	function toggleGenerated(): void {
		if (!showGenerated) {
			showGenerated = true;
			if (visibleAssets.length === 0) {
				onSelectAsset(topic.assets.findIndex((asset: TopicAsset) => asset.generated));
			}
			return;
		}

		if (topic.assets[selectedAssetIndex]?.generated) {
			onSelectAsset(topic.assets.findIndex((asset: TopicAsset) => !asset.generated));
		}
		showGenerated = false;
	}
</script>

<article class="viewer">
	<div class="viewer-head">
		<div>
			<p class="crumbs">{categoryName} / {topic.slug.split('/')[1]}</p>
			<h3>{topic.title}</h3>
		</div>
		<button class="done-toggle" onclick={onToggleDone}>
			{done ? 'Mark as not covered' : 'Mark as covered'}
		</button>
	</div>

	<div class="topic-nav">
		<button disabled={!hasPrev} onclick={onPrev}>Previous topic</button>
		<button disabled={!hasNext} onclick={onNext}>Next topic</button>
	</div>

	{#if topic.assets.some((asset: TopicAsset) => asset.generated)}
		<button class="starter-toggle" onclick={toggleGenerated} aria-expanded={showGenerated}>
			{showGenerated ? 'Hide generated starter drafts' : 'Show generated starter drafts'}
		</button>
	{/if}

	{#if visibleAssets.length > 0}
		<div class="asset-tabs">
			{#each visibleAssets as { asset, index } (asset.path)}
				<button class:active={selectedAssetIndex === index} onclick={() => onSelectAsset(index)}>
					{safeAssetLabel(asset.label, asset.type)}
				</button>
			{/each}
		</div>
		{#if !selectedAssetVisible}
			<div class="placeholder">
				<h4>No authored material yet</h4>
				<p>Generated starter drafts are available above; they are not reviewed interview content.</p>
			</div>
		{:else if loadedAsset?.error}
			<p class="placeholder error">{loadedAsset.error}</p>
		{:else if loadedAsset?.asset.type === 'markdown' && loadedAsset.html}
			<div class="markdown" class:is-loading={loading}>{@html loadedAsset.html}</div>
		{:else if loadedAsset?.asset.type === 'html' && loadedAsset.html}
			<iframe title="assessment" class="html-frame" class:is-loading={loading} srcdoc={loadedAsset.html}></iframe>
		{:else if loadedAsset?.asset.type === 'csv' && loadedAsset.rows}
			<Flashcard rows={loadedAsset.rows} />
		{:else if loadedAsset?.text}
			<pre class:is-loading={loading}><code>{loadedAsset.text}</code></pre>
		{:else if loading}
			<p class="placeholder">Loading content...</p>
		{/if}
	{:else if topic.assets.length > 0}
		<div class="placeholder">
			<h4>No authored material yet</h4>
			<p>Show generated starter drafts above if you want to use an unreviewed scaffold.</p>
		</div>
	{:else}
		<div class="placeholder">
			<h4>Authored material in progress</h4>
			<p>No reviewed notes or exercises are mapped to this topic yet.</p>
		</div>
	{/if}
</article>

<style>
	.viewer {
		background: #ffffff;
		border: 1px solid #d8dee7;
		border-radius: 14px;
		padding: 0.9rem;
		min-height: 72vh;
		display: grid;
		align-content: start;
		gap: 0.7rem;
		min-width: 0;
	}

	.viewer-head {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.crumbs {
		margin: 0;
		font-size: 0.74rem;
		color: #657389;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.viewer-head h3 {
		margin: 0.3rem 0 0;
		font-size: 1.1rem;
	}

	.viewer-head p {
		margin: 0.2rem 0 0;
		font-size: 0.78rem;
		color: #596275;
		font-family: 'IBM Plex Mono', monospace;
	}

	.done-toggle,
	.topic-nav button,
	.asset-tabs button {
		font-family: inherit;
	}

	.done-toggle {
		border: 1px solid #d8dee7;
		background: #fff;
		border-radius: 10px;
		padding: 0.4rem 0.75rem;
		cursor: pointer;
	}

	.topic-nav {
		display: flex;
		gap: 0.5rem;
	}

	.topic-nav button {
		border: 1px solid #d8dee7;
		background: #fff;
		border-radius: 8px;
		padding: 0.3rem 0.7rem;
		cursor: pointer;
	}

	.topic-nav button:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.asset-tabs {
		display: flex;
		gap: 0.45rem;
		flex-wrap: wrap;
	}

	.asset-tabs button {
		border: 1px solid #d7dde7;
		background: #f8fafc;
		border-radius: 10px;
		padding: 0.3rem 0.6rem;
		font-size: 0.8rem;
		cursor: pointer;
	}

	.asset-tabs button.active {
		background: #1a2437;
		color: #fff;
		border-color: #1a2437;
	}

	.starter-toggle {
		justify-self: start;
		border: 0;
		padding: 0.2rem 0;
		background: none;
		color: #586476;
		font: inherit;
		font-size: 0.8rem;
		text-decoration: underline;
		text-underline-offset: 0.15rem;
		cursor: pointer;
	}

	.markdown :global(h1),
	.markdown :global(h2),
	.markdown :global(h3) {
		margin-top: 1rem;
	}

	.markdown {
		min-width: 0;
		overflow-x: auto;
		opacity: 1;
		transition: opacity 0.12s ease;
	}

	.markdown.is-loading,
	.html-frame.is-loading,
	pre.is-loading {
		opacity: 0.45;
	}

	.html-frame,
	pre {
		transition: opacity 0.12s ease;
	}

	.markdown :global(pre),
	pre {
		margin: 0;
		background: #171f2d;
		color: #f8fbff;
		padding: 0.75rem;
		border-radius: 10px;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		max-width: 100%;
		box-sizing: border-box;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.84rem;
		white-space: pre;
		word-wrap: normal;
	}

	/* ── Tablet (≤ 1024px): constrain code block width ── */
	@media (max-width: 1024px) {
		.markdown :global(pre),
		pre {
			max-width: calc(100vw - 4rem);
		}
	}

	/* ── Phablets & phones (≤ 768px) ── */
	@media (max-width: 768px) {
		.markdown :global(pre),
		pre {
			max-width: calc(100vw - 3rem);
			font-size: 0.8rem;
			padding: 0.6rem;
		}
	}

	/* ── Small phones (≤ 480px) ── */
	@media (max-width: 480px) {
		.markdown :global(pre),
		pre {
			max-width: calc(100vw - 2.5rem);
			font-size: 0.76rem;
			padding: 0.5rem;
		}
	}

	.markdown :global(code:not(pre > code)) {
		word-break: break-word;
		overflow-wrap: break-word;
	}

	.html-frame {
		width: 100%;
		min-height: 58vh;
		border: 1px solid #d7dde6;
		border-radius: 10px;
		background: #fff;
	}

	.placeholder {
		border: 1px dashed #b8c5d9;
		border-radius: 10px;
		padding: 0.8rem;
		background: #f8fbff;
	}

	.placeholder.error {
		background: #fff4f4;
		border-color: #e7b2b2;
		color: #6e1f1f;
	}

	/* ── Phablets & phones (≤ 768px) ── */
	@media (max-width: 768px) {
		.viewer {
			padding: 0.75rem;
			min-height: unset;
		}

		.viewer-head {
			flex-direction: column;
			gap: 0.5rem;
		}

		.done-toggle {
			width: 100%;
			padding: 0.6rem 0.75rem;
			font-size: 0.88rem;
			min-height: 44px;
		}

		.topic-nav {
			width: 100%;
		}

		.topic-nav button {
			flex: 1;
			padding: 0.55rem 0.5rem;
			font-size: 0.85rem;
			min-height: 44px;
		}

		.asset-tabs button {
			padding: 0.45rem 0.7rem;
			font-size: 0.82rem;
			min-height: 38px;
		}

		.html-frame {
			min-height: 45vh;
		}
	}

	/* ── Small phones (≤ 480px) ── */
	@media (max-width: 480px) {
		.viewer {
			padding: 0.65rem;
			gap: 0.55rem;
			border-radius: 10px;
		}

		.viewer-head h3 {
			font-size: 0.98rem;
		}

		.topic-nav button {
			font-size: 0.8rem;
		}
	}

	/* ── Extra small phones (≤ 360px) ── */
	@media (max-width: 360px) {
		.viewer {
			padding: 0.5rem;
			gap: 0.45rem;
		}

		.viewer-head h3 {
			font-size: 0.9rem;
		}

		.done-toggle {
			font-size: 0.82rem;
			padding: 0.5rem 0.6rem;
		}

		.topic-nav button {
			font-size: 0.78rem;
			padding: 0.45rem 0.4rem;
		}

		.asset-tabs button {
			padding: 0.38rem 0.55rem;
			font-size: 0.78rem;
			min-height: 34px;
		}

		.html-frame {
			min-height: 38vh;
		}

		.markdown :global(pre),
		pre {
			font-size: 0.78rem;
			padding: 0.55rem;
			max-width: calc(100vw - 1.5rem);
		}
	}
</style>
