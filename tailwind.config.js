/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070A11',
          900: '#0B0F19',
          850: '#0F1524',
          800: '#141C30',
          750: '#1A233C',
          700: '#222E4E',
          600: '#32426E',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        accent: {
          purple: '#8B5CF6',
          violet: '#7C3AED',
          blue: '#38BDF8',
          cyan: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.25)',
        'glow-blue': '0 0 25px -5px rgba(56, 189, 248, 0.25)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.55), 0 0 15px -3px rgba(99, 102, 241, 0.15)',
      }
    },
  },
  plugins: [],
}

