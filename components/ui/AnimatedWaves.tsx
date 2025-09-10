'use client';

import { useEffect, useRef } from 'react';

interface Wave {
  gradient: CanvasGradient;
  amplitude: number;
  frequency: number;
  speed: number;
  yOffset: number;
}

const AnimatedWaves = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const wavesRef = useRef<Wave[]>([]);
  const frameRef = useRef<number>(0);

  const createGradient = (ctx: CanvasRenderingContext2D, colors: [string, string], width: number): CanvasGradient => {
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    return gradient;
  };

  const setupWaves = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const height = canvas.clientHeight;
    const width = canvas.clientWidth;
    
    wavesRef.current = [
      {
        gradient: createGradient(ctx, ["#fef08a", "#eab308"], width), // Yellow (from border-top)
        amplitude: 25,
        frequency: 0.008,
        speed: 0.018,
        yOffset: height / 2,
      },
      {
        gradient: createGradient(ctx, ["#6ee7b7", "#22c55e"], width), // Green (from border-top)
        amplitude: 15,
        frequency: 0.01,
        speed: -0.022,
        yOffset: height / 2,
      },
      {
        gradient: createGradient(ctx, ["#ffffff", "#f3f4f6"], width), // White (from border-top)
        amplitude: 20,
        frequency: 0.012,
        speed: 0.012,
        yOffset: height / 2,
      },
    ];
  };

  const animate = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    wavesRef.current.forEach((wave) => {
      ctx.beginPath();
      ctx.strokeStyle = wave.gradient;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#fef08a";
      ctx.shadowBlur = 8;

      for (let x = -5; x < canvas.clientWidth + 5; x++) {
        const y =
          wave.yOffset +
          wave.amplitude *
            Math.sin(x * wave.frequency + frameRef.current * wave.speed);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    frameRef.current++;
    animationFrameRef.current = requestAnimationFrame(() => animate(ctx, canvas));
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = container.clientWidth * dpr;
    canvas.height = container.clientHeight * dpr;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    setupWaves(ctx, canvas);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    resizeCanvas();
    animate(ctx, canvas);

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="w-full h-24 overflow-hidden">
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default AnimatedWaves;