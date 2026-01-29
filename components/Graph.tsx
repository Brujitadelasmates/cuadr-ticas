
import React, { useEffect, useRef } from 'react';

interface GraphProps {
  a: number;
  b: number;
  c: number;
}

export const Graph: React.FC<GraphProps> = ({ a, b, c }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Clear
    ctx.clearRect(0, 0, width, height);

    // Coordinate system setup
    const scale = 20; // pixels per unit
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= width; x += scale) {
      ctx.moveTo(x, 0); ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += scale) {
      ctx.moveTo(0, y); ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Draw Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY); ctx.lineTo(width, centerY); // X axis
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height); // Y axis
    ctx.stroke();

    // Draw Parabola
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let started = false;
    for (let px = 0; px <= width; px++) {
      const x = (px - centerX) / scale;
      const y = a * x * x + b * x + c;
      const py = centerY - y * scale;

      if (py >= 0 && py <= height) {
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
    }
    ctx.stroke();

    // Draw Roots if they are real
    const disc = b * b - 4 * a * c;
    if (disc >= 0) {
      const x1 = (-b + Math.sqrt(disc)) / (2 * a);
      const x2 = (-b - Math.sqrt(disc)) / (2 * a);
      
      [x1, x2].forEach(root => {
        const rx = centerX + root * scale;
        const ry = centerY;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(rx, ry, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

  }, [a, b, c]);

  return (
    <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={300} 
        className="w-full h-auto cursor-crosshair"
      />
      <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
        Live Cartesian Plane
      </div>
    </div>
  );
};
