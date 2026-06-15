import { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  BookOpen, 
  Flame, 
  Sparkles, 
  Terminal, 
  Briefcase, 
  Award, 
  ArrowUp, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Fingerprint, 
  GraduationCap, 
  Atom, 
  Smartphone, 
  Monitor, 
  Dna,
  Cpu
} from 'lucide-react';
import { 
  PROJECTS, 
  EDUCATION_ITEMS, 
  CREDENTIALS_DATABASE, 
  ThemeType, 
  themes 
} from './types';
import { audioSynthesizer } from './components/AudioEngine';
import RecruiterDashboard from './components/RecruiterDashboard';
import NeuralBackground from './components/NeuralBackground';
import CustomCursor from './components/CustomCursor';
import TypingText from './components/TypingText';
import SkillsUniverse from './components/SkillsUniverse';
import ProjectShowcase from './components/ProjectShowcase';
import CertificationsGallery from './components/CertificationsGallery';
import ResumePreview from './components/ResumePreview';
import ContactForm from './components/ContactForm';

export default function App() {
  // Theme state
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('professional-light');
  
  // Audio state
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // Loading intro phases
  // 0: absolute dark, 1: particles, 2: name appears, 3: subtitle fades, 4: complete
  const [loadPhase, setLoadPhase] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Active section track
  const [activeTab, setActiveTab] = useState('hero');
  const [recruiterMode, setRecruiterMode] = useState(false);

  // Stats Counters state
  const [counterStats, setCounterStats] = useState({
    cgpa: 0,
    academicPercent: 0,
    projects: 0,
    certs: 0,
    internships: 0,
    languages: 0
  });

  // Track scroll parameters
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
      setShowScrollTop(window.scrollY > 400);

      // Track active visual tab highlights
      const sections = ['hero', 'about', 'skills', 'projects', 'certifications', 'experience', 'resume', 'contact'];
      for (const sect of sections) {
        const el = document.getElementById(sect);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom >= 180) {
            setActiveTab(sect);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cinematic Intro Orchestrator
  useEffect(() => {
    // Phase 1: Show particle system after 800ms
    const timer1 = setTimeout(() => {
      setLoadPhase(1);
    }, 850);

    // Phase 2: Spell out Name at 1800ms
    const timer2 = setTimeout(() => {
      setLoadPhase(2);
    }, 2000);

    // Phase 3: Fade in Subtitles and Audio Control prompts at 3200ms
    const timer3 = setTimeout(() => {
      setLoadPhase(3);
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Incremental count animations trigger upon entering page
  useEffect(() => {
    if (loadPhase < 4) return;

    const duration = 2000;
    const steps = 60;
    const stamp = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setCounterStats(() => ({
        cgpa: Math.min(7.96, Number((7.96 * (currentStep / steps)).toFixed(2))),
        academicPercent: Math.min(86.2, Math.round(86.2 * (currentStep / steps))),
        projects: Math.min(3, Math.round(3 * (currentStep / steps))),
        certs: Math.min(6, Math.round(6 * (currentStep / steps))),
        internships: Math.min(1, Math.round(1 * (currentStep / steps))),
        languages: Math.min(2, Math.round(2 * (currentStep / steps)))
      }));

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stamp);

    return () => clearInterval(interval);
  }, [loadPhase]);

  const handleEnterUniverse = (enableSound: boolean) => {
    const isOk = audioSynthesizer.toggleSound(enableSound);
    setSoundEnabled(isOk);
    if (isOk) {
      audioSynthesizer.playSciFiSweep();
    }
    setLoadPhase(4); // Enter full webpage universe
  };

  const handleThemeChange = (theme: ThemeType) => {
    audioSynthesizer.playClick();
    setCurrentTheme(theme);
  };

  const toggleSoundMaster = () => {
    const state = audioSynthesizer.toggleSound();
    setSoundEnabled(state);
  };

  const scrollToSection = (id: string) => {
    audioSynthesizer.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const themeConfig = themes[currentTheme];

  return (
    <div className={`min-h-screen ${themeConfig.text} font-sans transition-colors duration-500 overflow-x-hidden ${themeConfig.bg} selection:bg-cyan-500/30 selection:text-white`}>
      {/* Absolute floating background */}
      <NeuralBackground currentTheme={currentTheme} />
      <CustomCursor currentTheme={currentTheme} />

      {/* Top progress bar tracking reader's navigation depth */}
      <div 
        className="fixed top-0 left-0 h-[3px] z-50 transition-all duration-100 bg-gradient-to-r from-cyan-400 via-purple-500 to-indigo-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ========================================================
          LOADING CINEMATIC INTRO SCREEN 
          ======================================================== */}
      {loadPhase < 4 && (
        <div className="fixed inset-0 bg-[#02040a] z-50 flex flex-col items-center justify-center p-6 select-none overflow-hidden text-center">
          {/* Cybernetic geometric meshes */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1.2px,transparent_1.2px),linear-gradient(90deg,rgba(255,255,255,0.01)_1.2px,transparent_1.2px)] bg-[size:24px_24px] pointer-events-none" />

          {/* AI particles generator state indicator */}
          {loadPhase >= 1 && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-[9px] text-cyan-400/60 uppercase tracking-[0.3em] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-cyan-400 block animate-ping" />
              AI Particle Generation Active
            </div>
          )}

          <div className="space-y-6 relative z-10 max-w-lg">
            {/* Circle loader structure */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/10 animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-double border-purple-500/20 animate-[spin_5s_linear_infinite_reverse]" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 flex items-center justify-center border border-white/5">
                <Cpu className="text-cyan-400/80 animate-pulse" size={24} />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-indigo-200 uppercase font-sans">
                {loadPhase >= 2 ? 'PAMPANA LEKHYA' : 'Initializing'}
              </h1>
              <p className="text-xs font-mono text-cyan-400 tracking-[0.2em] font-semibold uppercase animate-pulse">
                {loadPhase >= 3 ? 'Artificial Intelligence Student' : 'Calibrating Core Modules...'}
              </p>
            </div>

            {/* Entrance CTA and Audio Selector option */}
            {loadPhase >= 3 && (
              <div className="pt-8 space-y-4 animate-in fade-in duration-700">
                <p className="text-xs text-gray-500 max-w-sm mx-auto font-mono">
                  This website generates adaptive synthesizer tones. Toggle sound preference before launch.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                  <button
                    onClick={() => handleEnterUniverse(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-sans font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.03] active:scale-[0.98]"
                  >
                    Launch Cinematic Experience
                  </button>
                  <button
                    onClick={() => handleEnterUniverse(false)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-950/80 hover:bg-gray-900 border border-white/10 text-gray-400 font-sans font-medium text-xs uppercase tracking-wider transition-all hover:scale-[1.01]"
                  >
                    Explore in Silent Mode
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-8 text-[8px] font-mono text-gray-600 uppercase tracking-widest">
            PORTFOLIO SYSTEM ENGINE • ANDHRA PRADESH, INDIA © 2026
          </div>
        </div>
      )}

      {/* ========================================================
          IMMERSIVE HEADER CONTROLS
          ======================================================== */}
      {loadPhase === 4 && (
        <header className={`fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl h-16 rounded-2xl border ${
          currentTheme === 'professional-light' 
            ? 'border-slate-200 bg-white/80 shadow-md' 
            : 'border-white/5 bg-slate-950/70 shadow-2xl'
        } backdrop-blur-md z-40 px-4 sm:px-6 flex items-center justify-between transition-all duration-300`}>
          {/* Logo brand */}
          <div 
            onClick={() => scrollToSection('hero')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-[0_0_12px_rgba(6,182,212,0.3)] group-hover:rotate-12 transition-transform">
              PL
            </div>
            <div className="text-left font-sans">
              <div className={`text-xs font-bold tracking-widest leading-none ${currentTheme === 'professional-light' ? 'text-slate-800' : 'text-white'}`}>PAMPANA</div>
              <div className={`text-[9px] font-mono tracking-[0.15em] leading-none mt-1 ${currentTheme === 'professional-light' ? 'text-indigo-600' : 'text-cyan-400'}`}>LEKHYA v.1.0</div>
            </div>
          </div>

          {/* Table of contents anchors */}
          <nav className={`hidden lg:flex items-center gap-5 font-mono text-[10px] uppercase tracking-wider ${
            currentTheme === 'professional-light' ? 'text-slate-500' : 'text-gray-400'
          }`}>
            {recruiterMode ? (
              <button
                onClick={() => {
                  audioSynthesizer.playClick();
                  setRecruiterMode(false);
                }}
                className="text-red-500 hover:text-red-600 font-bold"
              >
                [EXIT RECRUIT PANEL]
              </button>
            ) : (
              ['about', 'skills', 'projects', 'certifications', 'resume', 'contact'].map((sect) => (
                <button
                  key={sect}
                  onClick={() => scrollToSection(sect)}
                  className={`transition-colors capitalize ${
                    currentTheme === 'professional-light' 
                      ? 'hover:text-indigo-600' 
                      : 'hover:text-white'
                  } ${
                    activeTab === sect 
                      ? (currentTheme === 'professional-light' ? 'text-indigo-600 font-bold' : 'text-cyan-400 font-bold') 
                      : (currentTheme === 'professional-light' ? 'text-slate-500' : 'text-gray-400')
                  }`}
                >
                  {sect}
                </button>
              ))
            )}
            <button
              onClick={() => {
                audioSynthesizer.playSuccess();
                setRecruiterMode(!recruiterMode);
              }}
              className={`px-3 py-1.2 rounded-xl text-[10px] font-bold border transition-all ${
                recruiterMode 
                  ? 'bg-red-500/10 text-red-500 border-red-500/30' 
                  : (currentTheme === 'professional-light' 
                      ? 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 shadow-sm'
                      : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]')
              }`}
            >
              FOR RECRUITERS
            </button>
          </nav>

          {/* Interactive Utility Controls */}
          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSoundMaster}
              title={soundEnabled ? "Mute interactive synthesized tones" : "Unmute interactive synthesized tones"}
              className="p-2 rounded-xl flex items-center justify-center bg-white/5 border border-white/5 hover:border-white/15 hover:text-white transition-all text-xs"
            >
              {soundEnabled ? <Volume2 size={14} className="text-cyan-400" /> : <VolumeX size={14} className="text-gray-500" />}
            </button>

            {/* Quick theme cycle button */}
            <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/5 rounded-xl">
              {(['neon-blue', 'purple-galaxy', 'professional-light'] as const).map((thId) => {
                const isActive = currentTheme === thId;
                return (
                  <button
                    key={thId}
                    onClick={() => handleThemeChange(thId)}
                    title={`Switch theme style: ${themes[thId].name}`}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-400/20' 
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {thId === 'neon-blue' && <Cpu size={11} />}
                    {thId === 'purple-galaxy' && <Atom size={11} />}
                    {thId === 'professional-light' && <Sun size={11} />}
                  </button>
                );
              })}
            </div>
            
            {/* Mobile Contact Quick Anchor */}
            <button
              onClick={() => scrollToSection('contact')}
              className="px-3.5 py-1.5 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-[10px] font-mono tracking-wider uppercase transition-all"
            >
              Contact
            </button>
          </div>
        </header>
      )}

      {/* ========================================================
          RECRUITER DASHBOARD COCKPIT (IF TOGGLED)
          ======================================================== */}
      {loadPhase === 4 && recruiterMode && (
        <div className="pt-24 min-h-screen">
          <RecruiterDashboard currentTheme={currentTheme} onExit={() => {
            audioSynthesizer.playClick();
            setRecruiterMode(false);
          }} />
        </div>
      )}

      {/* ========================================================
          STANDARD CINEMATIC EXPERIENCE
          ======================================================== */}
      {loadPhase === 4 && !recruiterMode && (
        <>
          {/* ========================================================
              HERO STORYTELLING SECTION
              ======================================================== */}
          {loadPhase === 4 && (
        <section id="hero" className="min-h-screen flex items-center pt-24 pb-16 relative px-4 z-10 w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-center">
            {/* Hero details */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="space-y-3">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest leading-none ${
                  currentTheme === 'professional-light' 
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-600 font-semibold' 
                    : 'bg-cyan-500/10 border border-cyan-400/20 text-cyan-400'
                }`}>
                  <Sparkles size={11} className="animate-spin" />
                  Portfolio Lab Environment
                </div>
                
                <div className="flex flex-row items-center gap-4 sm:gap-6 flex-wrap">
                  <h1 className={`text-4xl sm:text-6xl font-extrabold tracking-tight leading-none ${
                    currentTheme === 'professional-light' ? 'text-slate-900 font-display' : 'text-white'
                  }`}>
                    PAMPANA LEKHYA
                  </h1>
                  <div className={`w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-2xl overflow-hidden border-2 transition-transform duration-300 hover:scale-105 shrink-0 ${
                    currentTheme === 'professional-light' ? 'border-indigo-500 shadow-md' : 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  }`}>
                    <img 
                      src="/src/assets/images/student_photo_1781515365016.jpg" 
                      alt="Pampana Lekhya" 
                      className="w-full h-full object-cover animate-fade-in"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Typewriter element */}
                <h2 className={`text-lg sm:text-xl font-mono min-h-[30px] flex items-center ${
                  currentTheme === 'professional-light' ? 'text-indigo-600 font-semibold' : 'text-gray-300'
                }`}>
                  <TypingText 
                    phrases={[
                      'Artificial Intelligence Student',
                      'AI & ML Learner',
                      'Web Developer',
                      'Technology Explorer',
                      'Problem Solver'
                    ]} 
                  />
                </h2>

                <p className={`text-sm sm:text-base max-w-xl leading-relaxed ${
                  currentTheme === 'professional-light' ? 'text-slate-600 font-medium' : 'text-gray-400'
                }`}>
                  Exploring AI, Data, and Modern Web Technologies. Passionate about building intelligent applications, modern web experiences, and innovative technology solutions through AI and software development.
                </p>
              </div>

              {/* Action shortcuts */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => scrollToSection('projects')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-sans font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-[1.03] active:scale-[0.97]"
                >
                  Explore My Work
                </button>
                <button
                  onClick={() => scrollToSection('resume')}
                  className={`px-6 py-3 rounded-xl font-sans font-semibold text-xs uppercase tracking-wider transition-all hover:scale-[1.01] ${
                    currentTheme === 'professional-light' 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-sm' 
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                  }`}
                >
                  Download Resume
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className={`px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider transition-all ${
                    currentTheme === 'professional-light' 
                      ? 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-950 border border-transparent hover:border-slate-200' 
                      : 'bg-transparent hover:bg-white/5 text-gray-400 hover:text-white border border-transparent hover:border-white/5'
                  }`}
                >
                  Contact Me
                </button>
              </div>

              {/* Micro specs logs at hero foot */}
              <div className={`grid grid-cols-3 gap-4 pt-6 border-t max-w-md ${currentTheme === 'professional-light' ? 'border-slate-200' : 'border-white/5'}`}>
                <div>
                  <div className="text-[9px] font-mono text-gray-500 uppercase">COGNITIVE LEVEL</div>
                  <div className={`text-xs font-bold mt-1 ${currentTheme === 'professional-light' ? 'text-slate-800' : 'text-gray-300'}`}>B.Tech Fourth Year</div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-gray-500 uppercase">LOCATION STATUS</div>
                  <div className={`text-xs font-bold mt-1 ${currentTheme === 'professional-light' ? 'text-indigo-600' : 'text-cyan-400'}`}>Andhra Pradesh, IN</div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-gray-500 uppercase">ORBIT REGIMES</div>
                  <div className={`text-xs font-bold mt-1 ${currentTheme === 'professional-light' ? 'text-purple-600' : 'text-purple-400'}`}>AI / ML / DB / Web</div>
                </div>
              </div>
            </div>

            {/* Right side: Futuristic high-fidelity geometric digital shield avatar representation */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              {/* Backglow halos */}
              <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-500/10 to-purple-500/15 blur-3xl" />
              
              <div className="relative w-80 h-80 rounded-full border border-white/5 flex items-center justify-center p-6 bg-slate-950/20 backdrop-blur-md">
                {/* Simulated AI cybernetic avatar representation drawn cleanly with vectors */}
                <svg viewBox="0 0 200 200" className="w-full h-full text-cyan-400/80 animate-[spin_40s_linear_infinite]">
                  <defs>
                    <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Outer circle rings with notches */}
                  <circle cx="100" cy="100" r="85" fill="none" stroke="url(#cyberGradient)" strokeWidth="1" strokeDasharray="30 15 10 5" />
                  <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1.5" strokeDasharray="5 5" />
                  
                  {/* Orbiting node spheres */}
                  <circle cx="100" cy="15" r="3" fill="#06b6d4" />
                  <circle cx="185" cy="100" r="2.5" fill="#a855f7" />
                  <circle cx="15" cy="100" r="4" fill="#a855f7" />

                  {/* Hexagon pattern paths */}
                  <polygon points="100,50 143,75 143,125 100,150 57,125 57,75" fill="none" stroke="url(#cyberGradient)" strokeWidth="0.8" />
                  
                  {/* Internal neural mesh node connections */}
                  <line x1="100" y1="50" x2="100" y2="150" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <line x1="57" y1="75" x2="143" y2="125" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <line x1="57" y1="125" x2="143" y2="75" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                  {/* Core brain nodes representation */}
                  <circle cx="100" cy="100" r="14" fill="#090d16" stroke="url(#cyberGradient)" strokeWidth="2" />
                  <circle cx="100" cy="100" r="5" fill="#06b6d4" className="animate-ping" />
                </svg>

                {/* Floating telemetry labels in mockup */}
                <div className="absolute top-4 left-4 p-2 bg-black/80 rounded-xl border border-white/5 font-mono text-[9px] text-gray-400 group hover:border-cyan-400/30 transition-all">
                  <div className="text-cyan-400 font-bold">NODE_INDEX: B.Tech</div>
                  <div>LEKHYA_CORE_ACTIVE</div>
                </div>

                <div className="absolute bottom-4 right-4 p-2 bg-black/80 rounded-xl border border-white/5 font-mono text-[9px] text-gray-400">
                  <div className="text-purple-400 font-bold">STABILITY: 99.8%</div>
                  <div>SYNAPSE_GRID_ONLINE</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          STATS COUNTER SECTION
          ======================================================== */}
      {loadPhase === 4 && (
        <section className="py-8 bg-slate-950/20 border-y border-white/5 relative z-10 w-full px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {[
              { label: 'CGPA SCORE', value: counterStats.cgpa.toFixed(2), suffix: '' },
              { label: 'ACADEMIC PERCENT', value: counterStats.academicPercent, suffix: '%' },
              { label: 'DELIVERED PROJECTS', value: counterStats.projects, suffix: '+' },
              { label: 'CERTIFIED COURSES', value: counterStats.certs, suffix: '+' },
              { label: 'COMPLETED INTERNS', value: counterStats.internships, suffix: '' },
              { label: 'LANGUAGES ACTIVE', value: counterStats.languages, suffix: '' }
            ].map((stat, i) => (
              <div key={i} className="space-y-1 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="text-[10px] font-mono tracking-wider text-gray-500 uppercase">{stat.label}</div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
                  {stat.value}{stat.suffix}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          ABOUT SECTION WITH TIMELINE STORYTELLING
          ======================================================== */}
      {loadPhase === 4 && (
        <section id="about" className="py-24 relative px-4 z-10 w-full max-w-6xl mx-auto">
          <div className="space-y-16">
            <div className="text-center space-y-3">
              <span className={`text-xs uppercase font-mono tracking-widest ${
                currentTheme === 'professional-light' ? 'text-purple-600 font-bold' : 'text-[#a855f7]'
              }`}>
                Introspective Roadmap
              </span>
              <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-sans ${
                currentTheme === 'professional-light' ? 'text-slate-900' : ''
              }`}>
                Who Am I?
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left narrative */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
                <div className={`p-6 sm:p-8 rounded-3xl border backdrop-blur-md ${
                  currentTheme === 'professional-light' 
                    ? 'bg-white border-slate-200 shadow-sm text-slate-850' 
                    : 'bg-slate-900/40 border-white/5'
                }`}>
                  <h3 className={`text-xl font-bold font-sans tracking-tight mb-4 flex items-center gap-2 ${
                    currentTheme === 'professional-light' ? 'text-slate-900' : ''
                  }`}>
                    <Fingerprint className={currentTheme === 'professional-light' ? 'text-indigo-600' : 'text-purple-400'} /> Executive summary
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed space-y-4 ${
                    currentTheme === 'professional-light' ? 'text-slate-905 text-slate-900 font-medium' : 'text-gray-400'
                  }`}>
                    I am Pampana Lekhya, an active Artificial Intelligence student based in Andhra Pradesh, India. Starting my engineering path in 2023, I committed to converting theoretical algorithms (regression matrices, relational schemas, AI structures) into responsive web platforms.
                  </p>
                  <p className={`text-xs sm:text-sm leading-relaxed mt-4 ${
                    currentTheme === 'professional-light' ? 'text-slate-905 text-slate-900 font-medium' : 'text-gray-400'
                  }`}>
                    By learning both structured program workflows (Python, C Language) and dynamic web interfaces (HTML, Tailwind CSS, JavaScript), I seek to design helpful utilities for clinic patients and cognitive learners alike.
                  </p>
                </div>
              </div>

              {/* Right timeline path */}
              <div className="lg:col-span-7 space-y-8 relative pl-6 border-l border-white/10">
                {[
                  {
                    year: '2023',
                    title: 'B.Tech AI Core Kickoff',
                    description: "Enrolled in standard B.Tech program in 'Artificial Intelligence' at Vignan's Institute of Engineering for Women, cultivating core computational math habits."
                  },
                  {
                    year: 'Foundation Phase',
                    title: 'Systemized Programming Habits',
                    description: "Dived deep into standard structures, data modeling layouts, and procedural flows using Python and C Language implementations."
                  },
                  {
                    year: 'Web Expansion',
                    title: 'Markup & Interface Architectures',
                    description: 'Mastered responsive webpage designs utilizing semantic grid styling, CSS styles, flex components, and interaction logic with Vanilla JavaScript.'
                  },
                  {
                    year: 'Engineering Lab',
                    title: 'Assembling Academic Applications',
                    description: 'Drafted clinic diagnosis mockups, recipe macro calculators, and client telemetry loggers to simplify system management.'
                  },
                  {
                    year: 'Career Trainee',
                    title: 'Data Valley AI Trainee Program',
                    description: 'Engaged with actual enterprise datasets to evaluate, prune, sanitize, and train machine learning baseline algorithms.'
                  },
                  {
                    year: 'Active Vision',
                    title: 'Responsive AI Implementer',
                    description: 'Writing high-purity full-stack React portals to map client metrics cleanly and provide immediate professional value.'
                  }
                ].map((item, index) => (
                  <div key={index} className="relative space-y-2 group">
                    {/* Tiny pulsing marker node */}
                    <div className="absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full border border-purple-500 bg-[#090514] group-hover:scale-125 transition-transform flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                    </div>

                    <span className="text-[11px] font-mono leading-none font-bold text-purple-400 uppercase tracking-widest block">
                      {item.year}
                    </span>
                    <h4 className={`text-base font-bold transition-colors ${
                      currentTheme === 'professional-light' 
                        ? 'text-slate-900 group-hover:text-indigo-600' 
                        : 'text-gray-100 group-hover:text-cyan-400'
                    }`}>
                      {item.title}
                    </h4>
                    <p className={`text-xs leading-relaxed ${
                      currentTheme === 'professional-light' ? 'text-slate-800' : 'text-gray-400'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          SKILLS UNIVERSE SECTION
          ======================================================== */}
      {loadPhase === 4 && (
        <section id="skills" className={`py-24 border-y relative px-4 z-10 w-full ${
          currentTheme === 'professional-light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-white/5'
        }`}>
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-3">
              <span className={`text-xs uppercase font-mono tracking-widest ${
                currentTheme === 'professional-light' ? 'text-indigo-600 font-bold' : 'text-cyan-400'
              }`}>
                Cognitive Galaxy
              </span>
              <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-sans ${
                currentTheme === 'professional-light' ? 'text-slate-900' : ''
              }`}>
                The Skills Universe
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 mx-auto rounded" />
              <p className={`text-xs font-mono max-w-sm mx-auto ${
                currentTheme === 'professional-light' ? 'text-slate-900 font-semibold' : 'text-gray-400'
              }`}>
                Interactive math representation of Pampana Lekhya's active technical competencies.
              </p>
            </div>

            <SkillsUniverse currentTheme={currentTheme} />
          </div>
        </section>
      )}

      {/* ========================================================
          PROJECT SHOWCASE SECTION (THE MOST IMPORTANT)
          ======================================================== */}
      {loadPhase === 4 && (
        <section id="projects" className="py-24 relative px-4 z-10 w-full max-w-6xl mx-auto">
          <div className="space-y-16">
            <div className="text-center space-y-3">
              <span className={`text-xs uppercase font-mono tracking-widest ${
                currentTheme === 'professional-light' ? 'text-indigo-600 font-bold' : 'text-cyan-400'
              }`}>
                Functional Prototypes
              </span>
              <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-sans ${
                currentTheme === 'professional-light' ? 'text-slate-900' : ''
              }`}>
                Project Showcase
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded" />
              <p className={`text-xs font-mono max-w-sm mx-auto ${
                currentTheme === 'professional-light' ? 'text-slate-900 font-semibold' : 'text-gray-400'
              }`}>
                Cinematic interactive previews modeling true algorithmic logic and user options.
              </p>
            </div>

            <ProjectShowcase currentTheme={currentTheme} />
          </div>
        </section>
      )}

      {/* ========================================================
          EDUCATION CARD TIMELINES
          ======================================================== */}
      {loadPhase === 4 && (
        <section className="py-24 bg-slate-950/[0.15] border-y border-white/5 relative px-4 z-10 w-full max-w-6xl mx-auto">
          <div className="space-y-16">
            <div className="text-center space-y-3">
              <span className="text-xs uppercase font-mono tracking-widest text-[#a855f7]">
                Academic Pedigree
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
                Educational Foundations
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {EDUCATION_ITEMS.map((edu, idx) => (
                <div
                  key={edu.id}
                  className={`p-6 rounded-3xl border relative overflow-hidden flex flex-col justify-between min-h-[200px] transition-all ${
                    currentTheme === 'professional-light' 
                      ? 'bg-white border-slate-200 shadow-sm' 
                      : 'bg-slate-900/40 border-white/5'
                  }`}
                >
                  <div className="space-y-4">
                    <div className={`flex justify-between items-center text-[10px] font-mono ${
                      currentTheme === 'professional-light' ? 'text-slate-500' : 'text-gray-500'
                    }`}>
                      <span>[ACADEMIC_FILE_{idx + 1}]</span>
                      <span>{edu.year}</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className={`text-lg font-bold tracking-tight ${
                        currentTheme === 'professional-light' ? 'text-slate-900' : 'text-white'
                      }`}>
                        {edu.degree}
                      </h4>
                      <p className={`text-xs font-mono uppercase tracking-wider ${
                        currentTheme === 'professional-light' ? 'text-indigo-600 font-semibold' : 'text-cyan-400'
                      }`}>
                        {edu.field}
                      </p>
                    </div>

                    <p className={`text-xs leading-relaxed font-sans ${
                      currentTheme === 'professional-light' ? 'text-slate-800' : 'text-gray-400'
                    }`}>
                      {edu.institution}
                    </p>
                  </div>

                  <div className={`mt-6 pt-4 border-t flex items-center justify-between ${
                    currentTheme === 'professional-light' ? 'border-slate-100' : 'border-white/5'
                  }`}>
                    <span className={`text-[10px] font-mono ${
                      currentTheme === 'professional-light' ? 'text-slate-500' : 'text-gray-400'
                    }`}>GRADE RATING</span>
                    <span className="text-xs font-mono font-bold text-emerald-500">{edu.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          EXPERIENCE SECTION : TRAINEE AT DATA VALLEY
          ======================================================== */}
      {loadPhase === 4 && (
        <section id="experience" className="py-24 relative px-4 z-10 w-full max-w-6xl mx-auto">
          <div className="space-y-16">
            <div className="text-center space-y-3">
              <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
                Professional Trainee Path
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
                Experience & Learning Journey
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 mx-auto rounded" />
            </div>

            {/* Trainee Card details */}
            <div className={`p-6 sm:p-10 rounded-3xl border backdrop-blur-sm space-y-8 relative overflow-hidden max-w-3xl mx-auto ${
              currentTheme === 'professional-light' 
                ? 'bg-white border-slate-200 shadow-sm text-slate-800' 
                : 'bg-slate-900/40 border-white/5'
            }`}>
              {/* Back light glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className={`flex flex-col sm:flex-row justify-between sm:items-start gap-4 pb-6 border-b ${
                currentTheme === 'professional-light' ? 'border-slate-100' : 'border-white/5'
              }`}>
                <div className="space-y-1.5 text-left">
                  <h3 className={`text-2xl font-bold font-sans ${
                    currentTheme === 'professional-light' 
                      ? 'text-slate-900' 
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200'
                  }`}>
                    Data Valley India Pvt Ltd
                  </h3>
                  <p className={`text-xs font-mono uppercase tracking-widest ${
                    currentTheme === 'professional-light' ? 'text-indigo-600 font-semibold' : 'text-cyan-400'
                  }`}>
                    Foundations of AI & ML Trainee Intern
                  </p>
                </div>
                <div className={`text-left sm:text-right font-mono text-xs ${
                  currentTheme === 'professional-light' ? 'text-slate-500' : 'text-gray-400'
                }`}>
                  <div>Bengaluru, IN (Remote)</div>
                  <div className={`font-bold mt-1 ${
                    currentTheme === 'professional-light' ? 'text-indigo-600' : 'text-cyan-400'
                  }`}>Academic Training Session</div>
                </div>
              </div>

              {/* Core active responsibilities metrics */}
              <div className="space-y-6 text-left">
                <h4 className={`text-xs uppercase font-bold tracking-wider font-mono ${
                  currentTheme === 'professional-light' ? 'text-slate-900' : 'text-gray-400'
                }`}>
                  Module Actions & Applied Targets
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      act: 'Python-based Tasks',
                      desc: 'Wrote robust analytical programs, clean list structures, and custom automated metrics to process clinical inputs.'
                    },
                    {
                      act: 'Data Analysis Matrices',
                      desc: 'Executed core matrix data cleanses, parsed features, handled outliers, and evaluated variable scores.'
                    },
                    {
                      act: 'Machine Learning Concepts',
                      desc: 'Configured logical regression, clustering, and decision-tree architectures on standard dataset packages.'
                    },
                    {
                      act: 'Real-World AI Applications',
                      desc: 'Researched natural speech synthesis and predictive diagnostic math coordinates to solve medical inputs.'
                    }
                  ].map((elem, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border flex gap-3 ${
                      currentTheme === 'professional-light' 
                        ? 'bg-slate-50 border-slate-200' 
                        : 'bg-white/[0.02] border-white/5'
                    }`}>
                      <div className={`font-mono font-bold ${
                        currentTheme === 'professional-light' ? 'text-indigo-600' : 'text-cyan-400'
                      }`}>[0{idx + 1}]</div>
                      <div className="space-y-1 text-left">
                        <div className={`text-xs font-bold font-sans ${
                          currentTheme === 'professional-light' ? 'text-slate-950 font-bold' : 'text-gray-200'
                        }`}>{elem.act}</div>
                        <p className={`text-[11px] leading-relaxed ${
                          currentTheme === 'professional-light' ? 'text-slate-850 text-slate-800' : 'text-gray-400'
                        }`}>{elem.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          CERTIFICATIONS 3D GALLERY SECTION
          ======================================================== */}
      {loadPhase === 4 && (
        <section id="certifications" className={`py-24 border-y relative px-4 z-10 w-full ${
          currentTheme === 'professional-light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-white/5'
        }`}>
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-3">
              <span className={`text-xs uppercase font-mono tracking-widest ${
                currentTheme === 'professional-light' ? 'text-indigo-600 font-bold' : 'text-cyan-400'
              }`}>
                Verified Credentials
              </span>
              <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-sans ${
                currentTheme === 'professional-light' ? 'text-slate-900' : ''
              }`}>
                Active Certifications
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 mx-auto rounded" />
              <p className={`text-xs font-mono max-w-sm mx-auto ${
                currentTheme === 'professional-light' ? 'text-slate-900 font-semibold' : 'text-gray-400'
              }`}>
                Independently issued academic credentials. Click any card to inspect secure verification tokens.
              </p>
            </div>

            <CertificationsGallery currentTheme={currentTheme} />
          </div>
        </section>
      )}

      {/* ========================================================
          ACHIEVEMENTS & ROADMAPS LAYOUT
          ======================================================== */}
      {loadPhase === 4 && (
        <section className="py-24 relative px-4 z-10 w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Col: Achievements */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-2 text-left">
                <span className={`text-xs font-mono uppercase tracking-widest ${
                  currentTheme === 'professional-light' ? 'text-indigo-600 font-bold' : 'text-cyan-400'
                }`}>
                  Academic Milestones
                </span>
                <h3 className="text-2xl font-bold font-sans">
                  Honorable Achievements
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'HackHers 24-Hour Hackathon',
                    desc: 'Engaged with diverse female coder syndicates to devise and pitch clean technical solutions in a short high-stress sandbox.'
                  },
                  {
                    title: 'GenAI Hackathon Participation',
                    desc: 'Authored and integrated custom LLM prompt architectures to solve specific database categorization problems.'
                  },
                  {
                    title: 'AI & ML Internship Training',
                    desc: 'Successfully finished strict trainee credentials with solid evaluations in feature mapping and data modeling.'
                  },
                  {
                    title: 'Full Stack Development Training',
                    desc: 'Configured end-to-end full stack logic utilizing Node packages, React forms, database keys, and styled screens.'
                  }
                ].map((ach, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border flex gap-4 group transition-all text-left ${
                      currentTheme === 'professional-light' 
                        ? 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm text-slate-800' 
                        : 'bg-[#030712]/40 border border-white/5 hover:border-cyan-400/25'
                    }`}
                  >
                    <div className={`p-3 rounded-xl max-h-[44px] flex items-center justify-center ${
                      currentTheme === 'professional-light' ? 'bg-indigo-50 text-indigo-600' : 'bg-cyan-500/10 text-cyan-400'
                    }`}>
                      <Award size={16} />
                    </div>
                    <div className="space-y-1">
                      <h4 className={`text-sm font-bold font-sans transition-colors ${
                        currentTheme === 'professional-light' ? 'text-slate-900 group-hover:text-indigo-600' : 'text-gray-200 group-hover:text-cyan-300'
                      }`}>
                        {ach.title}
                      </h4>
                      <p className={`text-xs leading-relaxed ${
                        currentTheme === 'professional-light' ? 'text-slate-900 font-medium' : 'text-gray-400'
                      }`}>
                        {ach.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Futuristic Currently Learning roadmap */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-2 text-left">
                <span className={`text-xs font-mono uppercase tracking-widest ${
                  currentTheme === 'professional-light' ? 'text-purple-600 font-bold' : 'text-purple-400'
                }`}>
                  Ongoing Expansion Labs
                </span>
                <h3 className="text-2xl font-bold font-sans">
                  Currently Cultivating
                </h3>
              </div>

              <div className={`p-6 rounded-3xl border space-y-6 ${
                currentTheme === 'professional-light' 
                  ? 'bg-white border-slate-200 shadow-sm text-slate-800' 
                  : 'bg-purple-950/5 border border-purple-500/10'
              }`}>
                <p className={`text-xs font-mono mb-2 ${
                  currentTheme === 'professional-light' ? 'text-slate-900 font-semibold' : 'text-gray-400'
                }`}>
                  Active academic roadmap tracking which modern software architectures Lekhya is studying this semester.
                </p>

                <div className="space-y-4">
                  {[
                    { topic: 'Neural Weight Backpropagation (ML)', pct: '88%', col: currentTheme === 'professional-light' ? 'bg-indigo-600' : 'bg-cyan-500' },
                    { topic: 'Cognitive LLM APIs Modeling (AI)', pct: '82%', col: currentTheme === 'professional-light' ? 'bg-purple-600' : 'bg-purple-500' },
                    { topic: 'End-to-End full stack workflows (React)', pct: '77%', col: currentTheme === 'professional-light' ? 'bg-blue-600' : 'bg-indigo-500' },
                    { topic: 'Time Complexity limits (Data Structures)', pct: '70%', col: currentTheme === 'professional-light' ? 'bg-emerald-600' : 'bg-emerald-500' },
                    { topic: 'Problem Solving methodologies', pct: '65%', col: currentTheme === 'professional-light' ? 'bg-rose-600' : 'bg-rose-500' }
                  ].map((road, k) => (
                    <div key={k} className="space-y-1.5 text-left font-mono">
                      <div className={`flex justify-between items-center text-[10px] ${
                        currentTheme === 'professional-light' ? 'text-slate-900 font-bold' : 'text-gray-400'
                      }`}>
                        <span>{road.topic}</span>
                        <span className="font-bold">{road.pct}</span>
                      </div>
                      <div className={`w-full h-1.25 rounded-full overflow-hidden ${
                        currentTheme === 'professional-light' ? 'bg-slate-100' : 'bg-white/5'
                      }`}>
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${road.col}`}
                          style={{ width: road.pct }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          RESUME PDF EMBED & INTERACTIVE READER CARD
          ======================================================== */}
      {loadPhase === 4 && (
        <section id="resume" className={`py-24 border-y relative px-4 z-10 w-full max-w-6xl mx-auto ${
          currentTheme === 'professional-light' ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950/25 border-white/5'
        }`}>
          <div className="space-y-16">
            <div className="text-center space-y-3">
              <span className={`text-xs uppercase font-mono tracking-widest ${
                currentTheme === 'professional-light' ? 'text-purple-600 font-bold' : 'text-[#a855f7]'
              }`}>
                Human Resources Portal
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
                Curriculum Vitae Preview
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded" />
              <p className={`text-xs font-mono max-w-sm mx-auto ${
                currentTheme === 'professional-light' ? 'text-slate-500' : 'text-gray-400'
              }`}>
                Officially formatted academic resume preview tool. Print or fetch direct PDF formats dynamically.
              </p>
            </div>

            <ResumePreview currentTheme={currentTheme} />
          </div>
        </section>
      )}

      {/* ========================================================
          CONTACT SECTION (PREMIUM INTERRUPT)
          ======================================================== */}
      {loadPhase === 4 && (
        <section id="contact" className="py-24 relative px-4 z-10 w-full max-w-6xl mx-auto font-sans">
          <div className="space-y-16">
            <div className="text-center space-y-3">
              <span className={`text-xs uppercase font-mono tracking-widest ${
                currentTheme === 'professional-light' ? 'text-indigo-600 font-bold' : 'text-cyan-400'
              }`}>
                Secure SMTP Handshakes
              </span>
              <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-sans ${
                currentTheme === 'professional-light' ? 'text-slate-900' : 'text-white'
              }`}>
                Let's Build Something Amazing Together
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 mx-auto rounded" />
              <p className={`text-xs font-mono max-w-sm mx-auto ${
                currentTheme === 'professional-light' ? 'text-slate-500' : 'text-gray-400'
              }`}>
                Submit raw telemetry requests or internship contract proposals. Active live routing enabled.
              </p>
            </div>

            <ContactForm currentTheme={currentTheme} />
          </div>
        </section>
      )}
    </>
  )}

      {/* ========================================================
          FOOTER CHANNELS
          ======================================================== */}
      {loadPhase === 4 && (
        <footer className={`py-12 border-t relative z-10 w-full px-4 text-center ${
          currentTheme === 'professional-light' 
            ? 'bg-slate-50 border-slate-200 text-slate-800' 
            : 'bg-[#02040a] border-white/5 text-gray-400'
        }`}>
          <div className="max-w-6xl mx-auto space-y-8">
            <div className={`flex flex-col sm:flex-row justify-between items-center gap-6 border-b pb-8 ${
              currentTheme === 'professional-light' ? 'border-slate-200' : 'border-white/5'
            }`}>
              {/* Left brand */}
              <div className="text-left space-y-1.5 shrink-0">
                <h4 className={`text-lg font-bold font-sans uppercase tracking-wider ${
                  currentTheme === 'professional-light' ? 'text-slate-900' : 'text-white'
                }`}>
                  PAMPANA LEKHYA
                </h4>
                <p className={`text-xs font-mono ${
                  currentTheme === 'professional-light' ? 'text-indigo-600 font-semibold' : 'text-cyan-400'
                }`}>
                  Artificial Intelligence Student • Academic Portfolio
                </p>
              </div>

              {/* Table of contents shortcut guides */}
              <div className="flex flex-wrap gap-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                {['about', 'skills', 'projects', 'certifications', 'resume', 'contact'].map((tr) => (
                  <button
                    key={tr}
                    onClick={() => scrollToSection(tr)}
                    className={`transition-colors ${
                      currentTheme === 'professional-light' ? 'hover:text-indigo-600' : 'hover:text-cyan-400'
                    }`}
                  >
                    [{tr.toUpperCase()}]
                  </button>
                ))}
              </div>
            </div>

            {/* Copyright lines */}
            <div className={`flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono gap-4 ${
              currentTheme === 'professional-light' ? 'text-slate-500' : 'text-gray-600'
            }`}>
              <div>
                Designed & Developed by <span className={`font-semibold ${currentTheme === 'professional-light' ? 'text-slate-800 font-semiboldWidth' : 'text-gray-400'}`}>PAMPANA LEKHYA</span>
              </div>
              <div>
                Academic session: 2023 – 2027 • Andhra Pradesh, India
              </div>
              <div>
                © 2026 • All telemetries verified cryptographically
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* ========================================================
          BACK TO TOP ACTIVE TOGGLE 
          ======================================================== */}
      {loadPhase === 4 && showScrollTop && (
        <button
          onClick={() => {
            audioSynthesizer.playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="Return to gravity center"
          className={`fixed bottom-6 right-6 p-3.5 rounded-full border transition-all shadow-xl hover:scale-110 active:scale-95 z-40 cursor-pointer ${
            currentTheme === 'professional-light' 
              ? 'bg-white/95 border-slate-200 hover:border-indigo-400 text-slate-600 hover:text-indigo-600 shadow-indigo-100/30' 
              : 'bg-slate-900/80 border border-white/10 hover:border-cyan-400 hover:text-white text-gray-400'
          }`}
        >
          <ArrowUp size={16} />
        </button>
      )}
    </div>
  );
}
