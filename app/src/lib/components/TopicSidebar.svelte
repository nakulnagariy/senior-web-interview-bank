<script lang="ts">
	import type { Topic, TopicCategory } from '$lib/data/topics';

	let {
		categories,
		selectedTopic,
		doneTopicSlugs,
		collapsedByCategory,
		onToggleCategory,
		onSelectTopic
	} = $props<{
		categories: TopicCategory[];
		selectedTopic: Topic;
		doneTopicSlugs: Record<string, boolean>;
		collapsedByCategory: Record<string, boolean>;
		onToggleCategory: (categoryId: string) => void;
		onSelectTopic: (slug: string) => void;
	}>();

	const priorityClass: Record<Topic['priority'], string> = {
		must: 'prio-must',
		high: 'prio-high',
		med: 'prio-med',
		low: 'prio-low'
	};
</script>

<aside class="sidebar">
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

<style>
	.sidebar {
		display: grid;
		gap: 0.8rem;
		max-height: 75vh;
		overflow: auto;
		padding-right: 0.2rem;
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

	@media (max-width: 980px) {
		.sidebar {
			max-height: none;
		}
	}
</style>
