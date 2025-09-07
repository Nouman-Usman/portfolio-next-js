import { useState, useEffect } from 'react';

interface GitHubUser {
  login: string;
  id: number;
  name: string | null;
  [key: string]: any; 
}

export const useGitHubUsername = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  useEffect(() => {
    const fetchUsername = async () => {
      if (!token) {
        setError(new Error('GitHub token is required'));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://api.github.com/user', {
          headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${token}`,
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const userData: GitHubUser = await response.json();
        console.log("User data is: ", userData)
        setUsername(userData.name);
        setName(userData.login);
        setBio(userData.bio);

      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch GitHub username'));
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, [token]);

  return { username, loading, error, bio, name };
};