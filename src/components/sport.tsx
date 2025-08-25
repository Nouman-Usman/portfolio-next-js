'use client';

import React from 'react';
import { Photos, PhotoItem } from './photos';

const Leadership = () => {
  const leadershipPhotos: PhotoItem[] = [
    {
      src: '/ciphercraft.jpg',
      alt: 'Cipher Craft event',
      caption: 'Founded and leading Cipher Craft — a student-led AI & tech innovation club at UET Lahore',
    },
    {
      src: '/hultprize.jpg',
      alt: 'Hult Prize competition',
      caption: 'Organized and directed the Hult Prize at UET Lahore, mobilizing 100+ students',
    },
    {
      src: '/defang.jpg',
      alt: 'Defang workshop',
      caption: 'As Defang Campus Advocate, running workshops on cloud deployment & AI debugging',
    },
    {
      src: '/mlsa.jpg',
      alt: 'Microsoft Learn Student Ambassador session',
      caption: 'Hosting peer-learning sessions as a Microsoft Learn Student Ambassador',
    },
  ];

  return (
    <div className="mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-foreground text-3xl font-semibold md:text-4xl">
          Leadership & Campus Life
        </h2>
        <p className="mt-4 text-muted-foreground">
          Alongside my work in AI and SaaS, I actively contribute to my campus community. 
          From founding student initiatives to organizing international programs, these experiences 
          shaped my leadership, teamwork, and ability to drive impactful projects.
        </p>
      </div>
      <Photos photos={leadershipPhotos} />
    </div>
  );
};

export default Leadership;
