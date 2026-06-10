import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, PortfolioData, ViewAnalytics } from "../types";
import { STARTER_PORTFOLIOS } from "../constants";

interface FirebaseContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  portfolios: PortfolioData[];
  activePortfolio: PortfolioData | null;
  googleSignIn: () => Promise<void>;
  emailRegister: (email: string, pass: string, name: string) => Promise<void>;
  emailLogin: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  savePortfolio: (data: PortfolioData) => Promise<void>;
  deleteUserPortfolio: (id: string) => Promise<void>;
  createNewPortfolio: (id: string, name: string, templateId: string) => Promise<PortfolioData>;
  refreshPortfolios: () => Promise<void>;
  incrementPortfolioViews: (id: string, source?: string) => Promise<void>;
  getPortfolioAnalytics: (id: string) => Promise<ViewAnalytics>;
  upgradeToPro: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error("useFirebase must be used within a FirebaseProvider");
  return context;
};

// Mock placeholders to prevent import breaks in standard configurations of the app
export const db = {};
export const auth = {};

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [portfolios, setPortfolios] = useState<PortfolioData[]>([]);
  const [activePortfolio, setActivePortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user state from localStorage on mount
  useEffect(() => {
    // Seed some initial local fallback portfolios if empty
    const globRaw = localStorage.getItem("fallback_global_portfolios");
    if (!globRaw) {
      localStorage.setItem("fallback_global_portfolios", JSON.stringify({}));
    }

    const storedUser = localStorage.getItem("local_current_user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser({
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        emailVerified: true,
      });
      setProfile({
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        plan: "pro", // Give pro tier to all local creators
        aiCredits: 500,
      });

      // Load user portfolios
      const storedPortfolios = localStorage.getItem(`local_portfolios_${u.uid}`);
      if (storedPortfolios) {
        setPortfolios(JSON.parse(storedPortfolios));
      } else {
        setPortfolios([]);
      }
    } else {
      setUser(null);
      setProfile(null);
      setPortfolios([]);
    }
    setLoading(false);
  }, []);

  const refreshPortfolios = async () => {
    if (user) {
      const stored = localStorage.getItem(`local_portfolios_${user.uid}`);
      if (stored) {
        setPortfolios(JSON.parse(stored));
      } else {
        setPortfolios([]);
      }
    }
  };

  const googleSignIn = async () => {
    // Generate a quick mock Google SSO user
    const gUid = "google_" + Math.random().toString(36).substring(2, 11);
    const mockGoogleUser = {
      uid: gUid,
      email: "portfolio_creator@google.com",
      displayName: "Creator Pro",
    };
    localStorage.setItem("local_current_user", JSON.stringify(mockGoogleUser));
    
    // Save to user database as well
    const fallbackUsersRaw = localStorage.getItem("local_users_db") || "[]";
    const fallbackUsers = JSON.parse(fallbackUsersRaw);
    if (!fallbackUsers.some((u: any) => u.email === mockGoogleUser.email)) {
      fallbackUsers.push({ ...mockGoogleUser, password: "sso" });
      localStorage.setItem("local_users_db", JSON.stringify(fallbackUsers));
    }

    setUser({
      uid: gUid,
      email: mockGoogleUser.email,
      displayName: mockGoogleUser.displayName,
      emailVerified: true,
    });
    setProfile({
      uid: gUid,
      email: mockGoogleUser.email,
      displayName: mockGoogleUser.displayName,
      plan: "pro",
      aiCredits: 500,
    });

    const storedPortfolios = localStorage.getItem(`local_portfolios_${gUid}`);
    setPortfolios(storedPortfolios ? JSON.parse(storedPortfolios) : []);
  };

  const emailRegister = async (email: string, pass: string, name: string) => {
    const fallbackUsersRaw = localStorage.getItem("local_users_db") || "[]";
    const fallbackUsers = JSON.parse(fallbackUsersRaw);
    if (fallbackUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Email address already in use. Please log in instead.");
    }

    const newUid = "local_" + Math.random().toString(36).substring(2, 11);
    const newLocalUser = {
      uid: newUid,
      email: email.toLowerCase(),
      password: pass,
      displayName: name,
    };
    fallbackUsers.push(newLocalUser);
    localStorage.setItem("local_users_db", JSON.stringify(fallbackUsers));

    // Save session
    localStorage.setItem("local_current_user", JSON.stringify(newLocalUser));

    setUser({
      uid: newUid,
      email: email.toLowerCase(),
      displayName: name,
      emailVerified: true,
    });
    setProfile({
      uid: newUid,
      email: email.toLowerCase(),
      displayName: name,
      plan: "pro",
      aiCredits: 500,
    });

    // Initialize user portfolios
    const defaultPortfolios: PortfolioData[] = [];
    localStorage.setItem(`local_portfolios_${newUid}`, JSON.stringify(defaultPortfolios));
    setPortfolios(defaultPortfolios);
  };

  const emailLogin = async (email: string, pass: string) => {
    const fallbackUsersRaw = localStorage.getItem("local_users_db") || "[]";
    const fallbackUsers = JSON.parse(fallbackUsersRaw);
    const match = fallbackUsers.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass
    );

    if (!match) {
      throw new Error("Invalid credentials or user not found. Please register first.");
    }

    localStorage.setItem("local_current_user", JSON.stringify(match));

    setUser({
      uid: match.uid,
      email: match.email,
      displayName: match.displayName,
      emailVerified: true,
    });
    setProfile({
      uid: match.uid,
      email: match.email,
      displayName: match.displayName,
      plan: "pro",
      aiCredits: 500,
    });

    const storedPortfolios = localStorage.getItem(`local_portfolios_${match.uid}`);
    setPortfolios(storedPortfolios ? JSON.parse(storedPortfolios) : []);
  };

  const logout = async () => {
    localStorage.removeItem("local_current_user");
    setUser(null);
    setProfile(null);
    setPortfolios([]);
    setActivePortfolio(null);
  };

  const upgradeToPro = async () => {
    if (profile) {
      const updated = { ...profile, plan: "pro" as const, aiCredits: 500 };
      setProfile(updated);
    }
  };

  const createNewPortfolio = async (id: string, name: string, templateId: string): Promise<PortfolioData> => {
    if (!user) throw new Error("Authentication required");

    // Clean space ID slug validation
    const cleanId = id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
    if (!cleanId) throw new Error("A valid URL pathname slug is required");

    // Check availability
    const globRaw = localStorage.getItem("fallback_global_portfolios") || "{}";
    const glob = JSON.parse(globRaw);
    if (glob[cleanId]) {
      throw new Error(`The URL slug '/p/${cleanId}' is already taken. Please enter a different name.`);
    }

    // Prepare from premium preset
    const starterPreset = STARTER_PORTFOLIOS[templateId] || STARTER_PORTFOLIOS["dev"];
    const newPort: PortfolioData = {
      ...starterPreset,
      id: cleanId,
      userId: user.uid,
      name: name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save global cache
    glob[cleanId] = newPort;
    localStorage.setItem("fallback_global_portfolios", JSON.stringify(glob));

    // Save user list
    const uKey = `local_portfolios_${user.uid}`;
    const savedListRaw = localStorage.getItem(uKey) || "[]";
    const savedList = JSON.parse(savedListRaw);
    savedList.push(newPort);
    localStorage.setItem(uKey, JSON.stringify(savedList));
    setPortfolios(savedList);

    // Save dummy analytics
    const localAnalytic = {
      portfolioId: cleanId,
      views: 0,
      uniqueViews: 0,
      trafficSources: { direct: 0, google: 0, linkedin: 0 },
      projectHits: {},
      monthlyGrowth: [
        { month: "May", views: 0 },
        { month: "Jun", views: 0 }
      ],
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(`local_analytic_${cleanId}`, JSON.stringify(localAnalytic));
    return newPort;
  };

  const savePortfolio = async (data: PortfolioData) => {
    if (!user) return;
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    // Global cache
    const globRaw = localStorage.getItem("fallback_global_portfolios") || "{}";
    const glob = JSON.parse(globRaw);
    glob[data.id] = updatedData;
    localStorage.setItem("fallback_global_portfolios", JSON.stringify(glob));

    // User list
    const uKey = `local_portfolios_${user.uid}`;
    const savedListRaw = localStorage.getItem(uKey) || "[]";
    let savedList = JSON.parse(savedListRaw);
    savedList = savedList.map((p: any) => p.id === data.id ? updatedData : p);
    localStorage.setItem(uKey, JSON.stringify(savedList));
    setPortfolios(savedList);

    if (profile && profile.aiCredits > 0) {
      const remaining = profile.aiCredits - 1;
      setProfile(p => p ? { ...p, aiCredits: remaining } : null);
    }
  };

  const deleteUserPortfolio = async (id: string) => {
    if (!user) return;

    // Global cache
    const globRaw = localStorage.getItem("fallback_global_portfolios") || "{}";
    const glob = JSON.parse(globRaw);
    delete glob[id];
    localStorage.setItem("fallback_global_portfolios", JSON.stringify(glob));

    // User list
    const uKey = `local_portfolios_${user.uid}`;
    const savedListRaw = localStorage.getItem(uKey) || "[]";
    let savedList = JSON.parse(savedListRaw);
    savedList = savedList.filter((p: any) => p.id !== id);
    localStorage.setItem(uKey, JSON.stringify(savedList));
    setPortfolios(savedList);

    localStorage.removeItem(`local_analytic_${id}`);
  };

  const incrementPortfolioViews = async (id: string, source = "direct") => {
    const aKey = `local_analytic_${id}`;
    const localRaw = localStorage.getItem(aKey);
    if (localRaw) {
      const localData = JSON.parse(localRaw);
      localData.views = (localData.views || 0) + 1;
      localData.trafficSources[source] = (localData.trafficSources[source] || 0) + 1;
      localStorage.setItem(aKey, JSON.stringify(localData));
    }
  };

  const getPortfolioAnalytics = async (id: string): Promise<ViewAnalytics> => {
    const aKey = `local_analytic_${id}`;
    const localRaw = localStorage.getItem(aKey);
    if (localRaw) {
      return JSON.parse(localRaw) as ViewAnalytics;
    }
    return {
      portfolioId: id,
      views: 0,
      uniqueViews: 0,
      trafficSources: { direct: 0, google: 0, linkedin: 0 },
      projectHits: {},
      monthlyGrowth: [
        { month: "Jan", views: 15 },
        { month: "Feb", views: 24 },
        { month: "Mar", views: 50 },
        { month: "Apr", views: 85 },
        { month: "May", views: 140 },
        { month: "Jun", views: 210 }
      ]
    };
  };

  return (
    <FirebaseContext.Provider value={{
      user,
      profile,
      loading,
      portfolios,
      activePortfolio,
      googleSignIn,
      emailRegister,
      emailLogin,
      logout,
      savePortfolio,
      deleteUserPortfolio,
      createNewPortfolio,
      refreshPortfolios,
      incrementPortfolioViews,
      getPortfolioAnalytics,
      upgradeToPro
    }}>
      {!loading && children}
    </FirebaseContext.Provider>
  );
};
