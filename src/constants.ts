import { PortfolioData } from "./types";

export const TEMPLATE_METADATA = [
  {
    id: "dev",
    name: "Developer Portfolio",
    description: "Tailored for software engineers, developers, and architects. Focused on technical skill ratings and project repositories.",
    color: "from-blue-600 to-indigo-600",
    banner: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "designer",
    name: "Designer Portfolio",
    description: "Highly aesthetic visual gallery for UI/UX engineers, graphic artists, and web creators to focus on graphics and project images.",
    color: "from-pink-500 to-rose-500",
    banner: "https://images.unsplash.com/photo-1541462608141-27b2c7453c6f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "freelancer",
    name: "Freelancer Portfolio",
    description: "Sleek agency portfolio highlighting testimonials, service catalogs, contract pricing, and prompt client-contact systems.",
    color: "from-emerald-500 to-teal-600",
    banner: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "student",
    name: "Student Portfolio",
    description: "Clean simple design promoting academic research work, internships, educational highlights, Extracurricular activities, and projects.",
    color: "from-amber-500 to-orange-600",
    banner: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "founder",
    name: "Startup Founder Portfolio",
    description: "Professional design focusing on pitches, company growth history, milestones, blogs, social media outreach, and advisory details.",
    color: "from-violet-600 to-purple-600",
    banner: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "creative",
    name: "Creative Portfolio",
    description: "Avant-garde visual setup for authors, actors, content creators, photographers, and independent visual design professionals.",
    color: "from-cyan-500 to-blue-500",
    banner: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80",
  }
];

