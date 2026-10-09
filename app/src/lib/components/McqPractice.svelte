<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import {
		MCQ_QUESTION_BY_ID,
		MCQ_SETS,
		MCQ_TOPICS,
		MIXED_SET_ID,
		MIXED_SIZE,
		MISTAKES_SET_ID,
		SECONDS_PER_QUESTION,
		TOPIC_LABEL,
		TOPIC_PREFIX,
		createSession,
		formatClock,
		isCorrect,
		loadMistakes,
		loadResults,
		loadSession,
		recordResult,
		saveSession,
		scoreSession,
		sessionTitle,
		updateMistakes,
		type QuizMode,
		type ResultsMap,
		type Session
	} from '$lib/mcq/mcq';

	const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
	const PASS_PCT = 70;

	let session = $state<Session | null>(null);
	let saved = $state<Session | null>(null);
	let results = $state<ResultsMap>({});
	let mistakes = $state<string[]>([]);
	let mode = $state<QuizMode>('practice');
	let shuffleOptions = $state(true);
	let shuffleQuestions = $state(false);
	let timed = $state(true);
	let showNavigator = $state(false);
	let reviewFilter = $state<'all' | 'wrong'>('all');
	let confirmFinish = $state(false);
	let dir = $state<'next' | 'prev'>('next');
	let now = $state(Date.now());
	let rootEl: HTMLElement | undefined = $state();

	const scoreTween = new Tween(0, { duration: 1100, easing: cubicOut });

	// Confetti pieces are generated once; they only render on a passing result.
	const confetti = Array.from({ length: 26 }, (_, i) => ({
		left: Math.round(Math.random() * 100),
		delay: Math.round(Math.random() * 500),
		dur: 1400 + Math.round(Math.random() * 900),
		hue: [28, 205, 150, 45, 340][i % 5],
		rot: Math.round(Math.random() * 360)
	}));

	const allQuestions = MCQ_SETS.flatMap((s) => s.questions);
	const totalQuestions = allQuestions.length;
	const topicCounts = MCQ_TOPICS.map((topic) => ({
		topic,
		count: allQuestions.filter((q) => q.topic === topic).length
	}));

	const current = $derived(session && !session.finished ? session.items[session.index] : null);
	const currentQuestion = $derived(current ? MCQ_QUESTION_BY_ID[current.qid] : null);
	const answeredCount = $derived(session ? session.items.filter((i) => i.picked !== null).length : 0);
	const flaggedCount = $derived(session ? session.items.filter((i) => i.flagged).length : 0);
	const score = $derived(session?.finished ? scoreSession(session) : null);
	const reviewItems = $derived(
		session?.finished
			? session.items.filter((item) => reviewFilter === 'all' || !isCorrect(item))
			: []
	);
	const title = $derived(session ? sessionTitle(session.setId) : '');

	const remainingSec = $derived(
		session && !session.finished && session.durationSec > 0
			? Math.max(0, session.durationSec - (now - session.startedAt) / 1000)
			: null
	);
	const elapsedSec = $derived(session && !session.finished ? (now - session.startedAt) / 1000 : 0);
	const timerState = $derived(
		remainingSec === null
			? 'free'
			: remainingSec <= 300
				? 'danger'
				: remainingSec <= 600
					? 'warn'
					: 'ok'
	);

	function savedRemaining(s: Session): number | null {
		return s.durationSec > 0 ? Math.max(0, s.durationSec - (now - s.startedAt) / 1000) : null;
	}

	onMount(() => {
		results = loadResults();
		mistakes = loadMistakes();
		saved = loadSession();
		const tick = () => (now = Date.now());
		const id = setInterval(tick, 1000);
		document.addEventListener('visibilitychange', tick);
		return () => {
			clearInterval(id);
			document.removeEventListener('visibilitychange', tick);
		};
	});

	// Auto-submit when the countdown reaches zero.
	$effect(() => {
		if (session && !session.finished && remainingSec !== null && remainingSec <= 0) {
			finish(true);
		}
	});

	// Animate the score ring/number whenever a result is shown.
	$effect(() => {
		if (score) scoreTween.target = score.pct;
		else void scoreTween.set(0, { duration: 0 });
	});

	function persist(next: Session | null): void {
		session = next;
		saveSession(next && !next.finished ? next : null);
		if (!next || next.finished) saved = null;
	}

	function toTop(): void {
		rootEl?.scrollIntoView({ block: 'start' });
	}

	function start(setId: string, onlyIds?: string[]): void {
		confirmFinish = false;
		showNavigator = false;
		reviewFilter = 'all';
		dir = 'next';
		now = Date.now();
		persist(createSession(setId, mode, { shuffleOptions, shuffleQuestions, timed, onlyIds }));
		toTop();
	}

	function resume(): void {
		if (!saved) return;
		now = Date.now();
		session = saved;
		mode = saved.mode;
		toTop();
	}

	function pick(displayIdx: number): void {
		if (!session || !current) return;
		// In practice mode an answer is locked once chosen, to give honest feedback.
		if (session.mode === 'practice' && current.picked !== null) return;
		const original = current.order[displayIdx];
		if (original === undefined) return;
		const items = session.items.map((it, i) => (i === session!.index ? { ...it, picked: original } : it));
		persist({ ...session, items });
	}

	function clearPick(): void {
		if (!session || !current || session.mode !== 'exam' || current.picked === null) return;
		const items = session.items.map((it, i) => (i === session!.index ? { ...it, picked: null } : it));
		persist({ ...session, items });
	}

	function toggleFlag(): void {
		if (!session || !current) return;
		const items = session.items.map((it, i) =>
			i === session!.index ? { ...it, flagged: !it.flagged } : it
		);
		persist({ ...session, items });
	}

	function go(index: number): void {
		if (!session) return;
		const clamped = Math.max(0, Math.min(session.items.length - 1, index));
		if (clamped === session.index) return;
		dir = clamped > session.index ? 'next' : 'prev';
		persist({ ...session, index: clamped });
		confirmFinish = false;
		showNavigator = false;
		toTop();
	}

	function finish(timeUp = false): void {
		if (!session || session.finished) return;
		const done: Session = { ...session, finished: true, finishedAt: Date.now(), timedOut: timeUp };
		if (!session.partial) results = recordResult(session.setId, scoreSession(done).pct);
		mistakes = updateMistakes(done);
		persist(done);
		confirmFinish = false;
		showNavigator = false;
		toTop();
	}

	function requestFinish(): void {
		if (!session) return;
		if (answeredCount < session.items.length) confirmFinish = true;
		else finish();
	}

	/** Leave an unfinished quiz without losing it: it stays resumable from the menu. */
	function leave(): void {
		if (session && !session.finished) {
			saved = session;
			session = null;
		} else {
			persist(null);
		}
		toTop();
	}

	function retryWrong(): void {
		if (!session) return;
		const ids = session.items.filter((i) => !isCorrect(i)).map((i) => i.qid);
		if (ids.length) start(session.setId, ids);
	}

	function startMistakes(): void {
		if (mistakes.length) start(MISTAKES_SET_ID, mistakes);
	}

	function optionState(displayIdx: number): 'idle' | 'selected' | 'correct' | 'wrong' {
		if (!current || !currentQuestion || !session) return 'idle';
		const original = current.order[displayIdx];
		const reveal = session.mode === 'practice' && current.picked !== null;
		if (reveal) {
			if (original === currentQuestion.answerIndex) return 'correct';
			if (original === current.picked) return 'wrong';
			return 'idle';
		}
		return original === current.picked ? 'selected' : 'idle';
	}

	function onKey(e: KeyboardEvent): void {
		if (!session || session.finished) return;
		const tag = (e.target as HTMLElement)?.tagName;
		if (tag === 'INPUT' || tag === 'TEXTAREA' || e.ctrlKey || e.metaKey || e.altKey) return;
		if (e.key === 'ArrowRight') go(session.index + 1);
		else if (e.key === 'ArrowLeft') go(session.index - 1);
		else if (/^[1-6]$/.test(e.key)) pick(Number(e.key) - 1);
		else if (/^[a-fA-F]$/.test(e.key)) {
			if (e.key.toLowerCase() === 'f') toggleFlag();
			else pick(e.key.toUpperCase().charCodeAt(0) - 65);
		}
	}

	function pctClass(p: number): string {
		return p >= PASS_PCT ? 'good' : p >= 40 ? 'mid' : 'low';
	}
