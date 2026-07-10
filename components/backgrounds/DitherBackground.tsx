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
    
    // FPS Limiter
    const fps = 24; // Lower FPS for background effects significantly reduces CPU/GPU load
    const interval = 1000 / fps;
    let then = performance.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = (now: number) => {
      animFrame = requestAnimationFrame(draw);

      const delta = now - then;
      if (delta < interval) return;
      then = now - (delta % interval);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Layer 1: subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      // Layer 2: dither dots at grid intersections
      const dotSpacing = 40;
      for (let x = 0; x <= canvas.width; x += dotSpacing) {
        for (let y = 0; y <= canvas.height; y += dotSpacing) {
          // Organic feel: slight wave distortion
          const wave = Math.sin((x + time * 8) * 0.005) * Math.cos((y + time * 6) * 0.007);
          const alpha = 0.04 + wave * 0.025;

          if (alpha > 0) {
            ctx.fillStyle = `rgba(167, 139, 250, ${alpha * 1.5})`;
            // OPTIMIZATION: fillRect is massively faster than beginPath -> arc -> fill
            ctx.fillRect(x - 1, y - 1, 2, 2); 
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
            // OPTIMIZATION: fillRect instead of arc for large dots too (5x5 pixels)
            ctx.fillRect(x - 2.5, y - 2.5, 5, 5);
          }
        }
      }

      time += 1.5; // Compensate time speed due to lower FPS
    };

    resize();
    animFrame = requestAnimationFrame(draw);

    // Debounce resize to prevent freeze on mobile scroll (URL bar hide/show)
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
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
