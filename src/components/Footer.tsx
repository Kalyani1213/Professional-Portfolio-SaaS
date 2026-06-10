import React from "react";
import { Sparkles, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand */}
        <div className="flex items-center">
          <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white mr-2">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-sans font-bold text-white">PortfolioAI</span>
        </div>

        {/* Note */}
        <div className="text-slate-500 text-xs text-center md:text-right flex items-center gap-1.5 font-mono">
          <span>Made with</span>
          <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
          <span>secure server-side Gemini intelligence and Zero-Trust Firestore.</span>
        </div>
      </div>
    </footer>
  );
};
