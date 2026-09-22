import { FaGithub } from "react-icons/fa6";
import {
  portfolioContent,
  type PortfolioTimelineEntry,
} from "@/content/portfolio";

type SectionHeadingProps = {
  index: string;
  title: string;
};

function SectionHeading({ index, title }: SectionHeadingProps) {
  return (
    <header className="portfolio-section-heading">
      <span>{index}</span>
      <h2>{title}</h2>
    </header>
  );
}

function Timeline({ entries }: { entries: PortfolioTimelineEntry[] }) {
  return (
    <ol className="portfolio-entry-list">
      {entries.map((entry) => (
        <li className="portfolio-entry" key={`${entry.title}-${entry.period}`}>
          <div className="portfolio-entry-heading">
            <div>
              <h3>{entry.title}</h3>
              <p>{entry.organization}</p>
            </div>
            <span>{entry.period}</span>
          </div>
          <p className="portfolio-entry-description">{entry.description}</p>
        </li>
      ))}
    </ol>
  );
}

export function PortfolioSections() {
  return (
    <>
      <header className="portfolio-hero">
        <p className="portfolio-eyebrow">{portfolioContent.eyebrow}</p>
        <h2 className="portfolio-name">{portfolioContent.title}</h2>
        <p className="portfolio-introduction">
          {portfolioContent.introduction}
        </p>
        <p className="portfolio-byline">
          <span className="portfolio-byline-dot" aria-hidden="true" />
          {portfolioContent.byline}
        </p>
      </header>

      <div className="portfolio-section-stack">
        <section className="portfolio-section" id="education">
          <SectionHeading index="01" title="Education" />
          <Timeline entries={portfolioContent.education} />
        </section>

        <section className="portfolio-section" id="experience">
          <SectionHeading index="02" title="Experience" />
          <Timeline entries={portfolioContent.experience} />
        </section>

        <section className="portfolio-section" id="projects">
          <SectionHeading index="03" title="Projects" />
          <ol className="portfolio-project-list">
            {portfolioContent.projects.map((project, index) => (
              <li className="portfolio-project" key={project.title}>
                <span className="portfolio-project-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <article className="portfolio-project-body">
                  <h3 className="portfolio-project-title">
                    {project.href ? (
                      <a href={project.href}>{project.title}</a>
                    ) : (
                      project.title
                    )}
                  </h3>
                  <p className="portfolio-project-description">
                    {project.description}
                  </p>
                  <p className="portfolio-project-disciplines">
                    {project.disciplines.join(" / ")}
                  </p>
                </article>

                <div className="portfolio-project-meta">
                  <span className="portfolio-project-year">{project.year}</span>
                  <a
                    className="portfolio-project-github"
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${project.title} on GitHub`}
                    title={`View ${project.title} on GitHub`}
                  >
                    <FaGithub aria-hidden="true" />
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </section>

      </div>
    </>
  );
}