export const STARTER_PORTFOLIOS: Record<string, PortfolioData> = {
  dev: {
    id: "dev-starter",
    userId: "system",
    name: "Alex Dev Portfolio",
    templateId: "dev",
    title: "Senior Full Stack Dev & Cloud Architect",
    bio: "Building resilient microservices and distributed UI architectures that process millions of requests.",
    description: "I am a Passionate software architect with 6+ years of expertise. I love optimization battles, crafting robust TypeScript frameworks, and simplifying operational workflows.",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    resumeUrl: "#",
    seoSettings: {
      metaTitle: "Alex Rivers | Senior Full Stack Engineer Developer",
      metaDescription: "Professional full stack software portfolio specializing in TypeScript, Node, and secure cloud operations.",
      keywords: ["Full Stack", "TypeScript", "Nodejs", "AWS", "Docker", "DevOps"]
    },
    customStyles: {
      theme: "glass-dark",
      primaryColor: "#3b82f6",
      fontFamily: "Space Grotesk",
      cardStyle: "glassmorphism"
    },
    layout: ["About Me", "Skills", "Projects", "Work Experience", "Education", "Certifications", "Testimonials", "Blogs", "Contact"],
    sections: {
      skills: [
        { name: "TypeScript & React", percentage: 95 },
        { name: "Node.js (Express & NestJS)", percentage: 90 },
        { name: "Cloud Infrastructure (GCP, AWS)", percentage: 85 },
        { name: "Docker, Kubernetes & CI/CD", percentage: 80 }
      ],
      projects: [
        {
          id: "p1",
          title: "Realtime Collaborative Editor",
          description: "An operational transformation based rich-text editor allowing 100+ clients to type concurrently with live server cursor coordination.",
          techStack: ["Next.js", "WebSockets", "Redis", "Yjs"],
          liveUrl: "https://example.com/editor",
          githubUrl: "https://github.com/rivers/editor"
        },
        {
          id: "p2",
          title: "Zero-Trust SaaS Firewalls",
          description: "High speed edge authorization middleware handling request screening under 3ms latency averages.",
          techStack: ["Rust", "Cloudflare Workers", "WebAssembly"],
          liveUrl: "https://example.com/secure",
          githubUrl: "https://github.com/rivers/firewall"
        }
      ],
      experience: [
        {
          id: "e1",
          role: "Principal Platform Architect",
          company: "Enterprise CloudCorp",
          period: "2023 - Present",
          description: "Spearheaded internal migration to GCP serverless microservices saving $1.2M in annual cloud spending while boosting system availability metrics to 99.99%."
        },
        {
          id: "e2",
          role: "Senior Full Stack Dev",
          company: "WebDev Masters",
          period: "2021 - 2023",
          description: "Engineered robust internal design system utilized by 45 cross-functional product squads, dropping frontend delivery times by 35%."
        }
      ],
      education: [
        {
          id: "edu1",
          degree: "B.S. in Computer Science",
          school: "Stanford University",
          year: "2017 - 2021"
        }
      ],
      certifications: [
        {
          id: "c1",
          name: "Professional Cloud DevOps Engineer",
          issuer: "Google Cloud",
          year: "2024"
        }
      ],
      achievements: [
        "First Place Winner in CloudCorp Global Hackathon 2023",
        "Author of 'Simplified Microservices' technical ebook with 20K+ downloads"
      ],
      testimonials: [
        {
          id: "t1",
          clientName: "Eleanor Vance",
          role: "VP of Engineering",
          company: "Fintech Giants",
          feedback: "Alex has a rare combination of pure technical execution speed and exceptional system design foresight. He completed our core ledger rewrite 3 weeks early."
        }
      ],
      blogs: [
        {
          id: "b1",
          title: "The Silent Cost of Webpack to Vite Migrations",
          excerpt: "Deep diving into actual bundling size graphs, browser cache invalidations, and developer team productivity metrics.",
          publishDate: "Oct 12, 2025",
          readTime: "4 min read"
        }
      ],
      contactEmail: "alex.rivers@riversdev.example"
    },
    socialLinks: {
      github: "https://github.com/example",
      linkedin: "https://linkedin.com/example",
      twitter: "https://twitter.com/example"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  designer: {
    id: "designer-starter",
    userId: "system",
    name: "Elena Bloom Portfolio",
    templateId: "designer",
    title: "Senior Brand & UI/UX Designer",
    bio: "Weaving beautiful customer journeys and interfaces that make applications feel human.",
    description: "Designing for emotional resonance. Over 7 years of crafting product visual identities, responsive interface systems, and complex bento-grid visuals that elevate product stories.",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    resumeUrl: "#",
    seoSettings: {
      metaTitle: "Elena Bloom | Lead Brand & UIUX Design Master",
      metaDescription: "Visual brand architect portfolio presenting premium templates & typography systems.",
      keywords: ["Designer", "Figma", "Branding", "UIUX", "Typography", "Art Direction"]
    },
    customStyles: {
      theme: "nordic",
      primaryColor: "#f43f5e",
      fontFamily: "Outfit",
      cardStyle: "rounded-2xl"
    },
    layout: ["About Me", "Skills", "Projects", "Work Experience", "Education", "Certifications", "Testimonials", "Blogs", "Contact"],
    sections: {
      skills: [
        { name: "Visual Identity & Branding", percentage: 98 },
        { name: "Figma Typography Design Systems", percentage: 95 },
        { name: "Interaction Design", percentage: 90 },
        { name: "Motion Prototyping", percentage: 85 }
      ],
      projects: [
        {
          id: "p1",
          title: "Luna Mindfulness Redesign",
          description: "Full user experience revamping for a famous focus application, improving Day-7 retention from 18% to 32% through soothing visual systems.",
          techStack: ["Figma", "User Research", "Component Library", "A/B Testing"],
          liveUrl: "https://example.com/luna",
          githubUrl: ""
        }
      ],
      experience: [
        {
          id: "e1",
          role: "Creative Director",
          company: "Bloom Creative Labs",
          period: "2023 - Present",
          description: "Supervised product design of 4 core SaaS products, redefining brand typography guidelines and customer feedback touchpoints."
        }
      ],
      education: [
        {
          id: "edu1",
          degree: "Bachelor of Fine Arts (BFA) in Design",
          school: "Rhode Island School of Design",
          year: "2015 - 2019"
        }
      ],
      certifications: [
        {
          id: "c1",
          name: "Strategic Art Leadership",
          issuer: "Design Leaders Alliance",
          year: "2022"
        }
      ],
      achievements: [
        "Awwwards Web Design Winner - Jan 2024",
        "Keynote Speaker at UX International Expo 2025"
      ],
      testimonials: [
        {
          id: "t1",
          clientName: "David Vance",
          role: "Product Manager",
          company: "HealthTrack corp",
          feedback: "Elena is an outstanding creative who matches data analytics and research directly to visual poetry. A breeze to collaborate with."
        }
      ],
      blogs: [
        {
          id: "b1",
          title: "Why Minimalist Cards Don't Equal Lazy Design",
          excerpt: "Unpacking whitespace proportions, micro-interactions, layout rhythms, and the extreme power of silent borders.",
          publishDate: "Sept 10, 2025",
          readTime: "5 min read"
        }
      ],
      contactEmail: "elena@bloomdesign.example"
    },
    socialLinks: {
      linkedin: "https://linkedin.com/example",
      twitter: "https://twitter.com/example"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};
