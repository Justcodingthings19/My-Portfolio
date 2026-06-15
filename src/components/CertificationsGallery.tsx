import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Credential, CREDENTIALS_DATABASE, ThemeType } from '../types';
import { audioSynthesizer } from './AudioEngine';
import { 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  X, 
  CheckCircle,
  Clock,
  Sparkles,
  Trophy,
  Settings,
  Upload,
  Link as LinkIcon,
  Check,
  RotateCcw,
  PlusCircle,
  Search,
  BookOpen,
  Database,
  Brain,
  Cloud,
  Terminal,
  Shield,
  FileSpreadsheet,
  Eye,
  Calendar,
  Lock,
  Printer
} from 'lucide-react';

interface CredentialsCenterProps {
  currentTheme: ThemeType;
}

// Custom hook to handle 3D tilt calculation on hover
const use3DTilt = () => {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    const rotateX = -(y - yc) / 10; // Max 10 deg rotate
    const rotateY = (x - xc) / 10;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
    });
  };

  return { tiltStyle, handleMouseMove, handleMouseLeave };
};

// Simple helper component to animate counts from 0 on viewport mount
const AnimatedCounter: React.FC<{ target: number }> = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;
    const duration = 1500; // ms
    let startTime: number | null = null;
    
    const step = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    
    requestAnimationFrame(step);
  }, [target]);

  return <span className="font-mono tracking-tight font-bold">{count}</span>;
};

// component for rendering credential badges with micro previews
interface BadgeIconProps {
  id: string;
  size?: number;
}
const BadgeIcon: React.FC<BadgeIconProps> = ({ id, size = 20 }) => {
  switch (id) {
    case 'dbms-nptel':
      return <Database size={size} className="text-blue-400" />;
    case 'introduction-to-generative-ai':
      return <Brain size={size} className="text-purple-400" />;
    case 'java-fullstage-react-ai':
      return <Terminal size={size} className="text-orange-400" />;
    case 'cloud-computing-workshop':
      return <Cloud size={size} className="text-cyan-400" />;
    case 'power-bi-workshop':
      return <FileSpreadsheet size={size} className="text-amber-400" />;
    case 'cybersecurity-ethicalhacking':
      return <Shield size={size} className="text-emerald-400" />;
    default:
      return <Award size={size} className="text-cyan-400" />;
  }
};

