
import React, { useState } from 'react';
import { FlashCard } from '../types';

interface CardProps {
  card: FlashCard;
  onFlip?: () => void;
}

const Card: React.FC<CardProps> = ({ card, onFlip }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (onFlip) onFlip();
  };

  const difficultyColor = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  }[card.difficulty];

  return (
    <div className="w-full max-w-sm h-96 perspective-1000 cursor-pointer group" onClick={handleFlip}>
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Side (Turkish) */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 border-2 border-indigo-50">
          <span className={`absolute top-6 right-6 text-xs font-bold uppercase px-3 py-1 rounded-full ${difficultyColor}`}>
            {card.difficulty}
          </span>
          <div className="text-center">
            <p className="text-sm text-gray-400 font-medium mb-2 uppercase tracking-widest">Türkçe</p>
            <h2 className="text-3xl font-bold text-gray-800 leading-tight">
              {card.turkish}
            </h2>
          </div>
          <div className="absolute bottom-8 text-gray-400 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
          </div>
        </div>

        {/* Back Side (German) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-white">
          <div className="text-center">
            <p className="text-sm text-indigo-200 font-medium mb-2 uppercase tracking-widest">Almanca</p>
            <h2 className="text-3xl font-bold leading-tight">
              {card.german}
            </h2>
          </div>
          <button className="mt-8 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
