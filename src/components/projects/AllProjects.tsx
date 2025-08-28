"use client";
import { Card, Carousel } from "@/components/projects/apple-cards-carousel";
import { getCombinedProjects, ProjectCard, mapReposToCards } from "@/components/projects/Data";
import { useEffect, useState } from "react";

export default function AllProjects({
  position,
  initialRepos, // optional array of RepoMeta returned by the tool
  initialCards, // optional pre-mapped ProjectCard[]
}: {
  position?: string;
  initialRepos?: any[]; // RepoMeta[]
  initialCards?: ProjectCard[];
} = {}) {
  const [projects, setProjects] = useState<ProjectCard[]>(initialCards ?? []);
  const [loading, setLoading] = useState(!initialCards?.length);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);

      // Priority:
      // 1) Use already-mapped cards if provided
      if (initialCards && initialCards.length > 0) {
        if (!mounted) return;
        setProjects(initialCards);
        setLoading(false);
        return;
      }

      // 2) If the tool provided raw repo metadata, map it once (ensures same data shown)
      if (initialRepos && Array.isArray(initialRepos) && initialRepos.length > 0) {
        const mapped = await mapReposToCards(initialRepos);
        if (!mounted) return;
        setProjects(mapped || []);
        setLoading(false);
        return;
      }

      // 3) Otherwise fetch using position (normal behavior)
      const combined = await getCombinedProjects(position);
      if (!mounted) return;
      setProjects(combined || []);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [position, initialRepos, initialCards]);

  const cards = projects.map((card, index) => (
    <Card key={`${card.title}-${index}`} card={card} index={index} layout={true} />
  ));

  return (
    <div className="w-full h-full pt-8">
      <h2 className="max-w-7xl mx-auto text-xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        My Projects
      </h2>
      {loading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">Loading projects…</div>
      ) : (
        <Carousel items={cards} />
      )}
    </div>
  );
}

