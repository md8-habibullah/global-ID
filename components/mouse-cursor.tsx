"use client"

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { MousePointer2 } from 'lucide-react'; // Import the Arrow Icon

interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
}

export default function MouseCursor({
  targetSelector = 'a, button, input, textarea, .cursor-target, [role="button"]',
  spinDuration = 4, // Slower spin looks more elegant with curves
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

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia("(max-width: 768px)").matches;
  }, []);

  const constants = useMemo(
    () => ({
      borderWidth: 3,
      cornerSize: 12
    }),
    []
  );

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.1,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || isMobile || !cursorRef.current) return;

    // --- Optimization: Robust Cursor Hiding ---
    // This injects a global style to force hide cursor everywhere, 
    // solving the issue where it reappears on buttons/inputs.
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

    const cleanupTarget = (target: Element) => {
      if (currentLeaveHandler) {
        target.removeEventListener('mouseleave', currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });

    // Spin animation
    const createSpinTimeline = () => {
      if (spinTl.current) spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    };
    createSpinTimeline();

    // The ticker handles the magnetic/expansion effect
    const tickerFn = () => {
      if (!targetCornerPositionsRef.current || !cursorRef.current || !cornersRef.current) return;
      
      const strength = activeStrengthRef.current.current;
      if (strength === 0) return;

      const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
      const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;
      
      const corners = Array.from(cornersRef.current);
      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, 'x') as number;
        const currentY = gsap.getProperty(corner, 'y') as number;
        
        if (!targetCornerPositionsRef.current || !targetCornerPositionsRef.current[i]) return;

        const targetX = targetCornerPositionsRef.current[i].x - cursorX;
        const targetY = targetCornerPositionsRef.current[i].y - cursorY;
        
        // Linear interpolation based on strength (0 to 1)
        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;
        
        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;
        
        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration: duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto'
        });
      });
    };
    tickerFnRef.current = tickerFn;

    const moveHandler = (e: MouseEvent) => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    // Scroll handler to check if we moved away from target via scrolling
    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;
      const mouseX = gsap.getProperty(cursorRef.current, 'x') as number;
      const mouseY = gsap.getProperty(cursorRef.current, 'y') as number;
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget);
        
      if (!isStillOverTarget && currentLeaveHandler) {
        currentLeaveHandler();
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Click animations (Scale down on click)
    const mouseDownHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 0.8, duration: 0.1 });
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.1 });
    };

    const mouseUpHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
    };

    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    // Hover Enter Logic
    const enterHandler = (e: MouseEvent) => {
      const directTarget = e.target as HTMLElement;
      const target = directTarget.closest(targetSelector);
      
      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;
      
      if (activeTarget) cleanupTarget(activeTarget);
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach(corner => gsap.killTweensOf(corner));
      
      // Stop spinning and reset rotation to 0 for a clean box look
      gsap.killTweensOf(cursorRef.current, 'rotation');
      spinTl.current?.pause();
      gsap.to(cursorRef.current, { rotation: 0, duration: 0.3, ease: 'power2.out' });

      // Calculate bounds
      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;
      const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
      const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;

      // Define where corners should go
      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
        { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
      ];

      isActiveRef.current = true;
      if (tickerFnRef.current) gsap.ticker.add(tickerFnRef.current);
      
      // Animate "strength" to 1 (expansion effect)
      gsap.to(activeStrengthRef.current, {
        current: 1,
        duration: hoverDuration,
        ease: 'power2.out'
      });

      // Hide the arrow icon slightly when locked on target, or keep it visible. 
      // User request "inside dot will be arrow icon", usually implies keeping it.
      // But purely centering an arrow inside a box looks good.
    };

    // Hover Leave Logic
    const leaveHandler = () => {
      if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      
      gsap.set(activeStrengthRef.current, { current: 0, overwrite: true });
      activeTarget = null;

      if (cornersRef.current) {
        const corners = Array.from(cornersRef.current);
        gsap.killTweensOf(corners);
        const { cornerSize } = constants;
        
        // Reset corners to small box shape
        const positions = [
          { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
          { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
          { x: cornerSize * 0.5, y: cornerSize * 0.5 },
          { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
        ];

        corners.forEach((corner, index) => {
          gsap.to(corner, {
            x: positions[index].x,
            y: positions[index].y,
            duration: 0.3,
            ease: 'power3.out'
          });
        });
      }

      // Resume spinning
      resumeTimeout = setTimeout(() => {
        if (!activeTarget && cursorRef.current) {
          const currentRotation = gsap.getProperty(cursorRef.current, 'rotation') as number;
          const normalizedRotation = currentRotation % 360;
          
          if (spinTl.current) spinTl.current.kill();
          
          // Smoothly spin up to next position then start infinite spin
          gsap.to(cursorRef.current, {
            rotation: normalizedRotation + 360,
            duration: spinDuration * (1 - normalizedRotation / 360),
            ease: 'none',
            onComplete: () => {
              spinTl.current = gsap
                .timeline({ repeat: -1 })
                .to(cursorRef.current!, { rotation: '+=360', duration: spinDuration, ease: 'none' });
            }
          });
        }
        resumeTimeout = null;
      }, 50);
      
      // Cleanup cleanup
      if (activeTarget) cleanupTarget(activeTarget);
    };

    // Attach leave handler dynamically
    // Note: We use mouseover/out on window to catch bubbling events efficiently
    window.addEventListener('mouseover', enterHandler, { passive: true });
    
    // We need to detect when mouse leaves the specific target. 
    // The Enter handler attaches the specific leave listener.
    // However, since we used a generic approach above, we actually need to 
    // manually listen for mouseout on window and check if we left the target selector.
    const globalOutHandler = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (activeTarget && (target === activeTarget || activeTarget.contains(target))) {
             // We are leaving the active target (or a child of it)
             // Check if the *new* target (relatedTarget) is still inside
             if (!e.relatedTarget || !(activeTarget.contains(e.relatedTarget as Node))) {
                 leaveHandler();
             }
        }
    }
    window.addEventListener('mouseout', globalOutHandler, { passive: true });


    return () => {
      if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseover', enterHandler);
      window.removeEventListener('mouseout', globalOutHandler);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      
      const hider = document.getElementById('cursor-hider');
      if(hider) hider.remove();

      spinTl.current?.kill();
      document.body.style.cursor = '';
    };
  }, [targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor, isMobile, hoverDuration, parallaxOn]);

  if (isMobile) return null;

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      {/* Replaced Dot with Arrow Icon */}
      <div ref={dotRef} className="target-cursor-dot">
        <MousePointer2 className="w-5 h-5 text-primary fill-primary" />
      </div>
      
      <div className="target-cursor-corner corner-tl" />
      <div className="target-cursor-corner corner-tr" />
      <div className="target-cursor-corner corner-br" />
      <div className="target-cursor-corner corner-bl" />
    </div>
  );
}