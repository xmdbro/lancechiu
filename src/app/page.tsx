import { PortfolioSite } from "@/components/portfolio-site";
import { PageTransition } from "@/components/page-transition";

export default function Home() {
  return (
    <PageTransition variant="home">
      <PortfolioSite />
    </PageTransition>
  );
}
