<script lang="ts">
	let { rows } = $props<{ rows: string[][] }>();

	// Skip header row; rejoin answers that were split by the naive CSV comma-parser
	const cards = $derived(
		rows
			.slice(1)
			.filter((r: string[]) => r[0]?.trim())
			.map((r: string[]) => ({ q: r[0].trim(), a: r.slice(1).join(', ').trim() }))
	);

	let index = $state(0);
	let flipped = $state(false);
	let direction = $state<'left' | 'right' | null>(null);

	// Reset when the card deck changes (different topic asset loaded)
	$effect(() => {
		void cards;
		index = 0;
		flipped = false;
		direction = null;
	});

	const current = $derived(cards[index] ?? { q: '', a: '' });
	const showDots = $derived(cards.length <= 14);

	function flip(): void {
		flipped = !flipped;
	}

	function goNext(): void {
		if (index >= cards.length - 1) return;
		flipped = false;
		direction = 'right';
		index++;
		setTimeout(() => (direction = null), 380);
	}

	function goPrev(): void {
		if (index <= 0) return;
		flipped = false;
		direction = 'left';
		index--;
		setTimeout(() => (direction = null), 380);
	}

	function jumpTo(i: number): void {
		if (i === index) return;
		direction = i > index ? 'right' : 'left';
		flipped = false;
		index = i;
		setTimeout(() => (direction = null), 380);
	}

	// Touch tracking
	let touchStartX = 0;
	let touchStartY = 0;

	function onTouchStart(e: TouchEvent): void {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
	}

	function onTouchEnd(e: TouchEvent): void {
		const dx = e.changedTouches[0].clientX - touchStartX;
		const dy = e.changedTouches[0].clientY - touchStartY;
		if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48) {
			// Horizontal swipe — navigate
			if (dx < 0) goNext();
			else goPrev();
		} else if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
			// Tap — flip
			flip();
		}
	}

	function onCardKeyDown(e: KeyboardEvent): void {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			flip();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			goNext();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			goPrev();
		}
	}
</script>

