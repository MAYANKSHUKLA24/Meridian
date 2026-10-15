"use client";

import { useEffect, useRef } from "react";
import type { ParticleType } from "@/lib/meridian/segments";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  phase: number;
  wobble: number;
};

type Config = { type: ParticleType; density: number; speed: number; colors: string[] };

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function spawn(type: ParticleType, w: number, h: number, colors: string[], speed: number): Particle {
  const base: Particle = {
    x: rand(0, w),
    y: rand(0, h),
    vx: 0,
    vy: 0,
    size: 2,
    color: pick(colors),
    alpha: rand(0.3, 0.9),
    phase: rand(0, Math.PI * 2),
    wobble: rand(0.4, 1.2),
  };

  switch (type) {
    case "birds":
      return { ...base, y: rand(h * 0.08, h * 0.4), vx: rand(0.3, 0.7) * speed, vy: 0, size: rand(5, 10) };
    case "bokeh":
      return { ...base, vx: rand(-0.08, 0.08) * speed, vy: rand(-0.05, -0.15) * speed, size: rand(6, 26), alpha: rand(0.15, 0.5) };
    case "embers":
      return { ...base, y: rand(h * 0.5, h), vx: rand(-0.15, 0.15) * speed, vy: -rand(0.3, 0.9) * speed, size: rand(1.5, 3.5) };
    case "haze":
      return { ...base, vx: rand(0.02, 0.06) * speed, vy: rand(-0.02, 0.02) * speed, size: rand(60, 160), alpha: rand(0.04, 0.12) };
    case "neon":
      return { ...base, vx: rand(0.6, 1.4) * speed, vy: rand(-0.3, 0.3) * speed, size: rand(30, 90), alpha: rand(0.25, 0.6) };
    case "stars":
      return { ...base, vx: 0, vy: 0, size: rand(0.6, 2.2), alpha: rand(0.2, 1) };
    default:
      return base;
  }
}

function draw(ctx: CanvasRenderingContext2D, p: Particle, type: ParticleType, t: number) {
  ctx.save();
  ctx.globalAlpha = p.alpha;

  if (type === "birds") {
    const wing = Math.sin(t * 0.006 * p.wobble + p.phase) * p.size * 0.5;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(p.x - p.size, p.y - wing);
    ctx.lineTo(p.x, p.y);
    ctx.lineTo(p.x + p.size, p.y - wing);
    ctx.stroke();
  } else if (type === "stars") {
    const twinkle = 0.5 + 0.5 * Math.sin(t * 0.0015 * p.wobble + p.phase);
    ctx.globalAlpha = p.alpha * twinkle;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "neon") {
    const grad = ctx.createLinearGradient(p.x - p.size, p.y, p.x + p.size, p.y);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(0.5, p.color);
    grad.addColorStop(1, "transparent");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(p.x - p.size, p.y);
    ctx.lineTo(p.x + p.size, p.y);
    ctx.stroke();
  } else {
    // bokeh, embers, haze — soft radial dot
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    grad.addColorStop(0, p.color);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function Particles({ config }: { config: Config }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    let particles: Particle[] = Array.from({ length: configRef.current.density }, () =>
      spawn(configRef.current.type, width, height, configRef.current.colors, configRef.current.speed),
    );
    let lastType = configRef.current.type;

    let raf = 0;
    function tick(t: number) {
      const cfg = configRef.current;
      if (cfg.type !== lastType || particles.length !== cfg.density) {
        particles = Array.from({ length: cfg.density }, () => spawn(cfg.type, width, height, cfg.colors, cfg.speed));
        lastType = cfg.type;
      }

      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -p.size * 2) p.x = width + p.size * 2;
        if (p.x > width + p.size * 2) p.x = -p.size * 2;
        if (p.y < -p.size * 2) {
          Object.assign(p, spawn(cfg.type, width, height, cfg.colors, cfg.speed), { y: height + p.size * 2 });
        }
        if (p.y > height + p.size * 2) {
          Object.assign(p, spawn(cfg.type, width, height, cfg.colors, cfg.speed), { y: -p.size * 2 });
        }

        draw(ctx!, p, cfg.type, t);
      }

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-15] pointer-events-none" />;
}
