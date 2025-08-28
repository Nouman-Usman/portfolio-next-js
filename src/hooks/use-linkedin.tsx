import { useState, useEffect } from 'react';

interface ExperienceItem {
	company?: string;
	company_id?: string;
	company_linkedin_url?: string;
	company_logo_url?: string;
	title?: string;
	location?: string;
	location_type?: string;
	employment_type?: string;
	duration?: string;
	start_date?: { year?: number; month?: string };
	end_date?: { year?: number; month?: string };
	is_current?: boolean;
	skills?: string[];
	skills_url?: string;
}

interface EducationItem {
	school?: string;
	school_id?: string;
	school_linkedin_url?: string;
	school_logo_url?: string;
	degree?: string;
	degree_name?: string;
	field_of_study?: string;
	activities?: string;
	duration?: string;
	start_date?: { year?: number; month?: string };
	end_date?: { year?: number; month?: string };
}

interface CertificationItem {
	name?: string;
	issuer?: string;
	issued_date?: string;
}

interface BasicInfo {
	fullname?: string;
	first_name?: string;
	last_name?: string;
	headline?: string;
	public_identifier?: string;
	profile_picture_url?: string;
	about?: string;
	location?: {
		country?: string;
		city?: string;
		full?: string;
		country_code?: string;
	};
	creator_hashtags?: string[];
	is_creator?: boolean;
	is_influencer?: boolean;
	is_premium?: boolean;
	created_timestamp?: number;
	show_follower_count?: boolean;
	background_picture_url?: string;
	urn?: string;
	follower_count?: number;
	connection_count?: number;
	current_company?: string;
	current_company_urn?: string;
	current_company_url?: string;
	email?: string | null;
}

interface LinkedinProfile {
	// new structured response
	basic_info?: BasicInfo;
	experience?: ExperienceItem[];
	education?: EducationItem[];
	certifications?: CertificationItem[];

	// keep a few legacy/compatibility fields optional in case other parts of the app expect them
	fullName?: string;
	headline?: string;
	profilePictureUrl?: string;
	summary?: string;
	skills?: string[];
}

interface UseLinkedinOptions {
    username: string;
    includeEmail?: boolean;
}

export function useLinkedin({ username, includeEmail = true }: UseLinkedinOptions) {
    const [profile, setProfile] = useState<LinkedinProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!username) return;

        const fetchProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    'https://api.apify.com/v2/acts/apimaestro~linkedin-profile-detail/run-sync-get-dataset-items?token=apify_api_1PkrZDUq7wcQGubRgc6s3fLu8WrNyr0oh5bw',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            includeEmail,
                            username,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch LinkedIn profile');
                }

                const data = await response.json();
                setProfile(data[0] || null);
            } catch (err: any) {
                setError(err.message || 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username, includeEmail]);

    return { profile, loading, error };
}