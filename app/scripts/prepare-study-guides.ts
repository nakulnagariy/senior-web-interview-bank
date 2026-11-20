import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { STUDY_GUIDES } from '../src/lib/data/studyGuides';

const sourceDir = resolve(import.meta.dirname, '../../interview-bank/study-guides');
const targetDir = resolve(import.meta.dirname, '../static/study-guides');

if (!existsSync(sourceDir)) {
	throw new Error(`Study guide source folder not found: ${sourceDir}`);
}

mkdirSync(targetDir, { recursive: true });

for (const guide of STUDY_GUIDES) {
	for (const extension of ['html', 'pdf']) {
		const filename = `${guide.slug}.${extension}`;
		const sourcePath = resolve(sourceDir, filename);
		if (!existsSync(sourcePath)) {
			throw new Error(`Missing study guide asset: ${sourcePath}`);
		}
		copyFileSync(sourcePath, resolve(targetDir, filename));
	}
}

console.log(`Prepared ${STUDY_GUIDES.length} HTML/PDF study guide pairs.`);