# Adding writing

Duplicate `start-here.mdx`, rename it with a lowercase hyphenated slug, and update its metadata:

```mdx
export const metadata = {
  title: "The title",
  description: "A short sentence used on the index and in link previews.",
  date: "2026-09-22",
  kind: "Prose",
  draft: true,
}

Your piece starts here.
```

Drafts appear during local development and are omitted from production. Set `draft` to `false` when a piece is ready to publish. `kind` is free text; useful values include `Prose`, `Note`, and `Write-up`.

Content copied from Google Docs usually needs only a quick cleanup: use blank lines between paragraphs, `##` for section headings, `>` for blockquotes, and Markdown links in the form `[label](https://example.com)`.
