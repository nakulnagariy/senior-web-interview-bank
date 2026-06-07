/**
 * migrate-assessment-html.ts
 *
 * Strips the inline <style> block from every assessment-generated.html file
 * and replaces it with a comment marker.
 * After migration, TopicViewer injects app/static/content/shared/assessment.css
 * and assessment.js at load time, so no inline styles are needed.
 *
 * Run: tsx scripts/migrate-assessment-html.ts
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const appRoot = path.resolve(path.dirname(__filename), '..');
const contentRoot = path.join(appRoot, 'static', 'content');

// ── File discovery ─────────────────────────────────────────────────────────
async function findGeneratedHtmlFiles(dir: string): Promise<string[]> {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const results: string[] = [];
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...(await findGeneratedHtmlFiles(full)));
		} else if (entry.name === 'assessment-generated.html') {
			results.push(full);
		}
	}
	return results;
}

// ── Style-block stripping ──────────────────────────────────────────────────
const STYLE_BLOCK_RE = /[ \t]*<style>[\s\S]*?<\/style>\n?/;
const INJECT_MARKER = '  <!-- shared CSS injected by TopicViewer -->';

function migrateHtml(html: string): { result: string; changed: boolean } {
	if (!STYLE_BLOCK_RE.test(html)) {
		return { result: html, changed: false };
	}
	const result = html.replace(STYLE_BLOCK_RE, INJECT_MARKER + '\n');
	return { result, changed: true };
}

// ── Verification helpers ────────────────────────────────────────────────────
function verify(html: string): string[] {
	const issues: string[] = [];
	if (/<style>/i.test(html)) issues.push('still contains <style> block');
	if (/font-family:\s*Segoe/i.test(html)) issues.push('still has Segoe UI font-family');
	if (/background:#f6f8fb/i.test(html)) issues.push('still has hardcoded background color');
	// Either the injection marker OR already-converted files with no marker are acceptable
	const hasMarker = html.includes('<!-- shared CSS injected by TopicViewer -->');
	const isConverted = html.includes('class="q-card"') || html.includes('class="page-title"');
	if (!hasMarker && !isConverted) {
		issues.push('missing injection marker');
	}
	return issues;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
	const files = await findGeneratedHtmlFiles(contentRoot);
	console.log(`Found ${files.length} assessment-generated.html files\n`);

	let changed = 0;
	let alreadyClean = 0;
	let failed = 0;
	const verifyErrors: Array<{ file: string; issues: string[] }> = [];

	for (const filePath of files) {
		try {
			const raw = await fs.readFile(filePath, 'utf8');
			const { result, changed: wasChanged } = migrateHtml(raw);

			if (wasChanged) {
				await fs.writeFile(filePath, result, 'utf8');
				changed++;
			} else {
				alreadyClean++;
			}

			// Verify the written content
			const final = wasChanged ? result : raw;
			const issues = verify(final);
			if (issues.length > 0) {
				verifyErrors.push({ file: path.relative(contentRoot, filePath), issues });
			}
		} catch (err) {
			console.error(`  ERROR ${filePath}: ${err}`);
			failed++;
		}
	}

	// ── Report ───────────────────────────────────────────────────────────────
	console.log('── Results ──────────────────────────────────────────');
	console.log(`  Migrated  : ${changed}`);
	console.log(`  Already clean: ${alreadyClean}`);
	console.log(`  Errors    : ${failed}`);

	if (verifyErrors.length > 0) {
		console.log(`\n── Verification failures (${verifyErrors.length}) ─────────────`);
		for (const { file, issues } of verifyErrors) {
			console.log(`  ${file}`);
			for (const issue of issues) {
				console.log(`    ✗ ${issue}`);
			}
		}
		process.exit(1);
	} else {
		console.log(`\n  ✓ All ${files.length} files pass verification`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
