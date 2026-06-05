import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_TOPICS } from '../src/lib/data/topics';

const __filename = fileURLToPath(import.meta.url);
const appRoot = path.resolve(path.dirname(__filename), '..');

async function exists(filePath: string): Promise<boolean> {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function run(): Promise<void> {
	const errors: string[] = [];
	const slugSet = new Set<string>();

	for (const topic of ALL_TOPICS) {
		if (slugSet.has(topic.slug)) {
			errors.push(`Duplicate slug: ${topic.slug}`);
		}
		slugSet.add(topic.slug);

		if (topic.assets.length > 0) {
			for (const asset of topic.assets) {
				if (!asset.path.startsWith('/content/')) {
					errors.push(`Asset path must start with /content/: ${topic.slug} -> ${asset.path}`);
					continue;
				}

				const diskPath = path.join(appRoot, 'static', asset.path.replace(/^\//, '').replaceAll('/', path.sep));
				if (!(await exists(diskPath))) {
					errors.push(`Missing asset file: ${topic.slug} -> ${asset.path}`);
				}
			}
		} else {
			const placeholder = path.join(appRoot, 'static', 'content', topic.slug, 'notes.md');
			if (!(await exists(placeholder))) {
				errors.push(`Missing placeholder notes: ${topic.slug} -> /content/${topic.slug}/notes.md`);
			}
		}
	}

	if (errors.length > 0) {
		console.error('Manifest validation failed.');
		for (const error of errors) {
			console.error(`- ${error}`);
		}
		process.exitCode = 1;
		return;
	}

	console.log(`Manifest validation passed for ${ALL_TOPICS.length} topics.`);
}

void run();
