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
        // Warm Cream / Ivory for Light Mode
        cream: {
          50: '#FDFCF9',
          100: '#FAF7F2',
          200: '#F4EFE6',
          300: '#EAE1D3',
          400: '#DCD0BE',
          500: '#C8B9A2',
        },
        // Deep Charcoal for Dark Mode and Typography
        charcoal: {
          950: '#0C0D10',
          900: '#111216',
          850: '#16181E',
          800: '#1C1E26',
          750: '#232630',
          700: '#2C303D',
          600: '#3D4253',
          500: '#5A6178',
          400: '#868EA3',
          300: '#B0B6C7',
          200: '#D5D9E4',
          100: '#EBEFF7',
        },
        // Primary Accent: Coral Orange
        coral: {
          50: '#FFF5F2',
          100: '#FFE9E4',
          200: '#FFD3C9',
          300: '#FFB1A0',
          400: '#FF8166',
          500: '#FF5C35',
          600: '#ED4017',
          700: '#C82F0B',
          800: '#A4270B',
          900: '#86240E',
        },
        // Secondary Accent: Lime Green
        lime: {
          50: '#F9FFE5',
          100: '#F2FFBF',
          200: '#E4FF80',
          300: '#D6FF40',
          400: '#C6F10E',
          500: '#A9D604',
          600: '#81A600',
          700: '#607D00',
        },
        // Legacy dark aliases mapped to charcoal for backward compatibility
        dark: {
          950: '#0C0D10',
          900: '#111216',
          850: '#16181E',
          800: '#1C1E26',
          750: '#232630',
          700: '#2C303D',
          600: '#3D4253',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'coral-glow': '0 4px 20px -2px rgba(255, 92, 53, 0.25)',
        'lime-glow': '0 4px 20px -2px rgba(198, 241, 14, 0.25)',
        'card-light': '0 4px 16px -2px rgba(28, 30, 38, 0.05)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
        'elevated': '0 10px 30px -4px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
