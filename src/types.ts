export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  features: string[];
  videoThumbnail: string;
  demoVideoUrl?: string;
  screenshots: string[];
  mockupData: {
    status: string;
    metrics: { label: string; value: string }[];
    logs: string[];
    insights: string[];
  };
}

export interface Credential {
  id: string;
  title: string;
  provider: string;
  category: string;
  date: string;
  badges: string[];
  skillsAcquired: string[];
  linkedinUrl: string;
  verificationId: string;
  status: string;
  imageUrl: string;
  pdfUrl?: string;
  linkedinVerifyUrl?: string;
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  year: string;
  grade: string;
}

export interface SpaceSkill {
  name: string;
  level: 'Expert' | 'Intermediate' | 'Learner';
  category: 'Programming' | 'Web' | 'Database' | 'AI' | 'Analytics' | 'Cloud' | 'Security' | 'Tools';
  color: string;
}

export type ThemeType = 'neon-blue' | 'purple-galaxy' | 'professional-light';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  bg: string;
  text: string;
  textMuted: string;
  accent: string;
  accentGlow: string;
  cardBg: string;
  borderColor: string;
}

export const themes: Record<ThemeType, ThemeConfig> = {
  'neon-blue': {
    id: 'neon-blue',
    name: 'AI Neon Blue',
    bg: 'bg-[#030712]',
    text: 'text-gray-100',
    textMuted: 'text-gray-400',
    accent: 'cyan',
    accentGlow: 'rgba(6, 182, 212, 0.45)',
    cardBg: 'bg-gray-950/40 backdrop-blur-md',
    borderColor: 'border-cyan-500/20 hover:border-cyan-400/40'
  },
  'purple-galaxy': {
    id: 'purple-galaxy',
    name: 'Purple Galaxy',
    bg: 'bg-[#090514]',
    text: 'text-gray-100',
    textMuted: 'text-purple-300/70',
    accent: 'purple',
    accentGlow: 'rgba(168, 85, 247, 0.45)',
    cardBg: 'bg-purple-950/20 backdrop-blur-md',
    borderColor: 'border-purple-500/20 hover:border-purple-400/40'
  },
  'professional-light': {
    id: 'professional-light',
    name: 'Professional Light',
    bg: 'bg-[#f8fafc]',
    text: 'text-slate-800',
    textMuted: 'text-slate-500',
    accent: 'indigo',
    accentGlow: 'rgba(99, 102, 241, 0.15)',
    cardBg: 'bg-white/80 backdrop-blur-md shadow-sm',
    borderColor: 'border-slate-200 hover:border-indigo-300'
  }
};

