<script lang="ts">
	let { totalTopics, authoredTopicCount, mustKnowTopics, guideCount, doneCount, progressPct } = $props<{
		totalTopics: number;
		authoredTopicCount: number;
		mustKnowTopics: number;
		guideCount: number;
		doneCount: number;
		progressPct: number;
	}>();
</script>

<header class="hero">
	<div class="hero-main">
		<div class="hero-copy">
			<p class="eyebrow">Senior to lead · Frontend</p>
			<h1>Frontend Interview Prep</h1>
			<p class="description">
				Search reviewed topic notes and subject guides, practice MCQs, use the interview question bank,
				and keep a device-local interview log.
			</p>
			<p class="content-note">Reviewed material is surfaced first; generated starter drafts stay clearly labeled.</p>
		</div>

		<div class="progress-panel">
			<div class="progress-heading">
				<div>
					<span class="progress-title">Your roadmap progress</span>
					<strong class="progress-value">{progressPct}%</strong>
				</div>
				<span class="progress-count">{doneCount} of {totalTopics} covered</span>
			</div>
			<div
				class="progress"
				role="progressbar"
				aria-label="Your roadmap progress"
				aria-valuemin="0"
				aria-valuemax="100"
				aria-valuenow={progressPct}
			>
				<div style={`width:${progressPct}%`}></div>
			</div>
		</div>
	</div>

	<div class="stats" aria-label="Preparation library">
		<div class="stat"><span>{totalTopics}</span><small>Roadmap topics</small></div>
		<div class="stat"><span>{authoredTopicCount}</span><small>With reviewed content</small></div>
		<div class="stat"><span>{mustKnowTopics}</span><small>Must-know topics</small></div>
		<div class="stat"><span>{guideCount}</span><small>Subject guides</small></div>
	</div>
</header>

<style>
	.hero {
		background: #183541;
		color: #f7f6f0;
		border-radius: 12px;
		padding: 1.5rem 1.65rem 1.15rem;
		min-width: 0;
		width: 100%;
		box-sizing: border-box;
	}

	.hero-main {
		display: grid;
		grid-template-columns: minmax(0, 1.4fr) minmax(235px, 0.6fr);
		align-items: center;
		gap: 2rem;
	}

	.hero-copy {
		min-width: 0;
	}

	.eyebrow {
		margin: 0 0 0.35rem;
		color: #8de0c9;
		font-size: 0.76rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.hero h1 {
		margin: 0;
		font-size: 2rem;
		line-height: 1.16;
	}

	.description {
		max-width: 68ch;
		margin: 0.55rem 0 0;
		color: #d9e3e3;
		font-size: 0.92rem;
		line-height: 1.5;
	}

	.content-note {
		margin: 0.7rem 0 0;
		padding-left: 0.6rem;
		border-left: 2px solid #f3a66d;
		color: #f4d2b5;
		font-size: 0.78rem;
		line-height: 1.4;
	}

	.progress-panel {
		min-width: 0;
		padding-left: 1.4rem;
		border-left: 1px solid rgba(255, 255, 255, 0.2);
	}

	.progress-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 0.7rem;
	}

	.progress-heading > div {
		display: grid;
		gap: 0.1rem;
	}

	.progress-title,
	.progress-count {
		color: #d9e3e3;
		font-size: 0.76rem;
	}

	.progress-value {
		font-size: 2.15rem;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		margin-top: 1.35rem;
		padding-top: 1rem;
		border-top: 1px solid rgba(255, 255, 255, 0.2);
	}

	.stat {
		display: grid;
		align-content: start;
		gap: 0.1rem;
		min-width: 0;
		padding: 0 1rem;
		border-left: 1px solid rgba(255, 255, 255, 0.18);
	}

	.stat:first-child {
		padding-left: 0;
		border-left: 0;
	}

	.stat span {
		font-size: 1.45rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.stat small {
		color: #d9e3e3;
		font-size: 0.76rem;
		line-height: 1.3;
	}

	.progress {
		margin-top: 0.75rem;
		height: 7px;
		background: rgba(255, 255, 255, 0.18);
		border-radius: 999px;
		overflow: hidden;
	}

	.progress div {
		height: 100%;
		border-radius: inherit;
		background: #f3a66d;
		transition: width 0.35s ease;
	}

	@media (max-width: 860px) {
		.hero-main {
			grid-template-columns: minmax(0, 1fr);
			gap: 1.25rem;
		}

		.progress-panel {
			padding: 1rem 0 0;
			border-top: 1px solid rgba(255, 255, 255, 0.2);
			border-left: 0;
		}
	}

	@media (max-width: 620px) {
		.hero {
			padding: 1.1rem 1rem 0.9rem;
		}

		.hero h1 {
			font-size: 1.65rem;
		}

		.stats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			row-gap: 0.8rem;
		}

		.stat:nth-child(odd) {
			padding-left: 0;
			border-left: 0;
		}

		.stat:nth-child(even) {
			padding-right: 0;
		}
	}

	@media (max-width: 360px) {
		.hero {
			padding: 0.9rem 0.8rem 0.75rem;
		}

		.hero h1 {
			font-size: 1.45rem;
		}

		.description {
			font-size: 0.86rem;
		}

		.progress-heading {
			align-items: start;
			flex-direction: column;
			gap: 0.25rem;
		}

		.stats {
			margin-top: 1rem;
			padding-top: 0.8rem;
		}

		.stat span {
			font-size: 0.9rem;
		}

		.stat small {
			font-size: 0.7rem;
		}
	}
</style>
