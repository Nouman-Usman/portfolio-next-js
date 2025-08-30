import { useState, useEffect, useRef } from 'react';
import { RepoMeta } from '@/types/github';

// Create a global cache to prevent duplicate fetching
const globalCache = new Map<string, { repos: RepoMeta[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useProjects(position: string = 'all') {
  const [projects, setProjects] = useState<RepoMeta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  useEffect(() => {
    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    async function fetchProjects() {
      const cacheKey = `projects-${position}`;
      const cached = globalCache.get(cacheKey);
      
      // Use cached data if it's fresh
      if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        setProjects(cached.repos);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        const url = position === "all" 
          ? '/api/chat/projects'
          : `/api/chat/projects?position=${encodeURIComponent(position)}`;
        
        const response = await fetch(url, { signal });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const repos = data.repos || [];
        
        // Update cache
        globalCache.set(cacheKey, { 
          repos, 
          timestamp: Date.now() 
        });
        
        setProjects(repos);
      } catch (err) {
        // Don't set error if this was an intentional abort
        if (signal.aborted) return;
        
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        console.error('Project fetch error:', err);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }
    
    fetchProjects();
    
    // Cleanup function to abort fetch if component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [position]);
  
  return { projects, loading, error };
}
