import { ViewTransition, type ReactNode } from "react";

const directionalTransitions = {
  home: {
    "home-forward": "home-slide-forward",
    "home-back": "home-slide-back",
    default: "none",
  },
  article: {
    "article-forward": "article-slide-forward",
    "article-back": "article-slide-back",
    default: "none",
  },
};

type PageTransitionProps = {
  children: ReactNode;
  variant: keyof typeof directionalTransitions;
};

export function PageTransition({ children, variant }: PageTransitionProps) {
  const transition = directionalTransitions[variant];

  return (
    <ViewTransition
      enter={transition}
      exit={transition}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
