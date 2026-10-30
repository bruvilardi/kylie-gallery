import React from 'react';
import { Instagram, Twitter, Heart } from 'lucide-react';

// Simplified SVG for TikTok as Lucide might not have it in older versions, 
// but assuming standard icons. If TikTok missing, we can use a custom SVG.
const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto w-full py-12 px-6 border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-sm">Feito com</span>
          <Heart size={16} className="text-klbr fill-klbr animate-pulse" />
          <span className="text-sm">por Bruno Vilardi para Kylie Lovers BR</span>
        </div>

        <div className="flex items-center gap-8">
          <a 
            href="https://www.instagram.com/kylieloversbr/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-klbr hover:scale-110 transition-all duration-300"
          >
            <Instagram size={24} />
            <span className="sr-only">Instagram</span>
          </a>
          <a 
            href="https://x.com/kylieloversbr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 hover:scale-110 transition-all duration-300"
          >
            <Twitter size={24} />
            <span className="sr-only">Twitter</span>
          </a>
          <a 
            href="https://www.tiktok.com/@kylieloversbr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-klbr hover:scale-110 transition-all duration-300"
          >
            <TikTokIcon />
            <span className="sr-only">TikTok</span>
          </a>
        </div>
        
        <div className="text-gray-600 text-xs">
          &copy; {new Date().getFullYear()} KLBR Gallery. Fan site.
        </div>
      </div>
    </footer>
  );
};