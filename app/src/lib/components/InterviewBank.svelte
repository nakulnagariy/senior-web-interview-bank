<script lang="ts">
	import { onMount } from 'svelte';
	import {
		BANK_CATEGORIES,
		BANK_ENTRIES,
		categoryLabel,
		loadMarks,
		saveMarks,
		type BankEntry,
		type MarkMap
	} from '$lib/bank/bank';

	type View = 'browse' | 'revise';
	type StatusFilter = 'open' | 'all' | 'shaky';

	let view = $state<View>('browse');
	let category = $state<string>('all');
	let statusFilter = $state<StatusFilter>('open');
	let query = $state('');
	let marks = $state<MarkMap>({});
	let expanded = $state<Record<string, boolean>>({});
	let rootEl: HTMLElement | undefined = $state();

	// Revise mode
	let queue = $state<BankEntry[]>([]);
	let qIndex = $state(0);
	let revealed = $state(false);
	let dir = $state<'next' | 'prev'>('next');
	let reviseDone = $state(false);
	let reviseStats = $state({ known: 0, shaky: 0 });

	onMount(() => {
		marks = loadMarks();
	});

	function isOpenEntry(e: BankEntry): boolean {
		return e.status !== 'closed' || marks[e.id]?.state === 'shaky';
	}

	const counts = $derived({
		total: BANK_ENTRIES.length,
		open: BANK_ENTRIES.filter((e) => e.status !== 'closed').length,
		known: BANK_ENTRIES.filter((e) => marks[e.id]?.state === 'known').length,
		shaky: BANK_ENTRIES.filter((e) => marks[e.id]?.state === 'shaky').length
	});

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return BANK_ENTRIES.filter((e) => {
			if (category !== 'all' && e.category !== category) return false;
			if (statusFilter === 'open' && !isOpenEntry(e)) return false;
			if (statusFilter === 'shaky' && marks[e.id]?.state !== 'shaky') return false;
			if (q && !e.searchText.includes(q)) return false;
			return true;
		});
	});

	const grouped = $derived.by(() => {
		const map = new Map<string, BankEntry[]>();
		for (const e of filtered) {
			const list = map.get(e.category) ?? [];
			list.push(e);
			map.set(e.category, list);
		}
		return [...map.entries()];
	});

	const categoryCounts = $derived(
		Object.fromEntries(
			BANK_CATEGORIES.map((c) => [c, BANK_ENTRIES.filter((e) => e.category === c && isOpenEntry(e)).length])
		)
	);

	const current = $derived(queue[qIndex] ?? null);

	function toTop(): void {
		rootEl?.scrollIntoView({ block: 'start' });
	}

	function setMark(id: string, state: 'known' | 'shaky' | null): void {
		const next = { ...marks };
		if (state === null) delete next[id];
		else next[id] = { state, at: Date.now() };
		marks = next;
		saveMarks(next);
	}

	function toggle(id: string): void {
		expanded = { ...expanded, [id]: !expanded[id] };
	}

	function startRevise(): void {
		// Scope: current category filter. Shaky first, then never-reviewed open ones, then the rest.
		const pool = BANK_ENTRIES.filter((e) => category === 'all' || e.category === category);
		const rank = (e: BankEntry): number =>
			marks[e.id]?.state === 'shaky' ? 0 : !marks[e.id] && e.status !== 'closed' ? 1 : !marks[e.id] ? 2 : 3;
		const sorted = pool
			.filter((e) => (statusFilter === 'all' ? true : statusFilter === 'shaky' ? rank(e) === 0 : rank(e) < 3))
			.sort((a, b) => rank(a) - rank(b));
		queue = sorted;
		qIndex = 0;
		revealed = false;
		reviseDone = false;
		reviseStats = { known: 0, shaky: 0 };
		dir = 'next';
		view = 'revise';
		toTop();
	}

	function answer(state: 'known' | 'shaky'): void {
		if (!current) return;
		setMark(current.id, state);
		reviseStats = { ...reviseStats, [state]: reviseStats[state] + 1 };
		next();
	}

	function next(): void {
		revealed = false;
		dir = 'next';
		if (qIndex >= queue.length - 1) reviseDone = true;
		else qIndex += 1;
		toTop();
	}

	function prev(): void {
		if (qIndex === 0) return;
		revealed = false;
		dir = 'prev';
		qIndex -= 1;
		toTop();
	}

	function exitRevise(): void {
		view = 'browse';
		toTop();
	}

	function onKey(e: KeyboardEvent): void {
		if (view !== 'revise' || !current || reviseDone) return;
		const tag = (e.target as HTMLElement)?.tagName;
		if (tag === 'INPUT' || tag === 'TEXTAREA' || e.ctrlKey || e.metaKey || e.altKey) return;
		if (e.key === ' ' || e.key === 'Enter') {
			if (!revealed) {
				e.preventDefault();
				revealed = true;
			}
		} else if (revealed && e.key === '1') answer('shaky');
		else if (revealed && e.key === '2') answer('known');
	}

	function verdictClass(v: string): string {
		return v === 'Correct' ? 'good' : v === 'Partial' ? 'mid' : v === 'Wrong' ? 'low' : 'muted';
	}
