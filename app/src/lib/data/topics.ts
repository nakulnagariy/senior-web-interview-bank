export type Priority = 'must' | 'high' | 'med' | 'low';
export type TopicType = 'output' | 'concept' | 'code' | 'design' | 'gotcha';

export type TopicAssetType = 'markdown' | 'html' | 'code' | 'csv';

export type TopicAsset = {
	label: string;
	type: TopicAssetType;
	path: string;
};

export type Topic = {
	slug: string;
	title: string;
	priority: Priority;
	type: TopicType;
	assets: TopicAsset[];
	missing: boolean;
};

export type TopicCategory = {
	id: string;
	label: string;
	cat: 'js' | 'react' | 'ts' | 'css' | 'perf' | 'test' | 'angular' | 'design';
	topics: Topic[];
};

type RawTopic = {
	n: string;
	p: Priority;
	type: TopicType;
};

type RawCategory = {
	id: string;
	label: string;
	cat: TopicCategory['cat'];
	topics: RawTopic[];
};

const RAW_DATA: RawCategory[] = [
	{
		id: 'js-core',
		label: 'JavaScript core',
		cat: 'js',
		topics: [
			{ n: 'Hoisting - var vs let vs const TDZ', p: 'must', type: 'gotcha' },
			{ n: 'Closure & scope chain', p: 'must', type: 'concept' },
			{ n: 'Lexical vs dynamic scope', p: 'high', type: 'concept' },
			{ n: 'Event loop - call stack, microtask, macrotask', p: 'must', type: 'concept' },
			{ n: 'Prototype chain & inheritance', p: 'must', type: 'concept' },
			{ n: 'this keyword - 4 binding rules', p: 'must', type: 'gotcha' },
			{ n: 'Arrow function vs regular function', p: 'must', type: 'concept' },
			{ n: 'Execution context & scope', p: 'high', type: 'concept' },
			{ n: 'Callback hell & pyramid of doom', p: 'high', type: 'code' },
			{ n: 'Generators & yield', p: 'med', type: 'concept' },
			{ n: 'Symbols & iterators', p: 'med', type: 'concept' },
			{ n: 'WeakMap / WeakSet / WeakRef', p: 'med', type: 'concept' },
			{ n: 'Garbage collection & memory management', p: 'high', type: 'concept' },
			{ n: 'Debounce & throttle - implement from scratch', p: 'must', type: 'code' },
			{ n: 'Deep clone - structuredClone vs JSON vs lodash', p: 'high', type: 'code' },
			{ n: 'Pure functions & side effects', p: 'high', type: 'concept' },
			{ n: 'First-class functions & higher-order functions', p: 'high', type: 'concept' },
			{ n: 'Event delegation, bubbling, capturing', p: 'must', type: 'concept' }
		]
	},
	{
		id: 'async-js',
		label: 'Async JavaScript',
		cat: 'js',
		topics: [
			{ n: 'Promises - states, chaining, combinators', p: 'must', type: 'concept' },
			{ n: 'async/await - error handling patterns', p: 'must', type: 'code' },
			{ n: 'Microtask queue output prediction', p: 'must', type: 'output' },
			{ n: 'Promise.all vs allSettled vs race vs any', p: 'must', type: 'concept' },
			{ n: 'Implement retryWithBackoff', p: 'high', type: 'code' },
			{ n: 'Concurrency limiter (N at a time)', p: 'high', type: 'code' },
			{ n: 'Cancellable promises & AbortController', p: 'high', type: 'concept' },
			{ n: 'Async iterators & for-await-of', p: 'med', type: 'concept' }
		]
	},
	{
		id: 'arrays-objects',
		label: 'Arrays & Objects',
		cat: 'js',
		topics: [
			{ n: 'map / filter / reduce - chained output questions', p: 'must', type: 'output' },
			{ n: 'flat / flatMap - nested array manipulation', p: 'high', type: 'code' },
			{ n: 'Array.from, Array.of, spread vs rest', p: 'high', type: 'concept' },
			{ n: 'Object.freeze vs Object.seal vs const', p: 'must', type: 'gotcha' },
			{ n: 'Object.keys/values/entries iteration order', p: 'high', type: 'gotcha' },
			{ n: 'Shallow vs deep copy patterns', p: 'must', type: 'concept' },
			{ n: 'Destructuring - defaults, renaming, nested', p: 'high', type: 'code' },
			{ n: 'Optional chaining & nullish coalescing', p: 'high', type: 'code' },
			{ n: 'Date API - formatting, timezones, Intl.DateTimeFormat', p: 'med', type: 'code' },
			{ n: 'Set & Map - when to use over array/object', p: 'high', type: 'concept' }
		]
	},
	{
		id: 'react-fundamentals',
		label: 'React fundamentals',
		cat: 'react',
		topics: [
			{ n: 'Virtual DOM & reconciliation (diffing algo)', p: 'must', type: 'concept' },
			{ n: 'React Fiber - what it solved, incremental rendering', p: 'must', type: 'concept' },
			{ n: 'Controlled vs uncontrolled components', p: 'must', type: 'concept' },
			{ n: 'Class lifecycle vs hooks equivalents', p: 'high', type: 'concept' },
			{ n: 'React Strict Mode behavior', p: 'high', type: 'gotcha' },
			{ n: 'Keys - why they matter, bad key patterns', p: 'must', type: 'gotcha' },
			{ n: 'Synthetic events & event pooling', p: 'med', type: 'concept' },
			{ n: 'Error boundaries - class only, placement strategy', p: 'high', type: 'concept' }
		]
	},
	{
		id: 'react-hooks',
		label: 'React hooks',
		cat: 'react',
		topics: [
			{ n: 'useState - batching, functional updates, stale closure', p: 'must', type: 'gotcha' },
			{ n: 'useEffect - deps array, cleanup, common mistakes', p: 'must', type: 'gotcha' },
			{ n: 'useRef - DOM refs vs mutable values', p: 'must', type: 'concept' },
			{ n: 'useMemo vs useCallback - when each actually helps', p: 'must', type: 'concept' },
			{ n: 'useReducer - when to choose over useState', p: 'high', type: 'concept' },
			{ n: 'useContext - performance gotchas, re-render scope', p: 'high', type: 'gotcha' },
			{ n: 'useLayoutEffect vs useEffect - timing difference', p: 'high', type: 'concept' },
			{ n: 'useTransition & useDeferredValue (concurrent)', p: 'high', type: 'concept' },
			{ n: 'Custom hooks - design patterns & rules of hooks', p: 'must', type: 'code' },
			{ n: 'useImperativeHandle & forwardRef', p: 'med', type: 'concept' }
		]
	},
	{
		id: 'react-patterns-architecture',
		label: 'React patterns & architecture',
		cat: 'react',
		topics: [
			{ n: 'HOC vs custom hook vs render props', p: 'must', type: 'design' },
			{ n: 'State management - useState/useReducer/Context/Redux', p: 'must', type: 'design' },
			{ n: 'Redux Toolkit - slices, thunks, RTK Query', p: 'high', type: 'concept' },
			{ n: 'Code splitting - React.lazy, Suspense, dynamic import', p: 'must', type: 'concept' },
			{ n: 'Micro-frontend architecture', p: 'high', type: 'design' },
			{ n: 'Compound components & Context-based APIs', p: 'high', type: 'design' },
			{ n: 'Performance - memo, virtualization, avoiding re-renders', p: 'must', type: 'design' },
			{ n: 'React Query / SWR - caching, stale-while-revalidate', p: 'high', type: 'concept' },
			{ n: 'SSR vs SSG vs CSR trade-offs (Next.js)', p: 'high', type: 'design' },
			{ n: 'Prop drilling - when it becomes a problem & solutions', p: 'high', type: 'concept' }
		]
	},
	{
		id: 'typescript',
		label: 'TypeScript',
		cat: 'ts',
		topics: [
			{ n: 'type vs interface - key differences & when to use', p: 'must', type: 'concept' },
			{ n: 'Generics - constraints, defaults, infer', p: 'must', type: 'code' },
			{ n: 'Utility types - Partial, Required, Pick, Omit, Record', p: 'must', type: 'code' },
			{ n: 'Union & intersection types - discriminated unions', p: 'must', type: 'concept' },
			{ n: 'any vs unknown vs never - type safety implications', p: 'must', type: 'gotcha' },
			{ n: 'Type narrowing - typeof, instanceof, in, custom guards', p: 'high', type: 'concept' },
			{ n: 'Mapped types & conditional types', p: 'high', type: 'concept' },
			{ n: 'Declaration merging & module augmentation', p: 'med', type: 'concept' },
			{ n: 'Strict mode flags - what each enforces', p: 'med', type: 'concept' }
		]
	},
	{
		id: 'css-html',
		label: 'CSS & HTML',
		cat: 'css',
		topics: [
			{ n: 'Specificity - calculation, !important pitfalls', p: 'must', type: 'gotcha' },
			{ n: 'Box model - content/padding/border/margin', p: 'must', type: 'concept' },
			{ n: 'Flexbox vs Grid - when to use which', p: 'must', type: 'concept' },
			{ n: 'CSS Grid - areas, auto-fill vs auto-fit, minmax', p: 'high', type: 'code' },
			{ n: 'Responsive design - media queries, container queries', p: 'must', type: 'concept' },
			{ n: 'Pseudo-classes vs pseudo-elements', p: 'high', type: 'concept' },
			{ n: 'CSS custom properties (variables) & theming', p: 'high', type: 'concept' },
			{ n: 'SCSS - nesting, mixins, functions, extends', p: 'med', type: 'concept' },
			{ n: 'Stacking context & z-index gotchas', p: 'high', type: 'gotcha' },
			{ n: 'Semantic HTML - why it matters, SEO & a11y', p: 'must', type: 'concept' },
			{ n: 'HTML meta tags - viewport, OG, charset', p: 'med', type: 'concept' },
			{ n: 'Accessibility - ARIA roles, focus management', p: 'high', type: 'concept' }
		]
	},
	{
		id: 'performance-tooling',
		label: 'Performance & tooling',
		cat: 'perf',
		topics: [
			{ n: 'Core Web Vitals - LCP, FID/INP, CLS', p: 'must', type: 'concept' },
			{ n: 'Browser rendering pipeline - parse, layout, paint, composite', p: 'must', type: 'concept' },
			{ n: 'Webpack - loaders, plugins, tree shaking, code splitting', p: 'high', type: 'concept' },
			{ n: 'Vite vs Webpack - how Vite\'s ESM dev server works', p: 'high', type: 'concept' },
			{ n: 'Lazy loading - images, routes, components', p: 'high', type: 'concept' },
			{ n: 'Virtualization - react-window, when/why', p: 'high', type: 'concept' },
			{ n: 'Security - XSS, CSRF, CORS, CSP headers', p: 'must', type: 'concept' },
			{ n: 'HTTP methods & REST constraints', p: 'must', type: 'concept' },
			{ n: 'web app performance', p: 'must', type: 'concept' }
		]
	},
	{
		id: 'testing',
		label: 'Testing',
		cat: 'test',
		topics: [
			{ n: 'Jest - mocking, spies, timers, module mocks', p: 'must', type: 'concept' },
			{ n: 'React Testing Library - queries, user-event, philosophy', p: 'must', type: 'concept' },
			{ n: 'RTL vs Enzyme - why RTL won', p: 'high', type: 'concept' },
			{ n: 'Snapshot testing - when useful, when harmful', p: 'high', type: 'concept' },
			{ n: 'Testing async code - waitFor, findBy, act()', p: 'must', type: 'code' },
			{ n: 'Testing custom hooks - renderHook', p: 'high', type: 'code' },
			{ n: 'MSW (Mock Service Worker) - intercepting at network level', p: 'high', type: 'concept' },
			{ n: 'E2E testing - Playwright / Cypress philosophy', p: 'med', type: 'concept' }
		]
	},
	{
		id: 'react-angular',
		label: 'React vs Angular',
		cat: 'angular',
		topics: [
			{ n: 'React vs Angular - architecture & philosophy', p: 'must', type: 'concept' },
			{ n: 'React hooks vs Angular lifecycle & services', p: 'must', type: 'concept' },
			{ n: 'Popular design patterns with examples', p: 'high', type: 'design' },
			{ n: 'Senior React expert interview prep', p: 'must', type: 'concept' },
			{ n: 'Senior React expert mock interview', p: 'high', type: 'concept' },
			{ n: 'CV alignment checklist', p: 'high', type: 'concept' },
			{ n: '90-second intro pitch', p: 'med', type: 'concept' }
		]
	},
	{
		id: 'practical-js',
		label: 'Practical JavaScript',
		cat: 'js',
		topics: [
			{ n: 'Array & Object practice', p: 'high', type: 'code' },
			{ n: 'Part 1 - JavaScript fundamentals', p: 'must', type: 'concept' },
			{ n: 'Part 2 - TypeScript & React', p: 'must', type: 'concept' },
			{ n: 'Part 3 - Data structures & algorithms', p: 'high', type: 'code' }
		]
	},
	{
		id: 'system-design',
		label: 'System Design',
		cat: 'design',
		topics: [
			{ n: 'Frontend architecture - SPA vs MPA vs MFE', p: 'must', type: 'design' },
			{ n: 'Design a URL shortener', p: 'must', type: 'design' },
			{ n: 'Design a real-time chat system', p: 'must', type: 'design' },
			{ n: 'Design a news feed / social timeline', p: 'must', type: 'design' },
			{ n: 'Design a type-ahead / autocomplete', p: 'high', type: 'design' },
			{ n: 'Design a rate limiter', p: 'high', type: 'design' },
			{ n: 'CDN and caching strategies', p: 'high', type: 'concept' },
			{ n: 'API design - REST vs GraphQL vs tRPC', p: 'must', type: 'concept' },
			{ n: 'Authentication & authorisation patterns', p: 'must', type: 'concept' },
			{ n: 'Observability - logging, metrics, tracing', p: 'high', type: 'concept' },
			{ n: 'Database selection - SQL vs NoSQL trade-offs', p: 'high', type: 'concept' },
			{ n: 'Scalability patterns - horizontal vs vertical scaling', p: 'high', type: 'design' }
		]
	}
];

