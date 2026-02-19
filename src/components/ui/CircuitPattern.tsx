"use client";

import { useEffect, useRef } from "react";

interface CircuitTrace {
  segments: { x: number; y: number }[];
  progress: number;
  speed: number;
  opacity: number;
  width: number;
  color: string;
  nodeRadius: number;
}

function createTrace(w: number, h: number, forceEdge?: number): CircuitTrace {
  const edgeIndex = forceEdge !== undefined ? forceEdge % 4 : Math.floor(Math.random() * 4);
  const colors = ["4, 29, 119", "78, 199, 240"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  let x: number, y: number;
  let horizontal: boolean;

  switch (edgeIndex) {
    case 0: // left
      x = 0; y = Math.random() * h; horizontal = true; break;
    case 1: // right
      x = w; y = Math.random() * h; horizontal = true; break;
    case 2: // top
      x = Math.random() * w; y = 0; horizontal = false; break;
    default: // bottom
      x = Math.random() * w; y = h; horizontal = false; break;
  }

  const segments: { x: number; y: number }[] = [{ x, y }];
  const numSegments = 5 + Math.floor(Math.random() * 4);

  for (let i = 0; i < numSegments; i++) {
    const prev = segments[segments.length - 1];
    const step = 40 + Math.random() * 100;

    if (horizontal) {
      // Move toward center horizontally
      const dirX = prev.x < w / 2 ? 1 : -1;
      segments.push({
        x: Math.max(0, Math.min(w, prev.x + step * dirX)),
        y: prev.y,
      });
    } else {
      // Move toward center vertically
      const dirY = prev.y < h / 2 ? 1 : -1;
      segments.push({
        x: prev.x,
        y: Math.max(0, Math.min(h, prev.y + step * dirY)),
      });
    }
    horizontal = !horizontal;
  }

  return {
    segments,
    progress: 0,
    speed: 0.002 + Math.random() * 0.003,
    opacity: 0.07 + Math.random() * 0.09,
    width: 0.6 + Math.random() * 0.8,
    color,
    nodeRadius: 1.5 + Math.random() * 1.5,
  };
}

function getTotalLength(segments: { x: number; y: number }[]): number {
  let len = 0;
  for (let i = 1; i < segments.length; i++) {
    len += Math.abs(segments[i].x - segments[i - 1].x) + Math.abs(segments[i].y - segments[i - 1].y);
  }
  return len;
}

function drawTrace(ctx: CanvasRenderingContext2D, trace: CircuitTrace) {
  const { segments, progress, opacity, width, color, nodeRadius } = trace;
  if (segments.length < 2) return;

  const totalLen = getTotalLength(segments);
  const drawLen = Math.min(progress, 1) * totalLen;
  const fadeOpacity = opacity * Math.min(1, progress * 4);

  ctx.strokeStyle = `rgba(${color}, ${fadeOpacity})`;
  ctx.lineWidth = width;
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";

  ctx.beginPath();
  ctx.moveTo(segments[0].x, segments[0].y);

  let accumulated = 0;
  let tipX = segments[0].x;
  let tipY = segments[0].y;
  let drawing = true;

  for (let i = 1; i < segments.length && drawing; i++) {
    const dx = segments[i].x - segments[i - 1].x;
    const dy = segments[i].y - segments[i - 1].y;
    const segLen = Math.abs(dx) + Math.abs(dy);

    if (accumulated + segLen <= drawLen) {
      ctx.lineTo(segments[i].x, segments[i].y);
      accumulated += segLen;
      tipX = segments[i].x;
      tipY = segments[i].y;
    } else {
      const t = (drawLen - accumulated) / segLen;
      tipX = segments[i - 1].x + dx * t;
      tipY = segments[i - 1].y + dy * t;
      ctx.lineTo(tipX, tipY);
      drawing = false;
    }
  }

  ctx.stroke();

  // Nodes at reached corners
  ctx.fillStyle = `rgba(${color}, ${fadeOpacity * 1.3})`;
  accumulated = 0;
  for (let i = 0; i < segments.length; i++) {
    if (i === 0 || accumulated <= drawLen) {
      ctx.beginPath();
      ctx.arc(segments[i].x, segments[i].y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    if (i < segments.length - 1) {
      accumulated += Math.abs(segments[i + 1].x - segments[i].x) + Math.abs(segments[i + 1].y - segments[i].y);
    }
  }

  // Glow at leading tip
  if (progress < 1) {
    const grad = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 6);
    grad.addColorStop(0, `rgba(${color}, ${Math.min(fadeOpacity * 2.5, 0.4)})`);
    grad.addColorStop(1, `rgba(${color}, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(tipX, tipY, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function CircuitPattern() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number = 0;
    let traces: CircuitTrace[] = [];

    // Find the closest positioned ancestor (section, footer, etc.)
    const container = canvas.closest("section") ?? canvas.closest("footer") ?? canvas.parentElement;

    const getSize = () => {
      const el = container ?? canvas;
      return { w: el.offsetWidth, h: el.offsetHeight };
    };

    const resize = () => {
      const dpr = window.devicePixelRatio;
      const { w, h } = getSize();
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      const { w, h } = getSize();
      // Distribute evenly: ~3-4 traces per edge
      const perEdge = 3;
      traces = Array.from({ length: perEdge * 4 }, (_, i) => {
        const trace = createTrace(w, h, i);
        trace.progress = Math.random(); // stagger
        return trace;
      });
    };

    const draw = () => {
      const { w, h } = getSize();
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < traces.length; i++) {
        const trace = traces[i];
        trace.progress += trace.speed;

        if (trace.progress > 1.6) {
          const newTrace = createTrace(w, h, i);
          Object.assign(trace, newTrace);
          trace.progress = 0;
        }

        drawTrace(ctx, trace);
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    const onResize = () => { resize(); init(); };
    window.addEventListener("resize", onResize);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      cancelAnimationFrame(animationId);
      const s = getSize();
      ctx.clearRect(0, 0, s.w, s.h);
      for (const trace of traces) {
        trace.progress = 1;
        drawTrace(ctx, { ...trace, opacity: trace.opacity * 0.5 });
      }
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    />
  );
}
