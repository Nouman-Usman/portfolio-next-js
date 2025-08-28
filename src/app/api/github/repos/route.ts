import { listUserRepos } from '@/app/api/chat/tools/list_repos';
import type { RepoMeta } from '@/types/github';
import type { RepoQuery } from '@/app/api/chat/tools/list_repos';

function buildKeywordsForPosition(position?: string) {
	if (!position) return [];
	const p = position.toLowerCase();
	const tokens = p.split(/[\s,_\-]+/).filter(Boolean);
	const keywords = new Set<string>(tokens);

	// Add role-specific synonyms for common roles (extend as needed)
	if (p.includes('ai') || p.includes('machine') || p.includes('learning') || p.includes('ml')) {
		[
			'ai', 'ml', 'machine', 'learning', 'machine learning', 'deep', 'deep learning',
			'pytorch', 'tensorflow', 'keras', 'scikit', 'scikit-learn', 'neural', 'neural network',
			'nlp', 'natural language', 'computer vision', 'cv', 'vision', 'model', 'inference',
			'dataset', 'data', 'analytics', 'training', 'fine-tune', 'embedding',
		].forEach((k) => keywords.add(k));
	}

	return Array.from(keywords);
}

function scoreRepoByKeywords(repo: RepoMeta, keywords: string[]) {
	if (!keywords.length) return 0;
	let score = 0;
	const textFields = [
		(String(repo.name || '')).toLowerCase(),
		(String(repo.full_name || '')).toLowerCase(),
		(String(repo.description || '')).toLowerCase(),
		(String(repo.language || '')).toLowerCase(),
	];

	// topics can be array
	const topics = Array.isArray(repo.topics) ? repo.topics.map((t: string) => String(t).toLowerCase()) : [];

	for (const kw of keywords) {
		const k = kw.toLowerCase();
		// exact topic match is strong
		if (topics.includes(k)) score += 6;
		// language match is strong
		if (textFields[3] && textFields[3] === k) score += 4;
		// name/full_name matches boost
		if (textFields[0].includes(k) || textFields[1].includes(k)) score += 3;
		// description matches boost
		if (textFields[2].includes(k)) score += 5;
		// small bonus for owner/login/license etc
		if (repo.owner && String(repo.owner.login || '').toLowerCase().includes(k)) score += 1;
		if (repo.license && repo.license.name && String(repo.license.name).toLowerCase().includes(k)) score += 1;
	}

	// also reward popular repos slightly
	const stars = Number(repo.stargazers_count || 0);
	score += Math.min(Math.floor(stars / 50), 5); // +1 per 50 stars up to +5

	return score;
}

// New helper: fetch README and extract first markdown image and first meaningful paragraph
async function fetchReadmeInfo(owner: string, name: string) {
	// try common branches
	const branches = ['main', 'master', 'gh-pages'];
	for (const branch of branches) {
		try {
			const rawUrl = `https://raw.githubusercontent.com/${owner}/${name}/${branch}/README.md`;
			const res = await fetch(rawUrl);
			if (!res.ok) continue;
			const md = await res.text();

			// first image
			const imgMatch = md.match(/!\[.*?\]\((.*?)\)/);
			let image = '';
			if (imgMatch && imgMatch[1]) {
				let src = imgMatch[1].trim();
				if (!/^https?:\/\//i.test(src)) {
					src = src.replace(/^\.?\/+/, '');
					image = `https://raw.githubusercontent.com/${owner}/${name}/${branch}/${src}`;
				} else {
					image = src;
				}
			}

			// strip images/badges/comments and take first paragraph
			const cleaned = md
				.replace(/!\[.*?\]\(.*?\)/g, '')
				.replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/g, '')
				.replace(/^\s*\[.*?\]:.*$/gm, '')
				.replace(/^\s*<!--[\s\S]*?-->\s*$/gm, '')
				.replace(/^\s*\[badge.*$/gim, '');

			const parts = cleaned
				.split(/\n\s*\n/)
				.map((p) => p.replace(/\r/g, '').trim())
				.filter(Boolean);

			const description = parts.length ? parts[0].replace(/\[(.*?)\]\((.*?)\)/g, '$1') : '';

			return { image, description };
		} catch {
			continue;
		}
	}
	return { image: '', description: '' };
}

// Simple Next.js Route Handler for GET /api/github/repos
export async function GET(req: Request) {
	// Server-only token (must be set in your environment)
	const token = process.env.GITHUB_TOKEN;
	if (!token) {
		return new Response(JSON.stringify({ error: 'GITHUB_TOKEN not set on server' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	// Forward query params (per_page, page, visibility, etc.) and read position if present
	const url = new URL(req.url);
	const paramsObj: Record<string, string> = {};
	url.searchParams.forEach((v, k) => (paramsObj[k] = v));
	const position = paramsObj['position'] ?? paramsObj['role'] ?? '';

	try {
		// reuse server helper to fetch repos
		const paramsTyped = (Object.keys(paramsObj).length ? (paramsObj as unknown as RepoQuery) : undefined);
		const repos: RepoMeta[] = await listUserRepos(token, paramsTyped);

		// map to metadata and optionally filter by position
		const keywords = buildKeywordsForPosition(position);

		// fetch README info for each repo in parallel (server-side) and attach to metadata
		const mappedPromises = repos.map(async (r) => {
			const md: RepoMeta = {
				id: r.id,
				name: r.name,
				full_name: r.full_name,
				html_url: r.html_url,
				description: r.description,
				private: r.private,
				visibility: r.visibility ?? (r.private ? 'private' : 'public'),
				fork: r.fork,
				language: r.language,
				topics: Array.isArray(r.topics) ? r.topics : [],
				stargazers_count: r.stargazers_count,
				forks_count: r.forks_count,
				open_issues_count: r.open_issues_count,
				watchers_count: r.watchers_count ?? 0,
				created_at: r.created_at,
				updated_at: r.updated_at,
				pushed_at: r.pushed_at,
				license: r.license ? { name: r.license.name, spdx_id: r.license.spdx_id } : null,
				owner: r.owner ? { login: r.owner.login, html_url: r.owner.html_url, avatar_url: r.owner.avatar_url } : null,
			};

			// compute score
			const score = keywords.length ? scoreRepoByKeywords(r, keywords) : 0;

			// try to enrich with README info (single-server fetch)
			let readmeImage = '';
			let readmeDescription = '';
			try {
				if (md.owner && md.owner.login && md.name) {
					const info = await fetchReadmeInfo(String(md.owner.login), String(md.name));
					readmeImage = info.image || '';
					readmeDescription = info.description || '';
				}
			} catch {
				// ignore readme errors
			}

			return { ...md, _score: score, readme_image: readmeImage, readme_description: readmeDescription };
		});

		const mapped = await Promise.all(mappedPromises);

		let result = mapped;
		if (keywords.length) {
			result = mapped.filter((m) => (m._score ?? 0) > 0)
				.sort((a, b) => {
					if ((b._score ?? 0) !== (a._score ?? 0)) return (b._score ?? 0) - (a._score ?? 0);
					return (b.stargazers_count || 0) - (a.stargazers_count || 0);
				});
		} else {
			result = mapped.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
		}

		return new Response(JSON.stringify(result), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err: unknown) {
		// Preserve useful error message for client debugging
		const msg = String(err);
		return new Response(JSON.stringify({ error: 'Failed to fetch repos', details: msg }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
