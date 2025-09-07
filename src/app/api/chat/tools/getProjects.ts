import { tool } from "ai";
import { z } from "zod";
import { listUserRepos } from "@/app/api/chat/tools/list_repos";
import type { RepoMeta } from "@/types/github";

export const getProjects = tool({
  description:
    "Return projects. If a position is provided, return repos relevant to that role.",
  parameters: z.object({
    position: z.string().optional(),
  }),
  execute: async ({ position }: { position?: string }) => {
    // If no position provided, ask the user for it so the chat flow stays inside the chat UI
    if (!position || !position.trim()) {
      return "Which job position are you looking for? (e.g. 'AI Engineer') — tell me the role and I'll show relevant projects.";
    }

    // Helper: build keyword set for given role (extend as needed)
    function buildKeywordsForPosition(p?: string) {
      if (!p) return [];
      const s = p.toLowerCase();
      const tokens = s.split(/[\s,_\-]+/).filter(Boolean);
      const keywords = new Set<string>(tokens);

      if (
        s.includes("ai") ||
        s.includes("machine") ||
        s.includes("learning") ||
        s.includes("ml")
      ) {
        [
          "ai",
          "ml",
          "machine",
          "learning",
          "machine learning",
          "deep",
          "deep learning",
          "pytorch",
          "tensorflow",
          "keras",
          "scikit",
          "scikit-learn",
          "neural",
          "neural network",
          "nlp",
          "natural language",
          "computer vision",
          "cv",
          "vision",
          "model",
          "inference",
          "dataset",
          "data",
          "analytics",
          "training",
          "fine-tune",
          "embedding",
        ].forEach((k) => keywords.add(k));
      }
      // add other role heuristics here if needed

      return Array.from(keywords);
    }

    function scoreRepoByKeywords(repo: RepoMeta, keywords: string[]) {
      if (!keywords.length) return 0;
      let score = 0;
      const name = String(repo.name || "").toLowerCase();
      const full = String(repo.full_name || "").toLowerCase();
      const desc = String(repo.description || "").toLowerCase();
      const lang = String(repo.language || "").toLowerCase();
      const topics = Array.isArray(repo.topics)
        ? repo.topics.map((t: string) => String(t).toLowerCase())
        : [];

      for (const kw of keywords) {
        const k = kw.toLowerCase();
        if (topics.includes(k)) score += 6;
        if (lang && lang === k) score += 4;
        if (name.includes(k) || full.includes(k)) score += 3;
        if (desc.includes(k)) score += 5;
        if (repo.owner && String(repo.owner.login || "").toLowerCase().includes(k))
          score += 1;
        if (repo.license && repo.license.name && String(repo.license.name).toLowerCase().includes(k))
          score += 1;
      }

      const stars = Number(repo.stargazers_count || 0);
      score += Math.min(Math.floor(stars / 50), 5);
      return score;
    }

    // Server-only: ensure token present and fetch user's repos via helper
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    if (!token) {
      return { text: "Server error: GITHUB_TOKEN not configured.", repos: [] };
    }

    try {
      // fetch up to 100 repos (adjust pagination as needed)
      const rawRepos: RepoMeta[] = await listUserRepos(token, { per_page: 100 });

      const keywords = buildKeywordsForPosition(position);
      const mapped = rawRepos.map((r) => {
        const md: RepoMeta = {
          id: r.id,
          name: r.name,
          full_name: r.full_name,
          html_url: r.html_url,
          description: r.description,
          private: r.private,
          visibility: r.visibility ?? (r.private ? "private" : "public"),
          fork: r.fork,
          language: r.language,
          topics: Array.isArray(r.topics) ? r.topics : [],
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          open_issues_count: r.open_issues_count,
          watchers_count: r.watchers_count,
          created_at: r.created_at,
          updated_at: r.updated_at,
          pushed_at: r.pushed_at,
          license: r.license ? { name: r.license.name, spdx_id: r.license.spdx_id } : null,
          owner: r.owner ? { login: r.owner.login, html_url: r.owner.html_url, avatar_url: r.owner.avatar_url } : null,
        };
        const score = keywords.length ? scoreRepoByKeywords(r as RepoMeta, keywords) : 0;
        return { ...md, _score: score };
      });

      let result = mapped;
      if (keywords.length) {
        result = mapped
          .filter((m) => (m._score ?? 0) > 0)
          .sort(
            (a, b) =>
              (b._score! - a._score!) ||
              ((b.stargazers_count || 0) - (a.stargazers_count || 0))
          );
      } else {
        result = mapped.sort(
          (a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)
        );
      }

      // Return structured data so the chat UI can render repo cards inline
      return {
        text: `Found ${result.length} repositories relevant to "${position}".`,
        repos: result,
      };
    } catch (err: unknown) {
      return { text: `Failed to fetch repositories: ${String(err)}`, repos: [] };
    }
  },
});