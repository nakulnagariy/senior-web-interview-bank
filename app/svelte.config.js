import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	kit: {
		// No `fallback`: this app has exactly one route and it's fully prerendered
		// (+layout.ts sets prerender = true), so build/index.html is already the real,
		// server-rendered page with its actual <title>/meta tags baked in. A `fallback`
		// option here would make the adapter overwrite that real file with a generic
		// SPA-shell stub that has no <title>, no meta description, and no content until
		// JS runs — which is exactly the CSR rendering trap that breaks SEO and social
		// previews: crawlers that fetch the raw HTML see nothing to index.
		adapter: adapter({ strict: false }),
		// Register manually (dev-gated in +layout.svelte) — the default auto-registration
		// also runs in `vite dev`, where the SW's precache install 404s on /index.html
		// (dev mode serves "/" dynamically, there's no literal index.html) and a cache-first
		// SW actively conflicts with Vite's ever-changing dev module graph.
		serviceWorker: { register: false }
	}
};

export default config;
