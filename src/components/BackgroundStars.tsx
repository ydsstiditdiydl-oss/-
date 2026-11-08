import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  delta: number;
  color: string;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

export const BackgroundStars: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate stars
    const starCount = Math.min(130, Math.floor((width * height) / 10000));
    const starColors = ['#ffffff', '#fed7aa', '#fbcfe8', '#f472b6', '#c084fc'];
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        delta: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: starColors[Math.floor(Math.random() * starColors.length)]
      });
    }

    // Meteors
    const meteors: Meteor[] = [];
    const createMeteor = () => {
      meteors.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.4),
        length: Math.random() * 80 + 40,
        speed: Math.random() * 7 + 4,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        alpha: 1,
        active: true
      });
    };

    let meteorTimer = setInterval(() => {
      if (Math.random() > 0.3) {
        createMeteor();
      }
    }, 4000);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep galactic nebula radial glow
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.25,
        10,
        width * 0.5,
        height * 0.25,
        Math.max(width, height) * 0.7
      );
      grad.addColorStop(0, 'rgba(67, 10, 50, 0.25)'); // Burgundy glow
      grad.addColorStop(0.5, 'rgba(30, 10, 45, 0.15)'); // Deep purple
      grad.addColorStop(1, 'rgba(3, 0, 5, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render stars
      stars.forEach((star) => {
        star.alpha += star.delta;
        if (star.alpha <= 0.1 || star.alpha >= 0.95) {
          star.delta = -star.delta;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.05, Math.min(1, star.alpha));
        ctx.shadowBlur = star.radius > 1.2 ? 6 : 0;
        ctx.shadowColor = star.color;
        ctx.fill();
        ctx.restore();
      });

      // Render meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        if (!m.active) continue;

        ctx.save();
        const endX = m.x - Math.cos(m.angle) * m.length;
        const endY = m.y - Math.sin(m.angle) * m.length;

        const mGrad = ctx.createLinearGradient(m.x, m.y, endX, endY);
        mGrad.addColorStop(0, `rgba(255, 240, 245, ${m.alpha})`);
        mGrad.addColorStop(0.4, `rgba(244, 114, 182, ${m.alpha * 0.7})`);
        mGrad.addColorStop(1, 'rgba(244, 114, 182, 0)');

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = mGrad;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.restore();

        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= 0.015;

        if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
          m.active = false;
          meteors.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearInterval(meteorTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'radial-gradient(circle at 50% 15%, #18051e 0%, #08010e 55%, #020005 100%)' }}
    />
  );
};
