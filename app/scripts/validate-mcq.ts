/**
 * Validates the MCQ markdown papers in src/lib/content/mcq.
 *
 *   npm run validate:mcq
 *
 * Errors (exit 1): malformed questions, duplicate ids, answer letter that is not an option.
 * Warnings: categories that do not have the expected number of questions, and statistics that
 * hint at answer-guessing tells (correct answer usually the longest / unbalanced letters).
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join(import.meta.dirname, '..', 'src', 'lib', 'content', 'mcq');
const EXPECTED_PER_TOPIC = 20;
const OPTION_RE = /^- ([A-F])\)\s*(.*)$/;

const errors: string[] = [];
const warnings: string[] = [];
const ids = new Set<string>();
const letters: Record<string, number> = {};
let total = 0;
let longest = 0;

for (const file of readdirSync(DIR).filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md').sort()) {
	const raw = readFileSync(join(DIR, file), 'utf8').replace(/^﻿/, '');
	const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!fm) {
		errors.push(`${file}: missing front matter`);
		continue;
	}
	const meta = Object.fromEntries(
		fm[1].split(/\r?\n/).map((l) => [l.slice(0, l.indexOf(':')).trim(), l.slice(l.indexOf(':') + 1).trim()])
	);
	const setId = meta.id || file;
	if (ids.has(setId)) errors.push(`${file}: duplicate set id "${setId}"`);
	ids.add(setId);

	const topicCounts: Record<string, number> = {};
	const seenNums = new Set<number>();
	for (const block of fm[2].split(/^### /m).slice(1)) {
		const lines = block.split(/\r?\n/);
		const head = lines[0].match(/^Q(\d+)\s*\|\s*([^|]+?)\s*(?:\|\s*(.+?))?\s*$/);
		if (!head) {
			errors.push(`${file}: bad question header "${lines[0]}"`);
			continue;
		}
		const num = Number(head[1]);
		const where = `${file} Q${num}`;
		if (seenNums.has(num)) errors.push(`${where}: duplicate question number`);
		seenNums.add(num);
		topicCounts[head[2]] = (topicCounts[head[2]] ?? 0) + 1;

		let inFence = false;
		const opts: { letter: string; text: string }[] = [];
		let answer = '';
		let hasExplanation = false;
		for (const line of lines.slice(1)) {
			if (/^```/.test(line)) inFence = !inFence;
			if (inFence) continue;
			const o = line.match(OPTION_RE);
			if (o) opts.push({ letter: o[1], text: o[2] });
			const a = line.match(/^\*\*Answer:\*\*\s*([A-F])\b/);
			if (a) answer = a[1];
			if (/^\*\*Explanation:\*\*\s*\S/.test(line)) hasExplanation = true;
		}
		if (opts.length < 2) errors.push(`${where}: needs at least 2 options`);
		if (new Set(opts.map((o) => o.letter)).size !== opts.length) errors.push(`${where}: duplicate option letters`);
		if (new Set(opts.map((o) => o.text)).size !== opts.length) errors.push(`${where}: two options have identical text`);
		const correct = opts.find((o) => o.letter === answer);
		if (!correct) {
			errors.push(`${where}: answer "${answer}" does not match an option`);
			continue;
		}
		if (!hasExplanation) warnings.push(`${where}: missing explanation`);

		total++;
		letters[answer] = (letters[answer] ?? 0) + 1;
		if (opts.every((o) => correct.text.length >= o.text.length)) longest++;
	}

	console.log(`${file}: ${Object.entries(topicCounts).map(([t, n]) => `${t} ${n}`).join(', ')}`);
	for (const [topic, n] of Object.entries(topicCounts)) {
		if (n !== EXPECTED_PER_TOPIC) warnings.push(`${file}: ${topic} has ${n} questions (expected ${EXPECTED_PER_TOPIC})`);
	}
}

console.log(`\n${total} questions. Correct-answer letters: ${JSON.stringify(letters)}`);
const longestPct = total ? Math.round((longest / total) * 100) : 0;
console.log(`Correct option is the longest in ${longestPct}% of questions (about 25-45% is healthy).`);
if (longestPct > 55) warnings.push(`correct answer is the longest option in ${longestPct}% of questions: it is easy to guess`);

const maxLetter = Math.max(...Object.values(letters), 0);
if (total && maxLetter / total > 0.4) warnings.push('one answer letter is used for over 40% of questions (shuffle options is on in the app, but the files are lopsided)');

for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
if (errors.length) process.exit(1);
console.log(errors.length || warnings.length ? '' : 'MCQ papers OK');
