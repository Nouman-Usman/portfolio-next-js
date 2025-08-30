import { NextResponse } from 'next/server';
import { getProjects } from '@/app/api/chat/tools/getProjects';

export async function GET(request: Request) {
  try {
    // Extract position from URL if provided
    const url = new URL(request.url);
    const position = url.searchParams.get('position') || "all";
    
    // Cache responses to prevent duplicate processing
    const cacheKey = `api-${position}`;
    const cachedResponse = (global as any).__projectsCache?.[cacheKey];
    
    if (cachedResponse) {
      return NextResponse.json(cachedResponse, { status: 200 });
    }
    
    // Call the getProjects tool with the position
    const response = await getProjects.execute(
      { position: position },
      { toolCallId: `fetch-projects-${position}`, messages: [] }
    );
    
    let result;
    if (typeof response === 'string') {
      result = { text: response, repos: [] };
    } else {
      result = response;
    }
    
    // Store in global cache (persists between requests in same Node.js process)
    if (!(global as any).__projectsCache) {
      (global as any).__projectsCache = {};
    }
    (global as any).__projectsCache[cacheKey] = result;
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' }, 
      { status: 500 }
    );
  }
}
