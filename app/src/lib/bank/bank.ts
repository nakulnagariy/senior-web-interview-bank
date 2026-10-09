import { marked } from 'marked';

/**
 * The interview bank is plain Markdown in `<repo>/interview-bank/<category>/<topic>.md`
 * (written by the interview-coach skill). It is bundled into the JS at build time, so it
 * is cached by the service worker and works offline. Rebuild/redeploy to pick up new entries.
 *
 * Entry format: see `interview-bank/README.md`.
 */

export type BankVerdict = 'Correct' | 'Partial' | 'Wrong' | '?';
export type BankStatus = 'open' | 'closed';

export type BankEntry = {
	id: string;
	category: string;
	file: string;
	fileTitle: string;
	questionHtml: string;
	/** Plain text used for search. */
	searchText: string;
	asked: string;
	verdict: BankVerdict;
	status: BankStatus;
	myAnswerHtml: string;
	coveredHtml: string;
	gapsHtml: string;
	answerHtml: string;
	followUpsHtml: string;
	historyHtml: string;
	hasGaps: boolean;
};

const rawFiles = import.meta.glob('../../../../interview-bank/*/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const SECTION_KEYS: Record<string, keyof Pick<
	BankEntry,
	'myAnswerHtml' | 'coveredHtml' | 'gapsHtml' | 'answerHtml' | 'followUpsHtml' | 'historyHtml'
>> = {
	'my answer': 'myAnswerHtml',
	'covered well': 'coveredHtml',
	gaps: 'gapsHtml',
	'complete answer': 'answerHtml',
	'likely follow-ups': 'followUpsHtml',
	history: 'historyHtml'
};

const md = (text: string): string => (text.trim() ? (marked.parse(text.trim(), { async: false }) as string) : '');

function slug(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 60);
}

function parseEntry(category: string, file: string, fileTitle: string, block: string): BankEntry {
	const lines = block.split(/\r?\n/);
	const question = lines.shift()!.trim();

	const sections: Record<string, string[]> = {};
	let current = '';
	let inFence = false;
	const meta: string[] = [];
	for (const line of lines) {
		if (/^```/.test(line)) inFence = !inFence;
		const heading = !inFence && line.match(/^\*\*([^*]+?)\*\*\s*$/);
		if (heading) {
			const name = heading[1].toLowerCase().replace(/\s*\(.*\)\s*$/, '').trim();
			if (name in SECTION_KEYS) {
				current = name;
				sections[current] = [];
				continue;
			}
		}
		if (current) sections[current].push(line);
		else meta.push(line);
	}

	const metaText = meta.join(' ');
	const verdict = (metaText.match(/\*\*Verdict:\*\*\s*(Correct|Partial|Wrong)/i)?.[1] ?? '?') as BankVerdict;
	const statusRaw = metaText.match(/\*\*Status:\*\*\s*(open|closed)/i)?.[1]?.toLowerCase();
	const asked = metaText.match(/\*\*Asked:\*\*\s*([0-9-]+)/)?.[1] ?? '';

	const html: Record<string, string> = {};
	for (const [name, key] of Object.entries(SECTION_KEYS)) {
		html[key] = md((sections[name] ?? []).join('\n'));
	}

	const gapsText = (sections.gaps ?? []).join(' ').trim();
	const plain = [question, ...Object.values(sections).map((s) => s.join(' '))]
		.join(' ')
		.replace(/[`*_>#\[\]()]/g, ' ')
		.toLowerCase();

	return {
		id: `${category}/${file}::${slug(question)}`,
		category,
		file,
		fileTitle,
		questionHtml: marked.parseInline(question, { async: false }) as string,
		searchText: plain,
		asked,
		verdict,
		status: statusRaw === 'closed' ? 'closed' : 'open',
		myAnswerHtml: html.myAnswerHtml,
		coveredHtml: html.coveredHtml,
		gapsHtml: html.gapsHtml,
		answerHtml: html.answerHtml,
		followUpsHtml: html.followUpsHtml,
		historyHtml: html.historyHtml,
		hasGaps: gapsText.length > 0 && !/^[-*\s]*(none|n\/a)\.?\s*$/i.test(gapsText)
	};
}

function parseFile(path: string, raw: string): BankEntry[] {
	const parts = path.split('/');
	const file = parts[parts.length - 1].replace(/\.md$/, '');
	const category = parts[parts.length - 2];
	const fileTitle = raw.match(/^# (.+)$/m)?.[1] ?? file;
	return raw
		.replace(/^﻿/, '')
		.split(/^### Q: /m)
		.slice(1)
		.map((block) => parseEntry(category, file, fileTitle, block));
}

export const BANK_ENTRIES: BankEntry[] = Object.entries(rawFiles)
	.sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
	.flatMap(([path, raw]) => parseFile(path, raw));

export const BANK_CATEGORIES: string[] = [...new Set(BANK_ENTRIES.map((e) => e.category))];

export const CATEGORY_LABEL: Record<string, string> = {
	javascript: 'JavaScript',
	typescript: 'TypeScript',
	html: 'HTML',
	css: 'CSS',
	accessibility: 'Accessibility',
	react: 'React',
	'nextjs-rendering': 'Next.js & rendering',
	performance: 'Performance',
	'web-protocols-security': 'Web protocols & security',
	nodejs: 'Node.js',
	'design-patterns-architecture': 'Design & architecture',
	'engineering-practices': 'Engineering practices',
	'data-structures-sql': 'Data structures & SQL',
	'devops-cloud': 'DevOps & cloud',
	angular: 'Angular',
	leadership: 'Leadership',
	presentation: 'Presentation'
};

export function categoryLabel(category: string): string {
	return (
		CATEGORY_LABEL[category] ??
		category.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())
	);
}

// ── Device-local revision marks ────────────────────────────────────────────

export type Mark = { state: 'known' | 'shaky'; at: number };
export type MarkMap = Record<string, Mark>;

const MARKS_KEY = 'bench_bank_marks';

export function loadMarks(): MarkMap {
	try {
		const parsed = JSON.parse(localStorage.getItem(MARKS_KEY) ?? '{}') as MarkMap;
		return parsed && typeof parsed === 'object' ? parsed : {};
	} catch {
		return {};
	}
}

export function saveMarks(marks: MarkMap): void {
	try {
		localStorage.setItem(MARKS_KEY, JSON.stringify(marks));
	} catch {
		/* storage unavailable: marks just won't persist */
	}
}
