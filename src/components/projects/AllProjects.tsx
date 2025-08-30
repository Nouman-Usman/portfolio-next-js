"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Card } from '@/components/projects/apple-cards-carousel';
import { RepoMeta } from '@/types/github';

// Create a cache to store API responses
const projectsCache = new Map();

const AllProjects = ({ position = "all" }: { position?: string }) => {
  const [projects, setProjects] = useState<RepoMeta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchProjects = async () => {
      // Skip fetch if we've already fetched for this component instance
      if (fetchedRef.current) return;
      
      try {
        setLoading(true);
        
        // Check if we have cached results for this position
        const cacheKey = `projects-${position}`;
        if (projectsCache.has(cacheKey)) {
          setProjects(projectsCache.get(cacheKey));
          setLoading(false);
          return;
        }
        
        // Make the API call with the position parameter
        const url = position === "all" 
          ? '/api/chat/projects'
          : `/api/chat/projects?position=${encodeURIComponent(position)}`;
          
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        const repos = data.repos || [];
        
        // Cache the results
        projectsCache.set(cacheKey, repos);
        setProjects(repos);
        
        // Mark as fetched to prevent duplicate calls
        fetchedRef.current = true;
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [position]); // Only re-fetch if position changes

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const getRepoImage = (repo: RepoMeta) => {
    // Default project image if none available
    const defaultImage = "/images/default-project.jpg";
    
    // Return default image if no repo data
    if (!repo) return defaultImage;
    
    // Use the owner's avatar if available
    if (repo.owner?.avatar_url && repo.owner.avatar_url !== "") {
      return repo.owner.avatar_url;
    }
    
    // Use a generated image based on repo name
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(repo.name || "Project")}&background=random`;
  };

  const projectCards = projects.map((repo, index) => {
    const repoLanguage = repo.language || "No language specified";
    const repoName = repo.name || "Unnamed project";
    const repoDescription = repo.description || "No description available";
    
    // Get a valid image source
    const imageSrc = getRepoImage(repo);
    
    return {
      src: imageSrc,
      title: repoName,
      category: repoLanguage,
      content: (
        <div className="space-y-4">
          <p>{repoDescription}</p>
          
          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 my-4">
              {repo.topics.map((topic, i) => (
                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {topic}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{repo.stargazers_count || 0} stars</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5 3a3 3 0 016 0v5a3 3 0 01-6 0V3z" />
                  <path d="M3.5 6.5A.5.5 0 014 7v1a4 4 0 008 0V7a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a5.5 5.5 0 01-5 5.475V15h3a.5.5 0 010 1h-8a.5.5 0 010-1h3v-2.025A5.5 5.5 0 012 8V7a.5.5 0 01.5-.5h1z" />
                </svg>
                <span>{repo.forks_count || 0} forks</span>
              </div>
            </div>
            
            <a
              href={repo.html_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      )
    };
  });

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-3xl font-bold text-center mb-10">
        {position === "all" ? "My GitHub Projects" : `Projects for ${position}`}
      </h2>
      {projects.length === 0 ? (
        <p className="text-center text-gray-600">No projects found.</p>
      ) : (
        <Carousel items={projectCards.map((card, index) => (
          <Card key={index} card={card} index={index} />
        ))} />
      )}
    </div>
  );
};

export default AllProjects;

