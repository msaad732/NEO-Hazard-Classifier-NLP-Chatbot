import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  drift: number;
  base: number;
  twinkleRate: number;
  phase: number;
}

/**
 * Ambient backdrop. Deliberately near-invisible: monochrome pinpoints on the
 * chassis colour, drifting slowly enough that it reads as depth rather than
 * animation. It carries no information, so it is the first thing to switch off.
 *
 * Stops entirely under prefers-reduced-motion and while the tab is hidden.
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let stars: Star[] = [];
    let frame = 0;
    let running = false;

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density scales with area so a phone does not pay for a desktop's star count.
      const count = Math.round((w * h) / 9000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 0.9 + 0.35,
        drift: Math.random() * 0.012 + 0.004,
        base: Math.random() * 0.3 + 0.12,
        twinkleRate: Math.random() * 0.006 + 0.002,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const paint = (animated: boolean) => {
      const w = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
      const h = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));
      ctx.clearRect(0, 0, w, h);

      for (const star of stars) {
        let alpha = star.base;
        if (animated) {
          star.phase += star.twinkleRate;
          alpha = star.base * (0.65 + Math.sin(star.phase) * 0.35);
          star.y += star.drift;
          if (star.y > h) {
            star.y = -2;
            star.x = Math.random() * w;
          }
        }
        ctx.fillStyle = `rgba(226, 232, 240, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      paint(true);
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduceMotion.matches || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const sync = () => {
      stop();
      if (reduceMotion.matches) {
        paint(false); // static field still gives the page depth
      } else {
        start();
      }
    };

    const handleResize = () => {
      seed();
      if (!running) paint(false);
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else sync();
    };

    seed();
    sync();

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);
    reduceMotion.addEventListener('change', sync);

    return () => {
      stop();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      reduceMotion.removeEventListener('change', sync);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* Vignette keeps the field from competing with content in the centre. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_0%,hsl(var(--background)/0.45)_60%,hsl(var(--background)/0.85)_100%)]" />
    </div>
  );
}
