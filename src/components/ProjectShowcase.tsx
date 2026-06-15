import React, { useState, useEffect, useRef } from 'react';
import { Project, PROJECTS, ThemeType } from '../types';
import { audioSynthesizer } from './AudioEngine';
import { 
  Play, 
  Pause, 
  Eye, 
  Sliders, 
  Terminal, 
  ExternalLink, 
  X, 
  Info, 
  Maximize2, 
  Check, 
  VolumeX, 
  Volume2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ProjectShowcaseProps {
  currentTheme: ThemeType;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ currentTheme }) => {
  const [activeProject, setActiveProject] = useState<Project>(PROJECTS[0]);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  // Video / Screenshot viewer states
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(35); // simulated percent
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);
  const [activePopupProject, setActivePopupProject] = useState<Project | null>(null);
  const [videoModalProject, setVideoModalProject] = useState<Project | null>(null);

  // Sim controllers
  const [patientAge, setPatientAge] = useState(24);
  const [diabeticState, setDiabeticState] = useState<'Standard' | 'Low Carb' | 'Ketogenic'>('Standard');
  const [caloricValue, setCaloricValue] = useState(2100);
  const [testScore, setTestScore] = useState(72);

  // Video duration timeline simulate ticker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setVideoProgress((p) => {
        if (p >= 100) return 0;
        return p + 0.8;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Continuously rotate logging console lines
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLogIndex((prev) => (prev + 1) % activeProject.mockupData.logs.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeProject]);

  const handleProjectSelect = (p: Project) => {
    audioSynthesizer.playClick();
    setActiveProject(p);
    setActiveLogIndex(0);
    setVideoProgress(15);
    setIsPlaying(true);
  };

  const getSimulatedActionOutput = () => {
    if (activeProject.id === 'telemedicine') {
      return {
        line1: `DIET FOR AGE ${patientAge}: ` + (diabeticState === 'Standard' 
          ? 'Oatmeal with berries, quinoa salad with grilled chicken breast, fresh baked salmon with steamed asparagus.' 
          : diabeticState === 'Low Carb' 
          ? 'Egg baked avocado, crisp lettuce turkey wrap, baked cod with green string beans.'
          : 'Bacon cheddar cups, spinach pecan olive oil salad, beef brisket.'),
        line2: patientAge < 35 
          ? 'WORKOUT LOAD: HIIT cardiovascular focus (25m), anaerobic resistance (40m)'
          : 'WORKOUT LOAD: low-impact mobility yoga (30m), core abdominal balance (15m)',
        line3: `HYDRODYNAMIC CONSTANT: ${(caloricValue / 1000 + 0.6).toFixed(1)} Liters clean water intake recommended.`
      };
    } else if (activeProject.id === 'diet-recommender') {
      return {
        line1: `TARGET THERMOGENESIS ENTHALPY: ${caloricValue} kcal`,
        line2: `PORTIONS SPEC: Protein ${Math.round(caloricValue * 0.3 / 4)}g | Energy Carbohydrates ${Math.round(caloricValue * 0.45 / 4)}g | Healthy Lipids ${Math.round(caloricValue * 0.25 / 9)}g`,
        line3: 'NUTRITIONAL EQUILIBRIUM COGNIZANT INDEX: OPTIMAL PORTION MATCHED'
      };
    } else {
      const mode = testScore < 50 
        ? 'Curated Sandbox Foundations (Scaffolded Lectures + Graphic Slides)' 
        : testScore < 80 
        ? 'Interactive Quiz Matrix (Structured Projects + Adaptive Case Analysis)' 
        : 'Elite Autonomous Deep Dives (Independent Research Labs + Peer Forums)';
      return {
        line1: `INSTRUCTION STAGE: ${mode}`,
        line2: `LEVEL DENSITY: ${testScore < 50 ? 'Basic / Heavy Scaffolding' : testScore < 80 ? 'Intermediate / Target Review' : 'Honors Elite Scholar'}`,
        line3: `SYLLABUS FOCUS: ${testScore < 60 ? 'ML Data Matrices, Linear Estimations' : 'Neural backpropagation pathways, attention weight arrays'}`
      };
    }
  };

  const simOut = getSimulatedActionOutput();

  const getThemeText = () => {
    switch (currentTheme) {
      case 'neon-blue':
        return {
          tabActive: 'bg-cyan-500/10 text-cyan-400 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
          tabInactive: 'text-gray-400 hover:text-gray-200 border-transparent',
          accent: 'text-cyan-400',
          badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          glass: 'bg-gray-950/40 border-cyan-500/20 hover:border-cyan-400/30'
        };
      case 'purple-galaxy':
        return {
          tabActive: 'bg-purple-500/10 text-purple-400 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]',
          tabInactive: 'text-gray-400 hover:text-gray-200 border-transparent',
          accent: 'text-purple-400',
          badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
          glass: 'bg-purple-950/20 border-purple-500/20 hover:border-purple-400/30'
        };
      case 'professional-light':
        return {
          tabActive: 'bg-indigo-50 text-indigo-700 border-indigo-600 shadow-sm',
          tabInactive: 'text-slate-500 hover:text-slate-800 border-transparent',
          accent: 'text-indigo-600',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
          glass: 'bg-white shadow-[0_4px_24px_rgba(99,102,241,0.06)] border-slate-200 hover:border-indigo-300'
        };
    }
  };

  const tClass = getThemeText();

  return (
    <div className="w-full space-y-12">
      {/* TABS SELECTOR */}
      <div id="project-dashboard-tabs" className="flex flex-wrap justify-center gap-2 overflow-x-auto pb-1 max-w-3xl mx-auto">
        {PROJECTS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleProjectSelect(p)}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold border tracking-wider uppercase transition-all duration-300 ${
              activeProject.id === p.id ? tClass.tabActive : tClass.tabInactive
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* CORE HERO SHOWCASE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Descriptions, Badges, Features list */}
        <div className="col-span-1 lg:col-span-5 space-y-6 text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono tracking-widest uppercase mb-1">
              <Check size={11} /> DEMO AVAILABLE
            </div>
            <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans leading-tight ${
              currentTheme === 'professional-light' ? 'text-slate-900 font-display' : 'text-white'
            }`}>
              {activeProject.title}
            </h3>
            <p className={`text-xs font-mono italic ${
              currentTheme === 'professional-light' ? 'text-slate-950 font-semibold' : 'text-gray-400'
            }`}>
              {activeProject.subtitle}
            </p>
          </div>

          <p className={`text-xs sm:text-sm leading-relaxed ${
            currentTheme === 'professional-light' ? 'text-slate-900' : 'text-gray-400'
          }`}>
            {activeProject.description}
          </p>

          {/* Core Technologies stack */}
          <div className="space-y-1.5">
            <span className={`text-[10px] font-mono uppercase font-bold block ${currentTheme === 'professional-light' ? 'text-slate-900' : 'text-gray-500'}`}>Engine Stack:</span>
            <div className="flex flex-wrap gap-1.5">
              {activeProject.technologies.map((tech) => (
                <span
                  key={tech}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono border ${tClass.badge}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Key deliverables */}
          <div className="space-y-2">
            <span className={`text-[10px] font-mono uppercase font-bold block ${currentTheme === 'professional-light' ? 'text-slate-900' : 'text-gray-500'}`}>Deliverables Verified:</span>
            <div className="space-y-1.5">
              {activeProject.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className={`text-[9px] font-mono leading-tight mt-0.5 ${tClass?.accent || 'text-cyan-400'}`}>
                    [0{i + 1}]
                  </span>
                  <span className={`font-sans leading-snug ${currentTheme === 'professional-light' ? 'text-slate-800' : 'text-gray-300'}`}>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons row */}
          <div className="flex flex-wrap gap-2.5 pt-3">
            <button
              onClick={() => {
                audioSynthesizer.playSuccess();
                setVideoModalProject(activeProject);
              }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl font-sans font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Play size={12} fill="currentColor" /> Watch Walkthrough Video
            </button>
            <button
              onClick={() => {
                audioSynthesizer.playClick();
                setActiveScreenshot(activeProject.screenshots[0]);
              }}
              className="px-4 py-2 border border-white/10 hover:bg-white/5 text-gray-300 rounded-xl font-sans font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <Eye size={12} /> View Screenshots ({activeProject.screenshots.length})
            </button>
            <button
              onClick={() => {
                audioSynthesizer.playClick();
                setActivePopupProject(activeProject);
              }}
              className="px-3.5 py-2 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl font-sans font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <Info size={12} /> Project Details
            </button>
          </div>
        </div>

        {/* Right Column: Custom interactive console cockpit + video walkthrough mockup */}
        <div className="col-span-1 lg:col-span-7 space-y-6">
          <div className={`rounded-3xl border text-left overflow-hidden bg-[#02040b] backdrop-blur-md shadow-2xl relative ${tClass.glass}`}>
            {/* HUD Title block */}
            <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60 block" />
                <span className="text-[10px] font-mono text-gray-400 ml-2">SIMULATION_HUD.sh</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20 uppercase tracking-widest animate-pulse">
                  ● ANALYZER ACTIVE
                </span>
              </div>
            </div>

            {/* VIDEO DEMO SCREEN (Muted autoplay simulation with tracking scrubber) */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950 border-b border-white/5 group">
              <img 
                src={activeProject.videoThumbnail} 
                alt={`${activeProject.title} mockup video walkthrough`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-60"
              />

              {/* Holographic matrix lines */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.02)_0%,transparent_80%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(255,255,255,0.01)_1.5px,transparent_1.5px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

              {/* Animated HUD telemetry graphics */}
              <div className="absolute bottom-12 right-4 bg-black/80 rounded-lg p-2 border border-white/5 pointer-events-none font-mono text-[8px] text-gray-400 flex flex-col gap-0.5">
                <span className="text-cyan-400">MATH_BOUND: ACTIVE</span>
                <span>METRICS_SYNCHRONIZED</span>
                <span className="text-emerald-400">FRAME_DRIFT: 0.04s</span>
              </div>

              {/* Simulation Player overlay HUD */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between gap-3 text-white">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg border border-white/10 hover:border-cyan-400 text-gray-300 hover:text-cyan-400 flex items-center justify-center bg-slate-900/80 transition-all font-mono"
                >
                  {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                </button>

                {/* Progress track bar */}
                <div className="flex-1 h-1.5 rounded-full bg-white/10 relative overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-100" 
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>

                <span className="text-[9px] font-mono text-gray-400 select-none">
                  0:{Math.floor(videoProgress * 0.3).toString().padStart(2, '0')} / 0:30
                </span>

                <button
                  onClick={() => setVideoModalProject(activeProject)}
                  className="p-1.5 rounded-lg border border-white/10 hover:border-cyan-400 text-gray-300 hover:text-cyan-400 flex items-center justify-center bg-slate-900/80 transition-all"
                  title="Fullscreen Walkthrough"
                >
                  <Maximize2 size={12} />
                </button>
              </div>

              {/* Dynamic Overlay Play Banner */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full border border-white/20 bg-black/60 flex items-center justify-center text-white scale-110 fade-in duration-300">
                    <Play size={18} fill="currentColor" className="ml-0.5 text-cyan-400" />
                  </div>
                </div>
              )}
            </div>

            {/* INTERACTIVE INPUT CONTROLLER DIAL */}
            <div className="p-6 space-y-6">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300 pb-2 border-b border-white/5 uppercase">
                  <span>[Sandbox Console Tuner]</span>
                  <span className="animate-pulse flex items-center gap-1">
                    <Sliders size={11} /> Real Time Manipulations
                  </span>
                </div>

                {activeProject.id === 'telemedicine' && (
                  <div className="space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Age */}
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">PATIENT AGE INDICATOR:</span>
                          <span className="text-white font-bold">{patientAge} Yrs</span>
                        </div>
                        <input 
                          type="range" 
                          min="18" 
                          max="85" 
                          value={patientAge} 
                          onChange={(e) => {
                            setPatientAge(Number(e.target.value));
                            audioSynthesizer.playHover();
                          }}
                          className="w-full accent-cyan-400"
                        />
                      </div>

                      {/* Dietary condition */}
                      <div className="space-y-1">
                        <span className="text-gray-400 block mb-0.5">DIETARY CONDITION:</span>
                        <div className="grid grid-cols-3 gap-1">
                          {(['Standard', 'Low Carb', 'Ketogenic'] as const).map((tag) => (
                            <button
                              key={tag}
                              onClick={() => {
                                audioSynthesizer.playClick();
                                setDiabeticState(tag);
                              }}
                              className={`py-1 rounded text-[9px] font-mono border transition-all ${
                                diabeticState === tag 
                                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400/40' 
                                  : 'bg-transparent text-gray-500 border-white/5 hover:border-white/10'
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Calorics */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">MAX CALORIC CAP:</span>
                        <span className="text-white font-bold">{caloricValue} kcal</span>
                      </div>
                      <input 
                        type="range" 
                        min="1500" 
                        max="3500" 
                        step="100"
                        value={caloricValue} 
                        onChange={(e) => {
                          setCaloricValue(Number(e.target.value));
                          audioSynthesizer.playHover();
                        }}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                  </div>
                )}

                {activeProject.id === 'diet-recommender' && (
                  <div className="space-y-4 text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">METABOLIC BIOMETRIC CALORIES:</span>
                        <span className="text-white font-bold">{caloricValue} kcal</span>
                      </div>
                      <input 
                        type="range" 
                        min="1200" 
                        max="4000" 
                        step="50"
                        value={caloricValue} 
                        onChange={(e) => {
                          setCaloricValue(Number(e.target.value));
                          audioSynthesizer.playHover();
                        }}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                  </div>
                )}

                {activeProject.id === 'adaptive-learning' && (
                  <div className="space-y-4 text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">LEARNERS EVALUATION INDEX:</span>
                        <span className="text-white font-bold">{testScore}/100</span>
                      </div>
                      <input 
                        type="range" 
                        min="20" 
                        max="100" 
                        value={testScore} 
                        onChange={(e) => {
                          setTestScore(Number(e.target.value));
                          audioSynthesizer.playHover();
                        }}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* COCKPIT DIAL RESULTS */}
              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-black border border-white/5 space-y-2.5 text-gray-300 relative text-left">
                  <span className="text-[8px] font-mono text-cyan-400 tracking-widest absolute top-3 right-4 uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping inline-block" /> Real Time Synthesizer
                  </span>
                  <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{activeProject.mockupData.status}</h4>

                  <div className="space-y-2">
                    <p className="text-white leading-relaxed"><span className="text-cyan-400">&gt; </span>{simOut.line1}</p>
                    <p className="text-white leading-relaxed"><span className="text-cyan-400">&gt; </span>{simOut.line2}</p>
                    <p className="text-white leading-relaxed"><span className="text-cyan-400">&gt; </span>{simOut.line3}</p>
                  </div>
                </div>

                {/* SLIDING VIRTUAL COMPUTER LOGS */}
                <div className="p-4 rounded-xl border border-white/5 bg-slate-950 text-gray-500 text-[10px]">
                  <div className="flex justify-between items-center text-[9px] uppercase tracking-wider pb-2 border-b border-white/5">
                    <span>VIRTUAL TELEMETRY PORTALS</span>
                    <span>Line {activeLogIndex + 1} of {activeProject.mockupData.logs.length}</span>
                  </div>

                  <div className="pt-2 min-h-[50px]">
                    {activeProject.mockupData.logs.map((log, index) => {
                      const isActive = index === activeLogIndex;
                      return (
                        <div 
                          key={index} 
                          className={`transition-all duration-300 ${
                            isActive ? 'text-green-400 font-bold ml-1' : 'opacity-40'
                          }`}
                        >
                          &gt; {log}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SCREENSHOT LIGHTBOX OVERLAY */}
      {activeScreenshot && (
        <div 
          onClick={() => setActiveScreenshot(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-4xl w-full max-h-[85vh] relative text-right">
            <button 
              onClick={() => setActiveScreenshot(null)}
              className="absolute top-4 right-4 text-white hover:text-red-400 p-2 bg-black/60 rounded-full border border-white/10"
            >
              <X size={16} />
            </button>
            <img 
              src={activeScreenshot} 
              alt="High-fidelity project screenshot expanded" 
              referrerPolicy="no-referrer"
              className="w-full h-auto rounded-2xl object-contain border border-white/10" 
            />
            <p className="text-xs font-mono text-gray-400 text-center mt-2">PROJECT MOCKUP PREVIEW SCREENSHOT</p>
          </div>
        </div>
      )}

      {/* DEDICATED FULL PROJECT DETAIL POPUP MODAL */}
      {activePopupProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#030611] border border-cyan-500/20 max-w-2xl w-full rounded-3xl p-6 sm:p-8 text-white relative flex flex-col justify-between max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActivePopupProject(null)}
              className="absolute top-6 right-6 p-1.5 rounded-full border border-white/10 hover:border-red-400 text-gray-400 hover:text-red-400 bg-slate-900 transition-all"
            >
              <X size={14} />
            </button>

            <div className="space-y-6 text-left">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400">DETAILED REVIEW CAP</span>
                <h3 className="text-2xl font-bold tracking-tight font-sans">{activePopupProject.title}</h3>
                <p className="text-xs text-gray-400 font-mono italic">{activePopupProject.subtitle}</p>
              </div>

              {/* Tech details mockup list */}
              <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4">
                <div>
                  <span className="text-[9px] font-mono uppercase text-gray-500">Core Domain Architecture:</span>
                  <p className="text-xs font-bold mt-1 text-gray-200">
                    {activePopupProject.id === 'adaptive-learning' ? 'Artificial Intelligence / Pedagogical AI' : 'Clinical Health Informatics'}
                  </p>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-gray-500">Platform Scope:</span>
                  <p className="text-xs font-bold mt-1 text-gray-200">Single Page Client State-Engine Web Component</p>
                </div>
              </div>

              {/* Core Features list and technical details */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase text-gray-500 block font-bold">Comprehensive Deliverables Log:</span>
                <div className="space-y-2.5">
                  {activePopupProject.features.map((feat, idx) => (
                    <div key={idx} className="flex gap-2.5 text-xs text-gray-300">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 shrink-0" />
                      <p className="leading-relaxed">{feat}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Screens gallery selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-gray-500 block font-bold">Screenshot Sandbox Previews:</span>
                <div className="grid grid-cols-3 gap-2">
                  {activePopupProject.screenshots.map((scr, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setActiveScreenshot(scr);
                        setActivePopupProject(null);
                      }}
                      className="cursor-pointer rounded-lg overflow-hidden border border-white/5 hover:border-cyan-400 transition-all"
                    >
                      <img src={scr} alt="Thumb" referrerPolicy="no-referrer" className="w-full aspect-video object-cover hover:scale-105 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-6">
              <span className="text-[9px] font-mono text-gray-500">PROJECT STAGE: PREVIEW LOADED</span>
              <button
                onClick={() => setActivePopupProject(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl font-sans text-xs uppercase tracking-wider transition-all text-gray-300"
              >
                Close Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL DEMO VIDEO POPUP MODAL */}
      {videoModalProject && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-between p-4">
          <div className="max-w-4xl mx-auto w-full flex items-center justify-between p-4 border-b border-white/5">
            <div className="text-left">
              <span className="text-cyan-400 font-mono text-[9px] tracking-widest uppercase">WALKTHROUGH DEMO SYSTEM</span>
              <h3 className="text-sm font-bold text-white uppercase">{videoModalProject.title} VIDEO PORTAL</h3>
            </div>
            <button
              onClick={() => setVideoModalProject(null)}
              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg hover:text-white transition-all bg-transparent"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full aspect-video rounded-2xl overflow-hidden border border-cyan-500/30 relative bg-black shadow-2xl">
              <img 
                src={videoModalProject.videoThumbnail} 
                alt="Walkthrough screen"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-70"
              />

              {/* simulated walkthrough subtitles running aligned with video progress */}
              <div className="absolute top-4 left-4 p-2 bg-black/80 rounded border border-white/5 font-mono text-[8px] text-gray-400">
                RESOLUTION: 1080p Ultra HD • WALKTHROUGH MODEL
              </div>

              <div className="absolute inset-x-4 bottom-16 bg-black/85 p-3 rounded-xl border border-white/5 text-center font-mono text-xs text-white max-w-lg mx-auto">
                {videoProgress < 30 ? (
                  <p className="text-cyan-300">&gt; Presenting user profile index, configuring biomarker data inputs and target logs on page load.</p>
                ) : videoProgress < 60 ? (
                  <p className="text-cyan-300">&gt; Computing algorithms, formulation matrix structures, and mapping proteins to matching portions.</p>
                ) : (
                  <p className="text-cyan-300">&gt; Checking responses and compiling high impact responsive designs with fluid CSS components on screen.</p>
                )}
              </div>

              {/* Scrubber controllers */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 rounded bg-cyan-500 text-black flex items-center justify-center transition-all bg-transparent"
                >
                  {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                </button>

                <div className="flex-1 h-1 bg-white/20 rounded-full relative">
                  <div className="absolute left-0 top-0 h-full bg-cyan-400 rounded-full" style={{ width: `${videoProgress}%` }} />
                </div>
                <span className="text-[9px] font-mono text-gray-300">0:{Math.floor(videoProgress * 0.3).toString().padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto w-full p-4 border-t border-white/5 text-center text-mono text-[10px] text-gray-500 uppercase">
            Pampana Lekhya • Digital Portfolio Video Walkthrough System • Android / Web Lab
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectShowcase;
