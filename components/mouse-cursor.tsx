"use client";

import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { gsap } from 'gsap';

interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
}

export default function MouseCursor({
  targetSelector = 'a, button, input, textarea, .cursor-target, [role="button"]',
  spinDuration = 4,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true
}: TargetCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const isActiveRef = useRef(false);
  const targetCornerPositionsRef = useRef<{ x: number; y: number }[] | null>(null);
  const tickerFnRef = useRef<((time: number, deltaTime: number, frame: number) => void) | null>(null);
  const activeStrengthRef = useRef({ current: 0 });

  // 1. SAFE HYDRATION STATE
  // Start with true (Mobile) to ensure we render NOTHING during SSR/Hydration.
  // We only enable it after we confirm on the client that it's a desktop.
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      // Robust check: Touch capability OR small screen
      const mobile = window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window;
      setIsMobile(mobile);
    };

    // Run check immediately on mount
    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const constants = useMemo(() => ({ borderWidth: 3, cornerSize: 12 }), []);

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, { x, y, duration: 0.1, ease: 'power3.out' });
  }, []);

  useEffect(() => {
    // CRITICAL: Stop here if mobile. No listeners, no GSAP.
    if (isMobile) {
      // Cleanup if switching from desktop to mobile
      document.body.style.cursor = '';
      return;
    }

    if (!cursorRef.current) return;

    if (hideDefaultCursor) {
      // Using body style is cleaner than appending a style tag for SPA navigation
      document.body.style.cursor = 'none';

      // Also inject style for specific elements that might override body
      const style = document.createElement('style');
      style.id = 'cursor-hider';
      style.innerHTML = `* { cursor: none !important; }`;
      document.head.appendChild(style);
    }

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll('.target-cursor-corner');

    let activeTarget: Element | null = null;
    let currentLeaveHandler: (() => void) | null = null;
    let resumeTimeout: NodeJS.Timeout | null = null;

    // Center initially (off-screen or center, center is safer to prevent jump)
    gsap.set(cursor, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });

    const createSpinTimeline = () => {
      if (spinTl.current) spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    };
    createSpinTimeline();

    // The Ticker (Heavy logic)
    const tickerFn = () => {
      if (!targetCornerPositionsRef.current || !cursorRef.current || !cornersRef.current) return;
      const strength = activeStrengthRef.current.current;
      if (strength === 0) return;

      const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
      const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;

      const corners = Array.from(cornersRef.current);
      corners.forEach((corner, i) => {
        if (!targetCornerPositionsRef.current || !targetCornerPositionsRef.current[i]) return;
        const currentX = gsap.getProperty(corner, 'x') as number;
        const currentY = gsap.getProperty(corner, 'y') as number;
        const targetX = targetCornerPositionsRef.current[i].x - cursorX;
        const targetY = targetCornerPositionsRef.current[i].y - cursorY;
        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;

        // Dynamic duration based on closeness to target
        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;

        gsap.to(corner, {
          x: finalX, y: finalY, duration,
          ease: duration === 0 ? 'none' : 'power1.out', overwrite: 'auto'
        });
      });
    };
    tickerFnRef.current = tickerFn;

    const moveHandler = (e: MouseEvent) => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;
      const mouseX = gsap.getProperty(cursorRef.current, 'x') as number;
      const mouseY = gsap.getProperty(cursorRef.current, 'y') as number;
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      // Check if we are still hovering over the active target (or its children)
      const isStillOverTarget = elementUnderMouse && (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget);

      if (!isStillOverTarget && currentLeaveHandler) {
        // Manually trigger leave if scrolled away
        leaveHandler();
        // Note: leaveHandler will clear currentLeaveHandler, but we call it safely
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    const mouseDownHandler = () => { if (dotRef.current) gsap.to(dotRef.current, { scale: 0.8, duration: 0.1 }); };
    const mouseUpHandler = () => { if (dotRef.current) gsap.to(dotRef.current, { scale: 1, duration: 0.3 }); };
    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    const enterHandler = (e: MouseEvent) => {
      const directTarget = e.target as HTMLElement;
      const target = directTarget.closest(targetSelector);
      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;
      if (activeTarget) {
        // If switching targets quickly, clean up old one first
        if (currentLeaveHandler) {
          target.removeEventListener('mouseleave', currentLeaveHandler);
          currentLeaveHandler = null;
        }
      }
      if (resumeTimeout) { clearTimeout(resumeTimeout); resumeTimeout = null; }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach(corner => gsap.killTweensOf(corner));
      gsap.killTweensOf(cursorRef.current, 'rotation');
      spinTl.current?.pause();
      gsap.to(cursorRef.current, { rotation: 0, duration: 0.3, ease: 'power2.out' });

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;

      // Calculate target positions for corners
      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
        { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
      ];

      isActiveRef.current = true;
      if (tickerFnRef.current) gsap.ticker.add(tickerFnRef.current);
      gsap.to(activeStrengthRef.current, { current: 1, duration: hoverDuration, ease: 'power2.out' });

      // Define leave handler specific to this target
      currentLeaveHandler = () => {
        leaveHandler();
        target.removeEventListener('mouseleave', currentLeaveHandler!); // Use ! as we know it exists here
        currentLeaveHandler = null;
      };
      target.addEventListener('mouseleave', currentLeaveHandler);
    };

    const leaveHandler = () => {
      if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      gsap.set(activeStrengthRef.current, { current: 0, overwrite: true });
      activeTarget = null;

      if (cornersRef.current) {
        const corners = Array.from(cornersRef.current);
        const { cornerSize } = constants;
        const positions = [
          { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
          { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
          { x: cornerSize * 0.5, y: cornerSize * 0.5 },
          { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
        ];
        corners.forEach((corner, index) => {
          gsap.to(corner, { x: positions[index].x, y: positions[index].y, duration: 0.3, ease: 'power3.out' });
        });
      }

      resumeTimeout = setTimeout(() => {
        if (!activeTarget && cursorRef.current) {
          const currentRotation = gsap.getProperty(cursorRef.current, 'rotation') as number;
          const normalizedRotation = currentRotation % 360;
          if (spinTl.current) spinTl.current.kill();
          gsap.to(cursorRef.current, {
            rotation: normalizedRotation + 360,
            duration: spinDuration * (1 - normalizedRotation / 360),
            ease: 'none',
            onComplete: () => {
              spinTl.current = gsap.timeline({ repeat: -1 }).to(cursorRef.current!, { rotation: '+=360', duration: spinDuration, ease: 'none' });
            }
          });
        }
        resumeTimeout = null;
      }, 50);
    };

    // Use a single delegated listener for mouseover
    window.addEventListener('mouseover', enterHandler, { passive: true });

    return () => {
      if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      window.removeEventListener('mouseover', enterHandler);

      const hider = document.getElementById('cursor-hider');
      if (hider) hider.remove();
      spinTl.current?.kill();
      document.body.style.cursor = '';
    };
  }, [targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor, isMobile, hoverDuration, parallaxOn]);

  // RENDER:
  // If mobile, return NULL immediately. 
  // This removes all divs from the DOM on mobile phones.
  if (isMobile) return null;

  return (
    <div ref={cursorRef} className="target-cursor-wrapper fixed pointer-events-none z-[9999] top-0 left-0 hidden md:block">
      {/* Circle with Ring Style */}
      <div ref={dotRef} className="target-cursor-dot">
        <div className="relative">
          {/* Outer Ring */}
          <div className="absolute inset-0 w-6 h-6 rounded-full border-2 border-primary/60 animate-pulse" />
          {/* Center Dot */}
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" />
          </div>
        </div>
      </div>

      <div className="target-cursor-corner corner-tl" />
      <div className="target-cursor-corner corner-tr" />
      <div className="target-cursor-corner corner-br" />
      <div className="target-cursor-corner corner-bl" />
    </div>
  );
}