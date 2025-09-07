'use client';

import { cn } from '@/lib/utils';
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Define the card interface
interface Card {
  title: string;
  description: string;
  imageUrl: string;
  avatarSrc: string;
  name: string;
  role: string;
  company: string;
  date: string;
}

// Sample cards data
const cards: Card[] = [
  {
    title: 'Card 1',
    description: 'Description for card 1',
    imageUrl: 'https://via.placeholder.com/800x400',
    avatarSrc: 'https://avatars.githubusercontent.com/u/125990013?v=4',
    name: 'John Doe',
    role: 'Software Engineer',
    company: 'ABC Corp',
    date: '2023-01-01',
  },
  {
    title: 'Card 2',
    description: 'Description for card 2',
    imageUrl: 'https://via.placeholder.com/800x400',
    avatarSrc: 'https://avatars.githubusercontent.com/u/126898750?v=4',
    name: 'Jane Smith',
    role: 'Product Manager',
    company: 'XYZ Inc',
    date: '2023-02-01',
  },
  // Add more cards as needed
];

const CardsCarousel = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <Carousel
        showArrows={true}
        showStatus={false}
        showThumbs={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000}
        transitionTime={600}
        className="rounded-2xl overflow-hidden"
      >
        {cards.map((card, index) => (
          <div key={index} className="relative w-full h-96">
            {/* Background Image */}
            <Image
              src={card.imageUrl}
              alt={`Background image for ${card.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-center p-8 bg-black bg-opacity-50">
              {/* Avatar and Info */}
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 mr-3 rounded-full overflow-hidden">
                  <Image
                    src={card.avatarSrc}
                    alt={card.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="text-white">
                  <p className="text-sm font-semibold">{card.name}</p>
                  <p className="text-xs">{card.role} at {card.company}</p>
                </div>
              </div>

              {/* Title and Description */}
              <motion.h2
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {card.title}
              </motion.h2>
              <motion.p
                className="text-base text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {card.description}
              </motion.p>

              {/* Date */}
              <p className="mt-4 text-sm text-gray-300">
                {card.date}
              </p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CardsCarousel;