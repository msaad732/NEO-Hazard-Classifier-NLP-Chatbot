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

interface Planet {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  rings?: boolean;
  moons?: number;
  angle: number;
  orbitRadius: number;
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

    const stars: Star[] = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5,
      speed: Math.random() * 0.08 + 0.02,
      opacity: Math.random() * 0.6 + 0.3,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    const planets: Planet[] = [
      { 
        x: canvas.width * 0.15, 
        y: canvas.height * 0.25, 
        size: 80, 
        speed: 0.008, 
        color: '#8B5CF6',
        rings: true,
        angle: 0,
        orbitRadius: 30
      },
      { 
        x: canvas.width * 0.75, 
        y: canvas.height * 0.65, 
        size: 100, 
        speed: 0.006, 
        color: '#EC4899',
        moons: 2,
        angle: Math.PI,
        orbitRadius: 25
      },
      { 
        x: canvas.width * 0.5, 
        y: canvas.height * 0.15, 
        size: 60, 
        speed: 0.01, 
        color: '#F59E0B',
        angle: Math.PI / 2,
        orbitRadius: 20
      },
      { 
        x: canvas.width * 0.85, 
        y: canvas.height * 0.3, 
        size: 70, 
        speed: 0.007, 
        color: '#06B6D4',
        moons: 1,
        angle: Math.PI * 1.5,
        orbitRadius: 28
      },
      { 
        x: canvas.width * 0.3, 
        y: canvas.height * 0.75, 
        size: 90, 
        speed: 0.005, 
        color: '#A855F7',
        rings: true,
        angle: Math.PI * 0.75,
        orbitRadius: 35
      },
    ];

    let animationId: number;

    const drawPlanet = (planet: Planet, offsetX: number, offsetY: number) => {
      const gradient = ctx.createRadialGradient(
        planet.x + offsetX,
        planet.y + offsetY,
        0,
        planet.x + offsetX,
        planet.y + offsetY,
        planet.size
      );
      
      gradient.addColorStop(0, planet.color);
      gradient.addColorStop(0.7, planet.color + 'CC');
      gradient.addColorStop(1, planet.color + '00');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(planet.x + offsetX, planet.y + offsetY, planet.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = planet.color + '99';
      ctx.beginPath();
      ctx.arc(planet.x + offsetX - planet.size * 0.3, planet.y + offsetY - planet.size * 0.3, planet.size * 0.6, 0, Math.PI * 2);
      ctx.fill();

      if (planet.rings) {
        ctx.strokeStyle = planet.color + '66';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.ellipse(
          planet.x + offsetX,
          planet.y + offsetY,
          planet.size * 1.6,
          planet.size * 0.4,
          0.3,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        
        ctx.strokeStyle = planet.color + '44';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(
          planet.x + offsetX,
          planet.y + offsetY,
          planet.size * 1.8,
          planet.size * 0.5,
          0.3,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      if (planet.moons) {
        for (let i = 0; i < planet.moons; i++) {
          const moonAngle = planet.angle * 3 + (i * Math.PI * 2) / planet.moons;
          const moonDistance = planet.size * 1.4;
          const moonX = planet.x + offsetX + Math.cos(moonAngle) * moonDistance;
          const moonY = planet.y + offsetY + Math.sin(moonAngle) * moonDistance;
          
          ctx.fillStyle = '#FFFFFF88';
          ctx.beginPath();
          ctx.arc(moonX, moonY, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const animate = () => {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      gradient.addColorStop(0, '#0F0820');
      gradient.addColorStop(0.5, '#1A0B2E');
      gradient.addColorStop(1, '#0A0515');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.4 + 0.6;
        
        const colors = ['#FFFFFF', '#A78BFA', '#EC4899', '#F59E0B', '#06B6D4'];
        const color = colors[Math.floor(star.x + star.y) % colors.length];
        
        ctx.fillStyle = color + Math.floor(star.opacity * twinkle * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        if (star.size > 1.5) {
          ctx.fillStyle = color + '44';
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      planets.forEach((planet) => {
        planet.angle += planet.speed;
        const offsetX = Math.sin(planet.angle) * planet.orbitRadius;
        const offsetY = Math.cos(planet.angle) * planet.orbitRadius * 0.5;

        drawPlanet(planet, offsetX, offsetY);
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