</script>

<svelte:window onkeydown={onKey} />

<section class="mcq" bind:this={rootEl}>
	{#if !session}
		<!-- ───────────── Menu ───────────── -->
		<header class="menu-head rise" style="--i: 0">
			<h2>Web Stack MCQ Practice</h2>
			<p>
				{MCQ_SETS.length} papers · {totalQuestions} questions · MongoDB, Express, React &amp; Next.js,
				Node.js &amp; TypeScript. Mid–senior difficulty. Works fully offline.
			</p>
		</header>

		{#if saved}
			{@const rem = savedRemaining(saved)}
			<button class="resume-card rise" style="--i: 1" onclick={resume}>
				<span class="resume-title">▶ Resume your quiz</span>
				<span class="resume-sub">
					{sessionTitle(saved.setId)} · {saved.items.filter((i) => i.picked !== null).length}/{saved.items.length}
					answered
					{#if rem !== null}· {rem > 0 ? formatClock(rem) + ' left' : 'time is up'}{/if}
				</span>
			</button>
		{/if}

		{#if mistakes.length}
			<button class="mistake-card rise" style="--i: 2" onclick={startMistakes}>
				<span class="resume-title">🎯 Practise my mistakes</span>
				<span class="resume-sub">{mistakes.length} question{mistakes.length === 1 ? '' : 's'} you missed or skipped</span>
			</button>
		{/if}

		<div class="options-panel rise" style="--i: 3">
			<div class="seg" role="group" aria-label="Quiz mode">
				<button class:on={mode === 'practice'} onclick={() => (mode = 'practice')}>
					Practice
					<small>instant feedback</small>
				</button>
				<button class:on={mode === 'exam'} onclick={() => (mode = 'exam')}>
					Exam
					<small>results at the end</small>
				</button>
			</div>
			<div class="checks">
				<label class="check"><input type="checkbox" bind:checked={timed} /> Timer ({SECONDS_PER_QUESTION}s / question)</label>
				<label class="check"><input type="checkbox" bind:checked={shuffleOptions} /> Shuffle options</label>
				<label class="check"><input type="checkbox" bind:checked={shuffleQuestions} /> Shuffle questions</label>
			</div>
		</div>

		<h3 class="section-title rise" style="--i: 4">Full papers</h3>
		<div class="set-grid">
			{#each MCQ_SETS as set, n (set.id)}
				{@const r = results[set.id]}
				<button class="set-card rise" style="--i: {5 + n}" onclick={() => start(set.id)}>
					<span class="set-title">{set.title}</span>
					<span class="set-desc">{set.description}</span>
					<span class="set-meta">
						<span>{set.questions.length} Qs · {Math.round((set.questions.length * SECONDS_PER_QUESTION) / 60)} min</span>
						{#if r}
							<span class="badge {pctClass(r.best)}">Best {r.best}% · {r.attempts}×</span>
						{:else}
							<span class="badge muted">New</span>
						{/if}
					</span>
				</button>
			{/each}
		</div>

		<h3 class="section-title rise" style="--i: 9">Topic drills <small>every question on one topic, from all papers</small></h3>
		<div class="drill-grid">
			{#each topicCounts as t, n (t.topic)}
				<button class="drill rise" style="--i: {10 + n}" onclick={() => start(TOPIC_PREFIX + t.topic)}>
					<span class="drill-name">{TOPIC_LABEL[t.topic] ?? t.topic}</span>
					<span class="drill-meta">{t.count} Qs</span>
				</button>
			{/each}
			<button class="drill mixed rise" style="--i: 14" onclick={() => start(MIXED_SET_ID)}>
				<span class="drill-name">🎲 Mixed quiz</span>
				<span class="drill-meta">{MIXED_SIZE} random Qs{results[MIXED_SET_ID] ? ` · best ${results[MIXED_SET_ID].best}%` : ''}</span>
			</button>
		</div>
	{:else if current && currentQuestion}
		<!-- ───────────── Question ───────────── -->
		<div class="quiz-bar">
			<button class="link-btn" onclick={leave} aria-label="Back to papers (progress is saved)">← Papers</button>
			<span class="bar-title">{title}</span>
			<span
				class="timer {timerState}"
				role="timer"
				aria-label={remainingSec === null ? 'Elapsed time' : 'Time remaining'}
			>
				<span class="timer-icon" aria-hidden="true">⏱</span>
				{formatClock(remainingSec ?? elapsedSec)}
			</span>
		</div>

		<div class="progress" aria-hidden="true">
			<div class="progress-bar" style="width: {(answeredCount / session.items.length) * 100}%"></div>
		</div>

		<div class="q-meta">
			<span>
				Question <strong>{session.index + 1}</strong> / {session.items.length}
				· {answeredCount} answered{flaggedCount ? ` · ${flaggedCount} flagged` : ''}
			</span>
			<button class="link-btn" onclick={() => (showNavigator = !showNavigator)} aria-expanded={showNavigator}>
				{showNavigator ? 'Hide' : 'Jump to'} <span class="chev" class:open={showNavigator}>▾</span>
			</button>
		</div>

		{#if showNavigator}
			<div class="navigator">
				{#each session.items as item, i (item.qid)}
					{@const answered = item.picked !== null}
					<button
						class="nav-dot"
						class:current={i === session.index}
						class:answered={answered && session.mode === 'exam'}
						class:ok={answered && session.mode === 'practice' && isCorrect(item)}
						class:bad={answered && session.mode === 'practice' && !isCorrect(item)}
						class:flag={item.flagged}
						onclick={() => go(i)}
						aria-label="Go to question {i + 1}{item.flagged ? ' (flagged)' : ''}">{i + 1}</button
					>
				{/each}
			</div>
		{/if}

		{#key current.qid}
			<article class="q-card slide {dir}">
				<div class="tag-row">
					<span class="topic-tag">{currentQuestion.topic}</span>
					{#if currentQuestion.subtopic}<span class="sub-tag">{currentQuestion.subtopic}</span>{/if}
					<button
						class="flag-btn"
						class:on={current.flagged}
						onclick={toggleFlag}
						aria-pressed={Boolean(current.flagged)}
						title="Flag for review (F)"
					>
						<span aria-hidden="true">⚑</span> {current.flagged ? 'Flagged' : 'Flag'}
					</button>
				</div>
				<div class="prompt">{@html currentQuestion.promptHtml}</div>

				<div class="choices" role="group" aria-label="Answer options">
					{#each current.order as originalIdx, displayIdx (originalIdx)}
						{@const state = optionState(displayIdx)}
						<button
							class="choice {state}"
							style="--i: {displayIdx}"
							onclick={() => pick(displayIdx)}
							aria-pressed={state === 'selected'}
							disabled={session.mode === 'practice' && current.picked !== null}
						>
							<span class="letter">{LETTERS[displayIdx]}</span>
							<span class="choice-text">{@html currentQuestion.options[originalIdx].html}</span>
							{#if state === 'correct'}<span class="mark" aria-label="Correct">✓</span>{/if}
							{#if state === 'wrong'}<span class="mark" aria-label="Incorrect">✗</span>{/if}
						</button>
					{/each}
				</div>

				{#if session.mode === 'exam' && current.picked !== null}
					<button class="link-btn clear" onclick={clearPick}>Clear my answer</button>
				{/if}

				{#if session.mode === 'practice' && current.picked !== null}
					<div class="explain" class:ok={isCorrect(current)}>
						<strong>{isCorrect(current) ? '✓ Correct!' : '✗ Not quite.'}</strong>
						{@html currentQuestion.explanationHtml}
					</div>
				{/if}
			</article>
		{/key}

		{#if confirmFinish}
			<div class="confirm pop-in">
				<p>
					You have {session.items.length - answeredCount} unanswered question(s)
					{#if flaggedCount}and {flaggedCount} flagged{/if}. Submit anyway?
				</p>
				<div class="confirm-actions">
					<button class="btn" onclick={() => (confirmFinish = false)}>Keep going</button>
					<button class="btn primary" onclick={() => finish()}>Submit</button>
				</div>
			</div>
		{/if}

		<div class="q-nav">
			<button class="btn" onclick={() => go(session!.index - 1)} disabled={session.index === 0}>← Prev</button>
			{#if session.index === session.items.length - 1}
				<button class="btn primary" onclick={requestFinish}>Finish</button>
			{:else}
				<button class="btn primary" onclick={() => go(session!.index + 1)}>Next →</button>
			{/if}
		</div>
		{#if session.index !== session.items.length - 1}
			<button class="link-btn finish-link" onclick={requestFinish}>Finish &amp; see results</button>
		{/if}
	{:else if score}
		<!-- ───────────── Results ───────────── -->
		<header class="menu-head rise" style="--i: 0">
			<h2>{title} — Results</h2>
			{#if session.timedOut}<p class="timeup">⏰ Time was up, so your answers were submitted automatically.</p>{/if}
		</header>

		<div class="score-card rise {pctClass(score.pct)}" style="--i: 1">
			{#if score.pct >= PASS_PCT}
				<div class="confetti" aria-hidden="true">
					{#each confetti as c}
						<i style="left:{c.left}%; --d:{c.delay}ms; --t:{c.dur}ms; --h:{c.hue}; --r:{c.rot}deg"></i>
					{/each}
				</div>
			{/if}
			<div class="ring">
				<svg viewBox="0 0 120 120" aria-hidden="true">
					<circle class="ring-bg" cx="60" cy="60" r="52" />
					<circle
						class="ring-fg"
						cx="60"
						cy="60"
						r="52"
						stroke-dasharray={2 * Math.PI * 52}
						stroke-dashoffset={2 * Math.PI * 52 * (1 - scoreTween.current / 100)}
					/>
				</svg>
				<div class="ring-num">{Math.round(scoreTween.current)}<small>%</small></div>
			</div>
			<div class="score-detail">
				<span class="verdict">{score.pct >= PASS_PCT ? 'Nice work! 🎉' : score.pct >= 40 ? 'Getting there 💪' : 'Keep practising 📚'}</span>
				<span>✓ {score.correct} correct · ✗ {score.wrong} wrong{score.skipped ? ` · – ${score.skipped} skipped` : ''}</span>
				<span>⏱ {formatClock(score.elapsedSec)} used{session.durationSec ? ` of ${formatClock(session.durationSec)}` : ''}</span>
			</div>
		</div>

		<div class="topic-break rise" style="--i: 2">
			{#each score.byTopic as t (t.topic)}
				<div class="topic-row">
					<span>{TOPIC_LABEL[t.topic] ?? t.topic}</span>
					<span class="topic-bar"><span class={pctClass((t.correct / t.total) * 100)} style="--w: {(t.correct / t.total) * 100}%"></span></span>
					<span class="topic-score">{t.correct}/{t.total}</span>
				</div>
			{/each}
		</div>

		<div class="result-actions rise" style="--i: 3">
			{#if score.wrong + score.skipped > 0}
				<button class="btn primary" onclick={retryWrong}>Retry {score.wrong + score.skipped} missed</button>
			{/if}
			<button class="btn" onclick={() => start(session!.setId, session!.partial ? session!.items.map((i) => i.qid) : undefined)}>Restart</button>
			<button class="btn" onclick={leave}>All papers</button>
		</div>

		<div class="seg small rise" style="--i: 4" role="group" aria-label="Review filter">
			<button class:on={reviewFilter === 'all'} onclick={() => (reviewFilter = 'all')}>All answers</button>
			<button class:on={reviewFilter === 'wrong'} onclick={() => (reviewFilter = 'wrong')}>Missed only</button>
		</div>

		<div class="review-list">
			{#each reviewItems as item, n (item.qid)}
				{@const q = MCQ_QUESTION_BY_ID[item.qid]}
				{@const ok = isCorrect(item)}
				<article class="review-card rise" class:ok class:bad={!ok} style="--i: {Math.min(n, 8)}">
					<div class="tag-row">
						<span class="topic-tag">{q.topic}</span>
						{#if q.subtopic}<span class="sub-tag">{q.subtopic}</span>{/if}
						{#if item.flagged}<span class="sub-tag flagged">⚑ flagged</span>{/if}
					</div>
					<div class="prompt">{@html q.promptHtml}</div>
					<ul class="review-opts">
						{#each item.order as originalIdx, displayIdx (originalIdx)}
							<li
								class:right={originalIdx === q.answerIndex}
								class:picked-wrong={originalIdx === item.picked && originalIdx !== q.answerIndex}
							>
								<span class="letter">{LETTERS[displayIdx]}</span>
								<span>{@html q.options[originalIdx].html}</span>
								{#if originalIdx === q.answerIndex}<em>correct answer</em>{/if}
								{#if originalIdx === item.picked && originalIdx !== q.answerIndex}<em>your answer</em>{/if}
							</li>
						{/each}
					</ul>
					{#if item.picked === null}<p class="skipped">You skipped this question.</p>{/if}
					<div class="explain ok">{@html q.explanationHtml}</div>
				</article>
			{:else}
				<p class="empty">Nothing missed. 🎉</p>
			{/each}
		</div>
	{/if}
</section>

<style>
	.mcq {
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

	.section-title {
		margin: 0.4rem 0 -0.2rem;
		font-size: 1rem;
		color: #1a2437;
	}

	.section-title small {
		font-weight: 400;
		color: #657389;
		font-size: 0.8rem;
		margin-left: 0.4rem;
	}

	.menu-head p {
		margin: 0.3rem 0 0;
		color: #657389;
		font-size: 0.92rem;
		line-height: 1.4;
	}

	.timeup {
		color: #b33a00 !important;
		font-weight: 600;
	}

	/* ── Entrance animations ── */
	.rise {
		animation: rise 0.45s cubic-bezier(0.2, 0.7, 0.2, 1) both;
		animation-delay: calc(var(--i, 0) * 55ms);
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.slide.next {
		animation: slide-next 0.32s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}

	.slide.prev {
		animation: slide-prev 0.32s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}

	@keyframes slide-next {
		from {
			opacity: 0;
			transform: translateX(28px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes slide-prev {
		from {
			opacity: 0;
			transform: translateX(-28px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.pop-in {
		animation: pop-in 0.25s ease-out both;
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

	/* ── Menu ── */
	.resume-card,
	.mistake-card {
		font-family: inherit;
		text-align: left;
		display: grid;
		gap: 0.2rem;
		color: #fff;
		border: none;
		border-radius: 14px;
		padding: 0.9rem 1.1rem;
		cursor: pointer;
		min-height: 48px;
		transition: transform 0.15s, box-shadow 0.15s;
	}

	.resume-card {
		background: #1a2437;
	}

	.mistake-card {
		background: linear-gradient(135deg, #c2540a, #ef791b);
	}

	.resume-card:active,
	.mistake-card:active {
		transform: scale(0.985);
	}

	.resume-card:hover,
	.mistake-card:hover {
		box-shadow: 0 8px 22px rgba(26, 36, 55, 0.25);
	}

	.resume-title {
		font-weight: 700;
	}

	.resume-sub {
		font-size: 0.85rem;
		opacity: 0.85;
	}

	.options-panel {
		display: grid;
		gap: 0.7rem;
		background: rgba(255, 255, 255, 0.75);
		border: 1px solid #d8dee7;
		border-radius: 14px;
		padding: 0.75rem;
	}

	.checks {
		display: flex;
		flex-wrap: wrap;
		gap: 0 1.25rem;
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
		display: grid;
		gap: 0.1rem;
		justify-items: center;
		border: none;
		background: transparent;
		border-radius: 9px;
		padding: 0.5rem 0.4rem;
		font-weight: 600;
		font-size: 0.92rem;
		color: #657389;
		cursor: pointer;
		min-height: 44px;
		transition: background 0.2s, color 0.2s, transform 0.12s;
	}

	.seg button:active {
		transform: scale(0.97);
	}

	.seg button small {
		font-weight: 400;
		font-size: 0.7rem;
	}

	.seg button.on {
		background: #1a2437;
		color: #fff;
	}

	.seg.small button {
		min-height: 40px;
		font-size: 0.85rem;
	}

	.check {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		min-height: 40px;
		cursor: pointer;
	}

	.check input {
		width: 20px;
		height: 20px;
		accent-color: #ef791b;
	}

	.set-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 0.75rem;
	}

	.set-card {
		font-family: inherit;
		text-align: left;
		display: grid;
		align-content: start;
		gap: 0.4rem;
		background: #fff;
		border: 1px solid #d8dee7;
		border-radius: 16px;
		padding: 1rem;
		cursor: pointer;
		color: #20202a;
		transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
	}

	.set-card:hover {
		border-color: #ef791b;
		box-shadow: 0 6px 18px rgba(26, 36, 55, 0.1);
		transform: translateY(-2px);
	}

	.set-card:active {
		transform: scale(0.985);
	}

	.set-title {
		font-weight: 700;
		font-size: 1.02rem;
		color: #1a2437;
	}

	.set-desc {
		font-size: 0.86rem;
		color: #657389;
		line-height: 1.4;
	}

	.set-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: #657389;
		margin-top: 0.3rem;
	}

	.badge {
		background: #fdecd9;
		color: #9a4a06;
		border-radius: 999px;
		padding: 0.15rem 0.6rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.badge.good {
		background: #dcf3e3;
		color: #1d6b36;
	}

	.badge.low {
		background: #fde0e0;
		color: #a12a2a;
	}

	.badge.muted {
		background: #eef1f5;
		color: #657389;
		font-weight: 500;
	}

	.drill-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 0.6rem;
	}

	.drill {
		font-family: inherit;
		text-align: left;
		display: grid;
		gap: 0.15rem;
		background: #fff;
		border: 1px solid #d8dee7;
		border-radius: 14px;
		padding: 0.75rem 0.85rem;
		cursor: pointer;
		min-height: 56px;
		color: #20202a;
		transition: border-color 0.15s, transform 0.15s;
	}

	.drill:hover {
		border-color: #ef791b;
		transform: translateY(-2px);
	}

	.drill:active {
		transform: scale(0.97);
	}

	.drill.mixed {
		background: linear-gradient(135deg, #fff7ee, #fff);
		border-style: dashed;
	}

	.drill-name {
		font-weight: 700;
		font-size: 0.92rem;
		color: #1a2437;
	}

	.drill-meta {
		font-size: 0.78rem;
		color: #657389;
	}

	/* ── Quiz bar + timer ── */
	.quiz-bar {
		position: sticky;
		top: 0;
		z-index: 60;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 0.5rem;
		margin: -0.25rem -0.5rem 0;
		background: rgba(247, 245, 240, 0.94);
		backdrop-filter: blur(8px);
		border-radius: 14px;
	}

	.bar-title {
		font-weight: 600;
		font-size: 0.85rem;
		color: #657389;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
	}

	.timer {
		font-variant-numeric: tabular-nums;
		font-weight: 700;
		font-size: 1rem;
		padding: 0.3rem 0.7rem;
		border-radius: 999px;
		background: #1a2437;
		color: #fff;
		display: inline-flex;
		gap: 0.35rem;
		align-items: center;
		transition: background 0.4s;
	}

	.timer.warn {
		background: #c27a00;
	}

	.timer.danger {
		background: #c42b2b;
		animation: timer-pulse 1s ease-in-out infinite;
	}

	@keyframes timer-pulse {
		0%,
		100% {
			transform: scale(1);
			box-shadow: 0 0 0 0 rgba(196, 43, 43, 0.5);
		}
		50% {
			transform: scale(1.06);
			box-shadow: 0 0 0 8px rgba(196, 43, 43, 0);
		}
	}

	/* ── Question ── */
	.q-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		font-size: 0.88rem;
		color: #657389;
	}

	.chev {
		display: inline-block;
		transition: transform 0.2s;
	}

	.chev.open {
		transform: rotate(180deg);
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

	.link-btn.clear {
		justify-self: start;
		min-height: 32px;
		padding: 0.2rem 0;
		font-size: 0.82rem;
		color: #657389;
	}

	.finish-link {
		justify-self: center;
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
		transition: width 0.45s cubic-bezier(0.2, 0.7, 0.2, 1);
	}

	.navigator {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(42px, 1fr));
		gap: 0.4rem;
		background: #fff;
		border: 1px solid #d8dee7;
		border-radius: 14px;
		padding: 0.6rem;
		animation: pop-in 0.2s ease-out both;
	}

	.nav-dot {
		position: relative;
		font-family: inherit;
		height: 42px;
		border-radius: 10px;
		border: 1px solid #d8dee7;
		background: #f7f9fc;
		font-weight: 600;
		cursor: pointer;
		color: #44506a;
		transition: transform 0.12s;
	}

	.nav-dot:active {
		transform: scale(0.92);
	}

	.nav-dot.answered {
		background: #dbe9f6;
		border-color: #9cc2e4;
	}

	.nav-dot.ok {
		background: #dcf3e3;
		border-color: #86c99a;
	}

	.nav-dot.bad {
		background: #fde0e0;
		border-color: #e59a9a;
	}

	.nav-dot.flag::after {
		content: '⚑';
		position: absolute;
		top: -2px;
		right: 2px;
		font-size: 0.7rem;
		color: #c2540a;
	}

	.nav-dot.current {
		outline: 2px solid #1a2437;
		outline-offset: 1px;
	}

	.q-card,
	.review-card {
		background: #fff;
		border: 1px solid #d8dee7;
		border-radius: 18px;
		padding: 1rem;
		display: grid;
		gap: 0.8rem;
		min-width: 0;
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
		letter-spacing: 0.04em;
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

	.sub-tag.flagged {
		background: #fdecd9;
		color: #9a4a06;
	}

	.flag-btn {
		margin-left: auto;
		font-family: inherit;
		background: #f7f9fc;
		border: 1px solid #d8dee7;
		color: #657389;
		border-radius: 999px;
		font-size: 0.78rem;
		font-weight: 600;
		padding: 0.3rem 0.7rem;
		min-height: 32px;
		cursor: pointer;
		transition: background 0.2s, color 0.2s, transform 0.12s;
	}

	.flag-btn:active {
		transform: scale(0.93);
	}

	.flag-btn.on {
		background: #fdecd9;
		border-color: #f0c48f;
		color: #9a4a06;
	}

	.flag-btn.on span {
		display: inline-block;
		animation: flag-wave 0.4s ease-out;
	}

	@keyframes flag-wave {
		0% {
			transform: rotate(0);
		}
		40% {
			transform: rotate(-25deg) scale(1.3);
		}
		100% {
			transform: rotate(0);
		}
	}

	.prompt {
		font-size: 1.02rem;
		line-height: 1.55;
		overflow-wrap: anywhere;
		min-width: 0;
	}

	.prompt :global(p),
	.explain :global(p) {
		margin: 0 0 0.6rem;
	}

	.prompt :global(p:last-child),
	.explain :global(p:last-child) {
		margin-bottom: 0;
	}

	.mcq :global(pre) {
		background: #1a2437;
		color: #e8edf5;
		border-radius: 10px;
		padding: 0.8rem 0.9rem;
		overflow-x: auto;
		font-size: 0.82rem;
		line-height: 1.5;
		margin: 0.4rem 0;
		-webkit-overflow-scrolling: touch;
	}

	.mcq :global(code) {
		font-family: 'IBM Plex Mono', ui-monospace, Consolas, monospace;
		font-size: 0.88em;
	}

	.mcq :global(:not(pre) > code) {
		background: #eef1f5;
		color: #a23a00;
		border-radius: 5px;
		padding: 0.08rem 0.35rem;
		overflow-wrap: anywhere;
	}

	.choices {
		display: grid;
		gap: 0.55rem;
	}

	.choice {
		font-family: inherit;
		display: flex;
		align-items: flex-start;
		gap: 0.7rem;
		text-align: left;
		width: 100%;
		min-height: 52px;
		padding: 0.7rem 0.8rem;
		background: #f7f9fc;
		border: 1.5px solid #d8dee7;
		border-radius: 12px;
		font-size: 0.97rem;
		line-height: 1.45;
		color: #20202a;
		cursor: pointer;
		box-sizing: border-box;
		touch-action: manipulation;
		animation: rise 0.35s cubic-bezier(0.2, 0.7, 0.2, 1) both;
		animation-delay: calc(var(--i, 0) * 50ms + 80ms);
		transition: border-color 0.15s, background 0.2s, transform 0.12s;
	}

	.choice:disabled {
		cursor: default;
		opacity: 1;
	}

	.choice:not(:disabled):hover {
		border-color: #ef791b;
	}

	.choice:not(:disabled):active {
		transform: scale(0.985);
	}

	.choice.selected {
		border-color: #2379b9;
		background: #e8f2fb;
	}

	.choice.correct {
		border-color: #2e9a52;
		background: #e3f6e9;
		animation: pop 0.45s ease-out both;
	}

	.choice.wrong {
		border-color: #d44;
		background: #fde8e8;
		animation: shake 0.45s ease-out both;
	}

	@keyframes pop {
		0% {
			transform: scale(1);
		}
		40% {
			transform: scale(1.03);
		}
		100% {
			transform: scale(1);
		}
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20% {
			transform: translateX(-7px);
		}
		40% {
			transform: translateX(6px);
		}
		60% {
			transform: translateX(-4px);
		}
		80% {
			transform: translateX(3px);
		}
	}

	.letter {
		flex: none;
		width: 26px;
		height: 26px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: #e3e8ef;
		font-weight: 700;
		font-size: 0.8rem;
		color: #44506a;
		transition: background 0.2s, color 0.2s;
	}

	.choice.correct .letter {
		background: #2e9a52;
		color: #fff;
	}

	.choice.wrong .letter {
		background: #d44;
		color: #fff;
	}

	.choice.selected .letter {
		background: #2379b9;
		color: #fff;
	}

	.choice-text {
		flex: 1;
		min-width: 0;
		overflow-wrap: anywhere;
		padding-top: 2px;
	}

	.mark {
		font-weight: 800;
		font-size: 1.1rem;
		animation: mark-in 0.4s cubic-bezier(0.3, 1.6, 0.5, 1) both;
	}

	@keyframes mark-in {
		from {
			transform: scale(0) rotate(-40deg);
		}
		to {
			transform: scale(1) rotate(0);
		}
	}

	.choice.correct .mark {
		color: #2e9a52;
	}

	.choice.wrong .mark {
		color: #d44;
	}

	.explain {
		background: #fff4e5;
		border-left: 4px solid #ef791b;
		border-radius: 8px;
		padding: 0.7rem 0.85rem;
		font-size: 0.93rem;
		line-height: 1.5;
		animation: explain-in 0.35s ease-out both;
	}

	@keyframes explain-in {
		from {
			opacity: 0;
			transform: translateY(-6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.explain.ok {
		background: #eef8f1;
		border-left-color: #2e9a52;
	}

	.explain strong {
		display: block;
		margin-bottom: 0.25rem;
	}

	.q-nav {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
		position: sticky;
		bottom: 0;
		padding: 0.6rem 0 calc(0.6rem + env(safe-area-inset-bottom));
		background: linear-gradient(to top, rgba(247, 245, 240, 0.98) 70%, rgba(247, 245, 240, 0));
		z-index: 50;
	}

	.btn {
		font-family: inherit;
		min-height: 48px;
		border-radius: 12px;
		border: 1.5px solid #c9d1dd;
		background: #fff;
		color: #1a2437;
		font-weight: 700;
		font-size: 0.97rem;
		cursor: pointer;
		padding: 0 1rem;
		touch-action: manipulation;
		transition: transform 0.12s, box-shadow 0.15s;
	}

	.btn:not(:disabled):active {
		transform: scale(0.96);
	}

	.btn.primary {
		background: #1a2437;
		border-color: #1a2437;
		color: #fff;
	}

	.btn.primary:not(:disabled):hover {
		box-shadow: 0 6px 16px rgba(26, 36, 55, 0.3);
	}

	.btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.confirm {
		background: #fff4e5;
		border: 1px solid #f0c48f;
		border-radius: 14px;
		padding: 0.8rem;
	}

	.confirm p {
		margin: 0 0 0.6rem;
		font-size: 0.93rem;
	}

	.confirm-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
	}

	/* ── Results ── */
	.score-card {
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		gap: 1.2rem;
		background: #fff;
		border: 2px solid #e59a9a;
		border-radius: 18px;
		padding: 1rem 1.2rem;
	}

	.score-card.mid {
		border-color: #f0c48f;
	}

	.score-card.good {
		border-color: #86c99a;
	}

	.ring {
		position: relative;
		flex: none;
		width: 116px;
		height: 116px;
	}

	.ring svg {
		width: 100%;
		height: 100%;
		transform: rotate(-90deg);
	}

	.ring circle {
		fill: none;
		stroke-width: 10;
	}

	.ring-bg {
		stroke: #e3e8ef;
	}

	.ring-fg {
		stroke: #d44;
		stroke-linecap: round;
	}

	.score-card.mid .ring-fg {
		stroke: #ef9a1b;
	}

	.score-card.good .ring-fg {
		stroke: #2e9a52;
	}

	.ring-num {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		font-weight: 700;
		color: #1a2437;
		font-variant-numeric: tabular-nums;
	}

	.ring-num small {
		font-size: 1rem;
		margin-left: 1px;
	}

	.score-detail {
		display: grid;
		gap: 0.25rem;
		font-weight: 600;
		font-size: 0.92rem;
		min-width: 0;
	}

	.verdict {
		font-size: 1.1rem;
		color: #1a2437;
	}

	.confetti {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.confetti i {
		position: absolute;
		top: -12px;
		width: 8px;
		height: 14px;
		border-radius: 2px;
		background: hsl(var(--h) 85% 55%);
		transform: rotate(var(--r));
		opacity: 0;
		animation: confetti-fall var(--t) ease-in var(--d) 1 both;
	}

	@keyframes confetti-fall {
		0% {
			opacity: 1;
			transform: translateY(0) rotate(var(--r));
		}
		100% {
			opacity: 0;
			transform: translateY(190px) rotate(calc(var(--r) + 540deg));
		}
	}

	.topic-break {
		display: grid;
		gap: 0.5rem;
		background: #fff;
		border: 1px solid #d8dee7;
		border-radius: 14px;
		padding: 0.8rem;
	}

	.topic-row {
		display: grid;
		grid-template-columns: 7.5rem 1fr 3rem;
		align-items: center;
		gap: 0.6rem;
		font-size: 0.88rem;
	}

	.topic-bar {
		height: 8px;
		background: #e3e8ef;
		border-radius: 999px;
		overflow: hidden;
	}

	.topic-bar > span {
		display: block;
		height: 100%;
		width: var(--w);
		background: #2e9a52;
		animation: grow 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s both;
	}

	.topic-bar > span.mid {
		background: #ef9a1b;
	}

	.topic-bar > span.low {
		background: #d44;
	}

	@keyframes grow {
		from {
			width: 0;
		}
		to {
			width: var(--w);
		}
	}

	.topic-score {
		text-align: right;
		font-weight: 600;
	}

	.result-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.result-actions .btn {
		flex: 1 1 140px;
	}

	.review-list {
		display: grid;
		gap: 0.8rem;
	}

	.review-card.ok {
		border-left: 5px solid #2e9a52;
	}

	.review-card.bad {
		border-left: 5px solid #d44;
	}

	.review-opts {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.4rem;
	}

	.review-opts li {
		display: flex;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0.5rem 0.6rem;
		border-radius: 10px;
		background: #f7f9fc;
		font-size: 0.93rem;
		overflow-wrap: anywhere;
	}

	.review-opts li > span:nth-child(2) {
		flex: 1;
		min-width: 0;
	}

	.review-opts li.right {
		background: #e3f6e9;
	}

	.review-opts li.picked-wrong {
		background: #fde8e8;
	}

	.review-opts em {
		font-size: 0.74rem;
		font-style: normal;
		font-weight: 700;
		color: #44506a;
	}

	.skipped {
		margin: 0;
		color: #9a4a06;
		font-weight: 600;
		font-size: 0.88rem;
	}

	.empty {
		text-align: center;
		color: #657389;
	}

	@media (max-width: 480px) {
		.q-card,
		.review-card {
			padding: 0.85rem;
			border-radius: 16px;
		}

		.prompt {
			font-size: 0.98rem;
		}

		.bar-title {
			display: none;
		}

		.quiz-bar {
			grid-template-columns: 1fr auto;
		}

		.topic-row {
			grid-template-columns: 5.6rem 1fr 2.6rem;
		}

		.ring {
			width: 96px;
			height: 96px;
		}

		.ring-num {
			font-size: 1.6rem;
		}

		.score-card {
			gap: 0.9rem;
			padding: 0.9rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.mcq :global(*),
		.mcq :global(*::before),
		.mcq :global(*::after) {
			animation-duration: 0.01ms !important;
			animation-delay: 0ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}

		.confetti {
			display: none;
		}
	}
</style>
