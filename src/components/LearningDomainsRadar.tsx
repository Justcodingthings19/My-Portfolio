import React, { useState } from 'react';
import { ThemeType } from '../types';
import { audioSynthesizer } from './AudioEngine';

interface MapPoint {
  label: string;
  value: number; // 0 to 10
  skills: string[];
}

interface RadarProps {
  currentTheme: ThemeType;
}

export const LearningDomainsRadar: React.FC<RadarProps> = ({ currentTheme }) => {
  const [activeZone, setActiveZone] = useState<MapPoint | null>(null);

  const domains: MapPoint[] = [
    { label: 'Artificial Intelligence', value: 9.2, skills: ['Generative AI', 'Model fine tuning', 'Mathematical algorithms'] },
    { label: 'Web Development', value: 8.8, skills: ['Responsive UI Layouts', 'HTML5 & CSS3 structures', 'Tailwind utility classes'] },
    { label: 'Full Stack Development', value: 8.0, skills: ['Functional components', 'Context state hooks', 'API integration protocols'] },
    { label: 'Databases', value: 8.5, skills: ['Relational DBMS Core', 'Normalizations', 'Optimized SQL Querying'] },
    { label: 'Data Analytics', value: 8.2, skills: ['Power BI dashboards', 'Data Cleansings', 'Feature mapping'] },
    { label: 'Cloud Computing', value: 7.5, skills: ['Instance configuration', 'Virtualization schemes', 'S3 containers'] },
    { label: 'Cyber Security', value: 7.0, skills: ['Ethical hacking loops', 'Port mappings', 'Wireshark dumps analysis'] }
  ];

  // Radar geometry
  const center = 150;
  const radius = 100;
  const totalSides = domains.length;

  const points = domains.map((d, index) => {
    const angle = (Math.PI * 2 / totalSides) * index - Math.PI / 2;
    const distanceFactor = d.value / 10;
    const x = center + radius * distanceFactor * Math.cos(angle);
    const y = center + radius * distanceFactor * Math.sin(angle);
    return { x, y, label: d.label, val: d.value, skills: d.skills, angle };
  });

  const webPolygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  // Outer concentric guidelines
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getThemeText = () => {
    switch (currentTheme) {
      case 'neon-blue':
        return {
          accent: 'text-cyan-400',
          polyFill: 'rgba(6, 182, 212, 0.15)',
          polyStroke: '#06b6d4',
          glowNodes: 'rgba(6, 182, 212, 0.8)',
          cardBg: 'bg-gray-950/40 border border-cyan-500/10'
        };
      case 'purple-galaxy':
        return {
          accent: 'text-purple-400',
          polyFill: 'rgba(168, 85, 247, 0.15)',
          polyStroke: '#a855f7',
          glowNodes: 'rgba(168, 85, 247, 0.8)',
          cardBg: 'bg-purple-950/20 border border-purple-500/15'
        };
      case 'professional-light':
        return {
          accent: 'text-indigo-600',
          polyFill: 'rgba(99, 102, 241, 0.08)',
          polyStroke: '#6366f1',
          glowNodes: 'rgba(99, 102, 241, 0.5)',
          cardBg: 'bg-white shadow-[0_4px_24px_rgba(99,102,241,0.04)] border border-slate-200'
        };
    }
  };

  const colors = getThemeText();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
      {/* LEFT COL: SVG RADAR CHART */}
      <div className="col-span-1 lg:col-span-7 flex justify-center">
        <div className={`p-4 rounded-3xl relative overflow-hidden backdrop-blur-sm shadow-2xl flex items-center justify-center ${colors.cardBg} w-full max-w-[360px] aspect-square`}>
          
          <div className="absolute top-4 left-4 font-mono text-[8px] text-gray-500 uppercase tracking-widest">
            COGNITIVE RADAR SCHEMATIC
          </div>

          <svg viewBox="0 0 300 300" className="w-full h-full select-none text-white">
            {/* Draw guideline grids */}
            {levels.map((lvl, k) => {
              const gridPoints = domains.map((_, idx) => {
                const angle = (Math.PI * 2 / totalSides) * idx - Math.PI / 2;
                const x = center + radius * lvl * Math.cos(angle);
                const y = center + radius * lvl * Math.sin(angle);
                return `${x},${y}`;
              }).join(' ');

              return (
                <polygon
                  key={k}
                  points={gridPoints}
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="0.8"
                />
              );
            })}

            {/* Draw web spoke axis */}
            {domains.map((_, idx) => {
              const angle = (Math.PI * 2 / totalSides) * idx - Math.PI / 2;
              const x = center + radius * Math.cos(angle);
              const y = center + radius * Math.sin(angle);
              return (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="0.8"
                  strokeDasharray="4 2"
                />
              );
            })}

            {/* Filled Radar Polygon shape */}
            <polygon
              points={webPolygonPoints}
              fill={colors.polyFill}
              stroke={colors.polyStroke}
              strokeWidth="2"
              className="transition-all duration-300"
            />

            {/* Coordinate interactive Node markers */}
            {points.map((pt, index) => {
              const isActive = activeZone?.label === pt.label;
              return (
                <g 
                  key={index}
                  onMouseEnter={() => {
                    setActiveZone(domains[index]);
                    audioSynthesizer.playHover();
                  }}
                  onMouseLeave={() => setActiveZone(null)}
                  className="cursor-pointer group"
                >
                  {/* Glowing core dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isActive ? 6 : 3.5}
                    fill={colors.polyStroke}
                    className="transition-all duration-200"
                    style={{
                      filter: isActive ? `drop-shadow(0 0 6px ${colors.polyStroke})` : 'none'
                    }}
                  />
                  {/* Outer magnetic target ring */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={14}
                    fill="transparent"
                    className="hover:stroke-white/10"
                    strokeWidth="1"
                  />
                </g>
              );
            })}

            {/* Radar Spoke text labels */}
            {points.map((pt, ind) => {
              // Align text dynamically based on spoke orientation
              const cos = Math.cos(pt.angle);
              const textAnchor = Math.abs(cos) < 0.1 ? 'middle' : cos > 0 ? 'start' : 'end';
              const offsetMultiplier = 14;
              const textX = center + (radius + offsetMultiplier) * Math.cos(pt.angle);
              const textY = center + (radius + offsetMultiplier) * Math.sin(pt.angle) + 3; // vertical adjust

              const isFocused = activeZone?.label === pt.label;

              return (
                <text
                  key={ind}
                  x={textX}
                  y={textY}
                  textAnchor={textAnchor}
                  className={`font-mono text-[7.5px] transition-colors leading-none tracking-tight uppercase ${
                    isFocused ? 'fill-cyan-400 font-bold' : 'fill-gray-500'
                  }`}
                >
                  {pt.label.split(' ')[0]}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* RIGHT COL: HUD TELEMETRY INFOPANELS */}
      <div className="col-span-1 lg:col-span-5 text-left space-y-4">
        <div className={`p-6 rounded-3xl backdrop-blur-md border border-white/5 bg-slate-900/40`}>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold mb-1">DATA FLOW HUD</span>
          <h4 className="text-xl font-bold font-sans tracking-tight text-white mb-2">
            {activeZone ? activeZone.label : 'Domain Intelligence'}
          </h4>

          {activeZone ? (
            <div className="space-y-4 font-mono text-xs text-gray-400">
              <p className="leading-relaxed">
                Evaluating cognitive metrics in <span className="text-white font-bold">{activeZone.label}</span>. Standard projects catalog verify solid capabilities in mapping logic grids.
              </p>

              <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-gray-500">Skills Acquired:</span>
                <div className="flex flex-col gap-1 text-gray-200">
                  {activeZone.skills.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress and score indicators */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] uppercase tracking-wider">
                  <span>Target Competency Value</span>
                  <span className="text-cyan-400 font-bold">{(activeZone.value * 10).toFixed(0)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${activeZone.value * 10}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 font-mono text-xs text-gray-400">
              <p className="leading-relaxed">
                Hover over the coordinate nodes in the radar map graph to scan Lekhya's level of familiarity and actual programming tools used for each computer science domain.
              </p>
              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1.5 text-[9px] uppercase tracking-wider">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-500">AI Core: 9.2/10</span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-500">Full Stack: 8.0/10</span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-500">Database: 8.5/10</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningDomainsRadar;