</script>

<svelte:window onkeydown={onKey} />

<section class="bank" bind:this={rootEl}>
	{#if BANK_ENTRIES.length === 0}
		<div class="empty-state">
			<h2>Interview bank is empty</h2>
			<p>
				Run an <code>/interview</code> session with Claude Code. Every question is saved to
				<code>interview-bank/</code>, and appears here after the next build.
			</p>
		</div>
	{:else if view === 'browse'}
		<header class="head rise" style="--i: 0">
			<h2>Interview Bank</h2>
			<p>
				{counts.total} questions you were asked, with your gaps and the complete answers. Works offline.
			</p>
			<div class="stats">
				<span class="stat"><strong>{counts.open}</strong> open</span>
				<span class="stat warn"><strong>{counts.shaky}</strong> shaky</span>
				<span class="stat good"><strong>{counts.known}</strong> got it</span>
			</div>
		</header>

		<button class="revise-cta rise" style="--i: 1" onclick={startRevise}>
			<span class="cta-title">🧠 Revise {category === 'all' ? 'everything' : categoryLabel(category)}</span>
			<span class="cta-sub">Question first, reveal the answer, then mark it. Shaky ones come back first.</span>
		</button>

		<div class="filters rise" style="--i: 2">
			<input
				class="search"
				type="search"
				placeholder="Search questions, gaps, answers…"
				bind:value={query}
				aria-label="Search the interview bank"
			/>
			<div class="chips" role="group" aria-label="Category">
				<button class="chip" class:on={category === 'all'} onclick={() => (category = 'all')}>All</button>
				{#each BANK_CATEGORIES as c (c)}
					<button class="chip" class:on={category === c} onclick={() => (category = c)}>
						{categoryLabel(c)}
						{#if categoryCounts[c]}<span class="chip-n">{categoryCounts[c]}</span>{/if}
					</button>
				{/each}
			</div>
			<div class="seg" role="group" aria-label="Status filter">
				<button class:on={statusFilter === 'open'} onclick={() => (statusFilter = 'open')}>Needs work</button>
				<button class:on={statusFilter === 'shaky'} onclick={() => (statusFilter = 'shaky')}>Shaky</button>
				<button class:on={statusFilter === 'all'} onclick={() => (statusFilter = 'all')}>Everything</button>
			</div>
		</div>

		{#each grouped as [cat, entries] (cat)}
			<h3 class="cat-title">{categoryLabel(cat)} <small>{entries.length}</small></h3>
			<div class="list">
				{#each entries as e, n (e.id)}
					{@const open = expanded[e.id]}
					{@const mark = marks[e.id]?.state}
					<article class="entry rise" class:open style="--i: {Math.min(n, 6)}">
						<button class="entry-head" onclick={() => toggle(e.id)} aria-expanded={open}>
							<span class="q">{@html e.questionHtml}</span>
							<span class="badges">
								<span class="pill {verdictClass(e.verdict)}">{e.verdict}</span>
								{#if mark === 'known'}<span class="pill good">✓ got it</span>{/if}
								{#if mark === 'shaky'}<span class="pill mid">⚠ shaky</span>{/if}
								<span class="chev" class:open aria-hidden="true">▾</span>
							</span>
						</button>

						{#if open}
							<div class="entry-body">
								<p class="meta">{e.fileTitle}{e.asked ? ` · asked ${e.asked}` : ''}</p>

								{#if e.gapsHtml}
									<div class="block gaps">
										<h4>Gaps</h4>
										{@html e.gapsHtml}
									</div>
								{/if}
								{#if e.answerHtml}
									<div class="block answer">
										<h4>Complete answer</h4>
										{@html e.answerHtml}
									</div>
								{/if}
								{#if e.followUpsHtml}
									<div class="block">
										<h4>Likely follow-ups</h4>
										{@html e.followUpsHtml}
									</div>
								{/if}
								{#if e.myAnswerHtml || e.coveredHtml}
									<details class="more">
										<summary>What I answered, and what I covered</summary>
										{#if e.myAnswerHtml}<h4>My answer</h4>{@html e.myAnswerHtml}{/if}
										{#if e.coveredHtml}<h4>Covered well</h4>{@html e.coveredHtml}{/if}
									</details>
								{/if}
								{#if e.historyHtml}
									<details class="more">
										<summary>History</summary>
										{@html e.historyHtml}
									</details>
								{/if}

								<div class="mark-row">
									<button class="btn" class:sel={mark === 'shaky'} onclick={() => setMark(e.id, mark === 'shaky' ? null : 'shaky')}>⚠ Still shaky</button>
									<button class="btn" class:sel={mark === 'known'} onclick={() => setMark(e.id, mark === 'known' ? null : 'known')}>✓ Got it</button>
								</div>
							</div>
						{/if}
					</article>
				{/each}
			</div>
		{:else}
			<p class="empty">
				{statusFilter === 'open' ? 'Nothing needs work here. 🎉 Switch to "Everything" to see all answers.' : 'No questions match.'}
			</p>
		{/each}
	{:else}
		<!-- ───────────── Revise ───────────── -->
		<div class="rev-bar">
			<button class="link-btn" onclick={exitRevise}>← Bank</button>
			<span class="rev-count">{reviseDone ? 'Done' : `${qIndex + 1} / ${queue.length}`}</span>
		</div>
		<div class="progress" aria-hidden="true">
			<div class="progress-bar" style="width: {queue.length ? ((reviseDone ? queue.length : qIndex) / queue.length) * 100 : 0}%"></div>
		</div>

		{#if queue.length === 0}
			<p class="empty">Nothing to revise here yet.</p>
		{:else if reviseDone}
			<div class="done-card pop-in">
				<h2>Round complete 🎉</h2>
				<p><strong>{reviseStats.known}</strong> got it · <strong>{reviseStats.shaky}</strong> still shaky</p>
				<div class="mark-row">
					{#if reviseStats.shaky}<button class="btn primary" onclick={() => { statusFilter = 'shaky'; startRevise(); }}>Redo shaky ones</button>{/if}
					<button class="btn" onclick={exitRevise}>Back to bank</button>
				</div>
			</div>
		{:else if current}
			{#key current.id}
				<article class="rev-card slide {dir}">
					<div class="tag-row">
						<span class="topic-tag">{categoryLabel(current.category)}</span>
						<span class="sub-tag">{current.fileTitle}</span>
						{#if marks[current.id]?.state === 'shaky'}<span class="pill mid">⚠ shaky</span>{/if}
					</div>
					<h2 class="rev-q">{@html current.questionHtml}</h2>

					{#if !revealed}
						<p class="hint">Say your answer out loud first, then reveal.</p>
						<button class="btn primary big" onclick={() => (revealed = true)}>Reveal answer</button>
					{:else}
						<div class="reveal">
							{#if current.gapsHtml}
								<div class="block gaps">
									<h4>Where you had gaps</h4>
									{@html current.gapsHtml}
								</div>
							{/if}
							<div class="block answer">
								<h4>Complete answer</h4>
								{@html current.answerHtml}
							</div>
							{#if current.followUpsHtml}
								<div class="block">
									<h4>Likely follow-ups</h4>
									{@html current.followUpsHtml}
								</div>
							{/if}
						</div>
					{/if}
				</article>
			{/key}

			<div class="rev-nav">
				<button class="btn" onclick={prev} disabled={qIndex === 0} aria-label="Previous question">←</button>
				{#if revealed}
					<button class="btn warn" onclick={() => answer('shaky')}>⚠ Still shaky</button>
					<button class="btn ok" onclick={() => answer('known')}>✓ Got it</button>
				{:else}
					<button class="btn grow" onclick={next}>Skip</button>
				{/if}
			</div>
		{/if}
	{/if}
</section>

<style>
	.bank {
		display: grid;
		gap: 0.9rem;
		min-width: 0;
		scroll-margin-top: 0.5rem;
	}

	h2 {
		margin: 0;
		font-size: 1.35rem;
		color: #1a2437;
	}

	.head p {
		margin: 0.3rem 0 0.6rem;
		color: #657389;
		font-size: 0.92rem;
	}

	.stats {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.stat {
		background: #eef1f5;
		color: #44506a;
		border-radius: 999px;
		padding: 0.25rem 0.75rem;
		font-size: 0.82rem;
	}

	.stat.warn {
		background: #fdecd9;
		color: #9a4a06;
	}

	.stat.good {
		background: #dcf3e3;
		color: #1d6b36;
	}

	.rise {
		animation: rise 0.4s cubic-bezier(0.2, 0.7, 0.2, 1) both;
		animation-delay: calc(var(--i, 0) * 50ms);
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.slide.next {
		animation: slide-next 0.3s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}

	.slide.prev {
		animation: slide-prev 0.3s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}

	@keyframes slide-next {
		from {
			opacity: 0;
			transform: translateX(26px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes slide-prev {
		from {
			opacity: 0;
			transform: translateX(-26px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.pop-in {
		animation: pop-in 0.3s ease-out both;
	}

	@keyframes pop-in {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.revise-cta {
		font-family: inherit;
		text-align: left;
		display: grid;
		gap: 0.2rem;
		border: none;
		border-radius: 14px;
		padding: 0.9rem 1.1rem;
		background: linear-gradient(135deg, #1a2437, #2b3a5c);
		color: #fff;
		cursor: pointer;
		min-height: 48px;
		transition: transform 0.15s, box-shadow 0.15s;
	}

	.revise-cta:hover {
		box-shadow: 0 8px 22px rgba(26, 36, 55, 0.28);
	}

	.revise-cta:active {
		transform: scale(0.985);
	}

	.cta-title {
		font-weight: 700;
	}

	.cta-sub {
		font-size: 0.82rem;
		opacity: 0.8;
	}

	.filters {
		display: grid;
		gap: 0.6rem;
	}

	.search {
		font-family: inherit;
		font-size: 1rem;
		width: 100%;
		box-sizing: border-box;
		min-height: 46px;
		border: 1.5px solid #d8dee7;
		border-radius: 12px;
		padding: 0 0.9rem;
		background: #fff;
		color: #20202a;
	}

	.search:focus {
		outline: none;
		border-color: #ef791b;
	}

	.chips {
		display: flex;
		gap: 0.4rem;
		overflow-x: auto;
		padding-bottom: 0.2rem;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: thin;
	}

	.chip {
		flex: none;
		font-family: inherit;
		background: #fff;
		border: 1px solid #d8dee7;
		color: #44506a;
		border-radius: 999px;
		padding: 0.4rem 0.8rem;
		font-size: 0.85rem;
		font-weight: 600;
		min-height: 38px;
		cursor: pointer;
		transition: background 0.2s, color 0.2s, transform 0.12s;
	}

	.chip:active {
		transform: scale(0.95);
	}

	.chip.on {
		background: #1a2437;
		border-color: #1a2437;
		color: #fff;
	}

	.chip-n {
		display: inline-block;
		margin-left: 0.25rem;
		background: #ef791b;
		color: #fff;
		border-radius: 999px;
		font-size: 0.72rem;
		padding: 0 0.4rem;
	}

	.seg {
		display: flex;
		gap: 0.25rem;
		padding: 0.25rem;
		background: #eef1f5;
		border-radius: 12px;
	}

	.seg button {
		font-family: inherit;
		flex: 1;
		border: none;
		background: transparent;
		border-radius: 9px;
		padding: 0.5rem 0.3rem;
		font-weight: 600;
		font-size: 0.88rem;
		color: #657389;
		cursor: pointer;
		min-height: 42px;
		transition: background 0.2s, color 0.2s;
	}

	.seg button.on {
		background: #1a2437;
		color: #fff;
	}

	.cat-title {
		margin: 0.4rem 0 -0.2rem;
		font-size: 1rem;
		color: #1a2437;
	}

	.cat-title small {
		background: #eef1f5;
		color: #657389;
		border-radius: 999px;
		padding: 0.05rem 0.5rem;
		font-size: 0.75rem;
		margin-left: 0.3rem;
	}

	.list {
		display: grid;
		gap: 0.6rem;
	}

	.entry {
		background: #fff;
		border: 1px solid #d8dee7;
		border-radius: 14px;
		overflow: hidden;
		min-width: 0;
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	.entry.open {
		border-color: #ef791b;
		box-shadow: 0 6px 18px rgba(26, 36, 55, 0.08);
	}

	.entry-head {
		font-family: inherit;
		width: 100%;
		display: grid;
		gap: 0.5rem;
		text-align: left;
		background: none;
		border: none;
		padding: 0.85rem 0.95rem;
		cursor: pointer;
		color: #20202a;
		min-height: 48px;
	}

	.q {
		font-weight: 600;
		line-height: 1.4;
		overflow-wrap: anywhere;
	}

	.badges {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
	}

	.pill {
		border-radius: 999px;
		padding: 0.12rem 0.55rem;
		font-size: 0.72rem;
		font-weight: 700;
		background: #eef1f5;
		color: #44506a;
	}

	.pill.good {
		background: #dcf3e3;
		color: #1d6b36;
	}

	.pill.mid {
		background: #fdecd9;
		color: #9a4a06;
	}

	.pill.low {
		background: #fde0e0;
		color: #a12a2a;
	}

	.chev {
		margin-left: auto;
		color: #657389;
		transition: transform 0.2s;
	}

	.chev.open {
		transform: rotate(180deg);
	}

	.entry-body {
		display: grid;
		gap: 0.7rem;
		padding: 0 0.95rem 0.95rem;
		animation: pop-in 0.22s ease-out both;
	}

	.meta {
		margin: 0;
		font-size: 0.78rem;
		color: #657389;
	}

	.block {
		border-radius: 10px;
		padding: 0.65rem 0.8rem;
		background: #f7f9fc;
		font-size: 0.93rem;
		line-height: 1.55;
		overflow-wrap: anywhere;
		min-width: 0;
	}

	.block.gaps {
		background: #fff4e5;
		border-left: 4px solid #ef791b;
	}

	.block.answer {
		background: #eef8f1;
		border-left: 4px solid #2e9a52;
	}

	h4 {
		margin: 0 0 0.35rem;
		font-size: 0.78rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: #44506a;
	}

	.bank :global(p) {
		margin: 0 0 0.55rem;
	}

	.bank :global(p:last-child) {
		margin-bottom: 0;
	}

	.bank :global(ul),
	.bank :global(ol) {
		margin: 0.2rem 0 0.4rem;
		padding-left: 1.2rem;
	}

	.bank :global(li) {
		margin-bottom: 0.25rem;
	}

	.bank :global(pre) {
		background: #1a2437;
		color: #e8edf5;
		border-radius: 10px;
		padding: 0.75rem 0.85rem;
		overflow-x: auto;
		font-size: 0.8rem;
		line-height: 1.5;
		margin: 0.45rem 0;
		-webkit-overflow-scrolling: touch;
	}

	.bank :global(code) {
		font-family: 'IBM Plex Mono', ui-monospace, Consolas, monospace;
		font-size: 0.88em;
	}

	.bank :global(:not(pre) > code) {
		background: #eef1f5;
		color: #a23a00;
		border-radius: 5px;
		padding: 0.08rem 0.35rem;
		overflow-wrap: anywhere;
	}

	.more {
		border: 1px dashed #c9d1dd;
		border-radius: 10px;
		padding: 0.5rem 0.8rem;
		font-size: 0.9rem;
	}

	.more summary {
		cursor: pointer;
		font-weight: 600;
		color: #44506a;
		min-height: 32px;
		display: flex;
		align-items: center;
	}

	.mark-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}

	.btn {
		font-family: inherit;
		min-height: 48px;
		border-radius: 12px;
		border: 1.5px solid #c9d1dd;
		background: #fff;
		color: #1a2437;
		font-weight: 700;
		font-size: 0.93rem;
		cursor: pointer;
		padding: 0 0.9rem;
		touch-action: manipulation;
		transition: transform 0.12s, background 0.2s, border-color 0.2s;
	}

	.btn:not(:disabled):active {
		transform: scale(0.96);
	}

	.btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.btn.sel {
		background: #1a2437;
		border-color: #1a2437;
		color: #fff;
	}

	.btn.primary {
		background: #1a2437;
		border-color: #1a2437;
		color: #fff;
	}

	.btn.warn {
		background: #fff4e5;
		border-color: #f0c48f;
		color: #9a4a06;
	}

	.btn.ok {
		background: #e3f6e9;
		border-color: #86c99a;
		color: #1d6b36;
	}

	.btn.big {
		min-height: 54px;
		font-size: 1rem;
	}

	.btn.grow {
		grid-column: span 2;
	}

	.empty,
	.empty-state {
		text-align: center;
		color: #657389;
		padding: 1rem;
	}

	.link-btn {
		font-family: inherit;
		background: none;
		border: none;
		color: #2379b9;
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		padding: 0.5rem 0.25rem;
		min-height: 40px;
	}

	/* Revise */
	.rev-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 600;
		color: #657389;
	}

	.progress {
		height: 6px;
		background: #e3e8ef;
		border-radius: 999px;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, #ef791b, #f4a24d);
		border-radius: 999px;
		transition: width 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
	}

	.rev-card,
	.done-card {
		background: #fff;
		border: 1px solid #d8dee7;
		border-radius: 18px;
		padding: 1rem;
		display: grid;
		gap: 0.85rem;
		min-width: 0;
	}

	.done-card {
		text-align: center;
		justify-items: center;
	}

	.done-card .mark-row {
		width: 100%;
	}

	.tag-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
	}

	.topic-tag {
		background: #1a2437;
		color: #fff;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 600;
		padding: 0.18rem 0.65rem;
	}

	.sub-tag {
		background: #eef1f5;
		color: #44506a;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 600;
		padding: 0.18rem 0.6rem;
	}

	.rev-q {
		font-size: 1.15rem;
		line-height: 1.4;
		overflow-wrap: anywhere;
	}

	.hint {
		margin: 0;
		color: #657389;
		font-size: 0.9rem;
	}

	.reveal {
		display: grid;
		gap: 0.7rem;
		animation: pop-in 0.25s ease-out both;
	}

	.rev-nav {
		display: grid;
		grid-template-columns: 54px 1fr 1fr;
		gap: 0.5rem;
		position: sticky;
		bottom: 0;
		padding: 0.6rem 0 calc(0.6rem + env(safe-area-inset-bottom));
		background: linear-gradient(to top, rgba(247, 245, 240, 0.98) 70%, rgba(247, 245, 240, 0));
		z-index: 50;
	}

	@media (prefers-reduced-motion: reduce) {
		.bank :global(*),
		.bank :global(*::before),
		.bank :global(*::after) {
			animation-duration: 0.01ms !important;
			animation-delay: 0ms !important;
			transition-duration: 0.01ms !important;
		}
	}
</style>
