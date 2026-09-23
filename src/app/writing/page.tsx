import type { Metadata } from "next";
import Link from "next/link";
import { WritingCollection } from "@/components/writing-collection";
import { CopyButton } from "@/components/copy-button";
import { getAllWriting } from "@/content/writing";

export const metadata: Metadata = {
  title: "Writing — Lance Chiu",
  description: "Prose, notes, and write-ups by Lance Chiu.",
};

export default async function WritingPage() {
  const entries = await getAllWriting();

  return (
    <main className="writing-index">
      <header className="writing-index-masthead">
        <Link className="writing-back-link" href="/">
          <span aria-hidden="true">←</span> Return to home
        </Link>
        <span><i>Words! Mere words!</i></span>
        <h1>Writing</h1>
      </header>

      <section className="writing-index-intro" aria-label="About this collection">
        <p className="writing-kicker">Prose / Notes / Technical Write-ups</p>
        <p>
          Things I wanted to hold onto long enough to put into words, i.e., <i>an archive of love.</i><br />
        </p>
      </section>

      {entries.length > 0 ? (
        <WritingCollection entries={entries} />
      ) : (
        <p className="writing-empty">The first piece is still being written.</p>
      )}

      <footer className="writing-footer">
        <span>© {new Date().getFullYear()} Lance Chiu</span>
        <CopyButton value="hi@lancechiu.com" label="Copy email address" />
      </footer>
    </main>
  );
}
