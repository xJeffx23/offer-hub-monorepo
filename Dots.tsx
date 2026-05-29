/**
 * Dots.tsx — Standalone Interactive Dot Grid Component
 *
 * Extracted from: src/components/ui/InteractiveDotGrid.tsx
 * Source project: offer-hub-monorepo-fork
 *
 * A canvas-based, physics-driven dotted background that reacts to mouse
 * movement. Dots near the cursor are pushed away and grow in size, then
 * spring back smoothly when the mouse moves on.
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *
 *   import { Dots } from "./Dots";
 *
 *   // Full-screen fixed background (default):
 *   <Dots />
 *
 *   // Customised:
 *   <Dots
 *     dotColor="rgba(99, 102, 241, 0.8)"   // indigo dots
 *     opacity={0.5}
 *     gridSize={36}                          // tighter grid
 *   />
 *
 * ─── Props ───────────────────────────────────────────────────────────────────
 *
 *   dotColor  – CSS color string for the dots
 *               default: "rgba(109, 117, 143, 0.9)"
 *
 *   opacity   – overall canvas opacity (0–1)
 *               default: 0.85
 *
 *   gridSize  – spacing in px between dot centres
 *               default: 48
 *
 * ─── Notes ───────────────────────────────────────────────────────────────────
 *
 *   • Works in any React / Next.js project (mark the parent as "use client"
 *     when used inside Next.js App Router).
 *   • The canvas is fixed, full-viewport, and sits behind all other content
 *     (z-index: -10). It is pointer-events: none so it never blocks clicks.
 *   • Rendering is idle-aware: the animation loop only runs while dots are
 *     in motion, so it has zero CPU cost at rest.
 *   • HiDPI / Retina screens are handled automatically (capped at 2× DPR).
 */

"use client";

import { useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DotsProps {
  /** CSS color string for the dots. @default "rgba(109, 117, 143, 0.9)" */
  dotColor?: string;
  /** Overall canvas opacity (0–1). @default 0.85 */
  opacity?: number;
  /** Spacing in pixels between dot centres. @default 48 */
  gridSize?: number;
}

interface Dot {
  /** Grid-origin X position */
  x: number;
  /** Grid-origin Y position */
  y: number;
  /** Animated (current render) X position */
  currentX: number;
  /** Animated (current render) Y position */
  currentY: number;
  /** Resting radius */
  baseRadius: number;
  /** Animated (current render) radius */
  radius: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Dots({
  opacity = 0.85,
  dotColor = "rgba(109, 117, 143, 0.9)",
  gridSize = 48,
}: DotsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const sizeRef = useRef({ width: 0, height: 0 });
  const isAnimatingRef = useRef(false);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Physics constants ────────────────────────────────────────────────────
    const effectRadius = 160;   // px — how far from the cursor dots react
    const maxRepulsion = 25;    // px — maximum displacement per dot
    const baseRadius = 1.8;     // px — resting dot size
    const maxRadius = 4.5;      // px — maximum dot size at cursor centre
    const returnSpeed = 0.15;   // lerp factor — higher = snappier return
    const SETTLE_THRESHOLD = 0.05; // px — below this, stop animating

    // ── Grid initialisation ──────────────────────────────────────────────────
    const initGrid = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (width === 0 || height === 0) return;

      sizeRef.current = { width, height };

      // HiDPI support — cap at 2× to avoid excessive memory use
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const newDots: Dot[] = [];
      const cols = Math.floor(width / gridSize) + 2;
      const rows = Math.floor(height / gridSize) + 2;
      const marginX = (width - (cols - 1) * gridSize) / 2;
      const marginY = (height - (rows - 1) * gridSize) / 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = marginX + i * gridSize;
          const y = marginY + j * gridSize;
          newDots.push({ x, y, currentX: x, currentY: y, baseRadius, radius: baseRadius });
        }
      }

      dotsRef.current = newDots;
      drawStatic();
    };

    // ── Static frame (no interaction) ────────────────────────────────────────
    const drawStatic = () => {
      const { width, height } = sizeRef.current;
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = dotColor;
      ctx.globalAlpha = opacity;

      const dots = dotsRef.current;
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.baseRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // ── Physics render loop ──────────────────────────────────────────────────
    const render = () => {
      const { width, height } = sizeRef.current;
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = dotColor;
      ctx.globalAlpha = opacity;

      const dots = dotsRef.current;
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      let stillMoving = false;

      // Only compute physics for dots within the effect zone + a small margin
      const nearRange = effectRadius + 60;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Cheap AABB pre-check — skip full sqrt for distant dots
        const roughDx = Math.abs(mouseX - dot.x);
        const roughDy = Math.abs(mouseY - dot.y);

        if (roughDx < nearRange && roughDy < nearRange) {
          // Full distance + physics
          const dx = mouseX - dot.x;
          const dy = mouseY - dot.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let targetX = dot.x;
          let targetY = dot.y;
          let targetRadius = dot.baseRadius;

          if (distance < effectRadius) {
            const force = (effectRadius - distance) / effectRadius;
            const angle = Math.atan2(dy, dx);
            const pushOffset = force * maxRepulsion;
            targetX = dot.x - Math.cos(angle) * pushOffset;
            targetY = dot.y - Math.sin(angle) * pushOffset;
            targetRadius = dot.baseRadius + force * (maxRadius - dot.baseRadius);
          }

          dot.currentX += (targetX - dot.currentX) * returnSpeed;
          dot.currentY += (targetY - dot.currentY) * returnSpeed;
          dot.radius += (targetRadius - dot.radius) * returnSpeed;

          if (
            Math.abs(dot.currentX - targetX) > SETTLE_THRESHOLD ||
            Math.abs(dot.currentY - targetY) > SETTLE_THRESHOLD ||
            Math.abs(dot.radius - targetRadius) > SETTLE_THRESHOLD
          ) {
            stillMoving = true;
          }
        } else if (
          Math.abs(dot.currentX - dot.x) > SETTLE_THRESHOLD ||
          Math.abs(dot.currentY - dot.y) > SETTLE_THRESHOLD ||
          Math.abs(dot.radius - dot.baseRadius) > SETTLE_THRESHOLD
        ) {
          // Dot displaced but cursor left — spring back to origin
          dot.currentX += (dot.x - dot.currentX) * returnSpeed;
          dot.currentY += (dot.y - dot.currentY) * returnSpeed;
          dot.radius += (dot.baseRadius - dot.radius) * returnSpeed;
          stillMoving = true;
        }

        ctx.beginPath();
        ctx.arc(dot.currentX, dot.currentY, dot.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (stillMoving) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        isAnimatingRef.current = false;
      }
    };

    // ── Animation kickoff ────────────────────────────────────────────────────
    const startAnimation = () => {
      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    // ── Event listeners ──────────────────────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      startAnimation();
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
      startAnimation();
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initGrid, 200);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);

    initGrid();

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [dotColor, gridSize, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -10,
        display: "block",
      }}
    />
  );
}

export default Dots;