export const PROJECTS: Project[] = [
  {
    id: 'telemedicine',
    title: 'Telemedicine Platform',
    subtitle: 'Responsive Web Application for Personalized Healthcare Guidance',
    description: 'An immersive digital health assistance platform targeting simplified, easy access to clinical health feedback. It parses core user symptom markers, medical history indicators, and age limits to dynamically formulate custom food diets and safe wellness targets.',
    technologies: ['HTML5', 'CSS3', 'JavaScript (ES6)', 'Tailwind CSS', 'Responsive UI', 'State Engine'],
    features: [
      'Interactive patient intake diagnostics with custom state management',
      'Adaptive food regimes, calorie goals and fluid targets',
      'Dynamic nutrient mappings and biometric evaluation matrices',
      'Strict client-side accessibility compliance and elegant fluid transitions'
    ],
    videoThumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1504813184591-01552ff75805?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=400&q=80'
    ],
    mockupData: {
      status: 'DIAGNOSTIC SYSTEM ACTIVE',
      metrics: [
        { label: 'Survey Accuracy', value: '99.4%' },
        { label: 'Response Latency', value: '38ms' },
        { label: 'Code Size', value: 'Optimized' }
      ],
      logs: [
        'Booting telemedicine intake telemetry parser...',
        'Compiling symptom evaluation matrices...',
        'Routing patient metabolic metrics to scoring algorithms...',
        'Simulation online. Ready.'
      ],
      insights: [
        'Dynamically processes user caloric targets on the fly without server dependencies.',
        'Uses gorgeous CSS glass screens to transition user through the health questions easily.'
      ]
    }
  },
  {
    id: 'diet-recommender',
    title: 'Diet Recommendation Web App',
    subtitle: 'High-Fidelity Nutrition Mapping & Planner Component',
    description: 'A dedicated patient nutrition calculator custom-mapping user weight targets, physical activity inputs, and baseline BMR scores. Generates responsive daily diet portions and macros with an intuitive glass dashboard interface.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'Macro Planner', 'Dashboard UI'],
    features: [
      'Comprehensive biometric record fields and BMR calculating algorithms',
      'High-impact glass responsive layout showing rich macro statistics',
      'Adaptive recipe lookup arrays matching personalized targets',
      'Offline-capable calculation and smooth responsive animations'
    ],
    videoThumbnail: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
    ],
    mockupData: {
      status: 'CALORIE CALUCLATOR ACTIVE',
      metrics: [
        { label: 'Macro Precision', value: 'Exact' },
        { label: 'Computation Time', value: 'Instant' },
        { label: 'Reliability Index', value: '100%' }
      ],
      logs: [
        'Fetching current user body metrics profile...',
        'Initializing baseline BMR equations...',
        'Slicing macronutrients portions: 40% Carb / 30% Prot / 30% Fat...',
        'Interactive dashboards successfully compiled and active.'
      ],
      insights: [
        'Calculates customized nutrient splits based on user targets.',
        'Responsive layout fits perfectly from desktop screens to mobile ports.'
      ]
    }
  },
  {
    id: 'adaptive-learning',
    title: 'Adaptive Learning Style Recommendation System',
    subtitle: 'AI-Driven Educational Platform & Pattern Classifier',
    description: 'A futuristic pedagogical framework built to catalog students cognitive patterns and educational style (VARK: Visual, Auditory, Reading, Kinesthetic). Dynamically recalibrates curriculum material difficulty, format, and layout.',
    technologies: ['Machine Learning', 'Cognitive Modeling', 'AI concepts', 'Data Classification', 'React JS', 'Adaptive Feed'],
    features: [
      'Cognitive vector mapping based on student feedback sequences',
      'Interactive flow parameters that shift difficulty and medium based on metrics',
      'Comprehensive telemetry dashboard summarizing retention curves',
      'Flexible diagnostic sandbox for recruiters to manipulate student scoring'
    ],
    videoThumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80'
    ],
    mockupData: {
      status: 'NEURAL PREDICTOR LOADED',
      metrics: [
        { label: 'Classifier F1', value: '0.94' },
        { label: 'Retention Rate', value: '+42%' },
        { label: 'Profile Conf', value: '94.2%' }
      ],
      logs: [
        'Spinning up learner cognitive vector analyzer...',
        'Tuning pedagogical feedback parameters...',
        'Classified learner pattern: VISUAL-KINESTHETIC preference (94% confidence)...',
        'Serving tailored media pathway assets...'
      ],
      insights: [
        'Matches syllabus formats with individual learner cognitive profiles dynamically.',
        'Simulates custom analytical metrics panels using reactive HTML5 canvases.'
      ]
    }
  }
];

export const EDUCATION_ITEMS: Education[] = [
  {
    id: 'btech',
    degree: 'B.Tech',
    field: 'Artificial Intelligence',
    institution: "Vignan's Institute of Engineering for Women",
    year: '2023 – 2027',
    grade: 'CGPA: 7.96 | Percentage: 74.65%'
  },
  {
    id: 'inter',
    degree: 'Intermediate',
    field: 'MPC (Maths, Physics, Chemistry)',
    institution: 'Sri Chaitanya Junior College',
    year: '2021 – 2023',
    grade: 'Percentage: 86.2%'
  },
  {
    id: 'ssc',
    degree: 'SSC',
    field: 'Secondary School Certificate',
    institution: 'Sri Surya Teja School',
    year: '2021',
    grade: 'CGPA: 10/10'
  }
];

