import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Cache/Lazy instantiation for Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required but missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for body parsing
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // --- API ROUTES ---

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "PortfolioAI Support Server" });
  });

  // 1. AI BIO / PROFESSIONAL SUMMARY GENERATOR
  app.post("/api/ai/generate-bio", async (req, res) => {
    try {
      const { name, profession, style, keyKeywords, bulletPoints } = req.body;
      if (!name || !profession) {
        return res.status(400).json({ error: "Name and profession are required." });
      }

      const client = getGeminiClient();
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a gorgeous professional bio and professional summary statement for an expert portfolio.
        Name: ${name}
        Profession: ${profession}
        Vibe / Style Style: ${style || "modern and professional"}
        Keywords/Skills to highlight: ${keyKeywords || "none specified"}
        Experience bullet points/hobbies: ${bulletPoints || "none specified"}

        Respond strictly as a JSON object with properties:
        - "bio": a short catchy 2-sentence visual bio for hero section.
        - "summary": a comprehensive 4-sentence introductory professional statement for About Me.
        - "tagline": a short powerful 4-to-6 word visual tagline/headline.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bio: { type: Type.STRING },
              summary: { type: Type.STRING },
              tagline: { type: Type.STRING }
            },
            required: ["bio", "summary", "tagline"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty text returned from Gemini API.");
      }

      const parsed = JSON.parse(responseText.trim());
      res.json(parsed);
    } catch (err: any) {
      console.error("AI Bio Generator error:", err.message);
      res.status(500).json({ error: err.message || "Failed to generate bio" });
    }
  });

  // 2. AI PORTFOLIO CONTENT GENERATOR
  app.post("/api/ai/generate-sections", async (req, res) => {
    try {
      const { templateType, aboutMeInput, targetRole } = req.body;
      if (!templateType || !targetRole) {
        return res.status(400).json({ error: "Template type and target role are required" });
      }

      const client = getGeminiClient();
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are an elite talent coach. Generate tailored, highly convincing content for a "${templateType}" portfolio.
        Target Role: ${targetRole}
        About the user: ${aboutMeInput || "expert creator with stellar record"}

        Generate realistic rich portfolios records containing standard:
        1. "skills": list of 6-8 relevant skills (with confidence ratings 1-100)
        2. "projects": list of 3 mock projects matching this profile (each having title, brief description, techStack as list of strings, liveUrl, githubUrl)
        3. "experience": list of 2 work records (role, company, period e.g. "2024 - Present", description summarizing impact)
        4. "education": list of 1-2 realistic education milestones (degree, school, year)
        5. "certifications": list of 1-2 relevant certifications (name, issuer, year)

        Ensure the content is full of high-quality copy tailored beautifully to "${templateType}".
        Return the result as structured JSON strictly.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              skills: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    percentage: { type: Type.INTEGER }
                  },
                  required: ["name", "percentage"]
                }
              },
              projects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    techStack: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    liveUrl: { type: Type.STRING },
                    githubUrl: { type: Type.STRING }
                  },
                  required: ["title", "description", "techStack"]
                }
              },
              experience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    role: { type: Type.STRING },
                    company: { type: Type.STRING },
                    period: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["role", "company", "period", "description"]
                }
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    degree: { type: Type.STRING },
                    school: { type: Type.STRING },
                    year: { type: Type.STRING }
                  },
                  required: ["degree", "school", "year"]
                }
              },
              certifications: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    issuer: { type: Type.STRING },
                    year: { type: Type.STRING }
                  },
                  required: ["name", "issuer", "year"]
                }
              }
            },
            required: ["skills", "projects", "experience", "education", "certifications"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No data received from Gemini model.");
      res.json(JSON.parse(text.trim()));
    } catch (err: any) {
      console.error("AI Section Generator error:", err.message);
      res.status(500).json({ error: err.message || "Failed to generate sections" });
    }
  });

  // 3. AI PROJECT DESCRIPTION GENERATOR
  app.post("/api/ai/generate-project-desc", async (req, res) => {
    try {
      const { title, techStack, objective } = req.body;
      if (!title) return res.status(400).json({ error: "Project title is required." });

      const client = getGeminiClient();
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Create an elite, high-converting project description paragraph for a portfolio.
        Project Name: ${title}
        Technologies: ${techStack || "Modern Tools"}
        Core aim/mission: ${objective || "solving immediate real-world bottlenecks"}

        Write a cohesive 3-sentence description outlining (1) what real-world problem it solves, (2) technical implementation specifics, and (3) measurable production impact (e.g. 40% faster latency or improved productivity).
        Respond back with a flat JSON:
        { "description": "highly professional 3-sentence summary" }`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING }
            },
            required: ["description"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("Empty content.");
      res.json(JSON.parse(responseText.trim()));
    } catch (err: any) {
      console.error("Project Desc failure:", err.message);
      res.status(500).json({ error: err.message || "Could not generate project write-up" });
    }
  });

  // 4. AI RESUME ANALYZER / PARSER (MOCK extraction of PDF/text data)
  app.post("/api/ai/analyze-resume", async (req, res) => {
    try {
      const { resumeText } = req.body;
      if (!resumeText) return res.status(400).json({ error: "No resume text content provided to analyze." });

      const client = getGeminiClient();
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Extract detailed portfolio information from this raw resume text. Identify professional skills, experiences, education, and suggest portfolio improvements.
        Resume Text:
        ${resumeText}

        Respond in clean JSON with fields:
        "extractedName", "extractedTitle", "skills" (list", "experience" (career list of {role, company, period, description}), "education" (degrees), "achievements" (string suggestions), "optimizationTips" (list of actionable tips)`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              extractedName: { type: Type.STRING },
              extractedTitle: { type: Type.STRING },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              experience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    role: { type: Type.STRING },
                    company: { type: Type.STRING },
                    period: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["role", "company"]
                }
              },
              education: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              achievements: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              optimizationTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["extractedName", "extractedTitle", "skills", "experience", "optimizationTips"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("Could not parse resume with Gemini Model.");
      res.json(JSON.parse(responseText.trim()));
    } catch (err: any) {
      console.error("Resume analysis failure:", err.message);
      res.status(500).json({ error: err.message || "Failed to analyze resume text" });
    }
  });

  // 5. AI SEO SUGGESTIONS
  app.post("/api/ai/seo-suggestions", async (req, res) => {
    try {
      const { title, bio, templateId } = req.body;
      const client = getGeminiClient();
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Provide SEO meta options for a professional portfolio website setup.
        Profile Headline: ${title || "Creator"}
        Short Bio: ${bio || "Professional builder"}
        Vibe: ${templateId || "general"}

        Produce metadata that ranks well. Respond strictly in JSON:
        "metaTitle", "metaDescription", "suggestedSlug", "keywords" (array of strings)`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              metaTitle: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              suggestedSlug: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["metaTitle", "metaDescription", "suggestedSlug", "keywords"]
          }
        }
      });

      res.json(JSON.parse(response.text.trim()));
    } catch (err: any) {
      console.error("SEO Generator error:", err.message);
      res.status(500).json({ error: err.message || "Failed to generate SEO configuration" });
    }
  });

  // 6. AI PORTFOLIO IMPROVEMENT SUGGESTIONS (CRITIQUE ENGINE)
  app.post("/api/ai/improvement-feedback", async (req, res) => {
    try {
      const { portfolioData } = req.body;
      if (!portfolioData) return res.status(400).json({ error: "Portfolio data is required to critique." });

      const client = getGeminiClient();
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Review this structured portfolio configuration and act as a strict tech recruiter. Give 4 highly specific, actionable styling and contents recommendations to boost hireability.
        Portfolio Data:
        ${JSON.stringify(portfolioData)}

        Respond in flat JSON:
        { "critiqueScore": number(1-100), "feedbackPoints": [string, string, string, string], "personalBrandingRecommendation": string }`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              critiqueScore: { type: Type.INTEGER },
              feedbackPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              personalBrandingRecommendation: { type: Type.STRING }
            },
            required: ["critiqueScore", "feedbackPoints", "personalBrandingRecommendation"]
          }
        }
      });

      res.json(JSON.parse(response.text.trim()));
    } catch (err: any) {
      console.error("AI critique error:", err.message);
      res.status(500).json({ error: "Critique service currently busy." });
    }
  });

  // --- VITE MIDDLEWARE SETUP ---

  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PortfolioAI application listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start the Express Full-Stack server:", err);
});
