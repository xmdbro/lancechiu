export type PortfolioProject = {
  title: string;
  description: string;
  year: string;
  disciplines: string[];
  githubUrl: string;
  href?: string;
};

export type PortfolioTimelineEntry = {
  title: string;
  organization: string;
  period: string;
  description: string;
};

type PortfolioContent = {
  eyebrow: string;
  title: {
    lead: string;
    connector: string;
    emphasis: string;
  };
  introduction: string[];
  byline: string;
  education: PortfolioTimelineEntry[];
  experience: PortfolioTimelineEntry[];
  projects: PortfolioProject[];
  skills: { category: string; items: string[] }[];
};

export const portfolioContent: PortfolioContent = {
  eyebrow: "Portfolio / Profile",
  title: {
    lead: "software",
    connector: "is",
    emphasis: "beautiful",
  },
  introduction: [
    "I study computer science at De La Salle University, focusing on network information security. My interests lie in operations, networks, and security.",
    "I am rich in love and try to put a lot of that love into the things that I make.",
  ],
  byline: "Lance Chiu, De La Salle University",
  education: [
    {
      title: "Bachelor of Science in Computer Science",
      organization: "De La Salle University",
      period: "Expected Sep. 2028",
      description:
        "Major in Network Information Security. Cumulative GPA: 3.299.",
    },
  ],
  experience: [
    {
      title: "Data Annotator (Freelance)",
      organization: "DataAnnotation · Remote",
      period: "Oct. 2026 — Present",
      description:
        "Produce annotations for natural language processing tasks and evaluate LLM responses, providing linguistic and contextual feedback for human-in-the-loop learning pipelines.",
    },
    {
      title: "Associate Backend Engineer",
      organization: "La Salle Computer Society",
      period: "Oct. 2024 — Sep. 2026",
      description:
        "Built and maintained backend systems for internal tools, including an event registration platform supporting 30,000+ concurrent users and 99.9% uptime at its peak. Prepared digital materials and presentations for organisation-wide events.",
    },
  ],
  projects: [
    {
      title: "Resole",
      description:
        "Full-stack peer-to-peer footwear marketplace using YOLOv8n, TensorFlow Lite, and Gemini 3.1 Flash to suggest prices based on sneaker condition and market trends. Built with PostgreSQL and Drizzle ORM on Supabase, with Better Auth securing listings and transactions.",
      year: "Aug. 2026",
      disciplines: ["Next.js", "React Native", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"],
      githubUrl: "https://github.com/resole-ph/resole",
      href: "https://resole-main.vercel.app/",
    },
    {
      title: "Listening",
      description:
        "Live now-playing display combining Last.fm, Spotify Images, and OpenWeatherMap data, with JSON endpoints and embeddable SVG cards. Uses account-scoped caching, concurrent request deduplication, and fallbacks for incomplete artwork and stats.",
      year: "Aug. 2026",
      disciplines: ["React", "TypeScript"],
      githubUrl: "https://github.com/xmdbro/listening",
      href: "https://listening.lancechiu.com",
    },
    {
      title: "Leap 2025 Registration System",
      description:
        "High-traffic event registration platform engineered for reliability under extreme concurrency. At its peak, the system supported 30,000+ concurrent users, 302 hosted events, and 99.9% uptime.",
      year: "May 2025",
      disciplines: ["Express.js", "TypeScript", "Redis", "Kubernetes"],
      githubUrl: "https://github.com/dlsu-lscs/leap25-backend",
    },
    {
      title: "Suanpan",
      description:
        "A stateless counting API with counters organized by namespace. Built for privacy and performance, offering basic analytics with minimal overhead.",
      year: "Sep. 2026",
      disciplines: ["Python", "FastAPI", "Valkey"],
      githubUrl: "https://github.com/xmdbro/suanpan",
      href: "https://suanpan.lancechiu.com",
    },
    {
      title: "Vibe-Coded Website Fuzzer",
      description:
        "Hybrid SAST/DAST fuzzer that automates discovery of IDOR, JWT bypasses, and rate limiting flaws in AI-generated web applications. Includes native CVSS v3.1 scoring and styled vulnerability risk reports.",
      year: "July 2026",
      disciplines: ["Python"],
      githubUrl: "https://github.com/rdgonzaga/vibecheck",
    },
  ],
  skills: [
    {
      category: "Languages & data",
      items: ["Python", "C", "C++", "Java", "JavaScript", "TypeScript", "SQL (MySQL & PostgreSQL)", "Redis", "Valkey"],
    },
    {
      category: "Frameworks",
      items: ["React", "Node.js", "Next.js", "Express.js", "Tailwind CSS", "FastAPI", "CUDA"],
    },
    {
      category: "Tools",
      items: ["Git", "Docker", "Kubernetes", "Burp", "Nessus", "Nmap", "Postman", "Metasploit"],
    },
    {
      category: "Libraries",
      items: ["pandas", "NumPy", "Matplotlib", "scikit-learn", "TensorFlow", "VapourSynth", "FFmpeg"],
    },
  ],
};
