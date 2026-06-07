<script lang="ts">
	import { CATEGORY_BY_ID, type Topic, type TopicCategory } from '$lib/data/topics';
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

	const categoryId = $derived.by(() => topic.slug.split('/')[0]);
	const categoryName = $derived.by(
		() => (CATEGORY_BY_ID[categoryId] as TopicCategory | undefined)?.label ?? categoryId
	);

	function safeAssetLabel(label: string, type: string): string {
		return `${label} (${type})`;
	}
</script>

<article class="viewer">
	<div class="viewer-head">
		<div>
			<p class="crumbs">{categoryName} / {topic.slug.split('/')[1]}</p>
			<h3>{topic.title}</h3>
			<p>{topic.slug}</p>
		</div>
		<button class="done-toggle" onclick={onToggleDone}>
			{done ? 'Mark as not covered' : 'Mark as covered'}
		</button>
	</div>

	<div class="topic-nav">
		<button disabled={!hasPrev} onclick={onPrev}>Previous topic</button>
		<button disabled={!hasNext} onclick={onNext}>Next topic</button>
	</div>

	{#if topic.assets.length > 0}
		<div class="asset-tabs">
			{#each topic.assets as asset, index}
				<button class:active={selectedAssetIndex === index} onclick={() => onSelectAsset(index)}>
					{safeAssetLabel(asset.label, asset.type)}
				</button>
			{/each}
		</div>

		{#if loading}
			<p class="placeholder">Loading content...</p>
		{:else if loadedAsset?.error}
			<p class="placeholder error">{loadedAsset.error}</p>
		{:else if loadedAsset?.asset.type === 'markdown' && loadedAsset.html}
			<div class="markdown">{@html loadedAsset.html}</div>
		{:else if loadedAsset?.asset.type === 'html' && loadedAsset.html}
			<iframe title="assessment" class="html-frame" srcdoc={loadedAsset.html}></iframe>
		{:else if loadedAsset?.asset.type === 'csv' && loadedAsset.rows}
			<Flashcard rows={loadedAsset.rows} />
		{:else if loadedAsset?.text}
			<pre><code>{loadedAsset.text}</code></pre>
		{/if}
	{:else}
		<div class="placeholder">
			<h4>Placeholder topic</h4>
			<p>This topic is fully routed and connected, but content has not been added yet.</p>
			<ol>
				<li>Add interview notes markdown for this topic.</li>
				<li>Add at least one code or assessment asset.</li>
				<li>Update manifest mapping for the new files.</li>
			</ol>
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

	.markdown :global(h1),
	.markdown :global(h2),
	.markdown :global(h3) {
		margin-top: 1rem;
	}

	.markdown {
		min-width: 0;
		overflow-x: hidden;
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
		}
	}
</style>
