import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	kit: {
		adapter: adapter({ fallback: 'index.html', strict: false }),
		// Register manually (dev-gated in +layout.svelte) — the default auto-registration
		// also runs in `vite dev`, where the SW's precache install 404s on /index.html
		// (dev mode serves "/" dynamically, there's no literal index.html) and a cache-first
		// SW actively conflicts with Vite's ever-changing dev module graph.
		serviceWorker: { register: false }
	}
};

export default config;
