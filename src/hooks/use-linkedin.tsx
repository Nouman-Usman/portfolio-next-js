import { useState, useEffect } from 'react';

// Define types based on the LinkedIn API response structure
interface Location {
  country: string;
  city: string;
  full: string;
  country_code: string;
}

interface BasicInfo {
  fullname: string;
  first_name: string;
  last_name: string;
  headline: string;
  public_identifier: string;
  profile_picture_url: string;
  about: string;
  location: Location;
  creator_hashtags: string[];
  is_creator: boolean;
  is_influencer: boolean;
  is_premium: boolean;
  created_timestamp: number;
  show_follower_count: boolean;
  background_picture_url: string;
  urn: string;
  follower_count: number;
  connection_count: number;
  current_company: string;
  current_company_urn: string;
  current_company_url: string;
  email: string | null;
}

interface DateInfo {
  month: string;
  year: number;
}

interface Experience {
  title: string;
  company: string;
  company_logo_url: string;
  duration: string;
  location: string;
  employment_type: string;
  company_linkedin_url: string;
  description: string;
  start_date: DateInfo;
  end_date: DateInfo;
  is_current: boolean;
  skills: string[];
}

interface Education {
  school: string;
  degree: string;
  degree_name: string;
  field_of_study: string;
  duration: string;
  school_linkedin_url: string;
  description: string;
  activities: string;
  school_logo_url: string;
  start_date: DateInfo;
  end_date: DateInfo;
  grade: string;
}

interface Certification {
  name: string;
  organization: string;
  organization_urn: string;
  credential_id: string;
  issue_date: string;
  expiration_date: string | null;
  skills: string[];
  credential_url: string;
}

interface Skill {
  name: string;
  endorsement_count: number;
  related_experiences: string[];
}

interface Recommendation {
  recommender_name: string;
  recommender_title: string;
  recommender_profile_id: string;
  recommendation_date: string;
  relationship: string;
  recommendation_text: string;
}

interface Recommendations {
  received_recommendations: Recommendation[];
  given_recommendations: Recommendation[];
}

interface VolunteeringExperience {
  title: string;
  organization_name: string;
  organization_urn: string;
  start_date: string;
  end_date: string;
  duration: string;
  sector: string;
  description: string;
}

interface LinkedInProfile {
  profileUrl: string;
  basic_info: BasicInfo;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
  recommendations: Recommendations;
  "volunteering-experiences": VolunteeringExperience[];
}

interface UseLinkedInOptions {
  apiEndpoint?: string;
  autoFetch?: boolean;
  profileUrl?: string;
  includeEmail?: boolean;
}

export function useLinkedIn(options?: UseLinkedInOptions) {
  const apify_token = process.env.NEXT_PUBLIC_APIFY_TOKEN || 'apify_api_JdRR9FTJqOobU5RtdxfrVLzoBbr34t3NPLY8';
  const defaultEndpoint = `https://api.apify.com/v2/acts/apimaestro~linkedin-profile-detail/run-sync-get-dataset-items?token=${apify_token}`;
  const apiEndpoint = options?.apiEndpoint || defaultEndpoint;
  const autoFetch = options?.autoFetch !== false;
  const profileUrl = options?.profileUrl || "https://www.linkedin.com/in/nouman-usman/";
  const includeEmail = options?.includeEmail ?? false;
  
  const [linkedInData, setLinkedInData] = useState<LinkedInProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchLinkedInData = async (): Promise<LinkedInProfile | null> => {
    try {
      setLoading(true);
      console.log("Fetching LinkedIn data from:", apiEndpoint);
      const requestBody = {
        username: profileUrl, 
        includeEmail: includeEmail
      };

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch LinkedIn data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("LinkedIn API response:", data);
      
      if (data && data.length > 0) {
        const profileData = data[0];
        setLinkedInData(profileData);
        return profileData;
      } else {
        throw new Error('No LinkedIn data available');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching LinkedIn data:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchLinkedInData().catch(err => console.error("Failed initial LinkedIn data fetch:", err));
    }
  }, [apiEndpoint, autoFetch, profileUrl, includeEmail]);

  return { 
    linkedInData, 
    loading, 
    error, 
    fetchLinkedInData 
  };
}

// Standalone function for fetching LinkedIn profile data (doesn't use hooks)
export async function fetchLinkedInProfile(options?: UseLinkedInOptions): Promise<LinkedInProfile | null> {
  const apify_token = process.env.NEXT_PUBLIC_APIFY_TOKEN || '';
  const defaultEndpoint = `https://api.apify.com/v2/acts/apimaestro~linkedin-profile-full-sections-scraper/run-sync-get-dataset-items?token=${apify_token}`;
  const apiEndpoint = options?.apiEndpoint || defaultEndpoint;
  const profileUrl = options?.profileUrl || "https://www.linkedin.com/in/nouman-usman/";
  const includeEmail = options?.includeEmail ?? false;
  
  try {
    console.log("Fetching LinkedIn data from (standalone):", apiEndpoint);
    const requestBody = {
      username: profileUrl, 
      includeEmail: includeEmail
    };

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch LinkedIn data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("LinkedIn API response (standalone):", data);
    
    if (data && data.length > 0) {
      return data[0];
    } else {
      throw new Error('No LinkedIn data available');
    }
  } catch (err) {
    console.error('Error in standalone LinkedIn fetch:', err);
    throw err;
  }
}
