import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/page-transition";
import {
  formatWritingDate,
  getAllWriting,
  getWriting,
} from "@/content/writing";

export const dynamicParams = false;

export async function generateStaticParams() {
  const entries = await getAllWriting();
  return entries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const writingModule = await getWriting(slug);

  if (!writingModule) return {};

  return {
    title: `${writingModule.metadata.title} — Lance Chiu`,
    description: writingModule.metadata.description,
  };
}

export default async function WritingEntryPage({
  params,
}: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const writingModule = await getWriting(slug);

  if (!writingModule) notFound();

  const { default: Content, metadata } = writingModule;

  return (
    <PageTransition variant="article">
      <main className="writing-entry-page">
        <nav className="writing-nav" aria-label="Writing navigation">
          <Link
            className="writing-back-link"
            href="/writing"
            transitionTypes={["article-back"]}
          >
            <span aria-hidden="true">←</span> All writing
          </Link>
          <Link href="/" transitionTypes={["home-back"]}>Lance Chiu</Link>
        </nav>

        <article className="writing-entry">
          <header className="writing-entry-header">
            <div className="writing-entry-meta">
              <span>{metadata.kind}</span>
              <span aria-hidden="true">/</span>
              <time dateTime={metadata.date}>
                {formatWritingDate(metadata.date)}
              </time>
              {metadata.draft ? (
                <span className="writing-draft-badge">Draft</span>
              ) : null}
            </div>
            <h1>{metadata.title}</h1>
            <p>{metadata.description}</p>
          </header>

          <div className="writing-prose">
            <Content />
          </div>
        </article>

        <footer className="writing-entry-footer">
          <Link
            className="writing-back-link"
            href="/writing"
            transitionTypes={["article-back"]}
          >
            <span aria-hidden="true">←</span> Back to all writing
          </Link>
        </footer>
      </main>
    </PageTransition>
  );
}
