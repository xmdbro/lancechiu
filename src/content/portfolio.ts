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
  title: string;
  introduction: string;
  byline: string;
  education: PortfolioTimelineEntry[];
  experience: PortfolioTimelineEntry[];
  projects: PortfolioProject[];
};

// Replace this copy and add or remove projects as the portfolio grows.
export const portfolioContent: PortfolioContent = {
  eyebrow: "Portfolio / Profile",
  title: "software is beautiful",
  introduction:
    "My interests lie in operations, networks, and security. I am rich in love and try to put a lot of that love into the things that I make.",
  byline: "Lance Chiu, De La Salle University",
  education: [
    {
      title: "Bachelor of Science in Computer Science",
      organization: "De La Salle University",
      period: "2024 — 2028",
      description:
        "Major in Network Information Security under the Center for Networking and Information Security (CNIS).",
    },
  ],
  experience: [
    {
      title: "Associate Backend Engineer",
      organization: "La Salle Computer Society",
      period: "Sep. 2024 — Sep. 2026",
      description:
        "Built and maintained backend systems for the organisation’s internal tools and event registration platform, with contributions to API implementation and database design.",
    },
    // {
    //   title: "Earlier role title",
    //   organization: "Company or organization",
    //   period: "20XX — 20XX",
    //   description:
    //     "Keep this focused on a meaningful responsibility, contribution, or measurable result.",
    // },
  ],
  projects: [
    {
      title: "Resole",
      description:
        "AI-powered peer-to-peer marketplace for footwear. Integrates computer vision and multimodal LLMs for automated condition grading and real-time price prediction.",
      year: "Aug. 2026",
      disciplines: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"],
      githubUrl: "https://github.com/resole-ph/resole",
      href: "https://resole-main.vercel.app/",
    },
    {
      title: "Listening",
      description:
        "An elegant now-playing display for Last.fm showing song info, and integrating with OpenWeatherMap and Spotify APIs. Available as a standalone display and or embeddable SVG cards.",
      year: "Aug. 2026",
      disciplines: ["React", "Typescript"],
      githubUrl: "https://github.com/xmdbro/listening",
      href: "https://listening.lancechiu.com",
    },
    {
      title: "Leap 2025 Registration System",
      description:
        "Built a high-traffic event registration platform engineered for reliability under extreme concurrency. At it’s peak, the system supported 30,000+ concurrent users, 302 hosted events, and 99.9% uptime.",
      year: "May 2025",
      disciplines: ["Express.js", "Typerscript", "Redis", "Kubernetes"],
      githubUrl: "https://github.com/dlsu-lscs/leap25-backend",
    },
    {
      title: "Suanpan",
      description:
        "A stateless counting API with namespace based counters. Primarily privacy and performance driven, offering basic analytics without unnecessary complexity overhead",
      year: "Sep. 2026",
      disciplines: ["Python", "FastAPI", "Valkey"],
      githubUrl: "https://github.com/xmdbro/suanpan",
      href: "https://suanpan.lancechiu.com",
    },
    {
      title: "PromptPatrol",
      description:
        "Hybrid SAST/DAST security scanner and fuzzing suite engineered to automate vulnerability discovery in AI-generated (\"vibe-coded\") applications. Comes with a native CVSS 3.1 scoring model to evaluate findings and generate reports.",
      year: "Aug. 2026",
      disciplines: ["Python"],
      githubUrl: "https://github.com/rdgonzaga/vibecheck",
    },
  ],
};
