<script lang="ts">
	let { totalTopics, doneCount, mustKnowTopics, progressPct } = $props<{
		totalTopics: number;
		doneCount: number;
		mustKnowTopics: number;
		progressPct: number;
	}>();
</script>

<header class="hero">
	<h1>Bench Interview Preparation Navigator</h1>
	<p>All roadmap topics are connected. Existing materials render now, missing topics are routed as placeholders.</p>
	<div class="stats">
		<div class="stat"><span>{totalTopics}</span><small>Total topics</small></div>
		<div class="stat"><span>{doneCount}</span><small>Covered</small></div>
		<div class="stat"><span>{mustKnowTopics}</span><small>Must-know</small></div>
		<div class="stat"><span>{progressPct}%</span><small>Progress</small></div>
	</div>
	<div class="progress"><div style={`width:${progressPct}%`}></div></div>
</header>

<style>
	.hero {
		background: linear-gradient(140deg, #1a2437, #202f46 68%, #18465a);
		color: #fff;
		border-radius: 16px;
		padding: 1rem 1.2rem;
	}

	.hero h1 {
		margin: 0;
		font-size: 1.3rem;
	}

	.hero p {
		margin: 0.4rem 0 0.8rem;
		font-size: 0.92rem;
		color: #d4deef;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.7rem;
	}

	.stat {
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 10px;
		padding: 0.55rem;
		background: rgba(255, 255, 255, 0.08);
	}

	.stat span {
		display: block;
		font-size: 1.2rem;
		font-weight: 700;
	}

	.stat small {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #d9e6f8;
	}

	.progress {
		margin-top: 0.8rem;
		height: 8px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 999px;
	}

	.progress div {
		height: 100%;
		border-radius: 999px;
		background: linear-gradient(90deg, #ef791b, #ffd561);
	}

	/* ── Tablet + smaller (≤ 1024px): 2-column stats ── */
	@media (max-width: 1024px) {
		.stats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	/* ── Phablets & phones (≤ 768px): compact hero ── */
	@media (max-width: 768px) {
		.hero {
			padding: 0.85rem 0.9rem;
			border-radius: 12px;
		}

		.hero h1 {
			font-size: 1.1rem;
		}

		.hero p {
			font-size: 0.85rem;
			margin-bottom: 0.6rem;
		}

		.stat span {
			font-size: 1.05rem;
		}
	}

	/* ── Small phones (≤ 480px) ── */
	@media (max-width: 480px) {
		.hero {
			padding: 0.75rem;
		}

		.hero h1 {
			font-size: 1rem;
		}

		.hero p {
			font-size: 0.8rem;
		}

		.stat span {
			font-size: 0.95rem;
		}

		.stat small {
			font-size: 0.68rem;
		}
	}

	/* ── Extra small phones (≤ 360px) ── */
	@media (max-width: 360px) {
		.hero {
			padding: 0.65rem;
			border-radius: 10px;
		}

		.hero h1 {
			font-size: 0.92rem;
		}

		.hero p {
			display: none;
		}

		.stats {
			gap: 0.45rem;
		}

		.stat {
			padding: 0.4rem;
		}

		.stat span {
			font-size: 0.9rem;
		}

		.stat small {
			font-size: 0.63rem;
		}

		.progress {
			margin-top: 0.5rem;
		}
	}
</style>