{#if cards.length === 0}
	<p class="empty">No flashcards found in this file.</p>
{:else}
	<div class="deck">
		<!-- Counter + hint -->
		<div class="deck-meta">
			<span class="counter">{index + 1} <span class="sep">/</span> {cards.length}</span>
			<span class="hint">{flipped ? 'Answer' : 'Question'} · tap card to flip</span>
		</div>

		<!-- 3D flip card — {#key} re-mounts on index change to trigger entry animation -->
		{#key index}
			<div
				class="scene"
				class:enter-right={direction === 'right'}
				class:enter-left={direction === 'left'}
				ontouchstart={onTouchStart}
				ontouchend={onTouchEnd}
				onclick={flip}
				onkeydown={onCardKeyDown}
				role="button"
				tabindex="0"
				aria-label={flipped ? `Answer: ${current.a}` : `Question: ${current.q}. Press Enter to reveal answer.`}
			>
				<div class="card" class:is-flipped={flipped}>
					<!-- Front: Question -->
					<div class="face front">
						<span class="face-badge">Q</span>
						<p>{current.q}</p>
					</div>
					<!-- Back: Answer -->
					<div class="face back">
						<span class="face-badge answer">A</span>
						<p>{current.a}</p>
					</div>
				</div>
			</div>
		{/key}

		<!-- Navigation -->
		<div class="nav">
			<button class="nav-btn" disabled={index === 0} onclick={goPrev} aria-label="Previous card">
				← Prev
			</button>

			{#if showDots}
				<div class="dots" role="tablist">
					{#each cards as _, i}
						<button
							class="dot"
							class:active={i === index}
							onclick={() => jumpTo(i)}
							role="tab"
							aria-selected={i === index}
							aria-label="Card {i + 1}"
						></button>
					{/each}
				</div>
			{:else}
				<button class="shuffle-hint" onclick={() => jumpTo(0)}>↺ restart</button>
			{/if}

			<button
				class="nav-btn"
				disabled={index === cards.length - 1}
				onclick={goNext}
				aria-label="Next card"
			>
				Next →
			</button>
		</div>

		<!-- Keyboard hint (desktop only) -->
		<p class="kb-hint">← → to navigate &nbsp;·&nbsp; Space to flip</p>
	</div>
{/if}

<style>
	/* ── Layout ──────────────────────────────────────── */
	.deck {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.1rem;
		padding: 0.5rem 0;
		user-select: none;
	}

	/* ── Counter + hint row ──────────────────────────── */
	.deck-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		max-width: 580px;
	}

	.counter {
		font-size: 0.82rem;
		font-weight: 700;
		color: #4f5464;
	}

	.sep {
		color: #9fa6b4;
		font-weight: 400;
	}

	.hint {
		font-size: 0.75rem;
		color: #9fa6b4;
		font-style: italic;
	}

	/* ── Card scene (3-D context) ────────────────────── */
	.scene {
		width: 100%;
		max-width: 580px;
		min-height: 230px;
		perspective: 1100px;
		cursor: pointer;
		outline: none;
		border-radius: 18px;
	}

	.scene:focus-visible {
		box-shadow: 0 0 0 3px rgba(239, 121, 27, 0.55);
	}

	/* Entry animations */
	.scene.enter-right {
		animation: enterFromRight 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
	}

	.scene.enter-left {
		animation: enterFromLeft 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
	}

	@keyframes enterFromRight {
		from {
			opacity: 0;
			transform: translateX(56px) rotateY(-10deg);
		}
		to {
			opacity: 1;
			transform: translateX(0) rotateY(0deg);
		}
	}

	@keyframes enterFromLeft {
		from {
			opacity: 0;
			transform: translateX(-56px) rotateY(10deg);
		}
		to {
			opacity: 1;
			transform: translateX(0) rotateY(0deg);
		}
	}

	/* ── Card (flip container) ───────────────────────── */
	.card {
		width: 100%;
		min-height: 230px;
		position: relative;
		transform-style: preserve-3d;
		transition: transform 0.48s cubic-bezier(0.4, 0.2, 0.2, 1);
		border-radius: 18px;
	}

	.card.is-flipped {
		transform: rotateY(180deg);
	}

	/* ── Card faces ──────────────────────────────────── */
	.face {
		position: absolute;
		inset: 0;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		border-radius: 18px;
		padding: 2rem 2rem 1.6rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.9rem;
		text-align: center;
		box-shadow:
			0 4px 20px rgba(0, 0, 0, 0.18),
			0 1px 4px rgba(0, 0, 0, 0.1);
	}

	.front {
		background: linear-gradient(140deg, #1a2437 0%, #202f46 70%, #18465a 100%);
		color: #e8f0fc;
	}

	.back {
		background: linear-gradient(140deg, #0f3320 0%, #1a5232 70%, #1e6b3e 100%);
		color: #d8f5e8;
		transform: rotateY(180deg);
	}

	.face-badge {
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.15);
		color: rgba(255, 255, 255, 0.75);
		align-self: flex-start;
	}

	.face-badge.answer {
		background: rgba(255, 255, 255, 0.18);
	}

	.face p {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.55;
		font-weight: 500;
		word-break: break-word;
	}

	/* Desktop hover lift */
	@media (hover: hover) {
		.scene:hover .card:not(.is-flipped) {
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.22);
			transform: translateY(-2px);
		}

		.scene:hover .card.is-flipped {
			transform: rotateY(180deg) translateY(-2px);
		}
	}

	/* ── Navigation ──────────────────────────────────── */
	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		max-width: 580px;
		gap: 0.6rem;
	}

	.nav-btn {
		font-family: inherit;
		font-size: 0.85rem;
		font-weight: 600;
		border: 1px solid #d8dee7;
		background: #fff;
		border-radius: 10px;
		padding: 0.45rem 0.9rem;
		cursor: pointer;
		color: #20202a;
		transition:
			background 0.15s,
			border-color 0.15s;
		min-height: 38px;
		white-space: nowrap;
	}

	.nav-btn:hover:not(:disabled) {
		background: #f0f4ff;
		border-color: #a0aec0;
	}

	.nav-btn:disabled {
		opacity: 0.38;
		cursor: not-allowed;
	}

	/* ── Dots ────────────────────────────────────────── */
	.dots {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		justify-content: center;
		flex: 1;
	}

	.dot {
		width: 9px;
		height: 9px;
		border-radius: 999px;
		border: none;
		background: #d0d7e2;
		cursor: pointer;
		padding: 0;
		transition:
			background 0.2s,
			transform 0.2s;
	}

	.dot.active {
		background: #1a2437;
		transform: scale(1.3);
	}

	.shuffle-hint {
		font-family: inherit;
		font-size: 0.8rem;
		border: none;
		background: none;
		cursor: pointer;
		color: #707587;
		flex: 1;
		text-align: center;
	}

	/* ── Keyboard hint ───────────────────────────────── */
	.kb-hint {
		margin: 0;
		font-size: 0.72rem;
		color: #b0b8c8;
	}

	.empty {
		color: #707587;
		font-style: italic;
	}

	/* ── Responsive ──────────────────────────────────── */

	/* Phablets & phones (≤ 768px) */
	@media (max-width: 768px) {
		.scene {
			min-height: 210px;
		}

		.card {
			min-height: 210px;
		}

		.face {
			padding: 1.5rem 1.4rem 1.2rem;
		}

		.face p {
			font-size: 0.97rem;
		}

		.nav-btn {
			font-size: 0.82rem;
			padding: 0.5rem 0.75rem;
			min-height: 44px;
		}

		.kb-hint {
			display: none;
		}
	}

	/* Small phones (≤ 480px) */
	@media (max-width: 480px) {
		.scene {
			min-height: 190px;
		}

		.card {
			min-height: 190px;
		}

		.face {
			padding: 1.2rem 1rem 1rem;
		}

		.face p {
			font-size: 0.92rem;
		}

		.nav-btn {
			flex: 1;
			font-size: 0.8rem;
		}

		.dots {
			gap: 0.28rem;
		}

		.dot {
			width: 7px;
			height: 7px;
		}
	}

	/* Extra small phones (≤ 360px) */
	@media (max-width: 360px) {
		.face {
			padding: 1rem 0.85rem 0.85rem;
		}

		.face p {
			font-size: 0.86rem;
		}

		.face-badge {
			font-size: 0.6rem;
		}

		.nav-btn {
			font-size: 0.76rem;
			padding: 0.45rem 0.5rem;
		}
	}
</style>
