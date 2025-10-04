import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface CelestialBody {
  x: number;
  y: number;
  size: number;
  speed: number;
  type: 'planet' | 'nebula' | 'meteor';
  color: string;
  angle: number;
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars: Star[] = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speed: Math.random() * 0.05 + 0.01,
      opacity: Math.random() * 0.5 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    const celestialBodies: CelestialBody[] = [
      { x: canvas.width * 0.1, y: canvas.height * 0.2, size: 40, speed: 0.02, type: 'planet', color: 'rgba(100, 100, 200, 0.3)', angle: 0 },
      { x: canvas.width * 0.8, y: canvas.height * 0.7, size: 60, speed: 0.015, type: 'planet', color: 'rgba(150, 100, 150, 0.25)', angle: 0 },
      { x: canvas.width * 0.5, y: canvas.height * 0.4, size: 80, speed: 0.01, type: 'nebula', color: 'rgba(100, 50, 200, 0.15)', angle: 0 },
    ];

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 31, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      celestialBodies.forEach((body) => {
        body.angle += body.speed;
        const offsetX = Math.sin(body.angle) * 20;
        const offsetY = Math.cos(body.angle) * 10;

        if (body.type === 'nebula') {
          const gradient = ctx.createRadialGradient(
            body.x + offsetX,
            body.y + offsetY,
            0,
            body.x + offsetX,
            body.y + offsetY,
            body.size
          );
          gradient.addColorStop(0, body.color);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(body.x + offsetX, body.y + offsetY, body.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = body.color;
          ctx.beginPath();
          ctx.arc(body.x + offsetX, body.y + offsetY, body.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
