import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#016ba5',          // 40% AbtalQuest Royal Blue (Navbar, links, accents)
          'primary-hover': '#015786',
          'primary-light': '#0284c7',
          'primary-subtle': '#e0f2fe',
          secondary: '#fa8221',        // 35% Vibrant Action Orange (CTA, buttons, badges)
          'secondary-hover': '#e87313',
          'secondary-active': '#cf630b',
          'secondary-subtle': '#fff7ed',
          navy: '#06152B',             // Deep Space Navy (Dark banners, night panels)
          'navy-card': '#0A1C36',      // Dark card surface
          'navy-border': '#1E3A60',    // Starry border
          foundation: '#0A2540',       // Main dark foundation surface
          sky: '#EBF5FB',              // Hero & light section background tint
          'sky-light': '#F4F9FD',
          cyan: '#0284c7',             // Category eyebrow badges & step icons
          success: '#22C55E',          // Completed tasks, achievements, green checks
          warning: '#FACC15',          // Warnings & badges
          contrast: '#1C1C1C',         // Footer contrast, strong darks
          gamification: '#7C3AED',     // Quests, magic badges
          info: '#38BDF8',             // Highlights & active state
          'text-primary': '#0F2A4A',   // Deep dark slate-navy for titles
          'text-body': '#475569',      // Refined slate for readable body text
          'text-secondary': '#64748B', // Secondary descriptions & footnotes
        },
        primary: {
          DEFAULT: '#016ba5',
          hover: '#015786',
          active: '#00466c',
          light: '#0284c7',
          50: '#f0f9ff',
          100: '#e0f2fe',
        },
        secondary: {
          DEFAULT: '#fa8221',
          hover: '#e87313',
          active: '#cf630b',
          light: '#ff983d',
          50: '#fff7ed',
          100: '#ffedd5',
        },
        achievement: {
          DEFAULT: '#22C55E',
          light: '#4ade80',
          dark: '#16a34a',
        },
        attention: {
          DEFAULT: '#FACC15',
          light: '#fde047',
          dark: '#eab308',
        },
        adventure: {
          DEFAULT: '#7C3AED',
          light: '#8b5cf6',
          dark: '#6d28d9',
        },
        clarity: {
          DEFAULT: '#38BDF8',
          light: '#7dd3fc',
          dark: '#0284c7',
        },
        surface: {
          foundation: '#0A2540',
          contrast: '#1C1C1C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        headline: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        heading: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        title: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        button: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        gamification: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        badge: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        reward: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        'cta': '0 10px 25px -5px rgba(250, 130, 33, 0.4), 0 8px 10px -6px rgba(250, 130, 33, 0.2)',
        'cta-hover': '0 15px 30px -5px rgba(250, 130, 33, 0.5), 0 10px 15px -5px rgba(250, 130, 33, 0.3)',
        'quest': '0 10px 25px -5px rgba(124, 58, 237, 0.35)',
        'brand': '0 10px 25px -5px rgba(1, 107, 165, 0.35)',
        'card-soft': '0 4px 20px -2px rgba(1, 107, 165, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 20px 35px -8px rgba(1, 107, 165, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        marquee: 'marquee 45s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
