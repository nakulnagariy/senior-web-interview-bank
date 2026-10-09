import { marked } from 'marked';

/**
 * MCQ papers are plain Markdown files in `src/lib/content/mcq/*.md`.
 * They are bundled into the JS at build time (no network fetch), so they
 * work offline as soon as the app shell is cached by the service worker.
 *
 * See `src/lib/content/mcq/README.md` for the file format.
 */

export type McqOption = { html: string };

export type McqQuestion = {
	id: string; // `${setId}-q${n}`
	num: number;
	/** Category, e.g. MongoDB / Express / React / Node.js. Used for scoring and drills. */
	topic: string;
	/** Optional finer label shown next to the category. */
	subtopic: string;
	promptHtml: string;
	options: McqOption[];
	answerIndex: number;
	explanationHtml: string;
};

export type McqSet = {
	id: string;
	title: string;
	description: string;
	questions: McqQuestion[];
};

const rawFiles = import.meta.glob(['/src/lib/content/mcq/*.md', '!/src/lib/content/mcq/README.md'], {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

function parseFrontMatter(raw: string): { meta: Record<string, string>; body: string } {
	const match = raw.replace(/^﻿/, '').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) return { meta: {}, body: raw };
	const meta: Record<string, string> = {};
	for (const line of match[1].split(/\r?\n/)) {
		const idx = line.indexOf(':');
		if (idx > 0) meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
	}
	return { meta, body: match[2] };
}

const OPTION_RE = /^- ([A-F])\)\s*(.*)$/;

