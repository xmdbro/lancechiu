import type { ReactNode } from "react";

export default function WritingLayout({ children }: { children: ReactNode }) {
  return <div className="writing-shell">{children}</div>;
}
