"use client"

import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { gsap } from 'gsap';
// No icons needed - using pure CSS shapes

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

  // Use state to handle hydration safely
  const [isMobile, setIsMobile] = useState(true);

  // Check mobile status only on client mount
  useEffect(() => {
    const checkMobile = () => {
      // Check for touch capability or small screen
      const mobile = window.matchMedia("(max-width: 768px)").matches ||
        'ontouchstart' in window;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const constants = useMemo(() => ({ borderWidth: 3, cornerSize: 12 }), []);

  // ... (Movement logic remains the same) ...
  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, { x, y, duration: 0.1, ease: 'power3.out' });
  }, []);

  useEffect(() => {
    // CRITICAL OPTIMIZATION: Do not run ANY of this heavy logic on mobile
    if (isMobile || !cursorRef.current) return;

    if (hideDefaultCursor) {
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

    // Center initially
    gsap.set(cursor, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });

    const createSpinTimeline = () => {
      if (spinTl.current) spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    };
    createSpinTimeline();

    // The heavy lifter: the ticker
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

    // ... (Scroll, Mouse Down/Up handlers same as before) ...
    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;
      const mouseX = gsap.getProperty(cursorRef.current, 'x') as number;
      const mouseY = gsap.getProperty(cursorRef.current, 'y') as number;
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const isStillOverTarget = elementUnderMouse && (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget);
      if (!isStillOverTarget && currentLeaveHandler) currentLeaveHandler();
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    const mouseDownHandler = () => { if (dotRef.current) gsap.to(dotRef.current, { scale: 0.8, duration: 0.1 }); };
    const mouseUpHandler = () => { if (dotRef.current) gsap.to(dotRef.current, { scale: 1, duration: 0.3 }); };
    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    // ... (Enter/Leave handlers same as before) ...
    const cleanupTarget = (target: Element) => {
      if (currentLeaveHandler) target.removeEventListener('mouseleave', currentLeaveHandler);
      currentLeaveHandler = null;
    };

    const enterHandler = (e: MouseEvent) => {
      const directTarget = e.target as HTMLElement;
      const target = directTarget.closest(targetSelector);
      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;
      if (activeTarget) cleanupTarget(activeTarget);
      if (resumeTimeout) { clearTimeout(resumeTimeout); resumeTimeout = null; }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach(corner => gsap.killTweensOf(corner));
      gsap.killTweensOf(cursorRef.current, 'rotation');
      spinTl.current?.pause();
      gsap.to(cursorRef.current, { rotation: 0, duration: 0.3, ease: 'power2.out' });

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;
      const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
      const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;

      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
        { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
      ];

      isActiveRef.current = true;
      if (tickerFnRef.current) gsap.ticker.add(tickerFnRef.current);
      gsap.to(activeStrengthRef.current, { current: 1, duration: hoverDuration, ease: 'power2.out' });
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

    const globalOutHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (activeTarget && (target === activeTarget || activeTarget.contains(target))) {
        if (!e.relatedTarget || !(activeTarget.contains(e.relatedTarget as Node))) {
          leaveHandler();
          if (activeTarget) cleanupTarget(activeTarget);
        }
      }
    }

    window.addEventListener('mouseover', enterHandler, { passive: true });
    window.addEventListener('mouseout', globalOutHandler, { passive: true });

    return () => {
      if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      window.removeEventListener('mouseover', enterHandler);
      window.removeEventListener('mouseout', globalOutHandler);
      const hider = document.getElementById('cursor-hider');
      if (hider) hider.remove();
      spinTl.current?.kill();
      document.body.style.cursor = '';
    };
  }, [targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor, isMobile, hoverDuration, parallaxOn]);

  // Robust Mobile check: Render nothing if mobile (saves DOM nodes)
  // But during SSR/first render, default is "true" to avoid hydration mismatch, then effects flip it.
  // Actually, safe way: Default hidden via CSS, only mount GSAP if !mobile.
  // Render null on mobile to avoid unnecessary DOM nodes
  if (isMobile) return null;

  return (
    <div ref={cursorRef} className="target-cursor-wrapper hidden md:block">
      {/* Modern Minimal Cursor - Option 1: Simple Circle with Ring */}
      <div ref={dotRef} className="target-cursor-dot">
        <div className="relative">
          {/* Outer ring */}
          <div className="absolute inset-0 w-6 h-6 rounded-full border-2 border-primary/60 animate-pulse" />
          {/* Inner dot */}
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" />
          </div>
        </div>
      </div>

      {/* Alternative Modern Cursors (uncomment to use) */}

      {/* Option 2: Crosshair Plus
      <div ref={dotRef} className="target-cursor-dot">
        <div className="relative w-6 h-6">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-primary transform -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-primary transform -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
      */}

      {/* Option 3: Modern Diamond
      <div ref={dotRef} className="target-cursor-dot">
        <div className="w-3 h-3 bg-primary rotate-45 shadow-[0_0_10px_rgba(var(--primary-rgb),0.6)]" />
      </div>
      */}

      {/* Option 4: Sleek Line Cursor
      <div ref={dotRef} className="target-cursor-dot">
        <div className="flex flex-col items-center gap-1">
          <div className="w-[2px] h-3 bg-gradient-to-b from-primary to-transparent" />
          <div className="w-1 h-1 bg-primary rounded-full" />
          <div className="w-[2px] h-3 bg-gradient-to-t from-primary to-transparent" />
        </div>
      </div>
      */}

      <div className="target-cursor-corner corner-tl" />
      <div className="target-cursor-corner corner-tr" />
      <div className="target-cursor-corner corner-br" />
      <div className="target-cursor-corner corner-bl" />
    </div>
  );
}