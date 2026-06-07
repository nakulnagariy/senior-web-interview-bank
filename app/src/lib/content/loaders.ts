import { marked } from 'marked';
import type { TopicAsset } from '$lib/data/topics';

export type LoadedAsset = {
	asset: TopicAsset;
	html?: string;
	text?: string;
	rows?: string[][];
	error?: string;
};

function parseCsv(raw: string): string[][] {
	return raw
		.split(/\r?\n/)
		.filter((line) => line.trim().length > 0)
		.map((line) => line.split(',').map((item) => item.trim()));
}

// ── Shared assessment asset injection ─────────────────────────────────────────
// Cached promise — fetched once per page load, reused for all HTML assets.
let sharedAssetsCache: Promise<{ css: string; js: string }> | null = null;

function getSharedAssets(): Promise<{ css: string; js: string }> {
	if (!sharedAssetsCache) {
		sharedAssetsCache = Promise.all([
			fetch('/content/shared/assessment.css').then((r) => (r.ok ? r.text() : '')),
			fetch('/content/shared/assessment.js').then((r) => (r.ok ? r.text() : ''))
		]).then(([css, js]) => ({ css, js }));
	}
	return sharedAssetsCache;
}

function injectSharedAssets(html: string, css: string, js: string): string {
	const styleTag = `<style>\n${css}\n</style>`;
	const scriptTag = `<script>\n${js}\n<\/script>`;
	// Inject CSS before </head> if present, otherwise prepend to document
	if (html.includes('</head>')) {
		html = html.replace('</head>', `${styleTag}\n</head>`);
	} else {
		html = `${styleTag}\n${html}`;
	}
	// Inject JS before </body> if present, otherwise append to document
	if (html.includes('</body>')) {
		html = html.replace('</body>', `${scriptTag}\n</body>`);
	} else {
		html = `${html}\n${scriptTag}`;
	}
	return html;
}
// ──────────────────────────────────────────────────────────────────────────────

export async function loadAsset(asset: TopicAsset): Promise<LoadedAsset> {
	try {
		const response = await fetch(asset.path);
		if (!response.ok) {
			throw new Error(`Could not load ${asset.path} (${response.status})`);
		}

		const raw = await response.text();
		if (asset.type === 'markdown') {
			return { asset, html: await marked.parse(raw) };
		}

		if (asset.type === 'html') {
			const { css, js } = await getSharedAssets();
			return { asset, html: injectSharedAssets(raw, css, js) };
		}

		if (asset.type === 'csv') {
			return { asset, rows: parseCsv(raw) };
		}

		return { asset, text: raw };
	} catch (error) {
		return {
			asset,
			error: error instanceof Error ? error.message : 'Unknown content loading error'
		};
	}
}
