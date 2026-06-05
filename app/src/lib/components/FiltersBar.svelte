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
	}

	button.active {
		background: #1a2437;
		color: #fff;
		border-color: #1a2437;
	}
</style>
