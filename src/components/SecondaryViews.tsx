import React from "react";
import { Cpu, Zap, Sparkles, Sliders, Globe, Code, ShieldCheck, Check } from "lucide-react";
import { TEMPLATE_METADATA } from "../constants";

export const FeaturesView: React.FC = () => {
  return (
    <div className="bg-slate-950 py-16 px-4 max-w-7xl mx-auto text-left">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-white">Advanced AI SaaS Platforms</h2>
        <p className="text-sm text-slate-400 mt-2">Discover how our server-side Gemini system expedites landing job matches.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
          <Cpu className="h-8 w-8 text-blue-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Cognitive AI Copywriters</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our writing modules utilize Google Gemini to instantly form perfect semantic summaries, bio subtitles, project tags, and structured certification maps tailored specifically to standard professional indexes.
          </p>
        </div>
        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
          <Sliders className="h-8 w-8 text-indigo-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Live Theme Builder</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rearrange landing elements like Work Projects or Certifications seamlessly. Toggle visual accent palettes, responsive card rounding geometries, and customize layouts in a single, cohesive visual workspace.
          </p>
        </div>
        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
          <Globe className="h-8 w-8 text-emerald-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Custom Domain Networking</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pro portfolios can link custom domains smoothly. We manage CNAME matching and verify standard hostname resolution for instantaneous, zero-config propagation.
          </p>
        </div>
        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
          <ShieldCheck className="h-8 w-8 text-rose-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Resume Parsing Pipeline</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Input copy-pasted resume text, and PortfolioAI parses job details, dates, companies, and academic records to automatically set up your master builder form.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TemplatesView: React.FC<{ setView: (v: string) => void }> = ({ setView }) => {
  return (
    <div className="bg-slate-950 py-16 px-4 max-w-7xl mx-auto text-left">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-white">Visual Design System Templates</h2>
        <p className="text-sm text-slate-400 mt-2">Every template has custom visual theme settings, layouts, and typography presets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TEMPLATE_METADATA.map((temp) => (
          <div key={temp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${temp.color} mb-4 flex items-center justify-center font-bold text-white uppercase`}>
                {temp.id[0]}
              </div>
              <h3 className="text-lg font-bold text-white">{temp.name}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{temp.description}</p>
            </div>
            <button 
              onClick={() => setView("dashboard")}
              className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg text-slate-200 transition"
            >
              Configure Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


