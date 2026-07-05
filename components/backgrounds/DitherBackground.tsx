'use client';

import React, { useEffect, useRef } from 'react';

export default function DitherBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const spacing = 16;
      const dotSize = 1.2;

      ctx.fillStyle = '#d1d5db';

      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          // Dither pattern: offset every other row
          const offsetX = (Math.floor(y / spacing) % 2) * (spacing / 2);

          // Vary opacity slightly for organic dither feel
          const noise = Math.sin(x * 0.01 + y * 0.01) * 0.3 + 0.5;
          ctx.globalAlpha = noise * 0.4;

          ctx.beginPath();
          ctx.arc(x + offsetX, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
    };

    resize();
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
