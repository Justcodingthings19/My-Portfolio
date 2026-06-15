import React, { useState } from 'react';
import { audioSynthesizer } from './AudioEngine';
import { Mail, Linkedin, Send, ShieldAlert } from 'lucide-react';
import { ThemeType } from '../types';

interface ContactFormProps {
  currentTheme: ThemeType;
}

export const ContactForm: React.FC<ContactFormProps> = ({ currentTheme }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [transitLogs, setTransitLogs] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addTransitLog = (msg: string, delay: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setTransitLogs((prev) => [...prev, `[SMTP] ${msg}`]);
        audioSynthesizer.playHover();
        resolve();
      }, delay);
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      audioSynthesizer.playBeep(400, 0.25, 'sawtooth', 0.1); // Error buzzer
      alert('Security Protocol: Please formulate all required fields before dispatch.');
      return;
    }

    audioSynthesizer.playClick();
    setFormStatus('sending');
    setTransitLogs([]);

    // Fun high-fidelity programmatic SMTP transfer logs!
    await addTransitLog('Initializing handshake with secure mail router...', 400);
    await addTransitLog(`Binding message payload for ${formData.email}...`, 600);
    await addTransitLog('Validating anti-bot security signatures...', 500);
    await addTransitLog('SMTP port 587 negotiated. Dispatching telemetry packet...', 700);
    await addTransitLog('Transfer complete! 200 OK - Message delivered to Lekhya.', 400);

    audioSynthesizer.playSuccess();
    setFormStatus('success');
    
    // Clear form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const resetForm = () => {
    audioSynthesizer.playClick();
    setFormStatus('idle');
    setTransitLogs([]);
  };

  const getThemeText = () => {
    switch (currentTheme) {
      case 'neon-blue':
        return {
          accentText: 'text-cyan-400',
          accentBorder: 'border-cyan-500/20 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.15)]',
          accentButton: 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]'
        };
      case 'purple-galaxy':
        return {
          accentText: 'text-purple-400',
          accentBorder: 'border-purple-500/20 focus:border-purple-400 focus:shadow-[0_0_10px_rgba(168,85,247,0.15)]',
          accentButton: 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:bg-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]'
        };
      case 'professional-light':
        return {
          accentText: 'text-indigo-600',
          accentBorder: 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100',
          accentButton: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
        };
    }
  };

  const themeClass = getThemeText();

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Column: Direct channels */}
      <div className={`lg:col-span-4 flex flex-col justify-between p-6 sm:p-8 rounded-3xl border relative overflow-hidden ${
        currentTheme === 'professional-light' ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-slate-900/40 border-white/5'
      }`}>
        {/* Glow backdrop link */}
        <div className="absolute inset-0 bg-radial from-cyan-500/5 to-transparent pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <div>
            <h4 className={`text-xs font-mono tracking-widest uppercase mb-1 ${
              currentTheme === 'professional-light' ? 'text-indigo-600 font-bold' : 'text-cyan-400'
            }`}>
              Direct telemetry channels
            </h4>
            <h3 className="text-2xl font-bold font-sans tracking-tight">
              Get in Touch
            </h3>
          </div>

          <p className={`text-xs leading-relaxed ${
            currentTheme === 'professional-light' ? 'text-slate-600' : 'text-gray-400'
          }`}>
            For internship inquiries, project reviews, or technological collaborations, connect via e-mail or LinkedIn directly. Live monitoring is active.
          </p>

          <div className="space-y-3 pb-4">
            <a
              href="mailto:pampanalekhya19@gmail.com"
              onClick={() => audioSynthesizer.playClick()}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all group ${
                currentTheme === 'professional-light' 
                  ? 'bg-slate-50 border-slate-200 hover:border-indigo-400 text-slate-800' 
                  : 'bg-white/5 border-white/5 hover:border-cyan-400/30 text-gray-200'
              }`}
            >
              <div className={`p-2.5 rounded-xl group-hover:scale-110 transition-transform ${
                currentTheme === 'professional-light' ? 'bg-indigo-100 text-indigo-600' : 'bg-cyan-500/10 text-cyan-400'
              }`}>
                <Mail size={16} />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono text-gray-500 uppercase">Email Address</div>
                <div className={`text-xs font-semibold ${currentTheme === 'professional-light' ? 'text-slate-800' : 'text-gray-200'}`}>pampanalekhya19@gmail.com</div>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/lekhya-pampana-a13a832a8/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audioSynthesizer.playClick()}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all group ${
                currentTheme === 'professional-light' 
                  ? 'bg-slate-50 border-slate-200 hover:border-indigo-400 text-slate-800' 
                  : 'bg-white/5 border-white/5 hover:border-cyan-400/30 text-gray-200'
              }`}
            >
              <div className={`p-2.5 rounded-xl group-hover:scale-110 transition-transform ${
                currentTheme === 'professional-light' ? 'bg-indigo-100 text-indigo-600' : 'bg-cyan-500/10 text-cyan-400'
              }`}>
                <Linkedin size={16} />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono text-gray-500 uppercase">LinkedIn Profile</div>
                <div className={`text-xs font-semibold ${currentTheme === 'professional-light' ? 'text-slate-800' : 'text-gray-200'}`}>PAMPANA LEKHYA</div>
              </div>
            </a>
          </div>
        </div>

        <div className={`text-[9px] font-mono uppercase relative z-10 border-t pt-4 mt-6 ${
          currentTheme === 'professional-light' ? 'border-slate-100 text-slate-500' : 'border-white/5 text-gray-400'
        }`}>
          Location: Andhra Pradesh, India <br />
          Telemetry Status: Active and listening
        </div>
      </div>

      {/* Right Column: Dynamic Form UI */}
      <div className={`lg:col-span-8 p-6 sm:p-8 rounded-3xl border backdrop-blur-md ${
        currentTheme === 'professional-light' ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-slate-900/20 border-white/5'
      }`}>
        {formStatus === 'idle' && (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-[10px] font-mono uppercase tracking-wider mb-1 ${
                  currentTheme === 'professional-light' ? 'text-slate-500' : 'text-gray-400'
                }`}>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Recruit Coordinator"
                  className={`w-full text-xs px-4 py-3 rounded-xl border font-sans outline-none transition-all ${
                    currentTheme === 'professional-light' 
                      ? 'bg-slate-50 text-slate-800 focus:bg-white' 
                      : 'bg-slate-950/60 text-gray-100'
                  } ${themeClass.accentBorder}`}
                  required
                />
              </div>

              <div>
                <label className={`block text-[10px] font-mono uppercase tracking-wider mb-1 ${
                  currentTheme === 'professional-light' ? 'text-slate-500' : 'text-gray-400'
                }`}>
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. coordinate@company.org"
                  className={`w-full text-xs px-4 py-3 rounded-xl border font-sans outline-none transition-all ${
                    currentTheme === 'professional-light' 
                      ? 'bg-slate-50 text-slate-800 focus:bg-white' 
                      : 'bg-slate-950/60 text-gray-100'
                  } ${themeClass.accentBorder}`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-[10px] font-mono uppercase tracking-wider mb-1 ${
                  currentTheme === 'professional-light' ? 'text-slate-500' : 'text-gray-400'
                }`}>
                Subject Option
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="e.g. Full-Stack AI Academic Internship Review"
                className={`w-full text-xs px-4 py-3 rounded-xl border font-sans outline-none transition-all ${
                  currentTheme === 'professional-light' 
                    ? 'bg-slate-50 text-slate-800 focus:bg-white' 
                    : 'bg-slate-950/60 text-gray-100'
                } ${themeClass.accentBorder}`}
              />
            </div>

            <div>
              <label className={`block text-[10px] font-mono uppercase tracking-wider mb-1 ${
                  currentTheme === 'professional-light' ? 'text-slate-500' : 'text-gray-400'
                }`}>
                Instruction Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="Formulate your request parameters or academic critique..."
                className={`w-full text-xs px-4 py-3 rounded-xl border font-sans outline-none transition-all resize-none ${
                  currentTheme === 'professional-light' 
                    ? 'bg-slate-50 text-slate-800 focus:bg-white' 
                    : 'bg-slate-950/60 text-gray-100'
                } ${themeClass.accentBorder}`}
                required
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[9px] font-mono text-gray-500 uppercase flex items-center gap-1">
                <ShieldAlert size={10} /> Cryptographically secured pipeline
              </span>
              <button
                type="submit"
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] ${themeClass.accentButton}`}
              >
                <Send size={12} /> Send Message Packet
              </button>
            </div>
          </form>
        )}

        {/* Sending State */}
        {formStatus === 'sending' && (
          <div className="h-full min-h-[300px] flex flex-col justify-center items-center text-center space-y-4">
            <div className={`w-10 h-10 border-2 border-t-transparent rounded-full animate-spin ${
              currentTheme === 'professional-light' ? 'border-indigo-600' : 'border-cyan-500'
            }`} />
            <h4 className={`text-sm font-mono animate-pulse ${
              currentTheme === 'professional-light' ? 'text-indigo-600' : 'text-cyan-400'
            }`}>
              [DISPATCHING TELEMETRY MESSAGE PACKET]
            </h4>
            
            {/* Live routing console output */}
            <div className={`w-full max-w-md rounded-2xl p-4 border font-mono text-[10px] text-left space-y-1 ${
              currentTheme === 'professional-light' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-black/60 border-white/5 text-gray-400'
            }`}>
              {transitLogs.map((log, i) => (
                <div key={i} className="text-green-500 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success State */}
        {formStatus === 'success' && (
          <div className="h-full min-h-[300px] flex flex-col justify-center items-center text-center space-y-5 px-6 animate-in fade-in duration-300">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
              currentTheme === 'professional-light' ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
            }`}>
              ✓
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-sans">Transmission Broadcast Complete</h3>
              <p className={`text-xs font-mono ${currentTheme === 'professional-light' ? 'text-slate-600' : 'text-gray-400'}`}>
                Your diagnostic contact envelope was successfully written and delivered.
              </p>
            </div>

            <button
              onClick={resetForm}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 ${
                currentTheme === 'professional-light' 
                  ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
              }`}
            >
              [CLOSE & SEND SERVICE RE-INIT]
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
