import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOPIC_CATEGORIES } from '../src/lib/data/topics';

const __filename = fileURLToPath(import.meta.url);
const appRoot = path.resolve(path.dirname(__filename), '..');

type Row = {
	category: string;
	total: number;
	withAssets: number;
	placeholderOnly: number;
	placeholderFiles: number;
};

async function exists(filePath: string): Promise<boolean> {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function collectRows(): Promise<Row[]> {
	const rows: Row[] = [];

	for (const category of TOPIC_CATEGORIES) {
		let withAssets = 0;
		let placeholderOnly = 0;
		let placeholderFiles = 0;

		for (const topic of category.topics) {
			if (topic.assets.length > 0) {
				withAssets += 1;
				continue;
			}

			placeholderOnly += 1;
			const placeholderPath = path.join(appRoot, 'static', 'content', topic.slug, 'notes.md');
			if (await exists(placeholderPath)) {
				placeholderFiles += 1;
			}
		}

		rows.push({
			category: category.label,
			total: category.topics.length,
			withAssets,
			placeholderOnly,
			placeholderFiles
		});
	}

	return rows;
}

function pct(part: number, total: number): string {
	if (total === 0) return '0.0%';
	return `${((part / total) * 100).toFixed(1)}%`;
}

async function main(): Promise<void> {
	const rows = await collectRows();

	const totals = rows.reduce(
		(acc, row) => {
			acc.total += row.total;
			acc.withAssets += row.withAssets;
			acc.placeholderOnly += row.placeholderOnly;
			acc.placeholderFiles += row.placeholderFiles;
			return acc;
		},
		{ total: 0, withAssets: 0, placeholderOnly: 0, placeholderFiles: 0 }
	);

	console.log('Coverage Report');
	console.log('---------------');
	for (const row of rows) {
		console.log(
			`${row.category}: total=${row.total}, assets=${row.withAssets} (${pct(row.withAssets, row.total)}), placeholders=${row.placeholderOnly}, placeholder-files=${row.placeholderFiles}`
		);
	}
	console.log('---------------');
	console.log(
		`Overall: total=${totals.total}, assets=${totals.withAssets} (${pct(totals.withAssets, totals.total)}), placeholders=${totals.placeholderOnly}, placeholder-files=${totals.placeholderFiles}`
	);
}

void main();
