"use client";

import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  vx: number;
  vy: number;
  baseOpacity: number;
  isAccent: boolean;
}

export function FloatingDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number = 0;
    let dots: Dot[] = [];
    let isVisible = false;
    let lastTime = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const createDots = () => {
      // Max 35 dots — enough for visual effect without O(n²) cost
      const count = Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 18000);
      dots = Array.from({ length: Math.min(count, 35) }, () => {
        const baseOpacity = Math.random() * 0.35 + 0.1;
        return {
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          radius: Math.random() * 2 + 1,
          opacity: baseOpacity,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          baseOpacity,
          isAccent: baseOpacity > 0.3,
        };
      });
    };

    const draw = (timestamp: number) => {
      if (!isVisible) {
        animationId = 0;
        return;
      }

      // Throttle to ~30fps
      if (timestamp - lastTime < 33) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastTime = timestamp;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      for (const dot of dots) {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0) dot.x = w;
        if (dot.x > w) dot.x = 0;
        if (dot.y < 0) dot.y = h;
        if (dot.y > h) dot.y = 0;

        dot.opacity = dot.baseOpacity + Math.sin(timestamp * 0.0008 + dot.x) * 0.12;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dot.isAccent
          ? `rgba(78, 199, 240, ${dot.opacity})`
          : `rgba(4, 29, 119, ${dot.opacity})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    // Pause animation when section is off-screen
    const section = canvas.closest("section") ?? canvas.parentElement;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible && animationId === 0) {
          animationId = requestAnimationFrame(draw);
        }
      },
      { threshold: 0.01 },
    );
    if (section) observer.observe(section);

    const onResize = () => { resize(); createDots(); };
    window.addEventListener("resize", onResize, { passive: true });

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    resize();
    createDots();

    if (motionQuery.matches) {
      // Draw once, static
      for (const dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(4, 29, 119, ${dot.baseOpacity})`;
        ctx.fill();
      }
    } else {
      isVisible = true;
      animationId = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 size-full"
      aria-hidden="true"
    />
  );
}