export const CREDENTIALS_DATABASE: Credential[] = [
  {
    id: 'dbms-nptel',
    title: 'DBMS – NPTEL',
    provider: 'NPTEL | IIT Kharagpur',
    category: 'Database Certification',
    date: '2025',
    badges: ['Database', 'SQL'],
    skillsAcquired: ['DBMS', 'SQL', 'Database Design', 'Data Management'],
    linkedinUrl: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fpampana-lekhya.vercel.app',
    verificationId: 'NPTEL25CS18S632700965',
    status: 'VERIFIED_SIGNATURE_OK',
    imageUrl: ''
  },
  {
    id: 'introduction-to-generative-ai',
    title: 'Introduction to Generative AI',
    provider: 'Google Cloud × Simplilearn',
    category: 'AI Certification',
    date: 'January 2025',
    badges: ['Artificial Intelligence', 'Generative AI'],
    skillsAcquired: ['Generative AI', 'AI Fundamentals', 'Prompt Engineering Concepts'],
    linkedinUrl: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fpampana-lekhya.vercel.app',
    verificationId: 'GC-SIMPL-GENAI-88392',
    status: 'VERIFIED_SIGNATURE_OK',
    imageUrl: ''
  },
  {
    id: 'java-fullstage-react-ai',
    title: 'Java Full Stack with React JS & AI',
    provider: 'AICTE × Brainovision',
    category: 'Full Stack Certification',
    date: 'December 2024',
    badges: ['Java', 'React JS', 'Full Stack'],
    skillsAcquired: ['Java', 'React JS', 'Full Stack Development', 'Frontend Fundamentals'],
    linkedinUrl: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fpampana-lekhya.vercel.app',
    verificationId: 'NSSTP-BVN414',
    status: 'VERIFIED_SIGNATURE_OK',
    imageUrl: ''
  },
  {
    id: 'cloud-computing-workshop',
    title: 'Cloud Computing Workshop',
    provider: 'K. Kanaka Valli (Mentor)',
    category: 'Workshop',
    date: '2025',
    badges: ['Cloud Computing'],
    skillsAcquired: ['Cloud Fundamentals', 'Cloud Services', 'Cloud Architecture Basics'],
    linkedinUrl: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fpampana-lekhya.vercel.app',
    verificationId: 'WORKSHOP-CLOUD-3321',
    status: 'VERIFIED_SIGNATURE_OK',
    imageUrl: ''
  },
  {
    id: 'power-bi-workshop',
    title: 'Power BI Workshop',
    provider: 'Talentio Academy',
    category: 'Workshop',
    date: 'October 2024',
    badges: ['Data Analytics', 'Power BI'],
    skillsAcquired: ['Power BI', 'Data Analytics', 'Data Visualization', 'Business Intelligence'],
    linkedinUrl: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fpampana-lekhya.vercel.app',
    verificationId: 'DATA-PBI-WORKSHOP-4422',
    status: 'VERIFIED_SIGNATURE_OK',
    imageUrl: ''
  },
  {
    id: 'cybersecurity-ethicalhacking',
    title: 'Cyber Security & Ethical Hacking Workshop',
    provider: 'CYBERTHREYA',
    category: 'Workshop',
    date: 'September 2024',
    badges: ['Cyber Security', 'Ethical Hacking'],
    skillsAcquired: ['Cyber Security', 'Ethical Hacking', 'Security Awareness'],
    linkedinUrl: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fpampana-lekhya.vercel.app',
    verificationId: 'CBY2WKIBKf',
    status: 'VERIFIED_SIGNATURE_OK',
    imageUrl: ''
  }
];

export const SKILLS: SpaceSkill[] = [
  // Programming
  { name: 'Python', level: 'Expert', category: 'Programming', color: 'cyan' },
  { name: 'C', level: 'Intermediate', category: 'Programming', color: 'cyan' },
  // Web
  { name: 'HTML', level: 'Expert', category: 'Web', color: 'emerald' },
  { name: 'CSS', level: 'Expert', category: 'Web', color: 'emerald' },
  { name: 'JavaScript', level: 'Intermediate', category: 'Web', color: 'emerald' },
  // Database
  { name: 'DBMS', level: 'Expert', category: 'Database', color: 'purple' },
  { name: 'SQL', level: 'Expert', category: 'Database', color: 'purple' },
  // AI
  { name: 'Artificial Intelligence', level: 'Expert', category: 'AI', color: 'red' },
  { name: 'Machine Learning Fundamentals', level: 'Intermediate', category: 'AI', color: 'red' },
  { name: 'Generative AI', level: 'Expert', category: 'AI', color: 'red' },
  // Analytics
  { name: 'Power BI', level: 'Expert', category: 'Analytics', color: 'amber' },
  { name: 'Data Visualization', level: 'Expert', category: 'Analytics', color: 'amber' },
  // Cloud
  { name: 'Cloud Computing', level: 'Intermediate', category: 'Cloud', color: 'cyan' },
  // Security
  { name: 'Cyber Security', level: 'Intermediate', category: 'Security', color: 'purple' },
  { name: 'Ethical Hacking', level: 'Learner', category: 'Security', color: 'purple' },
  // Tools
  { name: 'VS Code', level: 'Expert', category: 'Tools', color: 'amber' }
];
