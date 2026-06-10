import React from "react";
import { Sparkles, Compass, CreditCard, LayoutDashboard, LogOut, ArrowRight, Menu, X, User } from "lucide-react";
import { useFirebase } from "./FirebaseProvider";

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, openAuthModal }) => {
  const { user, profile, logout } = useFirebase();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setView("landing")}>
            <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 mr-2.5">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <span className="font-sans font-bold text-lg tracking-tight text-white">
              Portfolio<span className="text-blue-400 bg-clip-text">AI</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => setView("landing")}
              className={`text-sm font-medium transition-colors ${currentView === "landing" ? "text-blue-400" : "text-slate-300 hover:text-white"}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setView("features")}
              className={`text-sm font-medium transition-colors ${currentView === "features" ? "text-blue-400" : "text-slate-300 hover:text-white"}`}
            >
              Features
            </button>
            <button 
              onClick={() => setView("templates")}
              className={`text-sm font-medium transition-colors ${currentView === "templates" ? "text-blue-400" : "text-slate-300 hover:text-white"}`}
            >
              Templates
            </button>
          </div>

          {/* Right Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setView("dashboard")}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-500/10 flex items-center gap-1.5"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </button>
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                    {profile?.displayName ? profile.displayName[0].toUpperCase() : <User className="h-4 w-4" />}
                  </div>
                  <button 
                    onClick={logout}
                    title="Log out" 
                    className="p-1 px-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={openAuthModal}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5"
                >
                  Sign In
                </button>
                <button 
                  onClick={openAuthModal}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center gap-1 shadow-lg shadow-blue-500/15"
                >
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-3">
          <button 
            onClick={() => { setView("landing"); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-base font-semibold text-slate-300 hover:text-white"
          >
            Overview
          </button>
          <button 
            onClick={() => { setView("features"); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-base font-semibold text-slate-300 hover:text-white"
          >
            Features
          </button>
          <button 
            onClick={() => { setView("templates"); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-base font-semibold text-slate-300 hover:text-white"
          >
            Templates
          </button>
          
          <div className="pt-4 border-t border-slate-800">
            {user ? (
              <div className="space-y-2">
                <button 
                  onClick={() => { setView("dashboard"); setMobileMenuOpen(false); }}
                  className="w-full text-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-1.5"
                >
                  <LayoutDashboard className="h-4.5 w-4.5" />
                  Dashboard
                </button>
                <button 
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-xl font-semibold flex items-center justify-center gap-1.5"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button 
                  onClick={() => { openAuthModal(); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2.5 rounded-xl text-base font-semibold text-slate-350 bg-slate-900 border border-slate-800"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => { openAuthModal(); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2.5 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
