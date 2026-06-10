import React, { useState } from "react";
import { 
  Github, Linkedin, Twitter, Mail, Phone, Calendar, Briefcase, Award, GraduationCap, 
  Sparkles, ExternalLink, Download, FileText, CheckCircle2, Send, Loader2
} from "lucide-react";
import { PortfolioData } from "../types";

interface PublicPortfolioProps {
  portfolio: PortfolioData;
  previewMode?: boolean;
}

export const PublicPortfolioView: React.FC<PublicPortfolioProps> = ({ portfolio, previewMode = false }) => {
  const [formData, setFormData] = useState({ name: "", email: "", msg: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const styleSettings = portfolio.customStyles || {
    theme: "glass-dark",
    primaryColor: "#3b82f6",
    fontFamily: "Space Grotesk",
    cardStyle: "glassmorphism"
  };

  // 1. Establish Theme Styles Colors Map
  let bgClass = "bg-slate-950 text-slate-100";
  let cardClass = "bg-slate-900/60 border border-slate-850 rounded-2xl p-6 shadow-xl";
  let textMutedClass = "text-slate-400";
  let titleClass = "text-white";

  if (styleSettings.theme === "light") {
    bgClass = "bg-slate-50 text-slate-800";
    cardClass = "bg-white border border-slate-200 rounded-xl p-6 shadow-md";
    textMutedClass = "text-slate-500";
    titleClass = "text-slate-900";
  } else if (styleSettings.theme === "dark") {
    bgClass = "bg-slate-950 text-slate-100";
    cardClass = "bg-slate-900 border border-slate-850 rounded-xl p-6 shadow-lg";
    textMutedClass = "text-slate-400";
    titleClass = "text-white";
  } else if (styleSettings.theme === "glass") {
    bgClass = "bg-gradient-to-tr from-sky-50 via-slate-50 to-blue-50 text-slate-800";
    cardClass = "bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-6 shadow-xl shadow-sky-500/5";
    textMutedClass = "text-slate-600";
    titleClass = "text-slate-900";
  } else if (styleSettings.theme === "glass-dark") {
    bgClass = "bg-[#0b0f19] text-slate-100";
    cardClass = "bg-slate-900/30 backdrop-blur-md border border-slate-800/40 rounded-2xl p-6 shadow-xl shadow-black/30";
    textMutedClass = "text-slate-400";
    titleClass = "text-white";
  } else if (styleSettings.theme === "nordic") {
    bgClass = "bg-[#faf9f6]/95 text-slate-800";
    cardClass = "bg-white border-b-4 border-slate-900 rounded-none p-6 shadow-sm";
    textMutedClass = "text-slate-500 border-l border-slate-400 pl-3";
    titleClass = "text-slate-950 font-black";
  } else if (styleSettings.theme === "sunset") {
    bgClass = "bg-gradient-to-b from-[#180f12] to-[#040103] text-orange-50";
    cardClass = "bg-rose-950/20 backdrop-blur-md border border-rose-500/10 rounded-3xl p-6 shadow-2xl";
    textMutedClass = "text-rose-200/60";
    titleClass = "text-rose-100";
  }

  // 2. Establish Primary Font Family Matcher
  let fontStyle = { fontFamily: "Inter, sans-serif" };
  if (styleSettings.fontFamily === "Space Grotesk") {
    fontStyle = { fontFamily: "Space Grotesk, sans-serif" };
  } else if (styleSettings.fontFamily === "Outfit") {
    fontStyle = { fontFamily: "Outfit, sans-serif" };
  } else if (styleSettings.fontFamily === "JetBrains Mono") {
    fontStyle = { fontFamily: "JetBrains Mono, monospace" };
  } else if (styleSettings.fontFamily === "Playfair Display") {
    fontStyle = { fontFamily: "Playfair Display, serif" };
  }

  // Handle Contact submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", msg: "" });
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div 
      className={`min-h-screen ${bgClass} transition-all duration-300 px-4 sm:px-6 lg:px-8 py-16 text-left selection:bg-blue-500/30`}
      style={fontStyle}
    >
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* --- HERO / SOCIALS SEGMENT --- */}
        <header className="flex flex-col md:flex-row items-center md:items-start gap-8 justify-between relative">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${titleClass}`}>
              {portfolio.name}
            </h1>
            <p className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
              {portfolio.title}
            </p>
            <p className={`text-sm leading-relaxed max-w-xl ${textMutedClass}`}>
              {portfolio.bio}
            </p>
            
            {/* Social handles links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-3 text-slate-450">
              {portfolio.socialLinks?.github && (
                <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              )}
              {portfolio.socialLinks?.linkedin && (
                <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {portfolio.socialLinks?.twitter && (
                <a href={portfolio.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              <a href={`mailto:${portfolio.sections.contactEmail}`} className="hover:text-blue-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Portrait profile bubble */}
          <div className="relative">
            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-slate-900 shadow-xl">
              <img 
                src={portfolio.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"} 
                alt={portfolio.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
            {previewMode && (
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 text-[9px] bg-blue-500 text-white rounded font-mono font-bold animate-pulse">
                active preview
              </span>
            )}
          </div>
        </header>

        {/* --- DYNAMIC CUSTOMIZABLE RENDER SEQUENCES (layout sorted list) --- */}
        {portfolio.layout.map((secName) => {
          
          if (secName === "About Me") {
            return (
              <section key={secName} className="space-y-4">
                <h3 className={`text-xl font-bold uppercase tracking-wider border-b border-slate-800 pb-2 ${titleClass}`}>
                  About Me Profile
                </h3>
                <div className={cardClass}>
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-300">
                    {portfolio.description}
                  </p>
                </div>
              </section>
            );
          }

          if (secName === "Skills" && portfolio.sections.skills?.length > 0) {
            return (
              <section key={secName} className="space-y-4">
                <h3 className={`text-xl font-bold uppercase tracking-wider border-b border-slate-800 pb-2 ${titleClass}`}>
                  Key Specializations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolio.sections.skills.map((sk) => (
                    <div key={sk.name} className={cardClass}>
                      <div className="flex justify-between items-center mb-2 font-mono">
                        <span className="text-xs font-bold text-slate-205">{sk.name}</span>
                        <span className="text-[10px] text-blue-400 font-bold">{sk.percentage}%</span>
                      </div>
                      
                      {/* Percent Slider bar */}
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" 
                          style={{ width: `${sk.percentage}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secName === "Projects" && portfolio.sections.projects?.length > 0) {
            return (
              <section key={secName} className="space-y-4">
                <h3 className={`text-xl font-bold uppercase tracking-wider border-b border-slate-800 pb-2 ${titleClass}`}>
                  Selected Project Portlets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolio.sections.projects.map((proj) => (
                    <div key={proj.id} className={`${cardClass} flex flex-col justify-between`}>
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h4 className={`text-lg font-bold ${titleClass}`}>{proj.title}</h4>
                          {proj.liveUrl && (
                            <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-white p-1">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <p className={`text-xs leading-relaxed mb-4 ${textMutedClass}`}>
                          {proj.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {proj.techStack?.map((t, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-400 font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secName === "Work Experience" && portfolio.sections.experience?.length > 0) {
            return (
              <section key={secName} className="space-y-4">
                <h3 className={`text-xl font-bold uppercase tracking-wider border-b border-slate-800 pb-2 ${titleClass}`}>
                  Career Achievements
                </h3>
                <div className="space-y-4">
                  {portfolio.sections.experience.map((ex) => (
                    <div key={ex.id} className={`${cardClass} flex flex-col sm:flex-row justify-between gap-4`}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-blue-400" />
                          <h4 className={`text-base font-bold ${titleClass}`}>{ex.role}</h4>
                        </div>
                        <p className={`text-xs ${textMutedClass}`}>{ex.company}</p>
                        <p className="text-xs leading-relaxed text-slate-300">{ex.description}</p>
                      </div>

                      <div className="flex items-start text-xs font-mono text-slate-400 whitespace-nowrap">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{ex.period}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secName === "Education" && portfolio.sections.education?.length > 0) {
            return (
              <section key={secName} className="space-y-4">
                <h3 className={`text-xl font-bold uppercase tracking-wider border-b border-slate-800 pb-2 ${titleClass}`}>
                  Education milestones
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolio.sections.education.map((edu) => (
                    <div key={edu.id} className={cardClass}>
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className={`text-sm font-extrabold ${titleClass}`}>{edu.degree}</h4>
                          <p className={`text-xs mt-0.5 ${textMutedClass}`}>{edu.school}</p>
                          <span className="text-[10px] text-indigo-400 font-mono mt-1 inline-block">{edu.year}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secName === "Certifications" && portfolio.sections.certifications?.length > 0) {
            return (
              <section key={secName} className="space-y-4">
                <h3 className={`text-xl font-bold uppercase tracking-wider border-b border-slate-800 pb-2 ${titleClass}`}>
                  Verified Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolio.sections.certifications.map((c) => (
                    <div key={c.id} className={cardClass}>
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                          <Award className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className={`text-sm font-extrabold ${titleClass}`}>{c.name}</h4>
                          <p className={`text-xs mt-0.5 ${textMutedClass}`}>issued by {c.issuer}</p>
                          <span className="text-[10px] text-emerald-400 font-mono mt-1 inline-block">{c.year}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secName === "Blogs" && portfolio.sections.blogs?.length > 0) {
            return (
              <section key={secName} className="space-y-4">
                <h3 className={`text-xl font-bold uppercase tracking-wider border-b border-slate-800 pb-2 ${titleClass}`}>
                  Technical Publications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolio.sections.blogs.map((b) => (
                    <div key={b.id} className={`${cardClass} flex flex-col justify-between`}>
                      <div>
                        <h4 className={`text-sm font-extrabold ${titleClass}`}>{b.title}</h4>
                        <p className={`text-xs mt-2 line-clamp-2 ${textMutedClass}`}>{b.excerpt}</p>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-3 mt-4 border-t border-slate-900/60">
                        <span>{b.publishDate}</span>
                        <span>{b.readTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secName === "Contact") {
            return (
              <section key={secName} className="space-y-4">
                <h3 className={`text-xl font-bold uppercase tracking-wider border-b border-slate-800 pb-2 ${titleClass}`}>
                  Contact & Get In Touch
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left info column */}
                  <div className="md:col-span-5 space-y-4">
                    <p className={`text-xs ${textMutedClass}`}>
                      Feel free to drop a line to discuss full-time hiring opportunities, consulting requests, or freelance design scopes.
                    </p>

                    <div className="space-y-3 font-mono text-xs text-slate-350">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-400" />
                        <span>{portfolio.sections.contactEmail}</span>
                      </div>
                      {portfolio.sections.contactPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-blue-400" />
                          <span>{portfolio.sections.contactPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form response elements */}
                  <form onSubmit={handleContactSubmit} className="md:col-span-7 space-y-3">
                    <input 
                      type="text" 
                      required
                      placeholder="My full name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                    />
                    <input 
                      type="email" 
                      required
                      placeholder="corporate@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <textarea 
                      required
                      placeholder="Write message details details..."
                      rows={3}
                      value={formData.msg}
                      onChange={(e) => setFormData(prev => ({ ...prev, msg: e.target.value }))}
                      className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 text-xs focus:outline-none focus:border-blue-500 font-sans"
                    />

                    {submitSuccess ? (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="h-4 w-4" /> Message successfully queued to inbox!
                      </div>
                    ) : (
                      <button 
                        type="submit"
                        disabled={submitting}
                        className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                        Email {portfolio.name}
                      </button>
                    )}
                  </form>
                </div>
              </section>
            );
          }

          return null;
        })}

      </div>
    </div>
  );
};
