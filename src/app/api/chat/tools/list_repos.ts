export type RepoQuery = {
	visibility?: 'all' | 'public' | 'private';
	affiliation?: string; // e.g. "owner,collaborator,organization_member"
	type?: 'all' | 'public' | 'private' | 'forks' | 'sources' | 'member';
	sort?: 'created' | 'updated' | 'pushed' | 'full_name';
	direction?: 'asc' | 'desc';
	per_page?: number;
	page?: number;
};

// Simple query-string builder for allowed params
function buildQuery(params?: RepoQuery) {
	if (!params) return '';
	const parts: string[] = [];
	for (const [k, v] of Object.entries(params)) {
		if (v === undefined || v === null) continue;
		parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
	}
	return parts.length ? `?${parts.join('&')}` : '';
}

async function ghFetch(token: string, url: string) {
	const res = await fetch(url, {
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${token}`,
			'X-GitHub-Api-Version': '2022-11-28',
		},
	});
	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(`GitHub API error ${res.status} ${res.statusText}: ${text}`);
	}
	return res.json();
}

/**
 * List repositories accessible to the authenticated user.
 * Example: await listUserRepos(process.env.GH_TOKEN, { visibility: 'all', per_page: 50 });
 */
export async function listUserRepos(token: string, params?: RepoQuery) {
	const q = buildQuery(params);
	const url = `https://api.github.com/user/repos${q}`;
	return ghFetch(token, url);
}

/**
 * List repositories for an organization.
 * Example: await listOrgRepos(process.env.GH_TOKEN, 'my-org', { type: 'all', per_page: 100 });
 */
export async function listOrgRepos(token: string, org: string, params?: RepoQuery) {
	if (!org) throw new Error('org is required');
	const q = buildQuery(params);
	const url = `https://api.github.com/orgs/${encodeURIComponent(org)}/repos${q}`;
	return ghFetch(token, url);
}

/**
 * List repositories accessible to a GitHub App installation.
 * Note: token should be an installation access token.
 * Example: await listInstallationRepos(process.env.INSTALL_TOKEN, { per_page: 100 });
 */
export async function listInstallationRepos(token: string, params?: RepoQuery) {
	const q = buildQuery(params);
	const url = `https://api.github.com/installation/repositories${q}`;
	return ghFetch(token, url);
}