const EXISTING_ASSET_MAP: Record<string, TopicAsset[]> = {
	'js-core/hoisting-var-vs-let-vs-const-tdz': [
		{ label: 'Notes', type: 'markdown', path: '/content/js-core/hoisting-var-vs-let-vs-const-tdz/notes.md' },
		{ label: 'Code', type: 'code', path: '/content/js-core/hoisting-var-vs-let-vs-const-tdz/example.js' }
	],
	'js-core/closure-scope-chain': [
		{ label: 'Notes', type: 'markdown', path: '/content/js-core/closure-scope-chain/notes.md' },
		{ label: 'Code', type: 'code', path: '/content/js-core/closure-scope-chain/example.js' }
	],
	'js-core/event-loop-call-stack-microtask-macrotask': [
		{ label: 'Notes', type: 'markdown', path: '/content/js-core/event-loop-call-stack-microtask-macrotask/notes.md' },
		{ label: 'Assessment', type: 'html', path: '/content/js-core/event-loop-call-stack-microtask-macrotask/assessment.html' }
	],
	'async-js/promises-states-chaining-combinators': [
		{ label: 'Promise fundamentals', type: 'code', path: '/content/async-js/promises-states-chaining-combinators/promise.js' },
		{ label: 'Promise prototype', type: 'code', path: '/content/async-js/promises-states-chaining-combinators/promise-prototype.js' }
	],
	'async-js/microtask-queue-output-prediction': [
		{ label: 'Runtime order', type: 'code', path: '/content/async-js/async-microtask-prediction/runtime-01-microtask-order.js' },
		{ label: 'queueMicrotask', type: 'code', path: '/content/async-js/async-microtask-prediction/queueMicrotask.js' }
	],
	'async-js/promise-all-vs-allsettled-vs-race-vs-any': [
		{ label: 'all vs allSettled', type: 'code', path: '/content/async-js/promise-all-vs-allsettled-vs-race-vs-any/combinators-01-all-vs-allSettled.js' },
		{ label: 'race', type: 'code', path: '/content/async-js/promise-all-vs-allsettled-vs-race-vs-any/combinators-02-race-timeout.js' },
		{ label: 'any', type: 'code', path: '/content/async-js/promise-all-vs-allsettled-vs-race-vs-any/combinators-03-any-replicas.js' }
	],
	'async-js/implement-retrywithbackoff': [
		{ label: 'retryWithBackoff', type: 'code', path: '/content/async-js/implement-retrywithbackoff/patterns-02-retry-backoff.js' }
	],
	'async-js/concurrency-limiter-n-at-a-time': [
		{ label: 'Concurrency limiter', type: 'code', path: '/content/async-js/concurrency-limiter-n-at-a-time/patterns-01-concurrency-limit.js' }
	],
	'react-hooks/usestate-batching-functional-updates-stale-closure': [
		{ label: 'Notes', type: 'markdown', path: '/content/react-hooks/usestate-batching-functional-updates-stale-closure/notes.md' },
		{ label: 'Assessment', type: 'html', path: '/content/react-hooks/usestate-batching-functional-updates-stale-closure/assessment.html' }
	],
	'react-hooks/useeffect-deps-array-cleanup-common-mistakes': [
		{ label: 'Notes', type: 'markdown', path: '/content/react-hooks/useeffect-deps-array-cleanup-common-mistakes/notes.md' },
		{ label: 'Assessment', type: 'html', path: '/content/react-hooks/useeffect-deps-array-cleanup-common-mistakes/assessment.html' }
	],
	'react-hooks/usememo-vs-usecallback-when-each-actually-helps': [
		{ label: 'Notes', type: 'markdown', path: '/content/react-hooks/usememo-vs-usecallback-when-each-actually-helps/notes.md' }
	],
	'react-hooks/custom-hooks-design-patterns-rules-of-hooks': [
		{ label: 'Notes', type: 'markdown', path: '/content/react-hooks/custom-hooks-design-patterns-rules-of-hooks/notes.md' }
	],
	'react-patterns-architecture/hoc-vs-custom-hook-vs-render-props': [
		{ label: 'Assessment', type: 'html', path: '/content/react-patterns-architecture/hoc-vs-custom-hook-vs-render-props/assessment.html' }
	],
	'react-patterns-architecture/code-splitting-react-lazy-suspense-dynamic-import': [
		{ label: 'Assessment', type: 'html', path: '/content/react-patterns-architecture/code-splitting-react-lazy-suspense-dynamic-import/assessment.html' }
	],
	'react-patterns-architecture/micro-frontend-architecture': [
		{ label: 'Assessment', type: 'html', path: '/content/react-patterns-architecture/micro-frontend-architecture/assessment.html' }
	],
	'react-patterns-architecture/compound-components-context-based-apis': [
		{ label: 'Notes', type: 'markdown', path: '/content/react-patterns-architecture/compound-components-context-based-apis/notes.md' },
		{ label: 'Assessment', type: 'html', path: '/content/react-patterns-architecture/compound-components-context-based-apis/assessment.html' }
	],
	'react-patterns-architecture/performance-memo-virtualization-avoiding-re-renders': [
		{ label: 'Best practices', type: 'markdown', path: '/content/react-patterns-architecture/performance-memo-virtualization-avoiding-re-renders/best-practices.md' },
		{ label: 'Revision sheet', type: 'markdown', path: '/content/react-patterns-architecture/performance-memo-virtualization-avoiding-re-renders/revision-sheet.md' },
		{ label: 'Flashcards', type: 'csv', path: '/content/react-patterns-architecture/performance-memo-virtualization-avoiding-re-renders/flashcards.csv' }
	],
	'react-patterns-architecture/state-management-usestate-usereducer-context-redux': [
		{ label: 'Patterns reference', type: 'markdown', path: '/content/react-patterns-architecture/state-management-usestate-usereducer-context-redux/popular-design-patterns.md' },
		{ label: 'React vs Angular', type: 'markdown', path: '/content/react-patterns-architecture/state-management-usestate-usereducer-context-redux/react-vs-angular.md' }
	],
	'react-angular/react-vs-angular-architecture-philosophy': [
		{ label: 'Notes', type: 'markdown', path: '/content/react-angular/react-vs-angular/notes.md' }
	],
	'react-angular/react-hooks-vs-angular-lifecycle-services': [
		{ label: 'Notes', type: 'markdown', path: '/content/react-angular/react-hooks-vs-angular/notes.md' }
	],
	'react-angular/popular-design-patterns-with-examples': [
		{ label: 'Notes', type: 'markdown', path: '/content/react-angular/popular-design-patterns-with-examples/notes.md' }
	],
	'react-angular/senior-react-expert-interview-prep': [
		{ label: 'Notes', type: 'markdown', path: '/content/react-angular/scor-rup-react-expert-interview-prep/notes.md' }
	],
	'react-angular/senior-react-expert-mock-interview': [
		{ label: 'Notes', type: 'markdown', path: '/content/react-angular/scor-rup-react-expert-mock-interview/notes.md' }
	],
	'react-angular/cv-alignment-checklist': [
		{ label: 'Notes', type: 'markdown', path: '/content/react-angular/scor-rup-cv-alignment-checklist/notes.md' }
	],
	'react-angular/90-second-intro-pitch': [
		{ label: 'Notes', type: 'markdown', path: '/content/react-angular/scor-rup-90-second-intro/notes.md' }
	],
	'practical-js/array-object-practice': [
		{ label: 'Practice problems', type: 'markdown', path: '/content/practical-js/array-object-practice.md' }
	],
	'practical-js/part-1-javascript-fundamentals': [
		{ label: 'Notes', type: 'markdown', path: '/content/practical-js/part1-javascript.md' }
	],
	'practical-js/part-2-typescript-react': [
		{ label: 'Notes', type: 'markdown', path: '/content/practical-js/part2-typescript-react.md' }
	],
	'practical-js/part-3-data-structures-algorithms': [
		{ label: 'Notes', type: 'markdown', path: '/content/practical-js/part3-dsa.md' }
	]
};

