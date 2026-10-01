import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/page-transition";
import {
  formatWritingDate,
  getWriting,
} from "@/content/writing";

export async function generateMetadata({
  params,
}: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const writing = await getWriting(slug);

  if (!writing) return {};

  return {
    title: `${writing.title} — Lance Chiu`,
    description: writing.description,
  };
}

export default async function WritingEntryPage({
  params,
}: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const writing = await getWriting(slug);

  if (!writing) notFound();

  return (
    <PageTransition variant="article">
      <main className="writing-entry-page">
        <nav className="writing-nav" aria-label="Writings navigation">
          <Link
            className="writing-back-link"
            href="/writing"
            transitionTypes={["article-back"]}
          >
            <span aria-hidden="true">←</span> All writings
          </Link>
          <Link href="/" transitionTypes={["home-back"]}>Lance Chiu</Link>
        </nav>

        <article className="writing-entry">
          <header className="writing-entry-header">
            <div className="writing-entry-meta">
              <span>{writing.type}</span>
              <span aria-hidden="true">/</span>
              <time dateTime={writing.date}>
                {formatWritingDate(writing.date)}
              </time>
              {writing.draft ? (
                <span className="writing-draft-badge">Draft</span>
              ) : null}
            </div>
            <h1>{writing.title}</h1>
            <p>{writing.description}</p>
          </header>

          <div
            className="writing-prose"
            dangerouslySetInnerHTML={{ __html: writing.html }}
          />
        </article>

        <footer className="writing-entry-footer">
          <Link
            className="writing-back-link"
            href="/writing"
            transitionTypes={["article-back"]}
          >
            <span aria-hidden="true">←</span> Back to all writings
          </Link>
        </footer>
      </main>
    </PageTransition>
  );
}
