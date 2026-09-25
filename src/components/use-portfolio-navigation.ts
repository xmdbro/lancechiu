"use client";

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type PointerEventHandler,
  type SetStateAction,
  type TouchEventHandler,
} from "react";
import { canStartMouseDrag } from "@/lib/mouse-drag";

const ENTER_SCROLL_THRESHOLD = 80;
const RETURN_SCROLL_THRESHOLD = 240;
const ENTER_TOUCH_THRESHOLD = 64;
const MAX_RETURN_PULL = 56;
const MOUSE_DRAG_THRESHOLD = 6;
const ENTER_MOUSE_THRESHOLD = 64;
const RETURN_MOUSE_THRESHOLD = 120;

type MouseDrag = {
  pointerId: number;
  startY: number;
  lastY: number;
  startedInPortfolio: boolean;
  dragging: boolean;
  returnDistance: number;
};

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
  const [introDrag, setIntroDrag] = useState(0);
  const [isMouseDragging, setIsMouseDragging] = useState(false);
  const siteFrameRef = useRef<HTMLElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const portfolioButtonRef = useRef<HTMLButtonElement>(null);
  const portfolioScrollRef = useRef<HTMLDivElement>(null);
  const hasOpenedPortfolio = useRef(false);
  const scrollIntent = useRef(0);
  const scrollResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartY = useRef<number | null>(null);
  const mouseDrag = useRef<MouseDrag | null>(null);

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

  const handlePointerDown: PointerEventHandler<HTMLElement> = (event) => {
    if (
      event.pointerType !== "mouse" ||
      event.button !== 0 ||
      !canStartMouseDrag(event.target) ||
      (portfolioOpen && (portfolioScrollRef.current?.scrollTop ?? 0) > 1)
    ) {
      return;
    }

    // Capture on press so native text selection cannot take over the gesture
    // before the movement threshold is reached on a physical mouse.
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    mouseDrag.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      lastY: event.clientY,
      startedInPortfolio: portfolioOpen,
      dragging: false,
      returnDistance: 0,
    };
    resetScrollIntent();
  };

  const handlePointerMove: PointerEventHandler<HTMLElement> = (event) => {
    const drag = mouseDrag.current;

    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    if (!drag.dragging) {
      if (Math.abs(event.clientY - drag.startY) < MOUSE_DRAG_THRESHOLD) {
        return;
      }

      drag.dragging = true;
      setIsMouseDragging(true);
    }

    event.preventDefault();
    const movement = event.clientY - drag.lastY;
    drag.lastY = event.clientY;

    if (!drag.startedInPortfolio) {
      setIntroDrag(
        reduceMotion
          ? 0
          : Math.min(140, Math.max(0, drag.startY - event.clientY)),
      );
      return;
    }

    drag.returnDistance = Math.max(0, drag.returnDistance + movement);

    setReturnPull(
      reduceMotion
        ? 0
        : Math.min(1, drag.returnDistance / RETURN_MOUSE_THRESHOLD) *
            MAX_RETURN_PULL,
    );
  };

  const finishPointerDrag: PointerEventHandler<HTMLElement> = (event) => {
    const drag = mouseDrag.current;

    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    mouseDrag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsMouseDragging(false);
    setIntroDrag(0);
    setReturnPull(0);

    if (!drag.dragging || event.type === "pointercancel") {
      return;
    }

    if (drag.startedInPortfolio) {
      if (drag.returnDistance >= RETURN_MOUSE_THRESHOLD) {
        setPortfolioOpen(false);
      }
    } else if (drag.startY - event.clientY >= ENTER_MOUSE_THRESHOLD) {
      setPortfolioOpen(true);
    }
  };

  return {
    backButtonRef,
    portfolioButtonRef,
    portfolioScrollRef,
    returnPull,
    introDrag,
    isMouseDragging,
    siteFrameRef,
    pointerHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: finishPointerDrag,
      onPointerCancel: finishPointerDrag,
      onLostPointerCapture: finishPointerDrag,
    },
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd,
    },
  };
}
