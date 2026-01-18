import { create } from 'zustand';
import * as THREE from 'three';

export interface PlanetData {
  id: string;
  name: string;
  title: string;
  description: string;
  details: string[];
  color: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  hasRings?: boolean;
  ringData?: string[];
}

export const PLANETS: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    title: 'About Me',
    description: 'Full Stack + Salesforce Developer passionate about building innovative solutions.',
    details: [
      'Vaibhav Chauhan',
      'Full Stack Developer',
      'Salesforce Specialist',
      'Based in India',
      'Passionate about clean code & UX'
    ],
    color: '#8C7853',
    size: 0.4,
    orbitRadius: 8,
    orbitSpeed: 0.008,
  },
  {
    id: 'venus',
    name: 'Venus',
    title: 'Tech Stack',
    description: 'Modern technologies powering exceptional digital experiences.',
    details: [
      'React & Next.js',
      'Three.js & WebGL',
      'Node.js & Express',
      'TypeScript',
      'PostgreSQL & MongoDB',
      'Tailwind CSS'
    ],
    color: '#E6C35C',
    size: 0.6,
    orbitRadius: 12,
    orbitSpeed: 0.006,
  },
  {
    id: 'earth',
    name: 'Earth',
    title: 'Full Stack Projects',
    description: 'Web applications built with modern architecture and best practices.',
    details: [
      'E-Commerce Platforms',
      'Real-time Dashboards',
      'API Integrations',
      'Progressive Web Apps',
      'Cloud Deployments'
    ],
    color: '#4A90D9',
    size: 0.65,
    orbitRadius: 16,
    orbitSpeed: 0.005,
  },
  {
    id: 'mars',
    name: 'Mars',
    title: 'Salesforce Expertise',
    description: 'Enterprise CRM solutions and custom Salesforce development.',
    details: [
      'Apex Development',
      'Lightning Web Components',
      'Salesforce CRM Customization',
      'Integration APIs',
      'Admin & Configuration',
      'Flow Builder Automation'
    ],
    color: '#C1440E',
    size: 0.5,
    orbitRadius: 20,
    orbitSpeed: 0.004,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    title: 'Experience Timeline',
    description: 'Professional journey through technology and innovation.',
    details: [
      '2024 - Senior Salesforce Developer',
      '2023 - Full Stack Engineer',
      '2022 - Salesforce Administrator',
      '2021 - Frontend Developer',
      '2020 - Started Coding Journey'
    ],
    color: '#D4A574',
    size: 1.2,
    orbitRadius: 28,
    orbitSpeed: 0.003,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    title: 'Skills & Certifications',
    description: 'Core competencies and professional certifications.',
    details: [
      'Salesforce Platform Developer I',
      'Salesforce Administrator',
      'AWS Cloud Practitioner',
      'React Advanced Patterns',
      'Node.js Best Practices'
    ],
    color: '#C9A227',
    size: 1.0,
    orbitRadius: 36,
    orbitSpeed: 0.002,
    hasRings: true,
    ringData: [
      'Problem Solving',
      'Team Leadership',
      'Agile/Scrum',
      'Code Review',
      'System Design'
    ]
  },
  {
    id: 'neptune',
    name: 'Neptune',
    title: 'Contact',
    description: 'Let\'s connect and build something amazing together.',
    details: [
      'Email: vaibhav@example.com',
      'LinkedIn: /in/vaibhavchauhan',
      'GitHub: @vaibhavchauhan',
      'Twitter: @vaibhavdev',
      'Portfolio: vaibhav.dev'
    ],
    color: '#4B70DD',
    size: 0.8,
    orbitRadius: 44,
    orbitSpeed: 0.001,
  },
];

interface GameState {
  isLoading: boolean;
  loadingProgress: number;
  selectedPlanet: PlanetData | null;
  isWarping: boolean;
  warpTarget: THREE.Vector3 | null;
  shipPosition: THREE.Vector3;
  shipRotation: THREE.Euler;
  showControls: boolean;
  isMobile: boolean;
  
  setLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  setSelectedPlanet: (planet: PlanetData | null) => void;
  startWarp: (target: THREE.Vector3) => void;
  endWarp: () => void;
  updateShipPosition: (position: THREE.Vector3) => void;
  updateShipRotation: (rotation: THREE.Euler) => void;
  setShowControls: (show: boolean) => void;
  setIsMobile: (mobile: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  isLoading: true,
  loadingProgress: 0,
  selectedPlanet: null,
  isWarping: false,
  warpTarget: null,
  shipPosition: new THREE.Vector3(0, 2, 50),
  shipRotation: new THREE.Euler(0, Math.PI, 0),
  showControls: true,
  isMobile: false,
  
  setLoading: (loading) => set({ isLoading: loading }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  startWarp: (target) => set({ isWarping: true, warpTarget: target }),
  endWarp: () => set({ isWarping: false, warpTarget: null }),
  updateShipPosition: (position) => set({ shipPosition: position }),
  updateShipRotation: (rotation) => set({ shipRotation: rotation }),
  setShowControls: (show) => set({ showControls: show }),
  setIsMobile: (mobile) => set({ isMobile: mobile }),
}));
