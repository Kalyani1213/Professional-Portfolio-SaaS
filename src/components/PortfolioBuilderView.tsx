import React, { useState, useEffect } from "react";
import { 
  Sparkles, Save, ArrowLeft, Loader2, Cpu, FileText, CheckCircle2, 
  Palette, RefreshCw, Layers, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, Globe, Layout, Search, Menu
} from "lucide-react";
import { useFirebase } from "./FirebaseProvider";
import { PortfolioData, ProjectItem, SkillItem, ExperienceItem, EducationItem, CertificationItem } from "../types";
import { PublicPortfolioView } from "./PublicPortfolioView";

interface PortfolioBuilderProps {
  portfolio: PortfolioData;
  onBack: () => void;
}

export const PortfolioBuilderView: React.FC<PortfolioBuilderProps> = ({ portfolio: initialPortfolio, onBack }) => {
  const { savePortfolio, profile } = useFirebase();
  const [portfolio, setPortfolio] = useState<PortfolioData>(initialPortfolio);
  const [saving, setSaving] = useState(false);
  const [activeBuilderTab, setActiveBuilderTab] = useState<"basics" | "content" | "styling" | "ai">("basics");

  // AI Generation triggers states
  const [generatingAI, setGeneratingAI] = useState(false);
  const [targetRole, setTargetRole] = useState(portfolio.title || "Senior Software Engineer");
  const [aboutUserInput, setAboutUserInput] = useState(portfolio.description || "Passionate full stack builder.");
  
  // AI Critique feedback state
  const [generatingCritique, setGeneratingCritique] = useState(false);
  const [critiqueResult, setCritiqueResult] = useState<any>(null);

  // Local helper lists trigger
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillPercentage, setNewSkillPercentage] = useState(90);

  // Manage projects helper state
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectTech, setNewProjectTech] = useState("");

  const handleFieldChange = (field: keyof PortfolioData, value: any) => {
    setPortfolio((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStyleChange = (field: string, value: any) => {
    setPortfolio((prev) => ({
      ...prev,
      customStyles: {
        ...prev.customStyles,
        [field]: value
      }
    }));
  };

  const handleSEOChange = (field: string, value: any) => {
    setPortfolio((prev) => ({
      ...prev,
      seoSettings: {
        ...prev.seoSettings,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePortfolio(portfolio);
      alert("Portfolio saved successfully! Changes are now alive.");
    } catch (err: any) {
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Section Ordering manipulation (Visual builder element sorting)
  const moveSection = (index: number, direction: "up" | "down") => {
    const newLayout = [...portfolio.layout];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLayout.length) return;

    // Swap
    const temp = newLayout[index];
    newLayout[index] = newLayout[targetIndex];
    newLayout[targetIndex] = temp;

    setPortfolio((prev) => ({
      ...prev,
      layout: newLayout
    }));
  };

  // AI BIO & TAGLINE Generation
  const triggerAIBio = async () => {
    setGeneratingAI(true);
    try {
      const resp = await fetch("/api/ai/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: portfolio.name,
          profession: targetRole,
          style: portfolio.customStyles.theme,
          bulletPoints: aboutUserInput
        })
      });
      const data = await resp.json();
      if (resp.ok) {
        setPortfolio(prev => ({
          ...prev,
          title: data.tagline || prev.title,
          bio: data.bio || prev.bio,
          description: data.summary || prev.description
        }));
        alert("Gemini auto-populated tagline, bio, and summary variables below!");
      } else {
        alert(data.error || "Generation busy.");
      }
    } catch (e) {
      alert("Generation failed, please ensure API is running.");
    } finally {
      setGeneratingAI(false);
    }
  };

  // AI ALL SECTIONS AUTO-Populator
  const triggerAIFullSections = async () => {
    if (!confirm("Are you sure you want to AI generate sections? This will overwrite your current skills, projects, and work experiences with high-quality styled templates.")) return;
    setGeneratingAI(true);
    try {
      const resp = await fetch("/api/ai/generate-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateType: portfolio.templateId,
          targetRole: targetRole,
          aboutMeInput: aboutUserInput
        })
      });
      const data = await resp.json();
      if (resp.ok) {
        setPortfolio(prev => ({
          ...prev,
          sections: {
            ...prev.sections,
            skills: data.skills || prev.sections.skills,
            projects: data.projects?.map((p: any, idx: number) => ({ id: `ai-p-${idx}`, ...p })) || prev.sections.projects,
            experience: data.experience?.map((e: any, idx: number) => ({ id: `ai-e-${idx}`, ...e })) || prev.sections.experience,
            education: data.education?.map((edu: any, idx: number) => ({ id: `ai-edu-${idx}`, ...edu })) || prev.sections.education,
            certifications: data.certifications?.map((c: any, idx: number) => ({ id: `ai-cert-${idx}`, ...c })) || prev.sections.certifications
          }
        }));
        alert("Completed generating portfolio structure, items, skills & achievements!");
      } else {
        alert(data.error || "Failed layout creation.");
      }
    } catch (e) {
      alert("Generation failed.");
    } finally {
      setGeneratingAI(false);
    }
  };

  // AI Critic Optimization checklist
  const triggerAICritique = async () => {
    setGeneratingCritique(true);
    try {
      const resp = await fetch("/api/ai/improvement-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolioData: portfolio })
      });
      const data = await resp.json();
      if (resp.ok) {
        setCritiqueResult(data);
      } else {
        alert("Critique unavailable.");
      }
    } catch (e) {
      alert("Critique timed out.");
    } finally {
      setGeneratingCritique(false);
    }
  };

  // SEO Suggester
  const triggerAISEO = async () => {
    setGeneratingAI(true);
    try {
      const resp = await fetch("/api/ai/seo-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: portfolio.title,
          bio: portfolio.bio,
          templateId: portfolio.templateId
        })
      });
      const data = await resp.json();
      if (resp.ok) {
        setPortfolio(prev => ({
          ...prev,
          seoSettings: {
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            keywords: data.keywords
          }
        }));
        alert("Meta titles, Meta Descriptions, and Keywords mapped!");
      }
    } catch (e) {
      alert("Failed to generate SEO parameters.");
    } finally {
      setGeneratingAI(false);
    }
  };

  // ITEM ADD / REMOVE TRIGGERS
  const addLocalSkill = () => {
    if (!newSkillName.trim()) return;
    const item: SkillItem = { name: newSkillName.trim(), percentage: Number(newSkillPercentage) };
    setPortfolio((p) => ({
      ...p,
      sections: {
        ...p.sections,
        skills: [...p.sections.skills, item]
      }
    }));
    setNewSkillName("");
  };

  const removeLocalSkill = (name: string) => {
    setPortfolio((p) => ({
      ...p,
      sections: {
        ...p.sections,
        skills: p.sections.skills.filter((s) => s.name !== name)
      }
    }));
  };

  const addLocalProject = async () => {
    if (!newProjectTitle.trim()) return;
    const project: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: newProjectTitle.trim(),
      description: newProjectDesc.trim() || "Work project highlighting robust system implementations.",
      techStack: newProjectTech.split(",").map((t) => t.trim()).filter(Boolean)
    };
    setPortfolio((p) => ({
      ...p,
      sections: {
        ...p.sections,
        projects: [...p.sections.projects, project]
      }
    }));
    setNewProjectTitle("");
    setNewProjectDesc("");
    setNewProjectTech("");
  };

  const removeLocalProject = (id: string) => {
    setPortfolio((p) => ({
      ...p,
      sections: {
        ...p.sections,
        projects: p.sections.projects.filter(pr => pr.id !== id)
      }
    }));
  };

  return (
    <div className="bg-slate-950 min-h-screen text-left flex flex-col">
      {/* Visual Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-lg font-extrabold text-white">Visual Design System Core</h2>
            <p className="text-xs text-slate-400">Editing: <span className="font-bold text-blue-400">{portfolio.name}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 transition cursor-pointer"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Live Changes
          </button>
        </div>
      </div>

      {/* Editor Main Layout Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100vh-64px)]">
        
        {/* LEFT COLUMN: BUILDER INPUT CONTROLS (Col-5) */}
        <div className="lg:col-span-5 border-r border-slate-900 overflow-y-auto px-6 py-8 bg-slate-950 space-y-8 select-none">
          <div className="flex border-b border-slate-900 pb-2 mb-6">
            <button 
              onClick={() => setActiveBuilderTab("basics")}
              className={`flex-1 text-center pb-2 text-xs font-bold border-b-2 transition ${activeBuilderTab === "basics" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"}`}
            >
              Copy Basics
            </button>
            <button 
              onClick={() => setActiveBuilderTab("content")}
              className={`flex-1 text-center pb-2 text-xs font-bold border-b-2 transition ${activeBuilderTab === "content" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"}`}
            >
              List Contents
            </button>
            <button 
              onClick={() => setActiveBuilderTab("styling")}
              className={`flex-1 text-center pb-2 text-xs font-bold border-b-2 transition ${activeBuilderTab === "styling" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"}`}
            >
              Theme Styling
            </button>
            <button 
              onClick={() => setActiveBuilderTab("ai")}
              className={`flex-1 text-center pb-2 text-xs font-bold border-b-2 transition ${activeBuilderTab === "ai" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"}`}
            >
              AI Assistant
            </button>
          </div>

          {/* TAB A: BASICS */}
          {activeBuilderTab === "basics" && (
            <div className="space-y-6 text-xs font-bold">
              <div className="space-y-1.5 text-left">
                <label className="text-slate-400">Headline Title</label>
                <input 
                  type="text" 
                  value={portfolio.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-slate-400">Section Subtitle / Tagline Bio</label>
                <textarea 
                  value={portfolio.bio}
                  onChange={(e) => handleFieldChange("bio", e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-slate-400">Detailed About Summary</label>
                <textarea 
                  value={portfolio.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-slate-400">Profile Image Unsplash URL</label>
                <input 
                  type="text" 
                  value={portfolio.profileImage}
                  onChange={(e) => handleFieldChange("profileImage", e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1.5 text-left pt-4 border-t border-slate-900">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Public SEO settings</span>
                <div className="space-y-4 mt-3">
                  <div className="space-y-1">
                    <label className="text-slate-500">Meta Title Title</label>
                    <input 
                      type="text" 
                      value={portfolio.seoSettings.metaTitle}
                      onChange={(e) => handleSEOChange("metaTitle", e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500">Meta Description</label>
                    <textarea 
                      value={portfolio.seoSettings.metaDescription}
                      onChange={(e) => handleSEOChange("metaDescription", e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB B: LIST CONTENTS */}
          {activeBuilderTab === "content" && (
            <div className="space-y-8 text-xs font-bold">
              {/* Skill Items */}
              <div className="space-y-4 p-4 rounded-xl border border-slate-900 bg-slate-900/10">
                <h4 className="text-slate-350 text-xs font-black uppercase tracking-wider">Manage Competency Skills</h4>
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. TailwindCSS"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="flex-1 p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-200 focus:outline-none"
                  />
                  <input 
                    type="number" 
                    placeholder="90%"
                    value={newSkillPercentage}
                    onChange={(e) => setNewSkillPercentage(Number(e.target.value))}
                    max={100}
                    className="w-16 p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-250 text-center"
                  />
                  <button 
                    type="button"
                    onClick={addLocalSkill}
                    className="px-3 bg-blue-600 hover:bg-blue-505 rounded-lg text-white font-black"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {portfolio.sections.skills.map((s, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 text-[10px] text-slate-300">
                      <span>{s.name} ({s.percentage}%)</span>
                      <button 
                        onClick={() => removeLocalSkill(s.name)}
                        className="text-slate-500 hover:text-red-400 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Work Projects */}
              <div className="space-y-4 p-4 rounded-xl border border-slate-900 bg-slate-900/10">
                <h4 className="text-slate-355 text-xs font-black uppercase tracking-wider">Manage Work Projects</h4>
                
                <div className="space-y-2 text-left">
                  <input 
                    type="text" 
                    placeholder="Project Title"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
                  />
                  <textarea 
                    placeholder="Project write-up summary..."
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none font-sans"
                  />
                  <input 
                    type="text" 
                    placeholder="Tech, split, by, comma"
                    value={newProjectTech}
                    onChange={(e) => setNewProjectTech(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none font-sans"
                  />
                  <button 
                    type="button"
                    onClick={addLocalProject}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-550 rounded-lg text-white font-bold transition flex items-center justify-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Project Card
                  </button>
                </div>

                <div className="space-y-1.5 pt-2 max-h-48 overflow-y-auto">
                  {portfolio.sections.projects.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-900 text-xs">
                      <span className="font-semibold text-slate-300 truncate max-w-[200px]">{p.title}</span>
                      <button 
                        onClick={() => removeLocalProject(p.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB C: THEME STYLING */}
          {activeBuilderTab === "styling" && (
            <div className="space-y-6 text-xs font-bold text-left">
              {/* Dynamic Theme Selection */}
              <div className="space-y-2">
                <label className="text-slate-400 block font-black">Visual Palette Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "light", name: "High Contrast Light" },
                    { id: "dark", name: "Slate Dark Theme" },
                    { id: "glass", name: "Clear Glass Spark" },
                    { id: "glass-dark", name: "Cosmic Dark Glass" },
                    { id: "nordic", name: "Nordic Minimalist" },
                    { id: "sunset", name: "Warm Sunset Glow" }
                  ].map((t) => (
                    <button 
                      key={t.id}
                      onClick={() => handleStyleChange("theme", t.id)}
                      className={`p-3 rounded-xl border text-left transition ${portfolio.customStyles.theme === t.id ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-slate-850 hover:bg-slate-900 text-slate-350"}`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Selection */}
              <div className="space-y-2 pt-4 border-t border-slate-900">
                <label className="text-slate-400 block font-black">Typography Font Pairings</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Inter", "Space Grotesk", "Outfit", "JetBrains Mono", "Playfair Display"].map((fn) => (
                    <button 
                      key={fn}
                      onClick={() => handleStyleChange("fontFamily", fn)}
                      className={`p-2.5 rounded-xl border text-[11px] transition ${portfolio.customStyles.fontFamily === fn ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold" : "border-slate-850 text-slate-400 hover:bg-slate-900"}`}
                      style={{ fontFamily: fn === "Inter" ? "sans-serif" : fn }}
                    >
                      {fn} Pairing
                    </button>
                  ))}
                </div>
              </div>

              {/* Drag and Drop layout element sequence list */}
              <div className="space-y-4 pt-6 border-t border-slate-900">
                <div>
                  <label className="text-slate-400 block font-black">Portfolio Layout Sequence (Visual Builder Shifting)</label>
                  <p className="text-[10px] text-slate-500 mt-0.5">Press Up/Down arrow controllers to instantly rearrange section grids.</p>
                </div>

                <div className="space-y-2">
                  {portfolio.layout.map((sect, idx) => (
                    <div 
                      key={sect}
                      className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 text-slate-300">
                        <Layers className="h-4 w-4 text-slate-500" />
                        <span>{sect}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button 
                          disabled={idx === 0}
                          onClick={() => moveSection(idx, "up")}
                          className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-white"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          disabled={idx === portfolio.layout.length - 1}
                          onClick={() => moveSection(idx, "down")}
                          className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-white"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB D: AI ASSISTANT CO-WRITERS */}
          {activeBuilderTab === "ai" && (
            <div className="space-y-6 text-xs text-left">
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-blue-400" />
                  <span className="font-black text-white">AI Content Autopilot</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Use our server-side Gemini 3.5 integrations to write full portfolio copywriting schemas dynamically!
                </p>

                <div className="space-y-3 pt-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">Profession / Target Job Role</label>
                    <input 
                      type="text" 
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Lead UIUX designer"
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">Highlights / Keywords about you</label>
                    <textarea 
                      value={aboutUserInput}
                      onChange={(e) => setAboutUserInput(e.target.value)}
                      placeholder="e.g. 5 yrs in Figma design systems, awards, risc graduate."
                      rows={2}
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none font-sans"
                    />
                  </div>

                  {generatingAI ? (
                    <div className="flex items-center gap-2 py-2 text-blue-400 font-mono font-bold text-xs">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Gemini Generating Layouts...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 pt-2">
                      <button 
                        onClick={triggerAIBio}
                        className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-502 font-bold text-white transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Cpu className="h-3.5 w-3.5" />
                        Generate AI Bio & Headline
                      </button>
                      <button 
                        onClick={triggerAIFullSections}
                        className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-505 font-bold text-white transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        AI Generate Full Sections Copy
                      </button>
                      <button 
                        onClick={triggerAISEO}
                        className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-505 font-bold text-white transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        Auto Generate AI SEO Tags
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Critique System */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-1.5 text-indigo-400 font-black">
                  <FileText className="h-4.5 w-4.5" />
                  <span>AI Tech Recruiter Critique Score</span>
                </div>
                <p className="text-[11px] text-slate-400">Assemble current settings and trigger recruiter grading score with optimization critique lists.</p>
                
                {generatingCritique ? (
                  <div className="flex items-center gap-2 py-2 text-indigo-400 font-mono font-bold text-xs">
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>Analyzing active design properties...</span>
                  </div>
                ) : (
                  <button 
                    onClick={triggerAICritique}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 font-bold rounded-lg text-slate-200 hover:text-white transition cursor-pointer"
                  >
                    Analyze Design Score
                  </button>
                )}

                {critiqueResult && (
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-850 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <span className="text-slate-450 uppercase font-semibold text-[10px] tracking-wider">Recruiter Hireability Score</span>
                      <span className={`font-mono font-extrabold text-lg ${critiqueResult.critiqueScore >= 80 ? "text-emerald-400" : "text-amber-400"}`}>{critiqueResult.critiqueScore}/100</span>
                    </div>

                    <p className="text-[10px] text-indigo-400 italic leading-relaxed">branding advice: "{critiqueResult.personalBrandingRecommendation}"</p>
                    
                    <ul className="list-decimal pl-3 text-[10px] text-slate-300 space-y-1 leading-relaxed">
                      {critiqueResult.feedbackPoints?.map((pt: string, i: number) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LIVE REAL-TIME PREVIEW MODAL (Col-7) */}
        <div className="lg:col-span-7 h-full bg-slate-950 p-4 lg:p-6 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
            <span className="text-xs uppercase font-mono font-extrabold tracking-widest text-slate-500 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Visual Simulator Core
            </span>
          </div>

          {/* Render target layout preview */}
          <div className="rounded-xl border border-slate-900 overflow-hidden shadow-2xl">
            <PublicPortfolioView portfolio={portfolio} previewMode={true} />
          </div>
        </div>

      </div>
    </div>
  );
};
