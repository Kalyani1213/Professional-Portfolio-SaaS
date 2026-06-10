import React, { useState, useEffect } from "react";
import { FirebaseProvider, useFirebase, db } from "./components/FirebaseProvider";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { LandingView } from "./components/LandingView";
import { FeaturesView, TemplatesView } from "./components/SecondaryViews";
import { DashboardView } from "./components/DashboardView";
import { PortfolioBuilderView } from "./components/PortfolioBuilderView";
import { PublicPortfolioView } from "./components/PublicPortfolioView";
import { PortfolioData } from "./types";
import { 
  Sparkles, Shield, User, Key, KeyRound, AlertCircle, Loader2, ArrowRight, CheckCircle2 
} from "lucide-react";

function MainAppContent() {
  const { user, profile, loading, googleSignIn, emailRegister, emailLogin } = useFirebase();
  const [currentView, setView] = useState<string>("landing");
  const [selectedPortfolioForBuilder, setSelectedPortfolioForBuilder] = useState<PortfolioData | null>(null);

  // Public portfolio routing state
  const [isPublicRoute, setIsPublicRoute] = useState(false);
  const [publicSlug, setPublicSlug] = useState("");
  const [publicPortfolio, setPublicPortfolio] = useState<PortfolioData | null>(null);
  const [loadingPublic, setLoadingPublic] = useState(false);

  // Auth modal modal trigger
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");

  // Clear states when modal toggled/closed
  useEffect(() => {
    if (!showAuthModal) {
      setAuthError("");
    }
  }, [showAuthModal]);

  // URL Path router detection
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/p/")) {
      const slug = path.substring(3).trim();
      if (slug) {
        setIsPublicRoute(true);
        setPublicSlug(slug);
        loadPublicPortfolio(slug);
      }
    }
  }, []);

  async function loadPublicPortfolio(slug: string) {
    setLoadingPublic(true);
    try {
      // First check local mock fallback global portfolios
      const globRaw = localStorage.getItem("fallback_global_portfolios") || "{}";
      const glob = JSON.parse(globRaw);
      if (glob[slug]) {
        setPublicPortfolio(glob[slug]);
        setLoadingPublic(false);
        return;
      }
    } catch (err) {
      console.error("Public parsing error:", err);
    } finally {
      setLoadingPublic(false);
    }
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      if (authMode === "register") {
        await emailRegister(authEmail, authPass, authName);
      } else {
        await emailLogin(authEmail, authPass);
      }
      setShowAuthModal(false);
      setAuthEmail("");
      setAuthPass("");
      setAuthName("");
      setView("dashboard");
    } catch (err: any) {
      console.error("Auth submit error:", err);
      setAuthError(err.message || "Credential authentication failed. Please retry.");
    }
  };

  // 1. PUBLIC ROUTE RENDER SWITCH
  if (isPublicRoute) {
    if (loadingPublic) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <p className="font-mono text-sm uppercase tracking-widest text-slate-400">Loading PortfolioAI Site...</p>
        </div>
      );
    }

    if (publicPortfolio) {
      return <PublicPortfolioView portfolio={publicPortfolio} />;
    }

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 text-left px-6">
        <div className="p-8 max-w-md bg-slate-900 rounded-3xl border border-slate-800 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-black text-white">404 - Portfolio Not Found</h2>
          <p className="text-xs text-slate-400">
            The requested address path <span className="font-mono text-blue-400 font-bold">/p/{publicSlug}</span> has not been claimed or published.
          </p>
          <a 
            href="/"
            className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-505 transition"
          >
            Claim This Slug on PortfolioAI
          </a>
        </div>
      </div>
    );
  }

  // 2. WORKSPACE BUILDER ACTIVE SWITCH
  if (selectedPortfolioForBuilder) {
    return (
      <PortfolioBuilderView 
        portfolio={selectedPortfolioForBuilder} 
        onBack={() => {
          setSelectedPortfolioForBuilder(null);
          setView("dashboard");
        }} 
      />
    );
  }

  // 3. MAIN SAAS HOME PAGE ROUTING
  return (
    <div className="bg-slate-950 min-h-screen flex flex-col text-slate-100 antialiased selection:bg-blue-500/30">
      
      {/* Universal navigation head */}
      <Navbar 
        currentView={currentView} 
        setView={setView} 
        openAuthModal={() => { setAuthMode("login"); setShowAuthModal(true); }} 
      />

      {/* Main core pages screen dynamic transitions */}
      <main className="flex-1">
        {currentView === "landing" && (
          <LandingView 
            setView={setView} 
            openAuthModal={() => { setAuthMode("register"); setShowAuthModal(true); }} 
          />
        )}
        {currentView === "features" && <FeaturesView />}
        {currentView === "templates" && <TemplatesView setView={(v) => setView(v)} />}

        {currentView === "dashboard" && (
          user ? (
            <DashboardView 
              onEditPortfolio={(p) => setSelectedPortfolioForBuilder(p)} 
              setView={setView}
            />
          ) : (
            <div className="max-w-md mx-auto text-center py-24 space-y-6">
              <Shield className="h-10 w-10 text-blue-400 mx-auto animate-pulse" />
              <div>
                <h3 className="text-xl font-bold text-white">Dashboard Credentials Required</h3>
                <p className="text-xs text-slate-450 mt-1">Please sign in or register a new SaaS profile to construct custom domains.</p>
              </div>
              <button 
                onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg transition"
              >
                Sign In to Workspace
              </button>
            </div>
          )
        )}
      </main>

      {/* Universal footer */}
      <Footer />


      {/* AUTH POPUP DIALOG MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 relative">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="h-10 w-10 mx-auto bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-3">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-extrabold text-white">
                {authMode === "register" ? "Create Free Account" : "Access Console"}
              </h3>
              <p className="text-xs text-slate-450 mt-1">
                {authMode === "register" ? "Get 20 free Gemini credits immediately" : "Welcome back to your builder dashboard"}
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 text-left animate-pulse">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span className="leading-snug">{authError}</span>
              </div>
            )}

            {/* Standard Login & Registration Forms */}
            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs font-semibold text-left">
              {authMode === "register" && (
                <div className="space-y-1.5">
                  <label className="text-slate-400 ml-0.5">Your Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={authName} 
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-850 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-slate-400 ml-0.5">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={authEmail} 
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-850 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 ml-0.5">Password</label>
                <input 
                  type="password" 
                  required
                  value={authPass} 
                  onChange={(e) => setAuthPass(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-850 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wide transition shadow-lg shadow-blue-500/10 cursor-pointer text-center text-xs"
              >
                {authMode === "register" ? "Register & Create Profile" : "Access Workspace"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5 text-center select-none">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative bg-slate-900 px-3 text-[10px] uppercase font-mono font-bold text-slate-500">
                or use single sign-on
              </span>
            </div>

            {/* Google Sign In CTA */}
            <button 
              onClick={async () => {
                setAuthError("");
                try {
                  await googleSignIn();
                  setShowAuthModal(false);
                  setAuthEmail("");
                  setAuthPass("");
                  setAuthName("");
                  setView("dashboard");
                } catch (err: any) {
                  setAuthError(err.message || "Google single sign-on failed.");
                }
              }}
              type="button"
              className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-slate-300 font-bold border border-slate-800 rounded-xl transition flex items-center justify-center gap-2 text-xs cursor-pointer shadow-md active:scale-[0.98]"
            >
              <KeyRound className="h-4.5 w-4.5 text-amber-500 shrink-0" />
              Sign In with Google SSO
            </button>

            {/* Mode switch helper */}
            <p className="text-center font-semibold text-[11px] text-slate-500 mt-6 select-none">
              {authMode === "register" ? "Already have an account?" : "Brand new to PortfolioAI?"}
              <button 
                onClick={() => {
                  setAuthMode(authMode === "register" ? "login" : "register");
                  setAuthError("");
                }}
                className="text-blue-400 underline font-extrabold ml-1 hover:text-white"
              >
                {authMode === "register" ? "Log In here" : "Sign up free"}
              </button>
            </p>

            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white text-sm"
            >
              ×
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <FirebaseProvider>
      <MainAppContent />
    </FirebaseProvider>
  );
}
