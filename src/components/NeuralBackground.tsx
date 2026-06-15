import React, { useEffect, useRef } from 'react';
import { ThemeType } from '../types';

interface NeuralBackgroundProps {
  currentTheme: ThemeType;
}

export const NeuralBackground: React.FC<NeuralBackgroundProps> = ({ currentTheme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse
    let mouse = {
      x: -1000,
      y: -1000,
      radius: 170, // influence aura
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Handle resizing beautifully
    let resizeFrameId: number;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || !entries.length) return;
      const { width: entryWidth, height: entryHeight } = entries[0].contentRect;
      
      cancelAnimationFrame(resizeFrameId);
      resizeFrameId = requestAnimationFrame(() => {
        if (canvas) {
          width = canvas.width = entryWidth;
          height = canvas.height = entryHeight;
        }
      });
    });
    resizeObserver.observe(canvas.parentElement || document.body);

    // Configure themes
    const getColors = () => {
      switch (currentTheme) {
        case 'neon-blue':
          return {
            nodeColor: 'rgba(6, 182, 212, 0.4)', // cyan
            lineColor: 'rgba(6, 182, 212, 0.08)',
            activeLineColor: 'rgba(34, 211, 238, 0.35)',
            glowColor: 'cyan',
          };
        case 'purple-galaxy':
          return {
            nodeColor: 'rgba(168, 85, 247, 0.4)', // purple
            lineColor: 'rgba(168, 85, 247, 0.08)',
            activeLineColor: 'rgba(192, 132, 252, 0.35)',
            glowColor: 'fuchsia',
          };
        case 'professional-light':
          return {
            nodeColor: 'rgba(99, 102, 241, 0.3)', // indigo
            lineColor: 'rgba(99, 102, 241, 0.05)',
            activeLineColor: 'rgba(99, 102, 241, 0.2)',
            glowColor: 'indigo',
          };
      }
    };

    // Node class helper
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }

    const nodes: Node[] = [];
    const maxNodes = Math.min(85, Math.floor((width * height) / 18000));

    // Populate initial nodes
    for (let i = 0; i < maxNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      const colors = getColors();
      ctx.clearRect(0, 0, width, height);

      // Create rich organic theme gradient mesh overlay
      if (currentTheme === 'neon-blue') {
        const gradient = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height));
        gradient.addColorStop(0, '#060b1e');
        gradient.addColorStop(1, '#02050d');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      } else if (currentTheme === 'purple-galaxy') {
        const gradient = ctx.createRadialGradient(width * 0.3, height * 0.3, 10, width / 2, height / 2, Math.max(width, height));
        gradient.addColorStop(0, '#0e0416');
        gradient.addColorStop(0.5, '#070210');
        gradient.addColorStop(1, '#020108');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      } else {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#f1f5f9'); // slate-100
        gradient.addColorStop(0.5, '#f8fafc'); // slate-50
        gradient.addColorStop(1, '#e2e8f0'); // slate-200
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Underlay a subtle professional technical grid overlay in light mode
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.035)';
        ctx.lineWidth = 1;
        const gridSize = 45;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // Draw active connection wires
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];

        // Slowly move nodes
        nodeA.x += nodeA.vx;
        nodeA.y += nodeA.vy;

        // Boundary bounce
        if (nodeA.x < 0 || nodeA.x > width) nodeA.vx *= -1;
        if (nodeA.y < 0 || nodeA.y > height) nodeA.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(nodeA.x, nodeA.y, nodeA.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors.nodeColor;
        ctx.fill();

        // Magnetic response attraction to mouse
        const dxMouse = mouse.x - nodeA.x;
        const dyMouse = mouse.y - nodeA.y;
        const distMouse = Math.hypot(dxMouse, dyMouse);

        if (distMouse < mouse.radius) {
          // Attract nodes subtly
          const force = (mouse.radius - distMouse) / mouse.radius;
          nodeA.x += (dxMouse / distMouse) * force * 0.4;
          nodeA.y += (dyMouse / distMouse) * force * 0.4;

          // Glowing cursor nexus lines
          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${currentTheme === 'neon-blue' ? '6, 182, 212' : currentTheme === 'purple-galaxy' ? '168, 85, 247' : '99, 102, 241'}, ${force * 0.15})`;
          ctx.stroke();
        }

        // Connect node to remaining nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);

            // Brighten up paths closer to mouse
            const avgX = (nodeA.x + nodeB.x) / 2;
            const avgY = (nodeA.y + nodeB.y) / 2;
            const mouseDistAvg = Math.hypot(mouse.x - avgX, mouse.y - avgY);

            if (mouseDistAvg < mouse.radius) {
              const intensity = (1 - dist / 130) * (1 - mouseDistAvg / mouse.radius);
              ctx.strokeStyle = colors.activeLineColor;
              ctx.lineWidth = intensity * 1.5;
            } else {
              ctx.strokeStyle = colors.lineColor;
              ctx.lineWidth = (1 - dist / 130) * 0.8;
            }
            ctx.stroke();
          }
        }
      }

      // Add soft cosmic background nebula dust particles
      if (currentTheme === 'purple-galaxy') {
        ctx.beginPath();
        ctx.arc(width * 0.7, height * 0.4, 180, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(168, 85, 247, 0.03)';
        ctx.filter = 'blur(60px)';
        ctx.fill();
        ctx.filter = 'none';
      } else if (currentTheme === 'neon-blue') {
        ctx.beginPath();
        ctx.arc(width * 0.2, height * 0.7, 220, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.02)';
        ctx.filter = 'blur(80px)';
        ctx.fill();
        ctx.filter = 'none';
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      cancelAnimationFrame(resizeFrameId);
    };
  }, [currentTheme]);

  return <canvas ref={canvasRef} className="absolute inset-0 block pointer-events-none z-0" />;
};

export default NeuralBackground;
