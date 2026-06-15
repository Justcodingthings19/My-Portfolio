import React from 'react';
import { ThemeType } from '../types';
import ResumePreview from './ResumePreview';
import SkillsUniverse from './SkillsUniverse';
import ProjectShowcase from './ProjectShowcase';
import CertificationsGallery from './CertificationsGallery';
import ContactForm from './ContactForm';
import LearningDomainsRadar from './LearningDomainsRadar';
import { 
  Briefcase, 
  User, 
  GraduationCap, 
  TrendingUp, 
  Code, 
  Database,
  Award,
  Sparkles,
  Search,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface RecruiterDashboardProps {
  currentTheme: ThemeType;
  onExit: () => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ currentTheme, onExit }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-16 animate-in fade-in duration-500">
      {/* COCKPIT HEADER PROFILE SUMMARY */}
      <div className="p-8 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md relative overflow-hidden text-left shadow-[0_0_50px_rgba(6,182,212,0.1)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />
        
        {/* Holographic matrix lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-40" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              <Sparkles size={11} className="animate-pulse" /> RECRUIT COCKPIT MODE ACTIVE
            </div>

            <div className="space-y-1.5">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans text-white">
                PAMPANA LEKHYA
              </h2>
              <p className="text-sm font-mono text-gray-400">
                Artificial Intelligence Student • Exploring AI, Data, and Modern Web Tech
              </p>
            </div>

            {/* Quick telemetry parameters */}
            <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-400 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span>CGPA score: <strong className="text-white">7.96</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Inter: <strong className="text-white">86.2%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Location: <strong className="text-white">Andhra Pradesh, India</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={onExit}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(239,68,68,0.25)] hover:scale-[1.03] active:scale-[0.97] self-start md:self-auto"
          >
            Exit Recruiter Mode
          </button>
        </div>
      </div>

      {/* RECRUITER ROADMAP ROAD PANEL */}
      <div className="space-y-8">
        <div className="text-left border-b border-white/5 pb-3">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">ACADEMIC PATHWAY</span>
          <h3 className="text-2xl font-bold font-sans text-white">EDUCATION TIMELINE & MILESTONES</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              inst: "Vignan's Institute of Engineering for Women",
              deg: "B.Tech in Artificial Intelligence",
              time: "2023 – 2027",
              grad: "CGPA: 7.96 (Equivalent Percentage: 74.65%)",
              icon: <GraduationCap className="text-cyan-400" />
            },
            {
              inst: "Sri Chaitanya Junior College",
              deg: "Intermediate Science Education (MPC)",
              time: "2021 – 2023",
              grad: "86.2% Academic Performance Score",
              icon: <Award className="text-purple-400" />
            },
            {
              inst: "Sri Surya Teja School",
              deg: "Secondary School Certificate (SSC)",
              time: "2021",
              grad: "CGPA: 10/10 Perfect Score",
              icon: <CheckCircle className="text-emerald-400" />
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 text-left relative overflow-hidden flex flex-col justify-between hover:border-cyan-500/20 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 text-gray-400 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 bg-slate-950 px-2 py-0.5 rounded border border-white/5">{item.time}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold font-sans text-white group-hover:text-cyan-400 transition-colors">{item.deg}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">{item.inst}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-gray-500 uppercase">SCORE RATING:</span>
                <span className="text-emerald-400 font-bold">{item.grad}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COGNITIVE SKILLS & RADAR SEGMENT */}
      <div className="space-y-8">
        <div className="text-left border-b border-white/5 pb-3">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">COGNITIVE MAPPING</span>
          <h3 className="text-2xl font-bold font-sans text-white">SKILLS DISCIPLINE & COMPREHENSIVE RADAR</h3>
        </div>

        <LearningDomainsRadar currentTheme={currentTheme} />

        <div className="pt-4 border-t border-white/5 mt-8">
          <SkillsUniverse currentTheme={currentTheme} />
        </div>
      </div>

      {/* SIMULATIVE PROJECTS CONSOLE */}
      <div className="space-y-8">
        <div className="text-left border-b border-white/5 pb-3">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">INTERACTIVE PROTOTYPES</span>
          <h3 className="text-2xl font-bold font-sans text-white">PROJECT WALKTHROUGHS & EXPERIMENTAL SANDBOXES</h3>
        </div>

        <ProjectShowcase currentTheme={currentTheme} />
      </div>

      {/* CREDENTIALS DATABASE SHEET */}
      <div className="space-y-8">
        <div className="text-left border-b border-white/5 pb-3">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">CREDENTIALS CENTER</span>
          <h3 className="text-2xl font-bold font-sans text-white">SECURE CERTIFICATES & WORKSHOP REGISTRY</h3>
        </div>

        <CertificationsGallery currentTheme={currentTheme} />
      </div>

      {/* CV / RESUME VIEWER MODULE */}
      <div className="space-y-8">
        <div className="text-left border-b border-white/5 pb-3">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">HUMAN RESOURCES CV</span>
          <h3 className="text-2xl font-bold font-sans text-white">INTEGRATED RESUME PREVIEW & PDF DISPATCH</h3>
        </div>

        <ResumePreview currentTheme={currentTheme} />
      </div>

      {/* SECURE DIRECT SMTP COMMUNICATION PORT PORTAL */}
      <div className="space-y-8">
        <div className="text-left border-b border-white/5 pb-3">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">SECURE CHANNEL</span>
          <h3 className="text-2xl font-bold font-sans text-white">HIRE & ENGAGE DIRECT SMTP TELEMETRY PORTAL</h3>
        </div>

        <ContactForm currentTheme={currentTheme} />
      </div>

      {/* RECRUITER SYSTEM DISMISSAL TRIGGER */}
      <div className="py-8 border-t border-white/5 text-center">
        <button
          onClick={onExit}
          className="px-6 py-3 rounded-2xl bg-slate-950 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-wider hover:bg-slate-900 transition-all"
        >
          [Exit Recruiter Dashboard Portal Sandbox]
        </button>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
