import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOPIC_CATEGORIES } from '../src/lib/data/topics';

const __filename = fileURLToPath(import.meta.url);
const appRoot = path.resolve(path.dirname(__filename), '..');

type Row = {
	category: string;
	total: number;
	withAuthoredAssets: number;
	authoredFiles: number;
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

async function listFiles(directory: string, prefix = ''): Promise<string[]> {
	const entries = await fs.readdir(directory, { withFileTypes: true });
	const files: string[] = [];
	for (const entry of entries) {
		const relativePath = path.join(prefix, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await listFiles(path.join(directory, entry.name), relativePath)));
		} else if (entry.isFile()) {
			files.push(relativePath.replace(/\\/g, '/'));
		}
	}
	return files;
}

async function collectUnmappedAuthoredFiles(): Promise<string[]> {
	const contentRoot = path.join(appRoot, 'static', 'content');
	const mappedPaths = new Set(
		TOPIC_CATEGORIES.flatMap((category) => category.topics.flatMap((topic) =>
			topic.assets.map((asset) => asset.path.replace(/^\/content\//, ''))
		))
	);
	const allFiles = await listFiles(contentRoot);
	return allFiles.filter(
		(file) =>
			!file.startsWith('shared/') &&
			!file.includes('-generated.') &&
			!mappedPaths.has(file)
	);
}

async function collectRows(): Promise<Row[]> {
	const rows: Row[] = [];

	for (const category of TOPIC_CATEGORIES) {
		let withAuthoredAssets = 0;
		let authoredFiles = 0;
		let placeholderOnly = 0;
		let placeholderFiles = 0;

		for (const topic of category.topics) {
			const authoredAssets = topic.assets.filter((asset) => !asset.generated);
			if (authoredAssets.length > 0) {
				withAuthoredAssets += 1;
				authoredFiles += authoredAssets.length;
			} else {
				placeholderOnly += 1;
			}

			for (const asset of topic.assets.filter((item) => item.generated)) {
				const placeholderPath = path.join(appRoot, 'static', asset.path.replace(/^\//, ''));
				if (await exists(placeholderPath)) placeholderFiles += 1;
			}
		}

		rows.push({
			category: category.label,
			total: category.topics.length,
			withAuthoredAssets,
			authoredFiles,
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
	const unmappedAuthoredFiles = await collectUnmappedAuthoredFiles();

	const totals = rows.reduce(
		(acc, row) => {
			acc.total += row.total;
			acc.withAuthoredAssets += row.withAuthoredAssets;
			acc.authoredFiles += row.authoredFiles;
			acc.placeholderOnly += row.placeholderOnly;
			acc.placeholderFiles += row.placeholderFiles;
			return acc;
		},
		{ total: 0, withAuthoredAssets: 0, authoredFiles: 0, placeholderOnly: 0, placeholderFiles: 0 }
	);

	console.log('Coverage Report');
	console.log('---------------');
	for (const row of rows) {
		console.log(
			`${row.category}: total=${row.total}, authored-topics=${row.withAuthoredAssets} (${pct(row.withAuthoredAssets, row.total)}), authored-files=${row.authoredFiles}, placeholder-only=${row.placeholderOnly}, generated-files=${row.placeholderFiles}`
		);
	}
	console.log('---------------');
	console.log(
		`Overall: total=${totals.total}, authored-topics=${totals.withAuthoredAssets} (${pct(totals.withAuthoredAssets, totals.total)}), authored-files=${totals.authoredFiles}, placeholder-only=${totals.placeholderOnly}, generated-files=${totals.placeholderFiles}`
	);
	console.log('---------------');
	console.log(`Unmapped authored files: ${unmappedAuthoredFiles.length}`);
	for (const file of unmappedAuthoredFiles) console.log(`/content/${file}`);
}

void main();
