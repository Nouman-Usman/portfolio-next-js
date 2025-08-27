import { ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import type { RepoMeta } from '@/types/github';

// Export card shape used by carousel
export type ProjectCard = {
	category: string;
	title: string;
	src: string;
	content: React.ReactNode;
};

// Static project content array
export const STATIC_PROJECT_CONTENT = [
	{
		title: 'Virtual Shark Tank Pakistan',
		description:
			'A real-time virtual pitching platform with AI-powered “shark” investors and human feedback, supporting both English and Urdu. Features low-latency video/audio streaming, AI-driven questioning using LangChain + OpenAI, and real-time chat & session management.',
		techStack: ['Next.js', 'WebRTC', 'Node.js', 'LangChain', 'OpenAI', 'Socket.io'],
		date: '2025',
		links: [
			{
				name: 'GitHub',
				url: 'https://github.com/Nouman-Usman', // replace with actual repo link if public
			},
		],
		images: [
			{ src: '/virtualsharktank1.png', alt: 'Virtual Shark Tank pitching session' },
			{ src: '/virtualsharktank2.png', alt: 'AI-powered shark interface' },
		],
	},
	{
		title: 'Legal Case Management',
		description:
			'A case management web app for tracking legal details with Google Calendar API integration, Twilio SMS reminders, and a responsive UI. Built with clean coding practices using TypeScript, ESLint, and Tailwind.',
		techStack: ['Next.js', 'TypeScript', 'Appwrite', 'Docker', 'LangGraph', 'OpenAI', 'TailwindCSS'],
		date: '2025',
		links: [
			{
				name: 'Demo',
				url: '#', // placeholder
			},
		],
		images: [
			{ src: '/legalcase1.png', alt: 'Case management dashboard' },
			{ src: '/legalcase2.png', alt: 'Calendar integration' },
		],
	},
	{
		title: 'Phishing-Hack Toolkit',
		description:
			'An open-source phishing simulation toolkit for AI evaluation and red teaming. Features CLI-based payload generation, credential harvesting scenarios, and automated logging to test phishing detection systems.',
		techStack: ['Python', 'CLI', 'Security Testing', 'AI Evaluation'],
		date: '2025',
		links: [
			{
				name: 'GitHub',
				url: 'https://github.com/Nouman-Usman', // replace with repo if public
			},
		],
		images: [
			{ src: '/phishinghack1.png', alt: 'CLI simulation workflow' },
			{ src: '/phishinghack2.png', alt: 'Attack scenario logs' },
		],
	},
	{
		title: 'EcoBarter AI',
		description:
			'A community-driven trading platform promoting sustainable exchange. Features auto product listings with vision models, AI-powered negotiation chat with LLMs, and smart matching logic for compatible trades.',
		techStack: ['Next.js 14', 'TailwindCSS', 'Shadcn/ui', 'LangChain', 'Vision Models'],
		date: '2024',
		links: [
			{
				name: 'Demo',
				url: '#',
			},
		],
		images: [
			{ src: '/ecobarter1.png', alt: 'EcoBarter marketplace interface' },
			{ src: '/ecobarter2.png', alt: 'AI negotiation chat' },
		],
	},
];

// Define interface for project prop (unchanged)
interface ProjectProps {
	title: string;
	description?: string;
	techStack?: string[];
	date?: string;
	links?: { name: string; url: string }[];
	images?: { src: string; alt: string }[];
}

const ProjectContent = ({ project }: { project: ProjectProps }) => {
	const projectData = STATIC_PROJECT_CONTENT.find((p) => p.title === project.title);
	if (!projectData) {
		return <div>Project details not available</div>;
	}

	return (
		<div className="space-y-10">
			{/* Header */}
			<div className="rounded-3xl bg-[#F5F5F7] p-8 dark:bg-[#1D1D1F]">
				<div className="space-y-6">
					<div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
						<span>{projectData.date}</span>
					</div>
					<p className="text-secondary-foreground font-sans text-base leading-relaxed md:text-lg">
						{projectData.description}
					</p>
					{/* Tech stack */}
					<div className="pt-4">
						<h3 className="mb-3 text-sm tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
							Technologies
						</h3>
						<div className="flex flex-wrap gap-2">
							{projectData.techStack.map((tech, index) => (
								<span
									key={index}
									className="rounded-full bg-neutral-200 px-3 py-1 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
								>
									{tech}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Links */}
			{projectData.links && projectData.links.length > 0 && (
				<div className="mb-24">
					<div className="px-6 mb-4 flex items-center gap-2">
						<h3 className="text-sm tracking-wide text-neutral-500 dark:text-neutral-400">
							Links
						</h3>
						{/* Removed invalid Link component */}
					</div>
					<Separator className="my-4" />
					<div className="space-y-3">
						{projectData.links.map((link, index) => (
							<a
								key={index}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className="group bg-[#F5F5F7] flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-[#E5E5E7] dark:bg-neutral-800 dark:hover:bg-neutral-700"
							>
								<span className="font-light capitalize">{link.name}</span>
								<ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
							</a>
						))}
					</div>
				</div>
			)}

			{/* Images */}
			{projectData.images && projectData.images.length > 0 && (
				<div className="space-y-6">
					<div className="grid grid-cols-1 gap-4">
						{projectData.images.map((image, index) => (
							<div
								key={index}
								className="relative aspect-video overflow-hidden rounded-2xl"
							>
								<Image
									src={image.src}
									alt={image.alt}
									fill
									className="object-cover transition-transform"
								/>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

// Map a GitHub repo object to a "card" shape compatible with existing Carousel/Card usage
function mapRepoToCard(repo: RepoMeta): ProjectCard {
	const title = repo.full_name || repo.name || 'unknown';
	const description = repo.description || 'No description';
	const language = repo.language || '';
	const topics = Array.isArray(repo.topics) ? repo.topics : [];
	const preview = repo.owner?.avatar_url || '/virtualsharktank_preview.png';

	const content = (
		<div className="space-y-6">
			<div className="rounded-3xl bg-[#F5F5F7] p-6 dark:bg-[#1D1D1F]">
				<div>
					<div className="flex items-center justify-between">
						<div className="text-sm text-neutral-500 dark:text-neutral-400">
							{new Date(repo.pushed_at || repo.updated_at || Date.now()).getFullYear()}
						</div>
						<a
							href={repo.html_url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-blue-600 dark:text-blue-400"
						>
							View on GitHub
						</a>
					</div>
					<p className="mt-3 text-secondary-foreground text-base leading-relaxed md:text-lg">
						{description}
					</p>

					<div className="pt-4">
						<h3 className="mb-3 text-sm tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
							Technologies
						</h3>
						<div className="flex flex-wrap gap-2">
							{language && (
								<span className="rounded-full bg-neutral-200 px-3 py-1 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
									{language}
								</span>
							)}
							{topics.slice(0, 6).map((t: string, i: number) => (
								<span
									key={i}
									className="rounded-full bg-neutral-200 px-3 py-1 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
								>
									{t}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	return {
		category: 'GitHub',
		title,
		src: preview,
		content,
	};
}

// Return combined array: GitHub-derived cards first (optional position filter), then static cards
export async function getCombinedProjects(position?: string, limit = 12) {
	try {
		// Only return GitHub-derived cards (dynamic projects)
		const ghCards = await fetchGithubProjects(position, limit);
		return ghCards;
	} catch (_err) {
		// On error return empty list (no static projects)
		return [];
	}
}

// Fetch GitHub repos from your server route and return them mapped to card entries
export async function fetchGithubProjects(position?: string, limit = 12): Promise<ProjectCard[]> {
	try {
		const q = position ? `?position=${encodeURIComponent(position)}&per_page=${limit}` : `?per_page=${limit}`;
		const res = await fetch(`/api/github/repos${q}`);
		if (!res.ok) {
			return [];
		}
		const repos = await res.json();
		if (!Array.isArray(repos)) return [];
		return (repos as RepoMeta[]).slice(0, limit).map(mapRepoToCard);
	} catch (_err) {
		return [];
	}
}

// Export the original combined "data" shape for backward compatibility (static entries)
export const data = [
	{
		category: 'AI SaaS',
		title: 'Virtual Shark Tank Pakistan',
		src: '/virtualsharktank_preview.png',
		content: <ProjectContent project={{ title: 'Virtual Shark Tank Pakistan' }} />,
	},
	{
		category: 'Legal Tech',
		title: 'Legal Case Management',
		src: '/legalcase_preview.png',
		content: <ProjectContent project={{ title: 'Legal Case Management' }} />,
	},
	{
		category: 'Security & AI',
		title: 'Phishing-Hack Toolkit',
		src: '/phishinghack_preview.png',
		content: <ProjectContent project={{ title: 'Phishing-Hack Toolkit' }} />,
	},
	{
		category: 'Sustainability',
		title: 'EcoBarter AI',
		src: '/ecobarter_preview.png',
		content: <ProjectContent project={{ title: 'EcoBarter AI' }} />,
	},
];
