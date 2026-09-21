"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  FaGithub,
  FaInstagram,
  FaLastfm,
  FaLinkedinIn,
} from "react-icons/fa6";
import { InView } from "@/components/in-view";

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kl-chiu/",
    icon: FaLinkedinIn,
  },
  {
    label: "GitHub",
    href: "https://github.com/xmdbro",
    icon: FaGithub,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/lance.kc",
    icon: FaInstagram,
  },
  {
    label: "Last.fm",
    href: "https://www.last.fm/user/xMdb",
    icon: FaLastfm,
  },
];

type PhoneState =
  | { status: "hidden" }
  | { status: "loading" }
  | { status: "revealed"; phone: string }
  | { status: "error" };

export function PortfolioSite() {
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [phoneState, setPhoneState] = useState<PhoneState>({ status: "hidden" });
  const reduceMotion = useReducedMotion();
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const portfolioButtonRef = useRef<HTMLButtonElement>(null);
  const hasOpenedPortfolio = useRef(false);

  useEffect(() => {
    if (portfolioOpen) {
      hasOpenedPortfolio.current = true;
      backButtonRef.current?.focus({ preventScroll: true });
      return;
    }

    if (hasOpenedPortfolio.current) {
      portfolioButtonRef.current?.focus({ preventScroll: true });
    }
  }, [portfolioOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && portfolioOpen) {
        setPortfolioOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [portfolioOpen]);

  async function revealPhone() {
    setPhoneState({ status: "loading" });

    try {
      const response = await fetch("/api/contact/reveal", {
        method: "POST",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Phone number unavailable");
      }

      const data = (await response.json()) as { phone: string };
      setPhoneState({ status: "revealed", phone: data.phone });
    } catch {
      setPhoneState({ status: "error" });
    }
  }

  return (
    <main className="site-frame">
      <motion.div
        className="panel-track"
        animate={{ y: portfolioOpen ? "-100dvh" : "0dvh" }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
        }
      >
        <section
          className="panel intro-panel"
          aria-hidden={portfolioOpen}
          inert={portfolioOpen || undefined}
        >
          <div className="intro-card">
            <h1 className="intro-name">Lance Chiu</h1>

            <div className="contact-list">
              <a className="text-link" href="mailto:hi@lancechiu.com">
                hi@lancechiu.com
              </a>

              {phoneState.status === "revealed" ? (
                <a
                  className="text-link"
                  href={`tel:${phoneState.phone.replace(/[^+\d]/g, "")}`}
                >
                  {phoneState.phone}
                </a>
              ) : (
                <button
                  className="phone-reveal"
                  type="button"
                  disabled={phoneState.status === "loading"}
                  onClick={revealPhone}
                >
                  {phoneState.status === "loading"
                    ? "[ Revealing… ]"
                    : phoneState.status === "error"
                      ? "[ Try Again ]"
                      : "[ Click to Reveal Phone ]"}
                </button>
              )}
            </div>

            <nav className="primary-nav" aria-label="Primary navigation">
              <button
                ref={portfolioButtonRef}
                className="nav-link"
                type="button"
                onClick={() => setPortfolioOpen(true)}
              >
                Portfolio
              </button>
              <span className="nav-divider" aria-hidden="true">
                /
              </span>
              <a
                className="nav-link"
                href="https://resume.lancechiu.com"
                target="_blank"
                rel="noreferrer"
              >
                Resume
              </a>
            </nav>

            <nav className="social-nav" aria-label="Social links">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  className="social-link"
                  href={href}
                  key={label}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                >
                  <Icon aria-hidden="true" />
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </nav>
          </div>
        </section>

        <section
          className="panel portfolio-panel"
          aria-label="Portfolio"
          aria-hidden={!portfolioOpen}
          inert={!portfolioOpen || undefined}
        >
          <button
            ref={backButtonRef}
            className="back-button"
            type="button"
            onClick={() => setPortfolioOpen(false)}
          >
            <span className="back-arrow" aria-hidden="true" />
            Back
          </button>

          <InView
            className="portfolio-content"
            variants={{
              hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
            viewOptions={{ amount: 0.45, once: true }}
          >
            <p className="portfolio-eyebrow">Portfolio / 001</p>
            <h2 className="portfolio-name">Under Construction...</h2>
            <p className="portfolio-subtitle">Sorry about that!</p>
            <p className="portfolio-byline">
              <span className="portfolio-byline-dot" aria-hidden="true" />
              Lance Chiu, De La Salle University
            </p>
          </InView>
        </section>
      </motion.div>
    </main>
  );
}