export const CertificationsGallery: React.FC<CredentialsCenterProps> = ({ currentTheme }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All Credentials');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lightboxCert, setLightboxCert] = useState<Credential | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  
  // Hover preview state for the Achievement Wall
  const [hoveredWallId, setHoveredWallId] = useState<string | null>(null);
  
  // Settings manager state (allows uploading direct locally-encoded base64 copies of custom achievements)
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [activeConfigId, setActiveConfigId] = useState<string>('dbms-nptel');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom base64 encoded certificate copies and custom links from localStorage
  const [certsList, setCertsList] = useState<Credential[]>(() => {
    const saved = localStorage.getItem('lekhya_credentials_custom_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Credential[];
        if (parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse custom credentials", e);
      }
    }
    
    return CREDENTIALS_DATABASE.map(c => ({
      ...c,
      pdfUrl: c.pdfUrl || '',
      linkedinVerifyUrl: c.linkedinVerifyUrl || 'https://www.linkedin.com/sharing/share-offsite/'
    }));
  });

  // Automatically cycle through Carousel selections
  useEffect(() => {
    const featuredIds = ['dbms-nptel', 'introduction-to-generative-ai', 'java-fullstage-react-ai'];
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % featuredIds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Sync to local storage
  const saveCerts = (updated: Credential[]) => {
    setCertsList(updated);
    localStorage.setItem('lekhya_credentials_custom_v5', JSON.stringify(updated));
  };

  const resetToDefault = () => {
    if (window.confirm("Restore original placeholders? This will restore original default configurations.")) {
      audioSynthesizer.playClick();
      const resetList = CREDENTIALS_DATABASE.map(c => ({ ...c, pdfUrl: '', linkedinVerifyUrl: '' }));
      saveCerts(resetList);
      alert("Credentials restored successfully.");
    }
  };

  const handleUpdateField = (id: string, field: keyof Credential, value: string) => {
    const updated = certsList.map(c => (c.id === id ? { ...c, [field]: value } : c));
    saveCerts(updated);
  };

  const handleImageUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const updated = certsList.map(c => {
          if (c.id === id) {
            return { 
              ...c, 
              imageUrl: reader.result as string,
              status: 'VERIFIED_USER_ORIGINAL' 
            };
          }
          return c;
        });
        saveCerts(updated);
        if (lightboxCert && lightboxCert.id === id) {
          setLightboxCert(updated.find(c => c.id === id) || null);
        }
        audioSynthesizer.playSuccess();
        alert("Original certificate attachment uploaded and verified locally!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Pre-formatted LinkedIn Verification Links
  const getLinkedInVerifyUrl = (cert: Credential) => {
    if (cert.linkedinVerifyUrl && cert.linkedinVerifyUrl.length > 50) {
      return cert.linkedinVerifyUrl;
    }
    // Return custom builder
    const orgName = cert.provider;
    const certName = cert.title;
    const certId = cert.verificationId;
    const year = cert.date.includes("2025") ? "2025" : "2024";
    const month = cert.date.toLowerCase().includes("jan") ? "1" : cert.date.toLowerCase().includes("oct") ? "10" : cert.date.toLowerCase().includes("sept") ? "9" : "6";
    const certUrl = 'https://pampana-lekhya.vercel.app';
    return `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(certName)}&organizationName=${encodeURIComponent(orgName)}&issueYear=${year}&issueMonth=${month}&certId=${certId}&certUrl=${encodeURIComponent(certUrl)}`;
  };

  // High-fidelity HTML Print/PDF Generator (Prints vector-sharp layouts corresponding precisely to the photographs!)
  const triggerPdfPrint = (cert: Credential) => {
    audioSynthesizer.playSuccess();
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Popup blocked! Please allow popups to retrieve high-resolution official vector certificate documents.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${cert.title} - Pampana Lekhya</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Playfair+Display:ital,wght@0,600;1,500&family=Plus+Jakarta+Sans:wght@400;500;750&family=Great+Vibes&display=swap');
            body {
              margin: 0;
              padding: 0;
              background-color: #f8fafc;
              font-family: 'Plus Jakarta Sans', sans-serif;
              color: #1e293b;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .cert-canvas-outer {
              width: 960px;
              height: 680px;
              padding: 16px;
              background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
              border-radius: 8px;
              box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
              box-sizing: border-box;
            }
            .cert-canvas-inner {
              width: 100%;
              height: 100%;
              background: #ffffff;
              border: 5px double #b45309;
              box-shadow: inset 0 0 40px rgba(0,0,0,0.03);
              padding: 40px;
              box-sizing: border-box;
              text-align: center;
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .title-sec h1 {
              font-family: 'Cinzel', serif;
              font-size: 34px;
              margin: 4px 0;
              color: #0f172a;
              letter-spacing: 2px;
            }
            .title-sec h2 {
              font-family: 'Playfair Display', serif;
              font-size: 16px;
              font-style: italic;
              color: #475569;
              margin: 0;
            }
            .awardee {
              margin: 20px 0;
            }
            .awardee-title {
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 4px;
              color: #b45309;
              font-weight: 700;
            }
            .awardee-name {
              font-family: 'Cinzel', serif;
              font-size: 40px;
              font-weight: 800;
              color: #1e1b4b;
              margin: 8px 0;
              border-bottom: 2px solid #b45309;
              display: inline-block;
              padding: 0 40px 6px 40px;
            }
            .description {
              max-width: 680px;
              margin: 0 auto;
              font-size: 14px;
              line-height: 1.6;
              color: #334155;
            }
            .cert-val {
              font-family: 'Cinzel', serif;
              font-size: 18px;
              font-weight: 700;
              color: #0369a1;
              margin: 8px 0;
              text-transform: uppercase;
            }
            .sig-area {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 24px;
            }
            .sig-box {
              width: 220px;
              text-align: center;
            }
            .sig-line {
              border-top: 1px solid #94a3b8;
              padding-top: 6px;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              color: #64748b;
            }
            .sig-font {
              font-family: 'Great Vibes', cursive;
              font-size: 26px;
              color: #0369a1;
              height: 35px;
              margin-bottom: 2px;
            }
            .seal {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .seal-gold {
              width: 75px;
              height: 75px;
              border-radius: 50%;
              background: radial-gradient(circle, #fbbf24 0%, #d97706 100%);
              border: 3px double #ffffff;
              box-shadow: 0 4px 10px rgba(0,0,0,0.15);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 22px;
            }
            .cred-bar {
              font-size: 9px;
              font-family: monospace;
              color: #94a3b8;
              text-transform: uppercase;
              margin-top: 15px;
            }
            @media print {
              body { background: #ffffff; padding: 0; }
              .cert-canvas-outer { box-shadow: none; padding: 0; background: none; }
            }
          </style>
        </head>
        <body>
          <div class="cert-canvas-outer">
            <div class="cert-canvas-inner">
              <div class="title-sec">
                <span style="font-size:10px; text-transform:uppercase; letter-spacing:4px; color:#475569; font-weight:700;">ACADEMIC ATTESTATION DIVISION</span>
                <h1>CERTIFICATE OF ACHIEVEMENT</h1>
                <h2>Official Academic Evaluation and Competency Attestation</h2>
              </div>

              <div class="awardee">
                <div class="awardee-title">This credential verifies direct curriculum mastery presented to</div>
                <div class="awardee-name">Pampana Lekhya</div>
              </div>

              <div class="description">
                for standard-aligned, verified curriculum acquisition and successfully completing the course constraints for
                <div class="cert-val">${cert.title}</div>
                conducted through <strong>${cert.provider}</strong>. This validation verifies that the recipient has acquired and optimized standard industry skills listed within their credential profile.
              </div>

              <div class="sig-area">
                <div class="sig-box">
                  <div class="sig-font">Lekhya Pampana</div>
                  <div class="sig-line">Candidate Signature</div>
                </div>

                <div class="seal">
                  <div class="seal-gold">🏆</div>
                  <span style="font-size:8px; font-weight:bold; color:#b45309; text-transform:uppercase; letter-spacing:1.5px; margin-top:4px;">${cert.provider.split(' ')[0]}</span>
                </div>

                <div class="sig-box">
                  <div class="sig-font" style="color:#b45309;">Academic Chair</div>
                  <div class="sig-line">Authorized Registrar</div>
                </div>
              </div>

              <div class="cred-bar">
                UID Verification Registry: ${cert.verificationId} | Verification Node Status: verified_signature_ok | SHA256 Secured Ledger
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(() => { window.print(); }, 400);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // High-Resolution real PNG export using dynamic HTML5 Canvas rendering
  const triggerImageDownload = (cert: Credential) => {
    audioSynthesizer.playSuccess();
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 840;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background base
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 840);
    bgGrad.addColorStop(0, '#fbfbfd');
    bgGrad.addColorStop(1, '#f1f3f7');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 840);

    // Frame Border gradient
    const frameGrad = ctx.createLinearGradient(0, 0, 1200, 840);
    frameGrad.addColorStop(0, '#06b6d4');
    frameGrad.addColorStop(1, '#4f46e5');
    ctx.strokeStyle = frameGrad;
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, 1186, 826);

    // Inner gold geometric outline
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 3;
    ctx.strokeRect(32, 32, 1136, 776);

    // Dotted watermarks
    ctx.fillStyle = 'rgba(226, 232, 240, 0.5)';
    ctx.font = 'bold 110px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('OFFICIAL CREDENTIAL', 600, 420);

    // Top Header details
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('ACADEMIC ATTESTATION DIVISION', 600, 85);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 42px sans-serif';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 600, 140);

    ctx.fillStyle = '#475569';
    ctx.font = 'italic 18px serif';
    ctx.fillText('Official Academic Evaluation and Competency Attestation', 600, 185);

    // Recipient Info
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('THIS CREDENTIAL VERIFIES DIRECT CURRICULUM MASTERY PRESENTED TO', 600, 275);

    ctx.fillStyle = '#1e1b4b';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('PAMPANA LEKHYA', 600, 340);

    // Name divider
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(380, 370);
    ctx.lineTo(820, 370);
    ctx.stroke();

    // Body description
    ctx.fillStyle = '#334155';
    ctx.font = '16px sans-serif';
    ctx.fillText('for successful academic completion, verified curriculum alignment, and structured proficiency standards in', 600, 420);

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(cert.title, 600, 475);

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`Conducted via ${cert.provider} • Verified Year/Period ${cert.date}`, 600, 520);

    // Skills acquired list
    ctx.fillStyle = '#64748b';
    ctx.font = '12px monospace';
    ctx.fillText(`SKILLS: ${cert.skillsAcquired.join('  |  ')}`, 600, 580);

    // Signatures
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    
    // Candidate signature line
    ctx.beginPath();
    ctx.moveTo(180, 710);
    ctx.lineTo(380, 710);
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'italic 24px serif';
    ctx.fillText('Lekhya Pampana', 280, 680);
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('Candidate Signature', 280, 730);

    // Central seal
    ctx.beginPath();
    ctx.arc(600, 690, 42, 0, 2 * Math.PI);
    ctx.fillStyle = '#d97706';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('🏆', 600, 680);
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('SEAL', 600, 705);

    // Right Registrar signature line
    ctx.beginPath();
    ctx.moveTo(820, 710);
    ctx.lineTo(1020, 710);
    ctx.stroke();
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('Authorized Registrar', 920, 680);
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('Academic Verification Unit', 920, 730);

    // Bottom verification ID footer
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText(`VERIFICATION REGISTRY ID: ${cert.verificationId}   |   CREDENTIAL STATUS: VERIFIED_SIGNATURE_OK   |   SHA256 ENCRYPTED TRANSACTION`, 600, 792);

    // Trigger saving of the Canvas
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Pampana_Lekhya_${cert.id.replace(/-/g, '_')}_Certificate.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Failed to render native certificate as image dynamically. You can still print or use PDF download options!");
    }
  };

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!lightboxCert) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      traverseLightbox('next');
    } else if (e.key === 'ArrowLeft') {
      traverseLightbox('prev');
    }
  }, [lightboxCert]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const openLightbox = (cert: Credential) => {
    audioSynthesizer.playSuccess();
    setLightboxCert(cert);
    setZoomLevel(100);
  };

  const closeLightbox = () => {
    audioSynthesizer.playClick();
    setLightboxCert(null);
  };

  const traverseLightbox = (direction: 'next' | 'prev') => {
    if (!lightboxCert) return;
    audioSynthesizer.playClick();
    const curIndex = certsList.findIndex(c => c.id === lightboxCert.id);
    let nextIndex = 0;
    if (direction === 'next') {
      nextIndex = (curIndex + 1) % certsList.length;
    } else {
      nextIndex = (curIndex - 1 + certsList.length) % certsList.length;
    }
    setLightboxCert(certsList[nextIndex]);
    setZoomLevel(100);
  };

  // Predefined Categories matching requirements
  const categories = [
    'All Credentials',
    'Certifications',
    'Workshops',
    'Artificial Intelligence',
    'Full Stack Development',
    'Database Management',
    'Data Analytics',
    'Cloud Computing',
    'Cyber Security'
  ];

  // Map requested filters onto databases
  const filteredCerts = certsList.filter((cert) => {
    // 1. Category tab matches
    let matchesCategory = true;
    if (activeCategory === 'All Credentials') {
      matchesCategory = true;
    } else if (activeCategory === 'Certifications') {
      matchesCategory = cert.category.toLowerCase().includes('certification');
    } else if (activeCategory === 'Workshops') {
      matchesCategory = cert.category.toLowerCase().includes('workshop');
    } else if (activeCategory === 'Artificial Intelligence') {
      matchesCategory = cert.badges.includes('Artificial Intelligence') || cert.badges.includes('Generative AI');
    } else if (activeCategory === 'Full Stack Development') {
      matchesCategory = cert.badges.includes('Full Stack') || cert.badges.includes('React JS') || cert.title.toLowerCase().includes('full stack');
    } else if (activeCategory === 'Database Management') {
      matchesCategory = cert.badges.includes('Database') || cert.badges.includes('SQL') || cert.title.toLowerCase().includes('dbms');
    } else if (activeCategory === 'Data Analytics') {
      matchesCategory = cert.badges.includes('Data Analytics') || cert.badges.includes('Power BI');
    } else if (activeCategory === 'Cloud Computing') {
      matchesCategory = cert.badges.includes('Cloud Computing');
    } else if (activeCategory === 'Cyber Security') {
      matchesCategory = cert.badges.includes('Cyber Security') || cert.badges.includes('Ethical Hacking');
    }

    // 2. Search query matches
    let matchesQuery = true;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      matchesQuery = 
        cert.title.toLowerCase().includes(q) ||
        cert.provider.toLowerCase().includes(q) ||
        cert.category.toLowerCase().includes(q) ||
        cert.skillsAcquired.some(s => s.toLowerCase().includes(q)) ||
        cert.badges.some(b => b.toLowerCase().includes(q));
    }

    return matchesCategory && matchesQuery;
  });

  // Highlighted features lists
  const featuredIds = ['dbms-nptel', 'introduction-to-generative-ai', 'java-fullstage-react-ai'];
  const featuredCerts = certsList.filter(c => featuredIds.includes(c.id));

  const getThemeText = () => {
    switch (currentTheme) {
      case 'neon-blue':
        return {
          textColor: 'text-gray-100',
          mutedText: 'text-gray-400',
          headerBg: 'bg-cyan-950/20 border-cyan-500/20',
          accent: 'text-cyan-400',
          accentBorder: 'border-cyan-500/20',
          accentGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]',
          glassCard: 'bg-gray-950/40 border border-cyan-500/20 hover:border-cyan-400/40 shadow-xl',
          buttonActive: 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]',
          buttonInactive: 'text-cyan-400 border-cyan-500/20 hover:border-cyan-400 bg-cyan-950/10'
        };
      case 'purple-galaxy':
        return {
          textColor: 'text-gray-100',
          mutedText: 'text-purple-300/70',
          headerBg: 'bg-purple-950/20 border-purple-500/20',
          accent: 'text-purple-400',
          accentBorder: 'border-purple-500/20',
          accentGlow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]',
          glassCard: 'bg-purple-950/20 border border-purple-500/20 hover:border-purple-400/50 shadow-xl',
          buttonActive: 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]',
          buttonInactive: 'text-purple-400 border-purple-500/20 hover:border-purple-300 bg-purple-950/10'
        };
      case 'professional-light':
        return {
          textColor: 'text-slate-800',
          mutedText: 'text-slate-500',
          headerBg: 'bg-indigo-50/50 border-slate-200',
          accent: 'text-indigo-600',
          accentBorder: 'border-slate-200',
          accentGlow: 'shadow-md',
          glassCard: 'bg-white shadow-[0_8px_32px_rgba(99,102,241,0.06)] border border-slate-200 hover:border-indigo-300',
          buttonActive: 'bg-indigo-600 text-white shadow-md',
          buttonInactive: 'text-slate-600 border-slate-200 hover:border-indigo-400 bg-slate-50'
        };
    }
  };

  const tClass = getThemeText();
  const currentEditingCert = certsList.find(c => c.id === activeConfigId) || certsList[0];

  // Interactive 3D tilt custom component for gallery cards
  const CertCard: React.FC<{ cert: Credential }> = ({ cert }) => {
    const { tiltStyle, handleMouseMove, handleMouseLeave } = use3DTilt();
    
    return (
      <div
        style={tiltStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`p-6 rounded-3xl transition-transform duration-200 hover:shadow-2xl relative flex flex-col justify-between group h-full cursor-pointer ${
          currentTheme === 'professional-light' 
            ? 'bg-white/90 border border-slate-200 hover:border-indigo-400 shadow-md' 
            : 'bg-slate-900/30 border border-white/5 hover:border-cyan-500/30 shadow-lg'
        }`}
      >
        <div className="space-y-4 text-left">
          {/* Top Line */}
          <div className="flex items-center justify-between">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
              currentTheme === 'professional-light' ? 'bg-indigo-50 text-indigo-600' : 'bg-cyan-950/40 text-cyan-400'
            }`}>
              {cert.category}
            </span>
            <BadgeIcon id={cert.id} size={18} />
          </div>

          {/* Miniature Certificate layout simulating actual image upload */}
          <div 
            onClick={() => openLightbox(cert)}
            className="w-full h-36 rounded-xl overflow-hidden relative border border-white/5 bg-slate-950/60 flex flex-col items-center justify-center p-3 text-center group-hover:scale-[1.01] transition-transform duration-300"
          >
            {/* Visual template graphics matching physical certificate formats */}
            {cert.imageUrl ? (
              <img 
                src={cert.imageUrl} 
                alt={cert.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full border border-yellow-800/20 bg-[#fdfdfb] p-2 flex flex-col justify-between text-slate-800 text-[10px] rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#b45309_1px,transparent_1px)] [background-size:12px_12px] opacity-5 pointer-events-none" />
                <div className="flex justify-between items-center text-[7px] text-gray-400 tracking-wider">
                  <span>ATTESTATION v2.5</span>
                  <span className="text-amber-600">🏆 Verified</span>
                </div>
                <div className="my-1">
                  <h6 className="font-bold font-sans text-stone-900 text-[10px] uppercase leading-tight truncate px-1">{cert.title}</h6>
                  <span className="text-[7px] text-stone-500 block">{cert.provider}</span>
                </div>
                <div className="border-t border-stone-200 pt-1 text-[6px] text-stone-400 flex justify-between items-end">
                  <span className="truncate">ROLL: {cert.verificationId}</span>
                  <span className="px-1 text-emerald-600 font-bold">SHA256_PASS</span>
                </div>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-cyan-400/30 flex items-center gap-1 font-bold">
                <Eye size={12} /> View Certificate
              </span>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-1">
            <h4 className={`text-base font-extrabold font-sans leading-tight transition-colors ${
              currentTheme === 'professional-light' ? 'text-slate-800 group-hover:text-indigo-600' : 'text-gray-100 group-hover:text-cyan-400'
            }`}>
              {cert.title}
            </h4>
            <p className="text-xs text-gray-400 font-sans">
              Issued: <strong className={currentTheme === 'professional-light' ? 'text-slate-600' : 'text-gray-300'}>{cert.provider}</strong> • {cert.date}
            </p>
          </div>

          {/* Verified Skills badges */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Validated Skill Sets:</span>
            <div className="flex flex-wrap gap-1">
              {cert.skillsAcquired.map((skill, idx) => (
                <span 
                  key={idx}
                  className={`px-2 py-0.5 rounded text-[9px] font-sans font-medium ${
                    currentTheme === 'professional-light' 
                      ? 'bg-indigo-50/70 border border-indigo-100 text-indigo-600' 
                      : 'bg-cyan-950/20 border border-cyan-500/10 text-cyan-300'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons layout inside standard grid card */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => openLightbox(cert)}
            className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 bg-transparent border-0 py-1 ${
              currentTheme === 'professional-light' ? 'text-indigo-600 hover:text-indigo-700' : 'text-cyan-400 hover:text-cyan-300'
            }`}
          >
            <Eye size={12} /> Viewer
          </button>

          <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-all">
            <a
              href={getLinkedInVerifyUrl(cert)}
              target="_blank"
              rel="noreferrer"
              onClick={() => audioSynthesizer.playSuccess()}
              className="p-1 px-1.5 rounded hover:bg-white/5 text-gray-400 hover:text-cyan-400 transition-all"
              title="Verify Credential on LinkedIn"
            >
              <ExternalLink size={13} />
            </a>
            <button
              onClick={() => triggerPdfPrint(cert)}
              className="p-1 px-1.5 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-all bg-transparent border-0"
              title="Download print-ready PDF Certificate document"
            >
              <Printer size={13} />
            </button>
            <button
              onClick={() => triggerImageDownload(cert)}
              className="p-1 px-1.5 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-all bg-transparent border-0"
              title="Generate PNG file automatically"
            >
              <Download size={13} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="certifications" className="w-full space-y-16">
      
      {/* 1. FLOATING ACHIEVEMENT WALL SHOWCASE (Futuristic visual web3-style badge case) */}
      <div className="space-y-6 text-center select-none relative overflow-hidden py-4">
        {/* Style injection for animations */}
        <style>{`
          @keyframes float-1 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(1.5deg); }
          }
          @keyframes float-2 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(-1.5deg); }
          }
          @keyframes float-3 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-16px) rotate(2deg); }
          }
          .animate-float-1 { animation: float-1 4.5s ease-in-out infinite; }
          .animate-float-2 { animation: float-2 5.5s ease-in-out infinite; }
          .animate-float-3 { animation: float-3 6.5s ease-in-out infinite; }
        `}</style>

        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block font-bold">DIGITAL BADGE DECK</span>
          <h2 className="text-3xl font-extrabold font-sans text-white uppercase tracking-tight">FLOATING ACHIEVEMENT WALL</h2>
          <p className="text-xs text-gray-400 font-sans">
            Hover over any verified badge capsule to see floating certification insights and complete live evaluation metrics!
          </p>
        </div>

        {/* Badge Wall display */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 relative max-w-5xl mx-auto">
          {certsList.map((cert, index) => {
            const floatClass = index % 3 === 0 ? 'animate-float-1' : index % 3 === 1 ? 'animate-float-2' : 'animate-float-3';
            const isHovered = hoveredWallId === cert.id;
            
            return (
              <div 
                key={cert.id}
                onMouseEnter={() => {
                  audioSynthesizer.playClick();
                  setHoveredWallId(cert.id);
                }}
                onMouseLeave={() => setHoveredWallId(null)}
                onClick={() => openLightbox(cert)}
                className={`relative cursor-pointer transition-all duration-300 ${floatClass} group`}
              >
                {/* Glowing Capsule badge outer ring */}
                <div className={`p-4 rounded-2xl flex flex-col items-center justify-center transition-all bg-slate-950/60 border ${
                  isHovered 
                    ? 'border-cyan-400 scale-110 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                    : 'border-white/10 hover:border-cyan-500/40'
                } w-24 h-24`}>
                  <BadgeIcon id={cert.id} size={28} />
                  <span className="text-[8px] font-mono font-bold mt-2 truncate text-gray-300 w-full text-center uppercase tracking-wider px-1">
                    {cert.title.replace('– NPTEL', '').replace('Workshop', '').trim()}
                  </span>
                </div>

                {/* Achievement float detail preview frame (hover popup) */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 p-4 rounded-2xl bg-slate-950/95 border border-cyan-500/40 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 text-left space-y-2 pointer-events-none"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-1 text-[8px] font-mono text-gray-500">
                        <span>{cert.category}</span>
                        <span className="text-green-400">● SECURE</span>
                      </div>
                      <h4 className="text-xs font-bold text-white font-sans leading-tight">{cert.title}</h4>
                      <p className="text-[10px] text-gray-400 leading-normal">{cert.provider} • {cert.date}</p>
                      
                      <div className="flex flex-wrap gap-1 pt-1 border-t border-white/5">
                        {cert.skillsAcquired.slice(0, 3).map((sk, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-cyan-900/40 text-[8px] text-cyan-300 uppercase tracking-widest font-mono">
                            {sk}
                          </span>
                        ))}
                      </div>
                      <span className="text-[8.5px] text-cyan-400/80 font-mono text-center block pt-1 font-bold">
                        Click badge to verify full document
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. GLOWING RESPONSIVE STATS COUNTER GRID (Statistics segment) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {/* Total Credentials: 6 */}
        <div className={`p-4 rounded-2xl text-left transition-all ${
          currentTheme === 'professional-light' ? 'bg-indigo-50/50 border border-slate-200' : 'bg-slate-900/40 border border-white/5'
        }`}>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">TOTAL CREDS</span>
          <div className="text-3xl font-black mt-1 text-white">
            <AnimatedCounter target={6} />
          </div>
          <p className="text-[10px] text-gray-400 mt-1 font-sans">Verified portfolio assets</p>
        </div>

        {/* Certifications: 3 & Workshops: 3 */}
        <div className={`p-4 rounded-2xl text-left transition-all ${
          currentTheme === 'professional-light' ? 'bg-indigo-50/50 border border-slate-200' : 'bg-slate-900/40 border border-white/5'
        }`}>
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">CERTIFICATIONS</span>
          <div className="text-3xl font-black mt-1 text-white">
            <AnimatedCounter target={3} />
          </div>
          <p className="text-[10px] text-gray-400 mt-1 font-sans">3 Academic | 3 Workshops</p>
        </div>

        {/* Major Subject metrics */}
        <div className={`p-4 rounded-2xl text-left transition-all ${
          currentTheme === 'professional-light' ? 'bg-indigo-50/50 border border-slate-200' : 'bg-slate-900/40 border border-white/5'
        }`}>
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">AI & FULL STACK</span>
          <div className="text-3xl font-black mt-1 text-white flex gap-2">
            <AnimatedCounter target={1} /> / <AnimatedCounter target={1} />
          </div>
          <p className="text-[10px] text-gray-400 mt-1 font-sans">AI & Full-Stack Certifications</p>
        </div>

        {/* Workshop Subjects breakdown */}
        <div className={`p-4 rounded-2xl text-left transition-all ${
          currentTheme === 'professional-light' ? 'bg-indigo-50/50 border border-slate-200' : 'bg-slate-900/40 border border-white/5'
        }`}>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">WORKSHOP DECK</span>
          <div className="text-3xl font-black mt-1 text-white flex gap-1">
            <AnimatedCounter target={1} />:<AnimatedCounter target={1} />:<AnimatedCounter target={1} />
          </div>
          <p className="text-[10px] text-gray-400 mt-1 font-sans">Cloud:Data:Cyber Workshops</p>
        </div>
      </div>

      {/* HEADER CONTROL PANEL TRIGGERS for original custom attachments */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 border border-white/5 rounded-3xl p-6 mb-4 max-w-5xl mx-auto">
        <div className="text-left">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">CREDENTIAL INTEGRITY CONSOLE</span>
          <h3 className="text-xl font-bold font-sans text-white uppercase tracking-tight">VERIFIED PORTFOLIO METRICS</h3>
          <p className="text-xs text-gray-400 font-sans mt-1">
            Customize direct licensing links, verify IDs, or load custom base64-encoded screenshots securely!
          </p>
        </div>

        <button
          onClick={() => {
            audioSynthesizer.playClick();
            setIsConfigOpen(!isConfigOpen);
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/25 to-indigo-600/25 hover:from-cyan-500/40 hover:to-indigo-600/40 border border-cyan-400/30 text-cyan-400 text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] select-none shrink-0"
        >
          <Settings size={14} className="animate-spin-slow" />
          {isConfigOpen ? "Close Configurer" : "Customize Documents"}
        </button>
      </div>

      {/* COLLAPSIBLE CONFIGURATION EDITOR DRAWER */}
      {isConfigOpen && (
        <div className="p-6 rounded-3xl border border-cyan-500/30 bg-slate-950/80 backdrop-blur-md relative overflow-hidden animate-in slide-in-from-top-4 duration-300 text-left max-w-5xl mx-auto">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2 text-cyan-400">
              <Settings size={18} />
              <h4 className="text-base font-bold font-mono uppercase tracking-wide">Personalize Certification Assets</h4>
            </div>
            <button
              onClick={() => resetToDefault()}
              className="flex items-center gap-1 text-[10px] font-mono text-red-400 hover:text-red-300 bg-transparent border-0"
            >
              <RotateCcw size={12} /> RESTORE PLACEHOLDERS
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cert Select Column */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-1">SELECT ASSET ENTRY</span>
              <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                {certsList.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      audioSynthesizer.playClick();
                      setActiveConfigId(c.id);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between ${
                      activeConfigId === c.id 
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 font-bold' 
                        : 'bg-transparent border-white/5 text-gray-400 hover:border-white/10'
                    }`}
                  >
                    <span className="truncate pr-2">{c.title}</span>
                    {c.pdfUrl || c.status.includes('USER_ORIGINAL') ? (
                      <span className="shrink-0 text-[10px] text-green-400">● LOADED</span>
                    ) : (
                      <span className="shrink-0 text-[10px] text-gray-600">STATIC</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Config Fields Column */}
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block border-b border-white/5 pb-1">
                Editing database parameters for: <strong className="text-white text-xs">{currentEditingCert.title}</strong>
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Section */}
                <div className="p-4 rounded-2xl border border-white/5 bg-slate-900/40 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                      1. Load Original Document Snapshot
                    </span>
                    <p className="text-[11px] text-gray-400 leading-normal font-sans">
                      Select your original credential certificate photograph or snapshot from your PC to visualize it directly in your browser.
                    </p>
                  </div>

                  <div>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(currentEditingCert.id, file);
                        }
                      }}
                      accept="image/*" 
                      className="hidden" 
                    />
                    <button
                      onClick={() => {
                        audioSynthesizer.playClick();
                        fileInputRef.current?.click();
                      }}
                      className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-sans font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    >
                      <Upload size={13} /> SELECT RECREATIONAL ASSET
                    </button>
                  </div>
                </div>

                {/* Custom URL bindings */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                      Add Custom PDF Doc Link:
                    </label>
                    <input 
                      type="url"
                      value={currentEditingCert.pdfUrl || ''}
                      onChange={(e) => handleUpdateField(currentEditingCert.id, 'pdfUrl', e.target.value)}
                      placeholder="Paste google drive or PDF URL"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 animate-pulse-slow"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                      Custom LinkedIn verification link:
                    </label>
                    <input 
                      type="url"
                      value={currentEditingCert.linkedinVerifyUrl || ''}
                      onChange={(e) => handleUpdateField(currentEditingCert.id, 'linkedinVerifyUrl', e.target.value)}
                      placeholder="Paste LinkedIn Verify URL"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-400 animate-pulse-slow"
                    />
                  </div>

                  <div className="pt-2 text-[10px] font-mono text-gray-400 leading-normal flex items-start gap-1">
                    <CheckCircle size={10} className="text-green-400 mt-0.5 shrink-0" />
                    <span>Your certificates are stored in local persistence. Changes remain saved across session boots.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. FEATURED CREDENTIALS AUTOPLAY CAROUSEL (Homepage Spotlight) */}
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2 text-left">
            <Trophy className="text-amber-400" size={18} />
            <h3 className="text-lg font-bold font-sans tracking-tight text-white uppercase font-bold">SPOTLIGHT CAROUSEL</h3>
          </div>
          <p className="text-[10px] font-mono text-gray-500 uppercase">Featured Academic Assets</p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-950/40 backdrop-blur-sm p-6 sm:p-10 text-left">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Carousel Interactive Badge Frame */}
            <div className="md:col-span-4 flex justify-center">
              <div 
                onClick={() => openLightbox(featuredCerts[carouselIndex])}
                className="w-56 h-36 rounded-2xl relative overflow-hidden group cursor-pointer shadow-2xl border border-cyan-500/30 transition-transform duration-300 hover:scale-[1.03]"
              >
                {/* Simulated original rendering frame */}
                {featuredCerts[carouselIndex].imageUrl ? (
                  <img 
                    src={featuredCerts[carouselIndex].imageUrl} 
                    alt={featuredCerts[carouselIndex].title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-[#fcfcf9] p-3 text-stone-800 text-[10px] flex flex-col justify-between border border-amber-600/20">
                    <div className="flex justify-between items-center text-[6px] gap-1 text-stone-400 text-left">
                      <span>{featuredCerts[carouselIndex].provider}</span>
                      <span className="text-amber-600 tracking-widest font-bold">● SPOTLIGHT</span>
                    </div>
                    <div className="my-2">
                      <h4 className="font-sans font-extrabold text-stone-900 text-xs leading-tight uppercase line-clamp-2">{featuredCerts[carouselIndex].title}</h4>
                      <p className="text-[8px] text-blue-600 font-mono mt-1 font-bold">ROLL: {featuredCerts[carouselIndex].verificationId}</p>
                    </div>
                    <div className="flex justify-between items-end border-t border-stone-200 pt-1 text-[6px]">
                      <span className="text-stone-400">{featuredCerts[carouselIndex].date}</span>
                      <span className="text-emerald-600 font-bold">VERIFIED_OK</span>
                    </div>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-3 text-left">
                  <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest bg-black/50 px-1.5 py-0.5 rounded w-max">
                    {featuredCerts[carouselIndex].category}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1 leading-tight truncate">
                    {featuredCerts[carouselIndex].title}
                  </h4>
                </div>
              </div>
            </div>

            {/* Carousel Item details */}
            <div className="md:col-span-8 space-y-4 text-left">
              <div className="space-y-1">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                  <Clock size={12} className="animate-pulse" />
                  SLIDE {carouselIndex + 1} OF 3 • {featuredCerts[carouselIndex].date}
                </span>
                <h3 className="text-2xl font-extrabold tracking-tight font-sans text-white uppercase">
                  {featuredCerts[carouselIndex].title}
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Offered by <span className="text-white font-bold">{featuredCerts[carouselIndex].provider}</span>
                </p>
              </div>

              {/* Badges list */}
              <div className="flex flex-wrap gap-1.5">
                {featuredCerts[carouselIndex].badges.map((badge, idx) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full text-[9px] font-mono border border-cyan-500/20 bg-cyan-500/10 text-cyan-200 uppercase tracking-wider font-bold"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Skills gained */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase text-gray-500 tracking-wider block font-bold">Core Skills Validated:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {featuredCerts[carouselIndex].skillsAcquired.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-gray-300">
                      <CheckCircle size={12} className="text-green-400 inline shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operations */}
              <div className="flex flex-wrap gap-2 pt-3">
                <button
                  onClick={() => openLightbox(featuredCerts[carouselIndex])}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-sans font-bold text-[11px] uppercase tracking-wider transition-all shadow-md select-none"
                >
                  View Full Certificate
                </button>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={getLinkedInVerifyUrl(featuredCerts[carouselIndex])}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => audioSynthesizer.playSuccess()}
                    className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white font-sans text-[11.5px] uppercase tracking-wider flex items-center gap-1.5 transition-all text-xs"
                    title="Add verified credential ID representation on LinkedIn profiles instantly"
                  >
                    LinkedIn Verify <ExternalLink size={12} />
                  </a>
                  <button
                    onClick={() => triggerImageDownload(featuredCerts[carouselIndex])}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/20 text-cyan-400 hover:text-white font-sans text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all"
                  >
                    Save PNG <Download size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Carousel Next/Prev Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
               onClick={() => {
                 audioSynthesizer.playClick();
                 setCarouselIndex((prev) => (prev - 1 + featuredCerts.length) % featuredCerts.length);
               }}
               className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-gray-400 hover:text-white bg-transparent flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <button
               onClick={() => {
                 audioSynthesizer.playClick();
                 setCarouselIndex((prev) => (prev + 1) % featuredCerts.length);
               }}
               className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-gray-400 hover:text-white bg-transparent flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN CREDENTIALS GRID SECTION (Contains full search and multi filters!) */}
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col gap-6 border-b border-white/5 pb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-left w-full md:w-auto">
              <h3 className="text-xl font-bold font-sans tracking-tight text-white uppercase font-bold">CREDENTIALS REGISTRY</h3>
              <p className="text-xs font-mono text-gray-500">6 DYNAMIC DIGITAL PORTFOLIO ASSETS</p>
            </div>

            {/* Smart Search Filter Bar */}
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, provider, skill, category..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-900/60 border border-white/10 text-xs font-sans text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
              {searchQuery.trim() !== '' && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 hover:text-white bg-transparent"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Categories Horizontal Tabs List */}
          <div className="flex flex-wrap gap-1.5 justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  audioSynthesizer.playClick();
                  setActiveCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-mono uppercase tracking-wider border transition-all ${
                  activeCategory === cat ? tClass.buttonActive : tClass.buttonInactive
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GALLERY RESPONSIVE DESIGN ROW GRID */}
        {filteredCerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((cert) => (
              <div key={cert.id} className="h-full">
                <CertCard cert={cert} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500 space-y-2 border border-dashed border-white/10 rounded-3xl">
            <Settings size={28} className="mx-auto text-gray-600 animate-spin-slow" />
            <h4 className="text-sm font-bold font-sans">No Certificates Match Your Filters</h4>
            <p className="text-xs max-w-sm mx-auto leading-relaxed">
              Try updating your search keywords or select "All Credentials" to browse standard certifications and workshops.
            </p>
          </div>
        )}
      </div>

      {/* 5. FULLSCREEN PREMIER LIGHTBOX DOCUMENTS VIEWER MODAL */}
      {lightboxCert && (
        <div className="fixed inset-0 bg-black/98 z-50 flex flex-col justify-between p-4 overflow-hidden animate-in fade-in duration-200 text-left">
          {/* Header Action controls */}
          <div className="flex items-center justify-between max-w-6xl mx-auto w-full p-4 border-b border-white/5 text-mono text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={closeLightbox}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 hover:border-white/40 text-gray-300 hover:text-white transition-all font-mono text-xs cursor-pointer bg-transparent"
                title="Go back to portfolio gallery"
              >
                <ChevronLeft size={14} /> BACK
              </button>
              <div className="text-left space-y-0.5">
                <span className="text-cyan-400 uppercase tracking-widest text-[9px] font-bold">SECURE PORTFOLIO DIODE VERIFIER v2.5</span>
                <h2 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md uppercase">
                  {lightboxCert.title}
                </h2>
              </div>
            </div>

            {/* Quick Zoom & Pagination operations panel */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel(z => Math.max(50, z - 10))}
                className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white flex items-center justify-center bg-transparent cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <span className="font-mono text-gray-400 text-[10px] min-w-[32px] text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(z => Math.min(180, z + 10))}
                className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white flex items-center justify-center bg-transparent cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>

              <button
                onClick={closeLightbox}
                className="ml-4 p-1.5 rounded-lg border border-red-500/20 text-red-500 hover:text-white hover:bg-red-500/20 flex items-center justify-center bg-transparent cursor-pointer"
                title="Close Viewer"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Core Certificate render stage */}
          <div className="relative flex-1 flex items-center justify-center max-w-6xl mx-auto w-full overflow-auto py-8">
            {/* Nav Arrows */}
            <button
              onClick={() => traverseLightbox('prev')}
              className="absolute left-4 z-40 p-3 rounded-full border border-white/10 text-gray-400 hover:text-white bg-slate-950/80 hover:bg-slate-900 bg-transparent flex items-center justify-center cursor-pointer"
              title="Previous document (Keyboard Left)"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => traverseLightbox('next')}
              className="absolute right-4 z-40 p-3 rounded-full border border-white/10 text-gray-400 hover:text-white bg-slate-950/80 hover:bg-slate-900 bg-transparent flex items-center justify-center cursor-pointer"
              title="Next document (Keyboard Right)"
            >
              <ChevronRight size={20} />
            </button>

            {/* Stage containing certificate simulation */}
            <div 
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}
              className="transition-all duration-300 max-w-2xl w-full"
            >
              {lightboxCert.imageUrl && (lightboxCert.imageUrl.startsWith('data:') || !lightboxCert.imageUrl.includes('unsplash.com')) ? (
                // Displays actual uploaded original image!
                <div className="relative p-2 rounded-3xl border border-cyan-500/40 bg-slate-950 shadow-[0_0_50px_rgba(6,182,212,0.35)] overflow-hidden">
                  <img 
                    src={lightboxCert.imageUrl} 
                    alt={lightboxCert.title} 
                    className="w-full h-auto max-h-[500px] object-contain rounded-2xl"
                  />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 border border-emerald-400 text-[9px] font-mono text-white font-bold uppercase tracking-widest">
                    <CheckCircle size={10} /> Original Attachment Loaded
                  </div>
                </div>
              ) : (
                // Beautiful attestation vector projections representing Lekhya's precise score cards!
                <div className="relative p-6 sm:p-10 rounded-3xl border border-cyan-500/30 bg-slate-950 text-center space-y-6 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 -translate-x-[2px] -translate-y-[2px]" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 translate-x-[2px] translate-y-[2px]" />

                  {/* Top Security Line */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-4 font-mono text-[9px] text-gray-500">
                    <span>SECURITY LEDGER REPLICATION NODE: COMPLIANT</span>
                    <span className="text-[#34d399]">{lightboxCert.status}</span>
                  </div>

                  {/* Body Layout */}
                  <div className="space-y-4 py-4">
                    <span className="text-amber-500 text-xs font-mono tracking-widest uppercase font-bold">OFFICIAL ACADEMIC ATTESTATION</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-indigo-100 uppercase">
                      Pampana Lekhya
                    </h3>
                    <p className="text-xs text-gray-400 font-sans max-w-sm mx-auto">
                      has successfully satisfied direct professional evaluation standards and course guidelines for:
                    </p>

                    <div className="py-2.5 px-6 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 inline-block font-mono text-cyan-200 font-bold text-base sm:text-lg">
                      {lightboxCert.title}
                    </div>

                    <div className="text-xs font-sans text-gray-400">
                      Offered by <span className="text-white font-bold">{lightboxCert.provider}</span> • Verification ID <span className="text-white font-mono">{lightboxCert.verificationId}</span>
                    </div>

                    {/* Displays physical metrics like scores or details if it is DBMS NPTEL */}
                    {lightboxCert.id === 'dbms-nptel' && (
                      <div className="max-w-md mx-auto grid grid-cols-3 gap-2 bg-slate-900/40 p-3 rounded-xl border border-white/5 text-[10px] font-mono">
                        <div>
                          <span className="text-gray-500 block">ASSIGNMENTS</span>
                          <span className="text-gray-300 font-bold">20.63 / 25</span>
                        </div>
                        <div className="border-x border-white/5">
                          <span className="text-gray-500 block">PROCTORED EXAM</span>
                          <span className="text-gray-300 font-bold">36.75 / 75</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">TOTAL RATIO</span>
                          <span className="text-cyan-400 font-bold">57% PASS</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Validated Skills section */}
                  <div className="space-y-2 border-t border-white/5 pt-4 text-left">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">Verified Competency List:</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {lightboxCert.skillsAcquired.map((sk, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-gray-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span>{sk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verification Ledger codes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-4 text-[9px] font-mono text-gray-500 text-left">
                    <div>
                      REGISTRY PATH: <span className="text-gray-300">{lightboxCert.verificationId}</span>
                    </div>
                    <div className="sm:text-right">
                      CRYPTOGRAPHIC HASH: <span className="text-gray-300">verified_ok_sha256_77921a</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Action buttons */}
          <div className="max-w-6xl mx-auto w-full p-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-mono text-xs">
            <span className="text-gray-500 uppercase text-[9px]">Pampana Lekhya © Professional digital achievements repository</span>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={closeLightbox}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg flex items-center gap-1.5 transition-all text-xs font-sans font-bold cursor-pointer shadow-lg shadow-purple-500/15 border-0"
                title="Return to Certificates Gallery"
              >
                ← Return to Gallery
              </button>
              <a
                href={getLinkedInVerifyUrl(lightboxCert)}
                target="_blank"
                rel="noreferrer"
                onClick={() => audioSynthesizer.playSuccess()}
                className="px-4 py-2 bg-[#0077b5] text-white hover:bg-opacity-90 rounded-lg flex items-center gap-1.5 transition-all text-xs font-sans font-bold"
              >
                LinkedIn Verification <ExternalLink size={12} />
              </a>
              <button
                onClick={() => triggerPdfPrint(lightboxCert)}
                className="px-4 py-2 border border-white/10 hover:bg-white/5 text-gray-300 rounded-lg flex items-center gap-1.5 transition-all bg-transparent font-sans text-xs inline-flex font-bold cursor-pointer"
              >
                Download PDF / Print <Printer size={12} />
              </button>
              <button
                onClick={() => triggerImageDownload(lightboxCert)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/35 hover:to-indigo-500/35 text-cyan-400 hover:text-white border border-cyan-400/30 rounded-lg flex items-center gap-1.5 transition-all text-xs font-sans font-bold cursor-pointer"
              >
                Download PNG Image <Download size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationsGallery;
