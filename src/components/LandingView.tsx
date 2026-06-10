import React from "react";
import { 
  Sparkles, Zap, Shield, FileText, Globe, Cpu, ChartBar, 
  ArrowRight, Check, CheckCircle2, Server, Star, StarHalf
} from "lucide-react";
import { TEMPLATE_METADATA } from "../constants";
import { useFirebase } from "./FirebaseProvider";

interface LandingViewProps {
  setView: (v: string) => void;
  openAuthModal: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ setView, openAuthModal }) => {
  const { user, profile, upgradeToPro } = useFirebase();

  const features = [
    {
      icon: Cpu,
      title: "AI Portfolio Content Generator",
      desc: "Instantly create fully populated copy, skills sections and mock projects customized directly to your ideal career role in 2 seconds."
    },
    {
      icon: Zap,
      title: "Instant Professional Bios",
      desc: "Generate professional taglines, short bios and conversational about summaries with selected visual vibe controls using Gemini."
    },
    {
      icon: FileText,
      title: "AI Resume Text Analyzer",
      desc: "Upload or copy paste your career resume, and watch PortfolioAI extract skills, work history and suggest improvements instantly."
    },
    {
      icon: Globe,
      title: "Custom Domain Support",
      desc: "Deploy your brand with custom name vanity domains (e.g., alexrivers.dev) to establish robust corporate and business presence."
    },
    {
      icon: ChartBar,
      title: "Real-time Visitor Analytics",
      desc: "Monitor exact hits, visitor growth, geographic or agency referral channels and top projects interest logs on your dashboard."
    },
    {
      icon: Shield,
      title: "Sleek Zero-Code Layouts",
      desc: "Drag-and-drop structural elements, change accent color coordinates and typography with native real-time visual output updates."
    }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 font-sans selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/20 via-slate-950 to-slate-950">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6 uppercase tracking-wider font-mono">
            <Sparkles className="h-3 w-3 animate-spin duration-[4000ms]" />
            Now Powered by Gemini 3.5 Models
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6">
            Build a Gorgeous, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-indigo-500">
              AI-Powered Portfolio
            </span> <br />
            Without Writing Code
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Create premium portfolios tailored precisely for developers, designers, freelancers, founders and students. Leverage elite resume analysis and layout assistants to land high-paying gigs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {user ? (
              <button
                onClick={() => setView("dashboard")}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group cursor-pointer"
              >
                Go to Builder Workspace
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group cursor-pointer"
              >
                Build For Free Currently
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            <button
              onClick={() => setView("templates")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-slate-905 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              See Template Presets
            </button>
          </div>

          {/* High level stats panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-900 pt-12 text-center">
            <div>
              <p className="text-3xl font-black text-white font-mono">142K+</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Portfolios Built</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white font-mono">1M+</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">AI Writing Credits</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white font-mono">99.9%</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Global CDN Uptime</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white font-mono">&lt; 1s</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Portfolio Load Speed</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. VALUE PROPOSITION FEATURES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              A Complete Suite of Artificial Intelligence
            </h2>
            <p className="text-base text-slate-400 mt-4 leading-relaxed">
              Why write portfolio copy manually? Our Gemini 3.5 integrations analyze resumes and auto-fill beautiful, verified layout pages with rich copy inside our intuitive builder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-850 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all text-left"
              >
                <div className="p-3 w-fit rounded-xl bg-blue-500/10 text-blue-400 mb-5">
                  <feat.icon className="h-6 w-6" />
                </div>
                <h3 className="font-sans font-bold text-lg text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE TEMPLATES GALLERY SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 border-b border-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-2xl text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Designed to Fit Any Vibe or Career Path
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Click to explore layout metadata and choose a design system starter.
              </p>
            </div>
            <button 
              onClick={() => setView("templates")}
              className="mt-4 md:mt-0 px-5 py-2.5 rounded-lg text-xs font-bold text-blue-400 border border-blue-500/10 bg-blue-500/5 hover:bg-blue-500/10 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
            >
              Learn More
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATE_METADATA.map((temp) => (
              <div 
                key={temp.id}
                className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-left hover:border-slate-700 transition-all"
              >
                {/* Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  <img 
                    src={temp.banner} 
                    alt={temp.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <span className={`absolute bottom-3 left-3 px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider text-white bg-gradient-to-r ${temp.color}`}>
                    {temp.id} preset
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-sans font-extrabold text-white text-lg">{temp.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed min-h-[48px]">{temp.description}</p>
                  
                  <button 
                    onClick={() => {
                      if (user) {
                        setView("dashboard");
                      } else {
                        openAuthModal();
                      }
                    }}
                    className="w-full mt-4 text-center py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 group-hover:text-white transition-colors"
                  >
                    Select & Customize AI
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
};
