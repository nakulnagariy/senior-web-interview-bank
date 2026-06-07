<script lang="ts">
	import type { Topic, TopicCategory } from '$lib/data/topics';

	let {
		categories,
		selectedTopic,
		doneTopicSlugs,
		collapsedByCategory,
		onToggleCategory,
		onSelectTopic,
		collapsed = false,
		onToggleCollapse,
		mobileOpen = false,
		onMobileClose
	} = $props<{
		categories: TopicCategory[];
		selectedTopic: Topic;
		doneTopicSlugs: Record<string, boolean>;
		collapsedByCategory: Record<string, boolean>;
		onToggleCategory: (categoryId: string) => void;
		onSelectTopic: (slug: string) => void;
		collapsed?: boolean;
		onToggleCollapse: () => void;
		mobileOpen?: boolean;
		onMobileClose?: () => void;
	}>();

	const priorityClass: Record<Topic['priority'], string> = {
		must: 'prio-must',
		high: 'prio-high',
		med: 'prio-med',
		low: 'prio-low'
	};
</script>

{#if collapsed && !mobileOpen}
	<aside class="sidebar sidebar-slim">
		<button class="slim-toggle" onclick={onToggleCollapse} title="Expand topic list  [" aria-label="Expand topic list">
			<span class="slim-arrow">▶</span>
			<span class="slim-label">Topics</span>
		</button>
	</aside>
{:else}
	<aside class="sidebar" class:mobile-open={mobileOpen}>
		<div class="sidebar-header">
			<span class="sidebar-title">Topics</span>
			<div class="header-actions">
				<button class="mobile-close-btn" onclick={onMobileClose} aria-label="Close topics panel">✕</button>
				<button class="collapse-btn" onclick={onToggleCollapse} title="Collapse sidebar  [" aria-label="Collapse sidebar">◄</button>
			</div>
		</div>
		{#each categories as category}
			<article class="category-card">
				<button class="category-title" onclick={() => onToggleCategory(category.id)}>
					<span>{category.label}</span>
					<span class:closed={collapsedByCategory[category.id]}>▾</span>
				</button>
				{#if !collapsedByCategory[category.id]}
					<ul>
						{#each category.topics as topic}
							<li>
								<button class:selected={selectedTopic.slug === topic.slug} onclick={() => onSelectTopic(topic.slug)}>
									<span class={`dot ${priorityClass[topic.priority as Topic['priority']]}`}></span>
									<span class="title">{topic.title}</span>
									{#if doneTopicSlugs[topic.slug]}<span class="done">done</span>{/if}
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			</article>
		{/each}
	</aside>
{/if}

<style>
	.sidebar {
		display: grid;
		gap: 0.8rem;
		max-height: 75vh;
		overflow: auto;
		padding-right: 0.2rem;
	}

	/* ── Collapse header ─────────────────────────────── */
	.sidebar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.2rem;
		padding: 0 0.1rem;
	}

	.header-actions {
		display: flex;
		gap: 0.4rem;
		align-items: center;
	}

	.sidebar-title {
		font-size: 0.78rem;
		font-weight: 700;
		color: #707587;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.collapse-btn {
		background: none;
		border: 1px solid #d8dee7;
		border-radius: 8px;
		padding: 0.25rem 0.5rem;
		cursor: pointer;
		font-size: 0.75rem;
		color: #707587;
		line-height: 1;
		transition: background 0.15s;
	}

	.collapse-btn:hover {
		background: #f0f0f0;
		color: #20202a;
	}

	.mobile-close-btn {
		display: none;
		background: none;
		border: 1px solid #d8dee7;
		border-radius: 8px;
		padding: 0.25rem 0.5rem;
		cursor: pointer;
		font-size: 0.9rem;
		color: #707587;
		line-height: 1;
		transition: background 0.15s;
	}

	.mobile-close-btn:hover {
		background: #f0f0f0;
		color: #20202a;
	}

	/* ── Slim collapsed strip ────────────────────────── */
	.sidebar-slim {
		max-height: 75vh;
		overflow: hidden;
		padding-right: 0;
		display: flex;
		align-items: flex-start;
	}

	.slim-toggle {
		background: #fff;
		border: 1px solid #d8dee7;
		border-radius: 12px;
		padding: 0.6rem 0.35rem;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		width: 40px;
		transition: background 0.15s;
	}

	.slim-toggle:hover {
		background: #fff4dc;
		border-color: #f2b349;
	}

	.slim-arrow {
		font-size: 0.65rem;
		color: #4f5464;
	}

	.slim-label {
		font-size: 0.6rem;
		color: #707587;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		writing-mode: vertical-rl;
		text-orientation: mixed;
	}

	.category-card {
		background: #fff;
		border: 1px solid #d8dee7;
		border-radius: 14px;
		padding: 0.8rem;
	}

	.category-title {
		display: flex;
		justify-content: space-between;
		width: 100%;
		border: none;
		background: transparent;
		padding: 0;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
	}

	.category-title span.closed {
		transform: rotate(-90deg);
	}

	ul {
		margin: 0.45rem 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 0.3rem;
	}

	li button {
		width: 100%;
		padding: 0.45rem;
		border-radius: 8px;
		border: 1px solid transparent;
		background: #f7fafc;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 0.45rem;
		cursor: pointer;
		text-align: left;
		font-family: inherit;
	}

	li button.selected {
		background: #fff4dc;
		border-color: #f2b349;
	}

	.dot {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 999px;
	}

	.prio-must {
		background: #1e4e93;
	}

	.prio-high {
		background: #18744e;
	}

	.prio-med {
		background: #c07a1d;
	}

	.prio-low {
		background: #7c7d82;
	}

	.title {
		font-size: 0.82rem;
	}

	.done {
		font-size: 0.67rem;
		background: #1f7a57;
		color: white;
		padding: 0.1rem 0.4rem;
		border-radius: 999px;
	}

	/* ── Tablet: limit sidebar height when stacked (769px–1024px) ── */
	@media (min-width: 769px) and (max-width: 1024px) {
		.sidebar {
			max-height: 42vh;
		}
	}

	/* ── Phablets & phones (≤ 768px): fixed drawer ── */
	@media (max-width: 768px) {
		.sidebar-slim {
			display: none;
		}

		.sidebar {
			position: fixed;
			top: 0;
			left: 0;
			width: min(88vw, 380px);
			height: 100dvh;
			max-height: 100dvh;
			z-index: 900;
			background: #fff;
			border-radius: 0 16px 16px 0;
			box-shadow: 4px 0 24px rgba(0, 0, 0, 0.2);
			padding: 1rem;
			overflow-y: auto;
			transform: translateX(-110%);
			transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
		}

		.sidebar.mobile-open {
			transform: translateX(0);
		}

		.mobile-close-btn {
			display: block;
		}

		.collapse-btn {
			display: none;
		}
	}

	/* ── Extra small phones (≤ 360px): tighter sidebar padding ── */
	@media (max-width: 360px) {
		.sidebar {
			width: 92vw;
			padding: 0.75rem;
		}
	}
</style>