const REQUIRED_ASSET_TYPES: TopicAssetType[] = ['markdown', 'html', 'code', 'csv'];

function buildGeneratedAssets(slug: string, existingAssets: TopicAsset[]): TopicAsset[] {
	const existingTypes = new Set(existingAssets.map((asset) => asset.type));
	const generatedAssets: TopicAsset[] = [];

	for (const type of REQUIRED_ASSET_TYPES) {
		if (existingTypes.has(type)) {
			continue;
		}

		if (type === 'markdown') {
			generatedAssets.push({
				label: 'Generated notes',
				type: 'markdown',
				path: `/content/${slug}/notes-generated.md`
			});
			continue;
		}

		if (type === 'html') {
			generatedAssets.push({
				label: 'Generated assessment',
				type: 'html',
				path: `/content/${slug}/assessment-generated.html`
			});
			continue;
		}

		if (type === 'code') {
			generatedAssets.push({
				label: 'Generated code drill',
				type: 'code',
				path: `/content/${slug}/example-generated.js`
			});
			continue;
		}

		generatedAssets.push({
			label: 'Generated flashcards',
			type: 'csv',
			path: `/content/${slug}/flashcards-generated.csv`
		});
	}

	return generatedAssets;
}

function slugify(value: string): string {
	return value
		.toLowerCase()
		.replace(/\(.*?\)/g, '')
		.replace(/[']/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export const TOPIC_CATEGORIES: TopicCategory[] = RAW_DATA.map((category) => ({
	id: category.id,
	label: category.label,
	cat: category.cat,
	topics: category.topics.map((topic) => {
		const slug = `${category.id}/${slugify(topic.n)}`;
		const explicitAssets = EXISTING_ASSET_MAP[slug] ?? [];
		const assets = [...explicitAssets, ...buildGeneratedAssets(slug, explicitAssets)];
		return {
			slug,
			title: topic.n,
			priority: topic.p,
			type: topic.type,
			assets,
			missing: false
		};
	})
}));

export const ALL_TOPICS: Topic[] = TOPIC_CATEGORIES.flatMap((category) => category.topics);
export const TOPIC_BY_SLUG: Record<string, Topic> = Object.fromEntries(
	ALL_TOPICS.map((topic) => [topic.slug, topic])
);
export const CATEGORY_BY_ID: Record<string, TopicCategory> = Object.fromEntries(
	TOPIC_CATEGORIES.map((category) => [category.id, category])
);

export const TOTAL_TOPICS = ALL_TOPICS.length;
export const MUST_KNOW_TOPICS = ALL_TOPICS.filter((topic) => topic.priority === 'must').length;
