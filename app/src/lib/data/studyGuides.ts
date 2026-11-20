export const STUDY_GUIDES = [
	{ slug: 'javascript-1', subject: 'JavaScript', title: 'JavaScript Study Guide 1' },
	{ slug: 'javascript-2', subject: 'JavaScript', title: 'JavaScript Study Guide 2' },
	{ slug: 'typescript', subject: 'TypeScript', title: 'TypeScript Study Guide' },
	{ slug: 'react-core', subject: 'React and Next.js', title: 'React Core Study Guide' },
	{ slug: 'react-ecosystem', subject: 'React and Next.js', title: 'React Ecosystem Study Guide' },
	{ slug: 'nextjs', subject: 'React and Next.js', title: 'Next.js and Rendering Study Guide' },
	{ slug: 'angular', subject: 'Angular', title: 'Angular Study Guide' },
	{ slug: 'html', subject: 'HTML', title: 'HTML Interview Study Guide' },
	{ slug: 'css', subject: 'CSS', title: 'CSS Interview Study Guide' },
	{ slug: 'css-part-5-scss-and-frameworks', subject: 'CSS', title: 'CSS Study Guide Part 5' },
	{ slug: 'browser-and-build', subject: 'Web Platform', title: 'Browser, Tooling and Build Study Guide' },
	{ slug: 'performance-and-pwa', subject: 'Web Platform', title: 'Performance and PWA Study Guide' },
	{ slug: 'web-protocols-and-security', subject: 'Web Platform', title: 'Web Protocols and Security Study Guide' },
	{ slug: 'java-for-frontend', subject: 'Backend and Languages', title: 'Java for Frontend Developers Study Guide' },
	{ slug: 'node-and-databases', subject: 'Backend and Languages', title: 'Node, Databases and Supabase Study Guide' },
	{ slug: 'architecture-and-devops', subject: 'Architecture and Leadership', title: 'Architecture, Deployment and DevOps Study Guide' },
	{ slug: 'design-systems-and-patterns', subject: 'Architecture and Leadership', title: 'Design Systems and Patterns Study Guide' },
	{ slug: 'engineering-practices-and-gen-ai', subject: 'Architecture and Leadership', title: 'Engineering Practices, Process and Gen AI Study Guide' },
	{ slug: 'leadership-and-team-development', subject: 'Leadership and Team Development', title: 'L4 Leadership and Team Development Guide' }
] as const;

export type StudyGuide = (typeof STUDY_GUIDES)[number];

export const STUDY_GUIDE_SUBJECTS = [...new Set(STUDY_GUIDES.map((guide) => guide.subject))];