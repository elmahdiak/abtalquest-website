/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#016ba5',       // 40% Navbar, links, active states, key UI elements
          secondary: '#fa8221',     // 35% Action/CTA, buttons, highlights
          success: '#22C55E',       // 4% Completed tasks, achievements, progress
          warning: '#FACC15',       // 3% Warnings, reminders, notifications
          contrast: '#1C1C1C',      // 4% Footer, overlays, strong contrast
          gamification: '#7C3AED',  // 4% Levels, quests, badges
          info: '#38BDF8',          // 4% Highlights, tooltips, secondary accents
          foundation: '#0A2540',    // 2% Main backgrounds, sections, dark surfaces
          'text-primary': '#1E293B',// 2% Headings, important text, titles
          'text-secondary': '#64748B', // 2% Descriptions, labels, inactive text
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
        // Enforce AbtalQuest Brand Typography:
        // Default text & sans-serif default to Roboto Mono for maximum readability
        sans: ['"Roboto Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        body: ['"Roboto Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        mono: ['"Roboto Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        
        // Primary Brand Font: Montserrat for all headlines, titles, and button labels
        headline: ['Montserrat', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
        title: ['Montserrat', 'system-ui', 'sans-serif'],
        button: ['Montserrat', 'system-ui', 'sans-serif'],
        
        // Gamification Font: Baloo 2 exclusively for badges, rewards, and gamified levels
        gamification: ['"Baloo 2"', 'cursive', 'sans-serif'],
        badge: ['"Baloo 2"', 'cursive', 'sans-serif'],
        reward: ['"Baloo 2"', 'cursive', 'sans-serif'],
      },
      boxShadow: {
        'cta': '0 10px 25px -5px rgba(250, 130, 33, 0.4), 0 8px 10px -6px rgba(250, 130, 33, 0.2)',
        'cta-hover': '0 15px 30px -5px rgba(250, 130, 33, 0.5), 0 10px 15px -5px rgba(250, 130, 33, 0.3)',
        'quest': '0 10px 25px -5px rgba(124, 58, 237, 0.35)',
        'brand': '0 10px 25px -5px rgba(1, 107, 165, 0.35)',
      },
    },
  },
  plugins: [],
}
