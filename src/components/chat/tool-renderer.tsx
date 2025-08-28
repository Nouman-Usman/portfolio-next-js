// src/components/chat/tool-renderer.tsx
import { Contact } from '../contact';
import Crazy from '../crazy';
import InternshipCard from '../InternshipCard';
import { Presentation } from '../presentation';
import AllProjects from '../projects/AllProjects';
import Resume from '../resume';
import Skills from '../skills';
import Sports from '../sport';
import { Card, Carousel } from "@/components/projects/apple-cards-carousel";
import { ChevronRight } from 'lucide-react';

interface ToolRendererProps {
  toolInvocations: any[];
  messageId: string;
}

// Helper function to extract position from tool invocation
function extractPositionFromTool(tool: any): string | undefined {
  try {
    // Try multiple locations where position might be stored
    if (tool.input?.position) return tool.input.position;
    if (tool.args?.position) return tool.args.position;
    if (tool.parameters?.position) return tool.parameters.position;
    
    // If tool.result is an object with text that mentions position
    if (typeof tool.result === 'object' && tool.result?.text) {
      const match = tool.result.text.match(/repositories relevant to ["']([^"']+)["']/i);
      if (match && match[1]) return match[1];
    }
    
    return undefined;
  } catch {
    return undefined;
  }
}

// Helper function to extract repos from tool invocation
function extractReposFromTool(tool: any): any[] | undefined {
  try {
    // Direct repos array
    if (Array.isArray(tool.result?.repos)) return tool.result.repos;
    
    // Plain array result
    if (Array.isArray(tool.result)) return tool.result;
    
    return undefined;
  } catch {
    return undefined;
  }
}

export default function ToolRenderer({
  toolInvocations,
  messageId,
}: ToolRendererProps) {
  return (
    <div className="w-full transition-all duration-300">
      {toolInvocations.map((tool) => {
        const { toolCallId, toolName } = tool;

        // Return specialized components based on tool name
        switch (toolName) {
          case 'getProjects': {
            // extract position from the tool invocation and pass it to AllProjects
            const position = extractPositionFromTool(tool) || undefined;

            // Try to get the raw repo list from the tool invocation with improved detection
            let initialRepos = extractReposFromTool(tool);

            // If initialRepos is still undefined but tool.result is a text list of repo names,
            // try to parse newline-separated "owner/repo" entries into minimal repo objects.
            if (!initialRepos && typeof tool.result === 'string') {
              const lines = tool.result
                .split('\n')
                .map((l: string) => l.trim())
                .filter(Boolean);
              const possible = lines
                .map((l: string) => {
                  const m = l.match(/([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)/);
                  if (m) {
                    return { full_name: m[1] };
                  }
                  return undefined;
                })
                .filter(Boolean);
              if (possible.length) initialRepos = possible as any[];
            }

            // If repos are available, render as cards
            if (Array.isArray(initialRepos) && initialRepos.length > 0) {
              return (
                <div key={toolCallId} className="w-full rounded-lg">
                  <AllProjects 
                    position={position} 
                    initialRepos={initialRepos} 
                  />
                </div>
              );
            }

            // Fallback to raw display if no repos
            return (
              <div className="bg-secondary/10 w-full rounded-lg p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-medium">{toolName}</h3>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-100">
                    Tool Result
                  </span>
                </div>
                <div className="mt-2">
                  {typeof tool.result === 'object' ? (
                    <pre className="bg-secondary/20 overflow-x-auto rounded p-3 text-sm">
                      {JSON.stringify(tool.result, null, 2)}
                    </pre>
                  ) : (
                    <p>{String(tool.result)}</p>
                  )}
                </div>
              </div>
            );
          }

          case 'getPresentation':
            return (
              <div
                key={toolCallId}
                className="w-full overflow-hidden rounded-lg"
              >
                <Presentation />
              </div>
            );

          case 'getResume':
            return (
              <div key={toolCallId} className="w-full rounded-lg">
                <Resume />
              </div>
            );

          case 'getContact':
            return (
              <div key={toolCallId} className="w-full rounded-lg">
                <Contact />
              </div>
            );

          case 'getSkills':
            return (
              <div key={toolCallId} className="w-full rounded-lg">
                <Skills />
              </div>
            );

          case 'getSports':
            return (
              <div key={toolCallId} className="w-full rounded-lg">
                <Sports />
              </div>
            );

          case 'getCrazy':
            return (
              <div key={toolCallId} className="w-full rounded-lg">
                <Crazy />
              </div>
            );

          case 'getInternship':
            return (
              <div key={toolCallId} className="w-full rounded-lg">
                <InternshipCard />
              </div>
            );

          default:
            return (
              <div
                key={toolCallId}
                className="bg-secondary/10 w-full rounded-lg p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-medium">{toolName}</h3>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-100">
                    Tool Result
                  </span>
                </div>
                <div className="mt-2">
                  {typeof tool.result === 'object' ? (
                    <pre className="bg-secondary/20 overflow-x-auto rounded p-3 text-sm">
                      {JSON.stringify(tool.result, null, 2)}
                    </pre>
                  ) : (
                    <p>{String(tool.result)}</p>
                  )}
                </div>
              </div>
            );
        }
      })}
    </div>
  );
}
