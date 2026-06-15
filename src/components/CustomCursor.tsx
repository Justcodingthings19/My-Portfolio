import React, { useEffect, useState } from 'react';
import { ThemeType } from '../types';

interface CustomCursorProps {
  currentTheme: ThemeType;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ currentTheme }) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailPosition, setTrailPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Check if device supports touch (standard mobile bypass)
    const checkDevice = () => {
      const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(touchSupport);
    };

    checkDevice();
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Listen to hovering any actionable item
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('cursor-pointer'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleElementHover);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleElementHover);
    };
  }, [isMobile]);

  // Spring lag/inertia formula for organic custom cursor trail
  useEffect(() => {
    if (isMobile || !isVisible) return;

    let animId: number;
    const updateTrail = () => {
      setTrailPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        
        // Adjust the inertia factor (0.13 = organic lazy follow)
        return {
          x: prev.x + dx * 0.16,
          y: prev.y + dy * 0.16
        };
      });
      animId = requestAnimationFrame(updateTrail);
    };

    animId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animId);
  }, [position, isMobile, isVisible]);

  if (isMobile || !isVisible) return null;

  const getThemeColor = () => {
    switch (currentTheme) {
      case 'neon-blue':
        return 'border-cyan-400 bg-cyan-400/10';
      case 'purple-galaxy':
        return 'border-purple-400 bg-purple-400/10';
      case 'professional-light':
        return 'border-indigo-600 bg-indigo-600/5';
    }
  };

  const getCoreColor = () => {
    switch (currentTheme) {
      case 'neon-blue':
        return 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]';
      case 'purple-galaxy':
        return 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]';
      case 'professional-light':
        return 'bg-indigo-600';
    }
  };

  return (
    <>
      {/* Delayed Inertia Outer Circle */}
      <div
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-all duration-75 mix-blend-difference ${
          getThemeColor()
        } ${isHovered ? 'w-14 h-14' : ''}`}
        style={{
          left: `${trailPosition.x}px`,
          top: `${trailPosition.y}px`
        }}
      />

      {/* Laser Precision Tiny Inner Dot */}
      <div
        className={`fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 ${
          getCoreColor()
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      />
    </>
  );
};

export default CustomCursor;
