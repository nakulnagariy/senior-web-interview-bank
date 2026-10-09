/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, prerendered, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

// Everything the app needs to run is precached on install: the JS/CSS build,
// every file in /static (topic notes, flashcards, assessments, icons, manifest)
// and the prerendered pages. MCQ papers are bundled into the JS itself.
const APP_CACHE = `app-${version}`;
const FONT_CACHE = 'fonts-v1';
const PRECACHE = [...new Set([...build, ...files, ...prerendered, '/', '/index.html'])];
const PRECACHE_SET = new Set(PRECACHE);

sw.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(APP_CACHE);
			// addAll is atomic: if any file fails, install fails and the old worker stays active.
			await cache.addAll(PRECACHE);
			await sw.skipWaiting();
		})()
	);
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			for (const key of await caches.keys()) {
				if (key !== APP_CACHE && key !== FONT_CACHE) await caches.delete(key);
			}
			await sw.clients.claim();
		})()
	);
});

async function cacheFirst(request: Request): Promise<Response> {
	const cache = await caches.open(APP_CACHE);
	const cached = await cache.match(request, { ignoreSearch: true });
	if (cached) return cached;
	const response = await fetch(request);
	if (response.ok) cache.put(request, response.clone());
	return response;
}

async function navigate(request: Request): Promise<Response> {
	const cache = await caches.open(APP_CACHE);
	// This is a single-page app (static adapter, fallback index.html): serve the shell.
	try {
		return (
			(await cache.match(request, { ignoreSearch: true })) ??
			(await cache.match('/index.html')) ??
			(await cache.match('/')) ??
			(await fetch(request))
		);
	} catch {
		return new Response('Offline and the app shell is not cached yet. Open the app once while online.', {
			status: 503,
			headers: { 'Content-Type': 'text/plain' }
		});
	}
}

// Google Fonts: serve from cache when possible, refresh in the background.
async function staleWhileRevalidate(request: Request): Promise<Response> {
	const cache = await caches.open(FONT_CACHE);
	const cached = await cache.match(request);
	const network = fetch(request)
		.then((response) => {
			if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
			return response;
		})
		.catch(() => undefined);
	return cached ?? (await network) ?? Response.error();
}

sw.addEventListener('fetch', (event) => {
	const request = event.request;
	if (request.method !== 'GET') return;
	const url = new URL(request.url);

	if (url.origin === sw.location.origin) {
		if (request.mode === 'navigate') {
			event.respondWith(navigate(request));
		} else if (PRECACHE_SET.has(url.pathname) || url.pathname.startsWith('/content/')) {
			event.respondWith(cacheFirst(request));
		}
		return;
	}

	if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
		event.respondWith(staleWhileRevalidate(request));
	}
});
