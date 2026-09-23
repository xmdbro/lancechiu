"use client";

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
  type TouchEventHandler,
} from "react";

const ENTER_SCROLL_THRESHOLD = 80;
const RETURN_SCROLL_THRESHOLD = 240;
const ENTER_TOUCH_THRESHOLD = 64;
const MAX_RETURN_PULL = 56;

type UsePortfolioNavigationOptions = {
  portfolioOpen: boolean;
  reduceMotion: boolean | null;
  setPortfolioOpen: Dispatch<SetStateAction<boolean>>;
};

export function usePortfolioNavigation({
  portfolioOpen,
  reduceMotion,
  setPortfolioOpen,
}: UsePortfolioNavigationOptions) {
  const [returnPull, setReturnPull] = useState(0);
  const siteFrameRef = useRef<HTMLElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const portfolioButtonRef = useRef<HTMLButtonElement>(null);
  const portfolioScrollRef = useRef<HTMLDivElement>(null);
  const hasOpenedPortfolio = useRef(false);
  const scrollIntent = useRef(0);
  const scrollResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartY = useRef<number | null>(null);

  function resetScrollIntent() {
    scrollIntent.current = 0;
    setReturnPull(0);
  }

  useEffect(() => {
    if (portfolioOpen) {
      hasOpenedPortfolio.current = true;
      portfolioScrollRef.current?.scrollTo({ top: 0, left: 0 });
      backButtonRef.current?.focus({ preventScroll: true });
      return;
    }

    if (hasOpenedPortfolio.current) {
      portfolioButtonRef.current?.focus({ preventScroll: true });
    }
  }, [portfolioOpen]);

  useEffect(() => {
    const siteFrame = siteFrameRef.current;

    if (!siteFrame) {
      return;
    }

    function scheduleIntentReset() {
      if (scrollResetTimer.current) {
        clearTimeout(scrollResetTimer.current);
      }

      scrollResetTimer.current = setTimeout(resetScrollIntent, 420);
    }

    function handleWheel(event: WheelEvent) {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        return;
      }

      const unit =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? window.innerHeight
            : 1;
      const delta = event.deltaY * unit;

      if (portfolioOpen) {
        if (delta >= 0) {
          resetScrollIntent();
          return;
        }

        if ((portfolioScrollRef.current?.scrollTop ?? 0) > 1) {
          resetScrollIntent();
          return;
        }

        event.preventDefault();

        scrollIntent.current = Math.min(
          RETURN_SCROLL_THRESHOLD,
          scrollIntent.current + Math.abs(delta),
        );

        if (!reduceMotion) {
          setReturnPull(
            (scrollIntent.current / RETURN_SCROLL_THRESHOLD) * MAX_RETURN_PULL,
          );
        }

        if (scrollIntent.current >= RETURN_SCROLL_THRESHOLD) {
          resetScrollIntent();
          setPortfolioOpen(false);
          return;
        }
      } else {
        event.preventDefault();
        setReturnPull(0);

        if (delta <= 0) {
          scrollIntent.current = 0;
          return;
        }

        scrollIntent.current = Math.min(
          ENTER_SCROLL_THRESHOLD,
          scrollIntent.current + delta,
        );

        if (scrollIntent.current >= ENTER_SCROLL_THRESHOLD) {
          scrollIntent.current = 0;
          setPortfolioOpen(true);
          return;
        }
      }

      scheduleIntentReset();
    }

    siteFrame.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      siteFrame.removeEventListener("wheel", handleWheel);

      if (scrollResetTimer.current) {
        clearTimeout(scrollResetTimer.current);
      }
    };
  }, [portfolioOpen, reduceMotion, setPortfolioOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && portfolioOpen) {
        setPortfolioOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [portfolioOpen, setPortfolioOpen]);

  const handleTouchStart: TouchEventHandler<HTMLElement> = (event) => {
    if (portfolioOpen) {
      touchStartY.current = null;
      return;
    }

    touchStartY.current = event.touches[0]?.clientY ?? null;
    resetScrollIntent();
  };

  const handleTouchMove: TouchEventHandler<HTMLElement> = (event) => {
    if (portfolioOpen || touchStartY.current === null) {
      return;
    }

    const currentY = event.touches[0]?.clientY;

    if (currentY === undefined) {
      return;
    }

    const distance = touchStartY.current - currentY;

    if (distance <= 0) {
      setReturnPull(0);
      return;
    }

    if (distance >= ENTER_TOUCH_THRESHOLD) {
      touchStartY.current = null;
      setPortfolioOpen(true);
    }
  };

  const handleTouchEnd: TouchEventHandler<HTMLElement> = () => {
    touchStartY.current = null;

    if (!portfolioOpen) {
      resetScrollIntent();
    }
  };

  return {
    backButtonRef,
    portfolioButtonRef,
    portfolioScrollRef,
    returnPull,
    siteFrameRef,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd,
    },
  };
}
