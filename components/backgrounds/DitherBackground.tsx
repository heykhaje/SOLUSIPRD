'use client';

import React, { useEffect, useRef } from 'react';

export default function DitherBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Layer 1: subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Layer 2: dither dots at grid intersections
      const dotSpacing = 40;
      for (let x = 0; x <= canvas.width; x += dotSpacing) {
        for (let y = 0; y <= canvas.height; y += dotSpacing) {
          // Organic feel: slight wave distortion
          const wave = Math.sin((x + time * 8) * 0.005) * Math.cos((y + time * 6) * 0.007);
          const alpha = 0.04 + wave * 0.025;

          if (alpha > 0) {
            ctx.fillStyle = `rgba(167, 139, 250, ${alpha * 1.5})`;
            ctx.beginPath();
            ctx.arc(x, y, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Layer 3: larger accent dots (sparse)
      const accentSpacing = 160;
      for (let x = accentSpacing / 2; x <= canvas.width; x += accentSpacing) {
        for (let y = accentSpacing / 2; y <= canvas.height; y += accentSpacing) {
          const wave = Math.sin((x + time * 4) * 0.003 + (y * 0.005));
          const alpha = 0.02 + wave * 0.015;
          if (alpha > 0) {
            ctx.fillStyle = `rgba(251, 113, 133, ${alpha * 2})`;
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      time += 1;
      animFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
