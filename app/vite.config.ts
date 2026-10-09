import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		// The interview bank lives one level up (<repo>/interview-bank) and is imported as raw Markdown.
		fs: { allow: ['..'] }
	}
});
