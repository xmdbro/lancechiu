import type { ReactNode } from "react";
import { PageTransition } from "@/components/page-transition";

export default function WritingLayout({ children }: { children: ReactNode }) {
  return (
    <PageTransition variant="home">
      <div className="writing-shell">{children}</div>
    </PageTransition>
  );
}
