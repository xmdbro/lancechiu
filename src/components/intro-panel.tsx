"use client";

import { useState, type RefObject } from "react";
import Link from "next/link";
import {
  FaGithub,
  FaInstagram,
  FaLastfm,
  FaLinkedinIn,
} from "react-icons/fa6";
import { AsciiRain } from "@/components/ascii-rain";
import { CopyButton } from "@/components/copy-button";

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

type IntroPanelProps = {
  portfolioOpen: boolean;
  portfolioButtonRef: RefObject<HTMLButtonElement | null>;
  onOpen: () => void;
};

export function IntroPanel({
  portfolioOpen,
  portfolioButtonRef,
  onOpen,
}: IntroPanelProps) {
  const [phoneState, setPhoneState] = useState<PhoneState>({ status: "hidden" });

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
    <section
      className="panel intro-panel"
      aria-hidden={portfolioOpen}
      inert={portfolioOpen || undefined}
    >
      <AsciiRain />

      <div className="intro-card">
        <h1 className="intro-name">Lance Chiu</h1>

        <div className="contact-list">
          <CopyButton
            className="text-link"
            value="hi@lancechiu.com"
            label="Copy email address"
          />

          {phoneState.status === "revealed" ? (
            <CopyButton
              className="text-link"
              value={phoneState.phone}
              label="Copy phone number"
            />
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
                  : "[ Press to Reveal Phone ]"}
            </button>
          )}
        </div>

        <nav className="primary-nav" aria-label="Primary navigation">
          <button
            ref={portfolioButtonRef}
            className="nav-link"
            type="button"
            onClick={onOpen}
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
          <span className="nav-divider" aria-hidden="true">
            /
          </span>
          <Link className="nav-link" href="/writing">
            Writing
          </Link>
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

      <div
        className="panel-scroll-cue panel-scroll-cue--intro"
        aria-hidden="true"
      >
        <span className="scroll-cue-arrow scroll-cue-arrow--down" />
        Scroll down to view portfolio
      </div>
    </section>
  );
}