function parseQuestion(setId: string, block: string): McqQuestion {
	const lines = block.split(/\r?\n/);
	const header = lines.shift() ?? '';
	const headerMatch = header.match(/^Q(\d+)\s*\|\s*([^|]+?)\s*(?:\|\s*(.+?))?\s*$/);
	if (!headerMatch) throw new Error(`[mcq] ${setId}: bad question header "${header}"`);
	const num = Number(headerMatch[1]);
	const topic = headerMatch[2].trim();
	const subtopic = (headerMatch[3] ?? '').trim();
	const where = `${setId} Q${num}`;

	const promptLines: string[] = [];
	const optionLetters: string[] = [];
	const optionTexts: string[] = [];
	let answerLetter = '';
	const explanationLines: string[] = [];
	let inFence = false;
	let section: 'prompt' | 'explanation' = 'prompt';

	for (const line of lines) {
		if (/^```/.test(line)) inFence = !inFence;

		if (section === 'prompt' && !inFence) {
			const opt = line.match(OPTION_RE);
			if (opt) {
				optionLetters.push(opt[1]);
				optionTexts.push(opt[2]);
				continue;
			}
			const ans = line.match(/^\*\*Answer:\*\*\s*([A-F])\b/);
			if (ans) {
				answerLetter = ans[1];
				continue;
			}
			const exp = line.match(/^\*\*Explanation:\*\*\s*(.*)$/);
			if (exp) {
				section = 'explanation';
				explanationLines.push(exp[1]);
				continue;
			}
		} else if (section === 'explanation') {
			explanationLines.push(line);
			continue;
		}
		promptLines.push(line);
	}

	if (optionTexts.length < 2) throw new Error(`[mcq] ${where}: needs at least 2 options`);
	const answerIndex = optionLetters.indexOf(answerLetter);
	if (answerIndex < 0) throw new Error(`[mcq] ${where}: answer "${answerLetter}" does not match an option`);

	return {
		id: `${setId}-q${num}`,
		num,
		topic,
		subtopic,
		promptHtml: marked.parse(promptLines.join('\n').trim(), { async: false }) as string,
		options: optionTexts.map((text) => ({
			html: marked.parseInline(text, { async: false }) as string
		})),
		answerIndex,
		explanationHtml: marked.parse(explanationLines.join('\n').trim(), { async: false }) as string
	};
}

function parseSet(path: string, raw: string): McqSet {
	const { meta, body } = parseFrontMatter(raw);
	const id = meta.id || path.split('/').pop()!.replace(/\.md$/, '');
	const blocks = body.split(/^### /m).slice(1);
	return {
		id,
		title: meta.title || id,
		description: meta.description || '',
		questions: blocks.map((block) => parseQuestion(id, block))
	};
}

export const MCQ_SETS: McqSet[] = Object.entries(rawFiles)
	.sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
	.map(([path, raw]) => parseSet(path, raw));

export const MCQ_QUESTION_BY_ID: Record<string, McqQuestion> = Object.fromEntries(
	MCQ_SETS.flatMap((set) => set.questions.map((q) => [q.id, q]))
);

/** Category names in the order they first appear in the papers. */
export const MCQ_TOPICS: string[] = [
	...new Set(MCQ_SETS.flatMap((s) => s.questions.map((q) => q.topic)))
];

export const TOPIC_LABEL: Record<string, string> = {
	MongoDB: 'MongoDB',
	Express: 'Express & APIs',
	React: 'React & Next.js',
	'Node.js': 'Node.js & TypeScript'
};

export const MIXED_SET_ID = 'mixed';
export const MISTAKES_SET_ID = 'mistakes';
export const TOPIC_PREFIX = 'topic:';
export const MIXED_SIZE = 40;
/** 80 questions → 60 minutes. */
export const SECONDS_PER_QUESTION = 45;

export function sessionTitle(setId: string): string {
	if (setId === MIXED_SET_ID) return 'Mixed Quiz';
	if (setId === MISTAKES_SET_ID) return 'My Mistakes';
	if (setId.startsWith(TOPIC_PREFIX)) {
		const topic = setId.slice(TOPIC_PREFIX.length);
		return `${TOPIC_LABEL[topic] ?? topic} Drill`;
	}
	return MCQ_SETS.find((s) => s.id === setId)?.title ?? 'Quiz';
}

// ── Quiz session ───────────────────────────────────────────────────────────

export type QuizMode = 'practice' | 'exam';

export type SessionItem = {
	qid: string;
	/** Original option indexes in the order they are displayed. */
	order: number[];
	/** Original option index the user picked, or null. */
	picked: number | null;
	/** Marked for review by the user. */
	flagged?: boolean;
};

export type Session = {
	setId: string;
	mode: QuizMode;
	items: SessionItem[];
	index: number;
	finished: boolean;
	startedAt: number;
	/** Time limit in seconds; 0 means untimed. */
	durationSec: number;
	/** When the quiz was finished (ms epoch). */
	finishedAt?: number;
	/** True when time ran out. */
	timedOut?: boolean;
	/** True for retry / mistakes runs; their score is not recorded as the paper's result. */
	partial?: boolean;
};

export function shuffle<T>(input: readonly T[]): T[] {
	const arr = [...input];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

function stratifiedMixed(size: number): McqQuestion[] {
	const perTopic = Math.max(1, Math.floor(size / MCQ_TOPICS.length));
	const all = MCQ_SETS.flatMap((s) => s.questions);
	return shuffle(
		MCQ_TOPICS.flatMap((topic) => shuffle(all.filter((q) => q.topic === topic)).slice(0, perTopic))
	);
}

export type SessionOptions = {
	shuffleQuestions: boolean;
	shuffleOptions: boolean;
	timed: boolean;
	onlyIds?: string[];
};

export function createSession(setId: string, mode: QuizMode, opts: SessionOptions): Session {
	let questions: McqQuestion[];
	let keepOrder = false;
	if (opts.onlyIds) {
		questions = opts.onlyIds.map((id) => MCQ_QUESTION_BY_ID[id]).filter(Boolean);
	} else if (setId === MIXED_SET_ID) {
		questions = stratifiedMixed(MIXED_SIZE);
		keepOrder = true;
	} else if (setId.startsWith(TOPIC_PREFIX)) {
		const topic = setId.slice(TOPIC_PREFIX.length);
		questions = shuffle(MCQ_SETS.flatMap((s) => s.questions).filter((q) => q.topic === topic));
		keepOrder = true;
	} else {
		questions = MCQ_SETS.find((s) => s.id === setId)?.questions ?? [];
	}
	if (opts.shuffleQuestions && !keepOrder) questions = shuffle(questions);

	return {
		setId,
		mode,
		index: 0,
		finished: false,
		startedAt: Date.now(),
		durationSec: opts.timed ? questions.length * SECONDS_PER_QUESTION : 0,
		partial: Boolean(opts.onlyIds),
		items: questions.map((q) => {
			const natural = q.options.map((_, i) => i);
			return { qid: q.id, order: opts.shuffleOptions ? shuffle(natural) : natural, picked: null };
		})
	};
}

export function isCorrect(item: SessionItem): boolean {
	return item.picked !== null && item.picked === MCQ_QUESTION_BY_ID[item.qid]?.answerIndex;
}

export type Score = {
	correct: number;
	wrong: number;
	skipped: number;
	total: number;
	pct: number;
	elapsedSec: number;
	byTopic: { topic: string; correct: number; total: number }[];
};

export function scoreSession(session: Session): Score {
	let correct = 0;
	let wrong = 0;
	let skipped = 0;
	const topics = new Map<string, { correct: number; total: number }>();
	for (const item of session.items) {
		const q = MCQ_QUESTION_BY_ID[item.qid];
		if (!q) continue;
		const entry = topics.get(q.topic) ?? { correct: 0, total: 0 };
		entry.total++;
		if (item.picked === null) skipped++;
		else if (isCorrect(item)) {
			correct++;
			entry.correct++;
		} else wrong++;
		topics.set(q.topic, entry);
	}
	const total = session.items.length;
	const end = session.finishedAt ?? Date.now();
	return {
		correct,
		wrong,
		skipped,
		total,
		pct: total ? Math.round((correct / total) * 100) : 0,
		elapsedSec: Math.max(0, Math.round((end - session.startedAt) / 1000)),
		byTopic: [...topics.entries()].map(([topic, v]) => ({ topic, ...v }))
	};
}

export function formatClock(totalSec: number): string {
	const s = Math.max(0, Math.floor(totalSec));
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	const sec = s % 60;
	const mm = String(m).padStart(2, '0');
	const ss = String(sec).padStart(2, '0');
	return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

// ── Persistence (localStorage, always wrapped: it can throw/be blocked) ────

const SESSION_KEY = 'bench_mcq_session';
const RESULTS_KEY = 'bench_mcq_results';
const MISTAKES_KEY = 'bench_mcq_mistakes';

export type SetResult = { best: number; last: number; attempts: number };
export type ResultsMap = Record<string, SetResult>;

export function loadSession(): Session | null {
	try {
		const raw = localStorage.getItem(SESSION_KEY);
		if (!raw) return null;
		const s = JSON.parse(raw) as Session;
		// Drop stale sessions that reference questions no longer in the bundle.
		if (!s.items?.length || s.items.some((i) => !MCQ_QUESTION_BY_ID[i.qid])) return null;
		s.durationSec ??= 0;
		return s;
	} catch {
		return null;
	}
}

export function saveSession(session: Session | null): void {
	try {
		if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
		else localStorage.removeItem(SESSION_KEY);
	} catch {
		/* storage unavailable: quiz still works, just without resume */
	}
}

export function loadResults(): ResultsMap {
	try {
		return JSON.parse(localStorage.getItem(RESULTS_KEY) ?? '{}') as ResultsMap;
	} catch {
		return {};
	}
}

export function recordResult(setId: string, pct: number): ResultsMap {
	const results = loadResults();
	const prev = results[setId];
	results[setId] = {
		best: Math.max(prev?.best ?? 0, pct),
		last: pct,
		attempts: (prev?.attempts ?? 0) + 1
	};
	try {
		localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
	} catch {
		/* ignore */
	}
	return results;
}

/** Question ids the user got wrong or skipped most recently. Correct answers clear them. */
export function loadMistakes(): string[] {
	try {
		const ids = JSON.parse(localStorage.getItem(MISTAKES_KEY) ?? '[]') as string[];
		return ids.filter((id) => MCQ_QUESTION_BY_ID[id]);
	} catch {
		return [];
	}
}

export function updateMistakes(session: Session): string[] {
	const current = new Set(loadMistakes());
	for (const item of session.items) {
		if (isCorrect(item)) current.delete(item.qid);
		else current.add(item.qid);
	}
	const next = [...current];
	try {
		localStorage.setItem(MISTAKES_KEY, JSON.stringify(next));
	} catch {
		/* ignore */
	}
	return next;
}
