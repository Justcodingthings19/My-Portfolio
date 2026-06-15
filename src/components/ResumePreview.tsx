import React, { useState } from 'react';
import { audioSynthesizer } from './AudioEngine';
import { ThemeType } from '../types';

interface ResumePreviewProps {
  currentTheme: ThemeType;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ currentTheme }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [documentTheme, setDocumentTheme] = useState<'clean-white' | 'terminal'>('clean-white');

  const handleDownload = () => {
    audioSynthesizer.playSuccess();
    // Simulate downloading by opening a printable window view
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Hi Hello! Iam Pampana Lekhya - Resume</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6; }
              hr { border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0; }
              h1 { margin-bottom: 5px; font-size: 28px; color: #0f172a; }
              h2 { font-size: 18px; color: #4f46e5; margin-top: 25px; border-bottom: 2px solid #818cf8; padding-bottom: 4px; }
              h3 { font-size: 15px; margin: 5px 0 2px 0; color: #1e293b; }
              .meta { font-size: 12px; color: #64748b; margin-bottom: 20px; }
              .section-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
              .bullet-list { padding-left: 20px; margin: 5px 0; }
              .grade { font-weight: bold; color: #10b981; }
            </style>
          </head>
          <body>
            <h1>PAMPANA LEKHYA</h1>
            <p>Artificial Intelligence Student | Exploring AI, Data, and Modern Web Technologies</p>
            <div class="meta">
              Andhra Pradesh, India | +91 9390980992 | pampanalekhya19@gmail.com | LinkedIn: Pampana Lekhya
            </div>

            <hr />

            <h2>PROFESSIONAL SUMMARY</h2>
            <p>Passionate Artificial Intelligence student focusing on building intelligent applications, modern web experiences, and innovative technology solutions through computer science, software development, and machine learning models.</p>

            <h2>EDUCATION</h2>
            <h3>Vignan's Institute of Engineering for Women (2023 - 2027)</h3>
            <p>B.Tech in Artificial Intelligence | <span class="grade">CGPA: 7.96</span> (Percentage: 74.65%)</p>

            <h3>Sri Chaitanya Junior College (2021 - 2023)</h3>
            <p>Intermediate Education (MPC) | <span class="grade">74.65% Academic Performance / 86.2% score</span></p>

            <h3>Sri Surya Teja School (2021)</h3>
            <p>SSC Certification | <span class="grade">CGPA: 10/10 Score</span></p>

            <h2>TECHNICAL SKILLS</h2>
            <p><strong>Languages:</strong> Python, C Language, JavaScript<br />
            <strong>Web Architectures:</strong> HTML5, CSS3, Tailwind CSS, Responsive Design<br />
            <strong>Databases:</strong> SQL, DBMS (Database Management Systems)<br />
            <strong>Intelligence Ecosystems:</strong> AI Fundamentals, Machine Learning, Deep Models</p>

            <h2>COMPLETED ENGINEERING PROJECTS</h2>
            <h3>1. Telemedicine Health Recommendation platform</h3>
            <p>Responsive web component formulated in HTML, CSS and ES6 JavaScript analyzing symptoms and metadata parameters to design optimized wellness food plans and custom diets.</p>

            <h3>2. Personalized Diet Calculator</h3>
            <p>High-fidelity client panel converting height and weight markers into optimized daily macronutrient scores.</p>

            <h3>3. AI Adaptive Educational Style Classifier</h3>
            <p>Machine learning pedagogical platform which adapts curriculum difficulty and medium in response to direct user performance scores.</p>

            <h2>EXPERIENCE & INTERNSHIPS</h2>
            <h3>Data Valley India Pvt. Ltd. (AI & ML Trainee Intern)</h3>
            <ul class="bullet-list">
              <li>Pioneered Python-based telemetry tasks and database scripting</li>
              <li>Engineered data analysis frameworks and classified ML datasets</li>
              <li>Connected algorithmic math guidelines to active business targets</li>
            </ul>

            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      alert("Popup blocker active! Please allow popups to preview/print the PDF copy of Lekhya's resume.");
    }
  };

  const adjustZoom = (amount: number) => {
    audioSynthesizer.playClick();
    setZoomLevel((prev) => Math.max(70, Math.min(130, prev + amount)));
  };

  const getThemeText = () => {
    switch (currentTheme) {
      case 'neon-blue':
        return {
          headerBg: 'bg-cyan-950/20 border-cyan-500/20',
          accent: 'text-cyan-400',
          glassCard: 'bg-gray-950/40 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-400/40'
        };
      case 'purple-galaxy':
        return {
          headerBg: 'bg-purple-950/20 border-purple-500/20',
          accent: 'text-purple-400',
          glassCard: 'bg-purple-950/20 backdrop-blur-md border border-purple-500/20 hover:border-purple-400/40'
        };
      case 'professional-light':
        return {
          headerBg: 'bg-indigo-50/50 border-slate-200',
          accent: 'text-indigo-600',
          glassCard: 'bg-white shadow-[0_8px_32px_rgba(99,102,241,0.06)] border border-slate-200 hover:border-indigo-300'
        };
    }
  };

  const tClass = getThemeText();

  return (
    <div className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 ${tClass.glassCard}`}>
      {/* Zoom / Layout controls bar */}
      <div className={`p-4 rounded-2xl mb-6 flex flex-wrap gap-4 items-center justify-between border ${tClass.headerBg}`}>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-gray-400">PDF Reader v2.6 [ONLINE]</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/5">
            <button
              onClick={() => adjustZoom(-15)}
              className="text-xs font-mono font-bold hover:text-white px-1.5 text-gray-500 transition-colors"
            >
              -
            </button>
            <span className="text-[10px] font-mono text-gray-300 min-w-[35px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => adjustZoom(15)}
              className="text-xs font-mono font-bold hover:text-white px-1.5 text-gray-500 transition-colors"
            >
              +
            </button>
          </div>

          <button
            onClick={() => {
              audioSynthesizer.playClick();
              setDocumentTheme((prev) => (prev === 'clean-white' ? 'terminal' : 'clean-white'));
            }}
            className="px-2.5 py-1 rounded border border-white/10 text-[10px] font-mono text-gray-400 hover:text-white transition-colors"
          >
            THEME: {documentTheme.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Embedded Document Frame */}
      <div className="w-full overflow-x-auto overflow-y-hidden py-2 bg-slate-900/60 rounded-2xl relative border border-white/5 flex justify-center max-h-[500px]">
        {/* Holographic Watermark lines */}
        <div className="absolute inset-0 pointer-events-none grid grid-cols-12 opacity-5 select-none font-mono text-[8px] p-4 text-cyan-400 uppercase tracking-widest">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="col-span-1 border-r border-cyan-400 h-full" />
          ))}
        </div>

        {/* Digital Document Sheet */}
        <div
          className={`px-8 py-10 transition-all duration-300 shadow-2xl rounded-lg origin-top shrink-0 text-left`}
          style={{
            transform: `scale(${zoomLevel / 100})`,
            width: '640px',
            background: documentTheme === 'clean-white' ? '#ffffff' : '#030712',
            color: documentTheme === 'clean-white' ? '#1e293b' : '#f3f4f6',
            minHeight: '820px'
          }}
        >
          {/* Header */}
          <div className="border-b border-gray-200/50 pb-4 text-center">
            <h4 className={`text-2xl font-extrabold tracking-tight ${documentTheme === 'clean-white' ? 'text-slate-900' : 'text-cyan-400'}`}>
              PAMPANA LEKHYA
            </h4>
            <p className={`text-xs font-mono mt-0.5 ${documentTheme === 'clean-white' ? 'text-slate-500' : 'text-gray-400'}`}>
              Artificial Intelligence Student | Andhra Pradesh, India
            </p>
            <div className={`mt-2 flex justify-center gap-3 text-[9px] font-mono ${documentTheme === 'clean-white' ? 'text-slate-400' : 'text-gray-500'}`}>
              <span>pampanalekhya19@gmail.com</span>
              <span>•</span>
              <span>+91 9390980992</span>
              <span>•</span>
              <span>LinkedIn Connected</span>
            </div>
          </div>

          {/* Quick Body sections */}
          <div className="mt-6 space-y-6 text-xs leading-relaxed">
            <div>
              <h5 className={`font-bold font-mono border-b ${documentTheme === 'clean-white' ? 'border-slate-300 text-indigo-600' : 'border-cyan-900 text-cyan-400'} pb-1 tracking-widest uppercase text-[10px] mb-2`}>
                Professional Objective
              </h5>
              <p className={documentTheme === 'clean-white' ? 'text-slate-600' : 'text-gray-300'}>
                Determined Artificial Intelligence undergraduate student striving to build, deploy, and scale diagnostic healthcare widgets, intelligent learning algorithms, and high-quality web utilities using responsive frontends and verified structures.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h5 className={`font-bold font-mono border-b ${documentTheme === 'clean-white' ? 'border-slate-300 text-indigo-600' : 'border-cyan-900 text-cyan-400'} pb-1 tracking-widest uppercase text-[10px] mb-2`}>
                  Education Milestones
                </h5>
                <div className="space-y-3">
                  <div>
                    <div className={`font-bold ${documentTheme === 'clean-white' ? 'text-slate-800' : 'text-gray-200'}`}>B.Tech in Artificial Intelligence</div>
                    <div className={documentTheme === 'clean-white' ? 'text-slate-600' : 'text-gray-400'}>Vignan's Institute of Engineering for Women</div>
                    <div className={`font-bold font-mono text-[10px] ${documentTheme === 'clean-white' ? 'text-emerald-600' : 'text-emerald-400'}`}>CGPA 7.96 | 2023 - 2027</div>
                  </div>
                  <div>
                    <div className={`font-bold ${documentTheme === 'clean-white' ? 'text-slate-800' : 'text-gray-200'}`}>Intermediate Board MPC</div>
                    <div className={documentTheme === 'clean-white' ? 'text-slate-600' : 'text-gray-400'}>Sri Chaitanya Junior College</div>
                    <div className={`font-bold font-mono text-[10px] ${documentTheme === 'clean-white' ? 'text-emerald-600' : 'text-emerald-400'}`}>Percentage: 86.2% | 2021 - 2023</div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className={`font-bold font-mono border-b ${documentTheme === 'clean-white' ? 'border-slate-300 text-indigo-600' : 'border-cyan-900 text-cyan-400'} pb-1 tracking-widest uppercase text-[10px] mb-2`}>
                  Core Skills Vector
                </h5>
                <div className="space-y-1.5 text-[11px]">
                  <div><strong className="font-mono">Languages:</strong> Python, C Language</div>
                  <div><strong className="font-mono">Frontend:</strong> HTML5, CSS3, ES6 Javascript</div>
                  <div><strong className="font-mono">Data Architectures:</strong> SQL Queries, DBMS</div>
                  <div><strong className="font-mono">Intelligence:</strong> Machine Learning concepts</div>
                </div>
              </div>
            </div>

            <div>
              <h5 className={`font-bold font-mono border-b ${documentTheme === 'clean-white' ? 'border-slate-300 text-indigo-600' : 'border-cyan-900 text-cyan-400'} pb-1 tracking-widest uppercase text-[10px] mb-2`}>
                Recent Internships
              </h5>
              <div>
                <div className="justify-between flex items-center">
                  <span className={`font-bold ${documentTheme === 'clean-white' ? 'text-slate-800' : 'text-gray-200'}`}>Data Valley India Pvt Ltd</span>
                  <span className={`font-mono ${documentTheme === 'clean-white' ? 'text-slate-600 font-bold' : 'text-gray-400'}`}>AI / ML Intern Trainee</span>
                </div>
                <p className={`mt-1 font-sans ${documentTheme === 'clean-white' ? 'text-slate-600' : 'text-gray-300'}`}>
                  Engineered custom datasets cleanings, compiled machine learning algorithms, handled Python scripting operations, and applied complex analytical formulas to fulfill practical tasks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interaction Actions */}
      <div className="flex flex-wrap justify-between gap-4 mt-6 items-center border-t border-white/5 pt-6">
        <p className="text-xs font-mono text-gray-500">
          File Name: <span className="text-gray-400 font-bold">lekhya_academic_resume.pdf</span> [342 kB]
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className={`px-5 py-2.5 rounded-xl text-xs font-sans font-bold shadow transition-all duration-200 select-none hover:scale-105 active:scale-95 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white`}
          >
            Download Official Copy
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2.5 rounded-xl text-xs font-sans hover:bg-white/5 text-gray-400 border border-white/10 hover:text-white transition-all duration-200 select-none"
          >
            Print PDF System
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
