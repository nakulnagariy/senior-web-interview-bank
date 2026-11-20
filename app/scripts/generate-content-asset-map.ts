import { readdirSync, writeFileSync } from 'node:fs';
import { basename, extname, join, relative, resolve } from 'node:path';
import type { TopicAsset, TopicAssetType } from '../src/lib/data/topics';

const contentRoot = resolve(import.meta.dirname, '../static/content');
const outputPath = resolve(import.meta.dirname, '../src/lib/data/contentAssets.generated.ts');
const typeByExtension: Record<string, TopicAssetType | undefined> = {
	'.md': 'markdown',
	'.html': 'html',
	'.js': 'code',
	'.csv': 'csv'
};

function walk(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const absolutePath = join(directory, entry.name);
		return entry.isDirectory() ? walk(absolutePath) : [absolutePath];
	});
}

function labelFor(filePath: string, type: TopicAssetType): string {
	const fileBase = basename(filePath, extname(filePath));
	if (fileBase === 'notes') return 'Notes';
	if (fileBase === 'assessment') return 'Assessment';
	if (fileBase.startsWith('flashcards')) return 'Flashcards';
	if (fileBase === 'example') return 'Code example';
	const title = fileBase
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/[-_]+/g, ' ')
		.replace(/\b\w/g, (letter) => letter.toUpperCase());
	return type === 'code' ? title : title || 'Reference';
}

const assetsByTopic: Record<string, TopicAsset[]> = {};
for (const absolutePath of walk(contentRoot).sort()) {
	const relativePath = relative(contentRoot, absolutePath).replace(/\\/g, '/');
	if (relativePath.startsWith('shared/') || relativePath.includes('-generated.')) continue;

	const [category, topicSlug] = relativePath.split('/');
	const type = typeByExtension[extname(relativePath).toLowerCase()];
	if (!category || !topicSlug || !type) continue;

	const key = `${category}/${topicSlug}`;
	const asset: TopicAsset = {
		label: labelFor(relativePath, type),
		type,
		path: `/content/${relativePath}`
	};
	(assetsByTopic[key] ??= []).push(asset);
}

for (const assets of Object.values(assetsByTopic)) {
	assets.sort((left, right) => left.label.localeCompare(right.label));
}

writeFileSync(
	outputPath,
	`import type { TopicAsset } from './topics';\n\nexport const DISCOVERED_CONTENT_ASSETS: Record<string, TopicAsset[]> = ${JSON.stringify(assetsByTopic, null, 2)};\n`,
	'utf8'
);

console.log(`Indexed authored assets for ${Object.keys(assetsByTopic).length} content folders.`);