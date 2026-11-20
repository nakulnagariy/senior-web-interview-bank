<script lang="ts">
	import { STUDY_GUIDES, STUDY_GUIDE_SUBJECTS } from '$lib/data/studyGuides';

	let query = $state('');
	let subject = $state('all');

	const filteredGuides = $derived.by(() => {
		const search = query.trim().toLowerCase();
		return STUDY_GUIDES.filter((guide) => {
			const matchesSubject = subject === 'all' || guide.subject === subject;
			const matchesSearch =
				!search || `${guide.title} ${guide.subject}`.toLowerCase().includes(search);
			return matchesSubject && matchesSearch;
		});
	});

	const groupedGuides = $derived.by(() => {
		const groups = new Map<string, typeof filteredGuides>();
		for (const guide of filteredGuides) {
			const group = groups.get(guide.subject) ?? [];
			group.push(guide);
			groups.set(guide.subject, group);
		}
		return [...groups.entries()];
	});
</script>

<section class="guide-library" aria-labelledby="guides-title">
	<header class="guide-heading">
		<p class="eyebrow">EPAM L3 to L4</p>
		<h2 id="guides-title">Study guides</h2>
		<p>Browse the printable interview guides by subject. Read a guide online or open its PDF.</p>
	</header>

	<div class="guide-controls">
		<label class="search-control">
			<span>Search guides</span>
			<input type="search" bind:value={query} placeholder="Try React, CSS, performance..." />
		</label>
		<label class="subject-control">
			<span>Subject</span>
			<select bind:value={subject}>
				<option value="all">All subjects</option>
				{#each STUDY_GUIDE_SUBJECTS as item (item)}
					<option value={item}>{item}</option>
				{/each}
			</select>
		</label>
		<p class="result-count" aria-live="polite">{filteredGuides.length} of {STUDY_GUIDES.length} guides</p>
	</div>

	{#if groupedGuides.length}
		<div class="guide-groups">
			{#each groupedGuides as [group, guides] (group)}
				<section class="subject-group" aria-label={group}>
					<h3>{group}<span>{guides.length}</span></h3>
					<ul>
						{#each guides as guide (guide.slug)}
							<li class="guide-row">
								<h4>{guide.title}</h4>
								<div class="guide-actions">
									<a href={`/study-guides/${guide.slug}.html`} target="_blank" rel="noreferrer">
										Read online <span aria-hidden="true">↗</span>
									</a>
									<a href={`/study-guides/${guide.slug}.pdf`} target="_blank" rel="noreferrer">
										Open PDF <span aria-hidden="true">↗</span>
									</a>
								</div>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>
	{:else}
		<p class="empty-state">No guides match that search. Try another subject or title.</p>
	{/if}
</section>

<style>
	.guide-library {
		width: min(100%, 1080px);
		margin: 0 auto;
		color: #20202a;
	}

	.guide-heading {
		padding: 0.5rem 0 1.2rem;
		border-bottom: 1px solid #d8dee7;
	}

	.eyebrow {
		margin: 0 0 0.35rem;
		color: #a34a10;
		font-size: 0.76rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	h2 {
		margin: 0;
		font-size: 1.65rem;
	}

	.guide-heading > p:last-child {
		margin: 0.35rem 0 0;
		color: #586476;
	}

	.guide-controls {
		display: grid;
		grid-template-columns: minmax(12rem, 1fr) minmax(12rem, 0.55fr) auto;
		align-items: end;
		gap: 0.8rem;
		padding: 1rem 0;
		border-bottom: 1px solid #d8dee7;
	}

	.guide-controls label {
		display: grid;
		gap: 0.3rem;
		color: #465166;
		font-size: 0.8rem;
		font-weight: 600;
	}

	input,
	select {
		min-width: 0;
		min-height: 2.65rem;
		padding: 0.55rem 0.7rem;
		border: 1px solid #bbc5d2;
		border-radius: 5px;
		background: #fff;
		color: #20202a;
		font: inherit;
	}

	input:focus-visible,
	select:focus-visible,
	a:focus-visible {
		outline: 3px solid #ef791b;
		outline-offset: 2px;
	}

	.result-count {
		margin: 0 0 0.65rem;
		color: #586476;
		font-size: 0.84rem;
		white-space: nowrap;
	}

	.guide-groups {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		column-gap: 2rem;
	}

	.subject-group h3 {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
		margin: 1.1rem 0 0;
		padding: 0.45rem 0;
		border-bottom: 2px solid #1a2437;
		font-size: 1rem;
	}

	.subject-group h3 span {
		color: #68758a;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.subject-group ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.guide-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 0;
		border-bottom: 1px solid #e1e5eb;
	}

	.guide-row h4 {
		margin: 0;
		font-size: 0.94rem;
		font-weight: 600;
		line-height: 1.35;
	}

	.guide-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 0.4rem;
	}

	.guide-actions a {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		min-height: 2rem;
		padding: 0.35rem 0.55rem;
		border: 1px solid #bac5d2;
		border-radius: 5px;
		color: #1a4d66;
		font-size: 0.78rem;
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
	}

	.guide-actions a:hover {
		border-color: #1a4d66;
		background: #edf5f7;
	}

	.empty-state {
		padding: 1.5rem 0;
		color: #586476;
	}

	@media (max-width: 760px) {
		.guide-controls {
			grid-template-columns: minmax(0, 1fr) minmax(9rem, 0.7fr);
		}

		.result-count {
			grid-column: 1 / -1;
			margin: 0;
		}

		.guide-groups {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	@media (max-width: 480px) {
		.guide-controls {
			grid-template-columns: minmax(0, 1fr);
		}

		.guide-row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.55rem;
		}

		.guide-actions {
			justify-content: flex-start;
		}
	}
</style>