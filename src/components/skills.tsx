'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { useGitHubUsername } from '@/hooks/get_username';
import { fetchLinkedInProfile } from '@/hooks/use-linkedin';
import { useEffect, useState } from 'react';

// Define interface for categorized skills
interface CategorizedSkill {
  category: string;
  skills: string[];
}

const Skills = () => {
  const { username, loading, error, bio } = useGitHubUsername();
  const [linkedInData, setLinkedInData] = useState<any>(null);
  const [linkedInLoading, setLinkedInLoading] = useState<boolean>(true);
  const [linkedInError, setLinkedInError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLinkedIn() {
      try {
        setLinkedInLoading(true);
        // Using the standalone fetch function that doesn't rely on hooks
        const data = await fetchLinkedInProfile({
          profileUrl: process.env.NEXT_PUBLIC_LINKEDIN_PROFILE_URL || "https://www.linkedin.com/in/nouman-usman/",
          includeEmail: false
        });
        if (!cancelled) {
          setLinkedInData(data);
          console.log("LinkedIn Data loaded successfully:", data);
        }
      } catch (e: any) {
        if (!cancelled) {
          setLinkedInError(e?.message || 'Failed to load LinkedIn data');
          console.error("LinkedIn data fetch error:", e);
        }
      } finally {
        if (!cancelled) setLinkedInLoading(false);
      }
    }

    loadLinkedIn();
    return () => { cancelled = true; };
  }, []);
  
  const [linkedInSkills, setLinkedInSkills] = useState<CategorizedSkill[]>([]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };
  
  // Use the linkedInData from state instead of from hook
  useEffect(() => {
    if (linkedInData) {
      console.log("Processing LinkedIn data for skills");
      let rawSkills: string[] = [];
      
      // Extract skills directly if available
      if (linkedInData.skills && Array.isArray(linkedInData.skills)) {
        console.log("Found explicit skills array in LinkedIn data");
        rawSkills = linkedInData.skills.map((skill: any) => skill.name);
      } else {
        console.log("No explicit skills array found, extracting from other data");
        
        // Extract skills from experience
        if (linkedInData.experience && Array.isArray(linkedInData.experience)) {
          linkedInData.experience.forEach((exp: any) => {
            // Add job titles as skills
            if (exp.title) rawSkills.push(exp.title);
            
            // Add skills from experience descriptions
            if (exp.description) {
              const techWords = extractTechTerms(exp.description);
              rawSkills.push(...techWords);
            }
            
            // Add skills directly from experience if available
            if (exp.skills && Array.isArray(exp.skills)) {
              rawSkills.push(...exp.skills);
            }
          });
        }
        
        // Extract from certifications
        if (linkedInData.certifications && Array.isArray(linkedInData.certifications)) {
          linkedInData.certifications.forEach((cert: any) => {
            if (cert.name) rawSkills.push(cert.name);
            
            // Add skills directly from certifications if available
            if (cert.skills && Array.isArray(cert.skills)) {
              rawSkills.push(...cert.skills);
            }
          });
        }
        
        // Extract from education
        if (linkedInData.education && Array.isArray(linkedInData.education)) {
          linkedInData.education.forEach((edu: any) => {
            if (edu.field_of_study) rawSkills.push(edu.field_of_study);
          });
        }
        
        // Add headline terms
        if (linkedInData.basic_info && linkedInData.basic_info.headline) {
          const techWords = extractTechTerms(linkedInData.basic_info.headline);
          rawSkills.push(...techWords);
        }
        
        // Add about section terms
        if (linkedInData.basic_info && linkedInData.basic_info.about) {
          const techWords = extractTechTerms(linkedInData.basic_info.about);
          rawSkills.push(...techWords);
        }
      }
      
      // Filter and clean up skills
      rawSkills = rawSkills
        .filter(Boolean) // Remove empty items
        .map((skill: string) => skill.trim())
        .filter((skill: string) => skill.length > 1)
        .filter((skill: string, index: number, self: string[]) => 
          self.indexOf(skill) === index); // Remove duplicates
    
      console.log("Extracted skills:", rawSkills);
      
      const categorizedSkills = categorizeSkills(rawSkills);
      setLinkedInSkills(categorizedSkills);
      console.log("Categorized LinkedIn skills:", categorizedSkills);
    }
  }, [linkedInData]);
  
  const categorizeSkills = (skills: string[]): CategorizedSkill[] => {
    const categories: Record<string, string[]> = {
      'Frontend Development': [],
      'Backend & Systems': [],
      'AI & Machine Learning': [],
      'Programming Languages': [],
      'Frameworks & Libraries': [],
      'Design & Creative Tools': [],
      'Soft Skills': [],
      'Tools & Platforms': [],
      'Other Skills': []
    };

    // Categorization rules (simple pattern matching)
    const categoryPatterns: Record<string, RegExp[]> = {
      'Frontend Development': [
        /\b(HTML|CSS|JavaScript|TypeScript|React|Angular|Vue|Next\.js|Gatsby|jQuery|DOM|Bootstrap|Tailwind|Material-UI|Chakra UI|Frontend|UI|UX|Web Development|Responsive Design|SPAs)\b/i
      ],
      'Backend & Systems': [
        /\b(Node\.js|Express|Django|Flask|Spring|Laravel|Rails|ASP\.NET|PHP|Server|API|REST|GraphQL|Microservices|System Design|Architecture|Cloud|DevOps|CI\/CD)\b/i
      ],
      'AI & Machine Learning': [
        /\b(Machine Learning|ML|Deep Learning|AI|Artificial Intelligence|Neural Networks|NLP|Natural Language Processing|Computer Vision|Data Science|TensorFlow|PyTorch|Keras|scikit-learn|LLM|Large Language Models|RAG|Retrieval|Embeddings|Vector|Generative AI)\b/i
      ],
      'Programming Languages': [
        /\b(JavaScript|TypeScript|Python|Java|C#|C\+\+|C|PHP|Ruby|Go|Kotlin|Swift|Rust|SQL|R|Scala|Perl|Shell|Bash)\b/i
      ],
      'Frameworks & Libraries': [
        /\b(React|Angular|Vue|Next\.js|Gatsby|Express|Django|Flask|Spring|Laravel|Rails|ASP\.NET|jQuery|Bootstrap|Tailwind|Material-UI|Redux|LangChain|LlamaIndex)\b/i
      ],
      'Design & Creative Tools': [
        /\b(Figma|Sketch|Adobe XD|Photoshop|Illustrator|Canva|UI Design|UX Design|Wireframing|Prototyping|Unity|3D|Animation)\b/i
      ],
      'Soft Skills': [
        /\b(Leadership|Communication|Teamwork|Problem Solving|Critical Thinking|Time Management|Creativity|Adaptability|Collaboration|Presentation|Mentoring|Teaching|Training|Negotiation|Emotional Intelligence)\b/i
      ],
      'Tools & Platforms': [
        /\b(Git|GitHub|GitLab|Docker|Kubernetes|AWS|Azure|GCP|Google Cloud|Heroku|Netlify|Vercel|Jenkins|Jira|Confluence|Slack|Notion|Figma|Adobe|Photoshop|Illustrator|IntelliJ|VS Code|Visual Studio)\b/i
      ]
    };

    // Categorize each skill
    skills.forEach(skill => {
      let categorized = false;
      
      // Try to match against patterns
      for (const [category, patterns] of Object.entries(categoryPatterns)) {
        if (patterns.some(pattern => pattern.test(skill))) {
          categories[category].push(skill);
          categorized = true;
          break;
        }
      }
      
      // If no category matched, put in Other Skills
      if (!categorized) {
        categories['Other Skills'].push(skill);
      }
    });

    // Convert to the expected format and filter out empty categories
    return Object.entries(categories)
      .filter(([_, skillsList]) => skillsList.length > 0)
      .map(([category, skillsList]) => ({
        category,
        skills: skillsList
      }));
  };

  // Generate LinkedIn skills sections based on categorized data
  const linkedInSkillsSections = linkedInSkills.map((category, index) => ({
    category: category.category,
    icon: <Briefcase className="h-5 w-5" />,
    skills: category.skills,
    color: `bg-${getColorForIndex(index)}-50 text-${getColorForIndex(index)}-600 border border-${getColorForIndex(index)}-200`,
  }));

  // Helper function to get a color based on index
  function getColorForIndex(index: number): string {
    const colors = ['blue', 'emerald', 'purple', 'indigo', 'amber', 'rose', 'teal', 'sky', 'pink', 'lime'];
    return colors[index % colors.length];
  }

  // Helper function to extract technical terms from text
  const extractTechTerms = (text: string): string[] => {
    if (!text) return [];
    
    const techKeywords = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Angular', 'Vue', 
      'Node.js', 'Express', 'Django', 'Flask', 'Ruby', 'Rails', 'PHP', 'Laravel',
      'HTML', 'CSS', 'SCSS', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
      'C#', 'C++', 'Go', 'Rust', 'Swift', 'Kotlin', 'MongoDB', 'PostgreSQL', 
      'MySQL', 'Redis', 'GraphQL', 'REST API', 'CI/CD', 'Git', 'GitHub',
      'Machine Learning', 'Deep Learning', 'AI', 'Data Science', 'TensorFlow',
      'PyTorch', 'Keras', 'scikit-learn', 'NLP', 'Computer Vision',
      'DevOps', 'Agile', 'Scrum', 'UX', 'UI', 'Design', 'Frontend', 'Backend',
      'Full Stack', 'Mobile', 'iOS', 'Android', 'Cloud', 'Serverless',
      'Leadership', 'Management', 'Communication', 'Problem Solving'
    ];
    
    const foundTerms: string[] = [];
    for (const keyword of techKeywords) {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        foundTerms.push(keyword);
      }
    }
    
    return foundTerms;
  };

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="mx-auto w-full max-w-5xl rounded-4xl"
    >
      <Card className="w-full border-none px-0 pb-12 shadow-none">
        <CardHeader className="px-0 pb-1">
          <CardTitle className="text-primary px-0 text-4xl font-bold">
            Skills & Expertise
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          {linkedInLoading && (
            <div className="text-muted-foreground mb-4">Loading LinkedIn skills (this may take 10-15 seconds)...</div>
          )}
          {linkedInError && (
            <div className="text-red-500 mb-4">Error loading LinkedIn skills: {linkedInError}</div>
          )}
          
          {!linkedInLoading && linkedInSkillsSections.length === 0 && !linkedInError && (
            <div className="text-muted-foreground mb-4">No skills found. Please check your LinkedIn profile.</div>
          )}
          
          <motion.div
            className="space-y-8 px-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {linkedInSkillsSections.map((section, index) => (
              <motion.div
                key={index}
                className="space-y-3 px-0"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2">
                  {section.icon}
                  <h3 className="text-accent-foreground text-lg font-semibold">
                    {section.category}
                  </h3>
                </div>

                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {section.skills.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      variants={badgeVariants}
                      whileHover={{
                        scale: 1.04,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Badge className={`border px-3 py-1.5 font-normal`}>
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Re-export this function so other components can use it
export async function fetchDynamicSkills(username: string): Promise<string[]> {
  try {
    console.log(`Fetching skills for GitHub user: ${username}`);
    
    // Make a request to GitHub API to get user repos
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    if (!reposResponse.ok) {
      throw new Error(`Failed to fetch repos: ${reposResponse.status}`);
    }

    const repos = await reposResponse.json();
    const skills = new Set<string>();
    
    // Extract programming languages and topics from repos
    for (const repo of repos) {
      if (repo.language) {
        skills.add(repo.language);
      }
      
      if (repo.topics && Array.isArray(repo.topics)) {
        for (const topic of repo.topics) {
          // Convert kebab-case topics to Title Case
          const formattedTopic = topic
            .split('-')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          skills.add(formattedTopic);
        }
      }
    }
    
    return Array.from(skills);
  } catch (error) {
    console.error('Error fetching GitHub skills:', error);
    return [];
  }
}

export default Skills;