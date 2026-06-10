export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  plan: "free" | "pro";
  aiCredits: number;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface CustomStyles {
  theme: "dark" | "light" | "glass" | "glass-dark" | "sunset" | "nordic";
  primaryColor: string; // Hex color code
  fontFamily: "Inter" | "Space Grotesk" | "Outfit" | "JetBrains Mono" | "Playfair Display";
  cardStyle: "rounded-lg" | "rounded-2xl" | "rounded-none" | "glassmorphism";
}

export interface SkillItem {
  name: string;
  percentage: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  image?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string; // e.g. "Jan 2022 - Aug 2024"
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  role: string;
  company: string;
  feedback: string;
  avatar?: string;
}

export interface BlogItem {
  id: string;
  title: string;
  excerpt: string;
  publishDate: string;
  readTime: string;
}

export interface PortfolioSections {
  skills: SkillItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  achievements: string[];
  testimonials: TestimonialItem[];
  blogs: BlogItem[];
  contactEmail: string;
  contactPhone?: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
  youtube?: string;
}

export interface PortfolioData {
  id: string;          // Acts as slug / vanity url path
  userId: string;
  name: string;        // Portfolio Title Name
  templateId: "dev" | "designer" | "freelancer" | "student" | "founder" | "creative";
  title: string;       // Creative headline
  bio: string;
  description: string;
  profileImage: string;
  resumeUrl?: string;
  customDomain?: string;
  seoSettings: SEOSettings;
  customStyles: CustomStyles;
  layout: string[];    // Array of active layout sections in order e.g. ["About Me", "Skills", "Projects", "Work Experience", "Education", "Certifications", "Testimonials", "Blogs", "Contact"]
  sections: PortfolioSections;
  socialLinks: SocialLinks;
  createdAt: string;
  updatedAt: string;
}

export interface ViewAnalytics {
  portfolioId: string;
  views: number;
  uniqueViews: number;
  trafficSources: { [source: string]: number };
  projectHits: { [projectId: string]: number };
  monthlyGrowth: { month: string; views: number }[];
}
