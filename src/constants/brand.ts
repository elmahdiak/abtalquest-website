/**
 * AbtalQuest Official Brand Identity & Design System Tokens
 * Source: AbtalQuest Brand Guidelines Manual
 */

export const BRAND_COLORS = {
  // 1. Primary Brand (40%)
  primary: {
    hex: '#016ba5',
    percentage: '40%',
    role: 'Brand / Structure',
    description: 'Navbar, links, active states, key UI elements',
    name: 'Cerulean Guardian Blue',
  },
  // 2. Secondary CTA / Energy (35%)
  secondary: {
    hex: '#fa8221',
    percentage: '35%',
    role: 'Action / CTA',
    description: 'Buttons, call-to-action, energetic highlights',
    name: 'Action Energy Orange',
  },
  // 3. Success / Achievement (4%)
  success: {
    hex: '#22C55E',
    percentage: '4%',
    role: 'Success / Reward',
    description: 'Completed tasks, achievements, quest progress',
    name: 'Victory Green',
  },
  // 4. Warning / Attention (3%)
  warning: {
    hex: '#FACC15',
    percentage: '3%',
    role: 'Attention',
    description: 'Warnings, reminders, parent notifications',
    name: 'Beacon Yellow',
  },
  // 5. Contrast / Depth (4%)
  contrast: {
    hex: '#1C1C1C',
    percentage: '4%',
    role: 'Deep Contrast',
    description: 'Footer, overlays, strong contrast areas',
    name: 'Obsidian Night',
  },
  // 6. Gamification (4%)
  gamification: {
    hex: '#7C3AED',
    percentage: '4%',
    role: 'Gamification',
    description: 'Levels, quests, badges, heroic milestones',
    name: 'Adventure Violet',
  },
  // 7. Info / Clarity (4%)
  info: {
    hex: '#38BDF8',
    percentage: '4%',
    role: 'Accent / Info',
    description: 'Highlights, tooltips, secondary UI accents',
    name: 'Sky Clarity Blue',
  },
  // 8. Foundation Base (2%)
  foundation: {
    hex: '#0A2540',
    percentage: '2%',
    role: 'Base / Background',
    description: 'Main backgrounds, sections, dark mode surfaces',
    name: 'Cosmic Navy',
  },
  // 9. Primary Text (2%)
  textPrimary: {
    hex: '#1E293B',
    percentage: '2%',
    role: 'Primary Text',
    description: 'Headings, important text, titles',
    name: 'Deep Slate',
  },
  // 10. Secondary Text (2%)
  textSecondary: {
    hex: '#64748B',
    percentage: '2%',
    role: 'Secondary Text',
    description: 'Descriptions, labels, inactive text',
    name: 'Muted Slate',
  },
} as const;

export const BRAND_FONTS = {
  headline: {
    family: 'Montserrat',
    roles: ['Headlines', 'Titles', 'Buttons', 'Hero Text'],
    why: 'Clean, geometric, modern; works perfect for startups and heroic themes',
    weights: ['Bold', 'SemiBold', 'Medium', 'Black'],
  },
  body: {
    family: 'Roboto Mono',
    roles: ['Paragraphs', 'Body text', 'UI text', 'App content'],
    why: 'Extremely readable with a modern technical touch',
    weights: ['Regular', 'Medium', 'Bold'],
  },
  gamified: {
    family: 'Baloo 2',
    roles: ['Badges', 'Rewards', 'Quest Levels', 'Gamified Elements'],
    why: 'Rounded, friendly for kids, playful excitement',
    weights: ['Bold', 'ExtraBold'],
  },
  arabic: {
    headlines: ['Cairo', 'Amiri'],
    body: 'Tajawal',
    rewards: 'Baloo Bhaijaan 2',
  },
} as const;

export const BRAND_VALUES = {
  name: 'AbtalQuest',
  tagline: 'A Safe, Values-Based Digital Universe for Children',
  pillars: [
    { title: 'Zero Ads & Distractions', description: 'No commercial interruptions, tracking, or sponsored popups.' },
    { title: 'Zero Violence', description: 'Empowering problem-solving, courage, kindness, and moral integrity.' },
    { title: 'Values-Driven Quests', description: 'Every challenge builds character, curiosity, and real-world empathy.' },
    { title: 'Parent Peace-of-Mind', description: 'Transparent progress tracking and healthy digital boundary controls.' },
  ],
} as const;
