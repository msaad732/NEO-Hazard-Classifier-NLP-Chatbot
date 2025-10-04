import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  opacity: number;
  size: number;
  life: number;
}

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);

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

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      particlesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        opacity: 1,
        size: Math.random() * 3 + 2,
        life: 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.life -= 0.02;
        particle.opacity = particle.life;
        particle.size *= 0.98;

        if (particle.life > 0) {
          ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity * 0.6})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 2
          );
          gradient.addColorStop(0, `rgba(0, 255, 255, ${particle.opacity * 0.3})`);
          gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.fill();

          return true;
        }
        return false;
      });

      ctx.save();
      ctx.translate(mousePos.x, mousePos.y);
      ctx.rotate(Math.PI / 4);
      
      ctx.fillStyle = '#00FFFF';
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(-4, 4);
      ctx.lineTo(0, 2);
      ctx.lineTo(4, 4);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FFD700';
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.lineTo(-2, 8);
      ctx.lineTo(0, 6);
      ctx.lineTo(2, 8);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 9999, cursor: 'none' }}
    />
  );
}
