"use client";
import { Card, Carousel } from "@/components/projects/apple-cards-carousel";
import { getCombinedProjects, ProjectCard } from "@/components/projects/Data";
import { useEffect, useState } from "react";

export default function AllProjects({ position }: { position?: string } = {}) {
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const combined = await getCombinedProjects(position);
      if (!mounted) return;
      setProjects(combined || []);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [position]);

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

