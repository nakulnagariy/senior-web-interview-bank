<script lang="ts">
	const options = [
		{ label: 'All categories', value: 'all' },
		{ label: 'JavaScript', value: 'js' },
		{ label: 'React', value: 'react' },
		{ label: 'TypeScript', value: 'ts' },
		{ label: 'CSS / HTML', value: 'css' },
		{ label: 'Performance', value: 'perf' },
		{ label: 'Testing', value: 'test' },
		{ label: 'React vs Angular', value: 'angular' },
		{ label: 'System Design', value: 'design' }
	] as const;

	type FilterValue = (typeof options)[number]['value'];

	let { activeFilter, onChange } = $props<{
		activeFilter: FilterValue;
		onChange: (filter: FilterValue) => void;
	}>();
</script>

<section class="filters">
	{#each options as filter}
		<button class:active={activeFilter === filter.value} onclick={() => onChange(filter.value)}>
			{filter.label}
		</button>
	{/each}
</section>

<style>
	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	button {
		font-family: inherit;
		border: 1px solid #cfd6de;
		background: #fff;
		border-radius: 999px;
		padding: 0.35rem 0.8rem;
		cursor: pointer;
		white-space: nowrap;
	}

	button.active {
		background: #1a2437;
		color: #fff;
		border-color: #1a2437;
	}

	/* ── Phablets & phones (≤ 768px): horizontal scroll ── */
	@media (max-width: 768px) {
		.filters {
			flex-wrap: nowrap;
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
			scrollbar-width: none;
			padding-bottom: 0.15rem;
		}

		.filters::-webkit-scrollbar {
			display: none;
		}

		button {
			padding: 0.4rem 0.75rem;
			font-size: 0.85rem;
			min-height: 38px;
		}
	}

	/* ── Small phones (≤ 480px) ── */
	@media (max-width: 480px) {
		button {
			padding: 0.38rem 0.65rem;
			font-size: 0.82rem;
		}
	}

	/* ── Extra small phones (≤ 360px) ── */
	@media (max-width: 360px) {
		button {
			padding: 0.35rem 0.55rem;
			font-size: 0.78rem;
			min-height: 34px;
		}
	}
</style>
