import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_TOPICS, type TopicAsset } from '../src/lib/data/topics';

const __filename = fileURLToPath(import.meta.url);
const appRoot = path.resolve(path.dirname(__filename), '..');

function slugToName(slug: string): string {
	return slug
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');
}

function normalizeTopicSegment(topicSlug: string): string {
	return topicSlug.split('/')[1] ?? topicSlug;
}

function complexityLevel(seed: number): string {
	const levels = ['Foundational', 'Applied', 'Advanced'];
	return levels[seed % levels.length] ?? 'Applied';
}

function mdContent(title: string, slug: string, seed: number): string {
	const segment = normalizeTopicSegment(slug);
	const level = complexityLevel(seed);

	return `# ${title}\n\n## Interview Lens\n- Focus level: ${level}\n- Route slug: ${slug}\n- What interviewers are probing: design judgement, edge-case awareness, and production trade-offs.\n\n## Core Mental Model\n${title} should be explained as a decision model, not a definition. Start from the baseline mechanism, then explain failure modes, and finally describe the production-safe pattern.\n\n## Senior Discussion Anchors\n1. What breaks first when ${title.toLowerCase()} is implemented naively?\n2. How does this topic affect observability, maintainability, and debugging speed?\n3. Which trade-off do you pick when latency and correctness are in tension?\n\n## Pitfalls to Mention\n- Overconfidence in happy-path behavior while ignoring edge inputs.\n- Missing rollback or fallback strategy in runtime error scenarios.\n- Coupling API shape to current UI assumptions.\n\n## Whiteboard Drill\n1. Explain ${title} in 45 seconds using one real production example.\n2. Show one anti-pattern and the corrected pattern for ${segment}.\n3. List two metrics you would track to verify the approach in production.\n\n## Compact Recap\nUse the format: "Problem -> Constraint -> Choice -> Trade-off -> Monitoring" when answering ${title}.\n`;
}

function htmlContent(title: string, slug: string, seed: number): string {
	const segment = normalizeTopicSegment(slug);
	const promptA = `How would you evaluate ${title} when requirements change mid-sprint?`;
	const promptB = `Which risk appears first if ${segment} is implemented without tests?`;
	const promptC = `How do you communicate trade-offs in ${title} to non-frontend stakeholders?`;

	return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — Assessment</title>
  <!-- shared CSS injected by TopicViewer -->
</head>
<body>
  <h1 class="page-title">${title}</h1>
  <p class="page-sub">Senior assessment — ${seed % 3 === 0 ? 'Foundational' : seed % 3 === 1 ? 'Applied' : 'Advanced'} level</p>

  <div class="divider"></div>
  <div class="section-label">Questions</div>

  <div class="q-card">
    <div class="q-meta"><span class="q-num">Q1</span></div>
    <div class="q-text">${promptA}</div>
    <details><summary>Expected answer signal</summary><p>Shows constraint mapping, identifies migration risks, and proposes phased rollout with guardrails.</p></details>
  </div>

  <div class="q-card">
    <div class="q-meta"><span class="q-num">Q2</span></div>
    <div class="q-text">${promptB}</div>
    <details><summary>Expected answer signal</summary><p>Identifies regression class, defines monitoring, and sets minimal reproducible checks.</p></details>
  </div>

  <div class="q-card">
    <div class="q-meta"><span class="q-num">Q3</span></div>
    <div class="q-text">${promptC}</div>
    <details><summary>Expected answer signal</summary><p>Frames impact in terms of reliability, delivery speed, and measurable outcomes.</p></details>
  </div>

  <div class="q-card">
    <div class="q-meta"><span class="q-num">Q4</span></div>
    <div class="q-text">Provide one anti-pattern and one corrected pattern for <code>${segment}</code>.</div>
    <details><summary>Expected answer signal</summary><p>Demonstrates specific failure mode and a pragmatic alternative with clear boundaries.</p></details>
  </div>

  <!-- shared JS injected by TopicViewer -->
</body>
</html>
`;
}

function jsContent(title: string, slug: string, seed: number): string {
	const fn = `drill${slugToName(normalizeTopicSegment(slug))}`;

	return `/**
 * Generated drill snippet for: ${title}
 * Slug: ${slug}
 */

const scenario = {
  topic: ${JSON.stringify(title)},
  slug: ${JSON.stringify(slug)},
  seed: ${seed}
};

function ${fn}(input) {
  const base = {
    ...scenario,
    input,
    timestamp: Date.now()
  };

  // Keep answers interview-oriented: explicit assumptions, trade-offs, and checks.
  return {
    summary: \
      'Explain baseline mechanism, highlight edge case, then provide mitigation and verification plan.',
    assumptions: [
      'Inputs can be malformed in production',
      'Requirements may change after initial delivery',
      'Monitoring is required to validate correctness'
    ],
    tradeOff: 'Prefer debuggability and predictability over clever but opaque shortcuts',
    checkList: ['error path covered', 'fallback defined', 'runtime metric identified'],
    context: base
  };
}

const output = ${fn}({ candidate: 'senior', mode: 'discussion' });
console.log(output);
`;
}

function csvContent(title: string, slug: string, seed: number): string {
	const level = complexityLevel(seed).toLowerCase();

	const rows = [
		['question', 'answer', 'level'],
		[
			`What is the primary objective of ${title}?`,
			'Define the mechanism and link it to reliability/performance impact.',
			level
		],
		[
			`Which failure mode should be mentioned first for ${title}?`,
			'Name one realistic edge case and describe mitigation.',
			level
		],
		[
			`How would you validate ${title} after release?`,
			'Use observable metrics, regression checks, and rollback strategy.',
			level
		],
		[
			`What trade-off appears in ${title} decisions?`,
			'Balance speed, correctness, and maintainability with explicit priorities.',
			level
		],
		[
			`How do you explain ${slug} to a non-specialist?`,
			'Translate technical details into user impact and delivery risk.',
			level
		]
	];

	return rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n');
}

async function writeGeneratedAsset(topicTitle: string, topicSlug: string, asset: TopicAsset, seed: number): Promise<boolean> {
	const absolute = path.join(appRoot, 'static', asset.path.replace(/^\//, '').replaceAll('/', path.sep));
	if (!absolute.endsWith('-generated.md') && !absolute.endsWith('-generated.html') && !absolute.endsWith('-generated.js') && !absolute.endsWith('-generated.csv')) {
		return false;
	}

	await fs.mkdir(path.dirname(absolute), { recursive: true });
	let content = '';

	if (asset.type === 'markdown') {
		content = mdContent(topicTitle, topicSlug, seed);
	} else if (asset.type === 'html') {
		content = htmlContent(topicTitle, topicSlug, seed);
	} else if (asset.type === 'code') {
		content = jsContent(topicTitle, topicSlug, seed);
	} else {
		content = csvContent(topicTitle, topicSlug, seed);
	}

	await fs.writeFile(absolute, content, 'utf8');
	return true;
}

async function run(): Promise<void> {
	let written = 0;
	let topicsTouched = 0;

	for (let i = 0; i < ALL_TOPICS.length; i += 1) {
		const topic = ALL_TOPICS[i];
		let wroteForTopic = false;

		for (const asset of topic.assets) {
			const didWrite = await writeGeneratedAsset(topic.title, topic.slug, asset, i + 1);
			if (didWrite) {
				written += 1;
				wroteForTopic = true;
			}
		}

		if (wroteForTopic) {
			topicsTouched += 1;
		}
	}

	console.log(`content generation complete: topics=${topicsTouched} files=${written}`);
}

void run();
