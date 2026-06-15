import React, { useState, useEffect, useRef } from 'react';
import { SKILLS, SpaceSkill, ThemeType, themes } from '../types';
import { audioSynthesizer } from './AudioEngine';

interface SkillsUniverseProps {
  currentTheme: ThemeType;
}

export const SkillsUniverse: React.FC<SkillsUniverseProps> = ({ currentTheme }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [hoveredSkill, setHoveredSkill] = useState<SpaceSkill | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHoveredCore, setIsHoveredCore] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Rotate gravity field continuously
  useEffect(() => {
    let animId: number;
    const tick = () => {
      setRotationAngle((prev) => (prev + 0.015) % (Math.PI * 2));
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Track cursor movement over container to skew the orbits subtly (magnetic celestial 3D effect!)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMouseOffset({ x: x * 25, y: y * 25 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const categories = ['All', 'Programming', 'Web', 'Database', 'AI', 'Analytics', 'Cloud', 'Security', 'Tools'];

  // Filter skills based on chosen orbital ring
  const filteredSkills = activeCategory === 'All'
    ? SKILLS
    : SKILLS.filter((s) => s.category === activeCategory);

  const getThemeColors = () => {
    switch (currentTheme) {
      case 'neon-blue':
        return {
          coreGlow: 'shadow-[0_0_50px_rgba(6,182,212,0.6)] border-cyan-400 bg-cyan-950/70 text-cyan-400',
          orbitLine: 'border-cyan-500/10',
          skillCardGlow: 'rgba(6,182,212,0.15)',
          buttonActive: 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]',
          buttonInactive: 'text-cyan-400 border-cyan-500/20 hover:border-cyan-400'
        };
      case 'purple-galaxy':
        return {
          coreGlow: 'shadow-[0_0_50px_rgba(168,85,247,0.6)] border-purple-400 bg-purple-950/70 text-purple-300',
          orbitLine: 'border-purple-500/10',
          skillCardGlow: 'rgba(168,85,247,0.15)',
          buttonActive: 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]',
          buttonInactive: 'text-purple-400 border-purple-500/20 hover:border-purple-300'
        };
      case 'professional-light':
        return {
          coreGlow: 'shadow-[0_0_25px_rgba(99,102,241,0.2)] border-indigo-500 bg-indigo-50 text-indigo-700',
          orbitLine: 'border-indigo-200',
          skillCardGlow: 'rgba(99,102,241,0.05)',
          buttonActive: 'bg-indigo-600 text-white shadow-md',
          buttonInactive: 'text-slate-600 border-slate-200 hover:border-indigo-400'
        };
    }
  };

  const themeColors = getThemeColors();

  // Return level descriptions
  const getProficiencyText = (level: string) => {
    switch (level) {
      case 'Expert': return 'High Competency (Academic Focus & Project Verified)';
      case 'Intermediate': return 'Strong Foundation & Active Applications';
      case 'Learner': return 'Currently Cultivating Advanced Concepts';
      default: return 'Familiar Knowledge Base';
    }
  };

  return (
    <div className="flex flex-col items-center w-full relative">
      {/* Category Ring Controls */}
      <div id="skills-universes-categories" className="flex flex-wrap justify-center gap-2 mb-12 relative z-10 max-w-2xl px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              audioSynthesizer.playClick();
              setActiveCategory(cat);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium border uppercase tracking-wider transition-all duration-300 ${
              activeCategory === cat ? themeColors.buttonActive : themeColors.buttonInactive
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl items-center relative z-10 px-4">
        {/* Orbital Mechanics Canvas container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="col-span-1 lg:col-span-7 h-[420px] sm:h-[500px] w-full relative rounded-3xl overflow-hidden flex items-center justify-center border border-white/5 backdrop-blur-sm"
          style={{
            background: currentTheme === 'professional-light' 
              ? 'radial-gradient(circle, rgba(99,102,241,0.02) 0%, transparent 80%)' 
              : 'radial-gradient(circle, rgba(168,85,247,0.03) 0%, transparent 85%)'
          }}
        >
          {/* Scientific Overlay Grids */}
          <div className="absolute inset-0 pointer-events-none opacity-20 border-[0.5px] border-dashed border-white/10 m-6 rounded-2xl flex items-center justify-center">
            <div className="w-[1px] h-full bg-white/5 absolute left-1/2" />
            <div className="h-[1px] w-full bg-white/5 absolute top-1/2" />
          </div>

          <div className="absolute text-[8px] font-mono opacity-25 tracking-[0.2em] uppercase top-4 left-4">
            CELESTIAL SYSTEM: {activeCategory.toUpperCase()} ORBITS
          </div>

          {/* Core Central Mass - LEKHYA */}
          <div
            onMouseEnter={() => {
              setIsHoveredCore(true);
              audioSynthesizer.playHover();
            }}
            onMouseLeave={() => setIsHoveredCore(false)}
            className={`w-28 h-28 rounded-full border-2 flex flex-col items-center justify-center text-center p-3 relative z-30 transition-all duration-300 cursor-help select-none ${
              themeColors.coreGlow
            } ${isHoveredCore ? 'scale-110' : ''}`}
            style={{
              transform: `translate(${mouseOffset.x * 0.3}px, ${mouseOffset.y * 0.3}px)`
            }}
          >
            <div className="absolute inset-0 rounded-full animate-ping opacity-10 bg-current" />
            <span className="text-xs uppercase tracking-[0.3em] opacity-60 font-mono">Center</span>
            <span className="text-base font-bold tracking-widest font-sans uppercase">LEKHYA</span>
            <span className="text-[9px] font-mono opacity-60 mt-1">AI CORE v19</span>
          </div>

          {/* Drawing Orbital Rings with trigonometrical coordinate mapping */}
          {filteredSkills.map((skill, index) => {
            // Distribute radius evenly based on index count
            const baseRadius = 85 + (index % 3) * 45 + Math.floor(index / 3) * 15;
            
            // Adjust angular offset based on index and rotation ticker
            const angularSpacing = (Math.PI * 2) / filteredSkills.length;
            const currentAngle = rotationAngle + index * angularSpacing;

            // Apply slight mathematical tilt to create a galaxy 3D dish
            const tiltY = 0.45; 
            const x = Math.cos(currentAngle) * baseRadius + mouseOffset.x;
            const y = Math.sin(currentAngle) * baseRadius * tiltY + mouseOffset.y;

            // Simple parallax sizing multiplier simulating celestial distance
            const isBehind = Math.sin(currentAngle) < 0;
            const sizeMultiplier = isBehind ? 0.8 : 1.25;
            const zIndex = isBehind ? 10 : 40;
            const opacity = isBehind ? 0.5 : 1;

            const isHovered = hoveredSkill?.name === skill.name;

            // Skill specific color mapping
            const getSkillColor = (color: string) => {
              switch (color) {
                case 'cyan': return 'bg-cyan-500 text-cyan-100 shadow-[0_0_12px_rgba(6,182,212,0.4)]';
                case 'emerald': return 'bg-emerald-500 text-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.4)]';
                case 'purple': return 'bg-purple-500 text-purple-100 shadow-[0_0_12px_rgba(168,85,247,0.4)]';
                case 'red': return 'bg-rose-500 text-rose-100 shadow-[0_0_12px_rgba(244,63,94,0.4)]';
                case 'amber': return 'bg-amber-500 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.4)]';
                default: return 'bg-blue-500 text-blue-100';
              }
            };

            return (
              <React.Fragment key={skill.name}>
                {/* SVG orbit pathway guides */}
                <div
                  className={`absolute rounded-full border border-dashed pointer-events-none opacity-10 ${themeColors.orbitLine}`}
                  style={{
                    width: `${baseRadius * 2}px`,
                    height: `${baseRadius * 2 * tiltY}px`,
                    transform: `translate(${mouseOffset.x * 0.15}px, ${mouseOffset.y * 0.15}px)`,
                    zIndex: 5
                  }}
                />

                {/* Orbiting Skill Nodes */}
                <div
                  onMouseEnter={() => {
                    setHoveredSkill(skill);
                    audioSynthesizer.playHover();
                  }}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className={`absolute flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-mono cursor-pointer transition-all duration-200 select-none ${
                    getSkillColor(skill.color)
                  } ${isHovered ? 'scale-125 z-50 ring-2 ring-white/50' : ''}`}
                  style={{
                    transform: `translate(${x}px, ${y}px) scale(${sizeMultiplier})`,
                    zIndex: zIndex,
                    opacity: opacity,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="font-semibold">{skill.name}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Informative Diagnostic Sidebar Panel */}
        <div className="col-span-1 lg:col-span-5 flex flex-col justify-center">
          <div className={`p-6 rounded-3xl border ${themes[currentTheme].cardBg} ${
            currentTheme === 'professional-light' ? 'border-indigo-100 shadow-sm text-slate-800' : 'border-white/5'
          }`}>
            <h4 className={`text-xs uppercase tracking-widest font-mono mb-2 ${
              currentTheme === 'professional-light' ? 'text-indigo-600 font-bold' : 'text-cyan-400'
            }`}>
              Celestial HUD telemetry
            </h4>
            <h3 className="text-xl font-bold font-sans tracking-tight mb-4">
              {hoveredSkill ? `Inspecting: ${hoveredSkill.name}` : 'Orbital Gravity Center'}
            </h3>

            {hoveredSkill ? (
              <div className="space-y-4 font-mono text-xs">
                <div className={`p-3 rounded-xl border ${
                  currentTheme === 'professional-light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border border-white/5'
                }`}>
                  <div className={`uppercase text-[10px] mb-1 ${
                    currentTheme === 'professional-light' ? 'text-slate-500' : 'text-gray-400'
                  }`}>Vector Field</div>
                  <div className="capitalize font-semibold text-sm">{hoveredSkill.category} Section</div>
                </div>

                <div className={`p-3 rounded-xl border ${
                  currentTheme === 'professional-light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border border-white/5'
                }`}>
                  <div className={`uppercase text-[10px] mb-1 ${
                    currentTheme === 'professional-light' ? 'text-slate-500' : 'text-gray-400'
                  }`}>Knowledge Altitude</div>
                  <div className="font-semibold text-sm">{hoveredSkill.level} Level</div>
                </div>

                <div className={`p-3 rounded-xl border flex flex-col gap-1 ${
                  currentTheme === 'professional-light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border border-white/5'
                }`}>
                  <div className={`uppercase text-[10px] ${
                    currentTheme === 'professional-light' ? 'text-slate-500' : 'text-gray-400'
                  }`}>Verification Log</div>
                  <div className={`leading-relaxed text-[11px] ${
                    currentTheme === 'professional-light' ? 'text-slate-700' : 'text-gray-200'
                  }`}>
                    {getProficiencyText(hoveredSkill.level)}
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="pt-2">
                  <div className={`flex justify-between items-center text-[10px] uppercase tracking-wider mb-1 ${
                    currentTheme === 'professional-light' ? 'text-slate-500' : ''
                  }`}>
                    <span>Synchronicity Index</span>
                    <span>{hoveredSkill.level === 'Expert' ? '92%' : hoveredSkill.level === 'Intermediate' ? '78%' : '55%'}</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                    currentTheme === 'professional-light' ? 'bg-slate-100' : 'bg-white/10'
                  }`}>
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-500" 
                      style={{ 
                        width: hoveredSkill.level === 'Expert' ? '92%' : hoveredSkill.level === 'Intermediate' ? '78%' : '55%' 
                      }} 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className={`space-y-4 font-mono text-xs ${
                currentTheme === 'professional-light' ? 'text-slate-600' : 'text-gray-400'
              }`}>
                <p className="leading-relaxed">
                  Hover or tap any skill orbiting around the center AI Core to inspect technical diagnostics, academic verified competency ratings, and category filters.
                </p>
                <div className={`pt-4 border-t flex flex-col gap-2 ${
                  currentTheme === 'professional-light' ? 'border-slate-100' : 'border-white/5'
                }`}>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>Cyan orbits: Core Coding (Python, C)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Green orbits: Web Architectures (HTML, JS)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Purple orbits: Database Systems (DBMS, SQL)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>Rose orbits: AI & Cognitive Sciences (ML)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsUniverse;
