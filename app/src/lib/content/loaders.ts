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
			return { asset, html: raw };
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
