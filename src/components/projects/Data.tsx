import { ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

// Enhanced project content array with all projects
const PROJECT_CONTENT = [
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
  const projectData = PROJECT_CONTENT.find((p) => p.title === project.title);
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

// Main export with updated categories
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
