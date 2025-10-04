import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  opacity: number;
  size: number;
  life: number;
  color: string;
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

    const colors = ['#8B5CF6', '#EC4899', '#F59E0B', '#A855F7'];

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      particlesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        opacity: 1,
        size: Math.random() * 4 + 2,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.life -= 0.015;
        particle.opacity = particle.life;
        particle.size *= 0.97;

        if (particle.life > 0) {
          ctx.fillStyle = particle.color + Math.floor(particle.opacity * 160).toString(16).padStart(2, '0');
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          );
          gradient.addColorStop(0, particle.color + Math.floor(particle.opacity * 100).toString(16).padStart(2, '0'));
          gradient.addColorStop(1, particle.color + '00');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          ctx.fill();

          return true;
        }
        return false;
      });

      ctx.save();
      ctx.translate(mousePos.x, mousePos.y);
      ctx.rotate(Math.PI / 4);
      
      const gradient = ctx.createLinearGradient(0, -10, 0, 10);
      gradient.addColorStop(0, '#8B5CF6');
      gradient.addColorStop(0.5, '#A855F7');
      gradient.addColorStop(1, '#EC4899');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(-5, 5);
      ctx.lineTo(0, 3);
      ctx.lineTo(5, 5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#F59E0B';
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, 3);
      ctx.lineTo(-3, 10);
      ctx.lineTo(0, 7);
      ctx.lineTo(3, 10);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
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
