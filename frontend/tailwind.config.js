/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          dark: '#1e1035',
        },
        coral: {
          300: '#fca5a5',
          400: '#f87171',
          500: '#ff6b6b',
          600: '#ee5253',
        },
        amber: {
          300: '#fde047',
          400: '#facc15',
          500: '#f59e0b',
        },
        mint: {
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
        },
        sky: {
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
        },
        surface: {
          bg: '#fcfaff',
          card: '#ffffff',
          glass: 'rgba(255, 255, 255, 0.75)',
          dark: '#0f0919',
          darkCard: 'rgba(26, 17, 43, 0.85)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(124, 58, 237, 0.25)',
        'glow-lg': '0 0 50px rgba(124, 58, 237, 0.35)',
        'coral-glow': '0 0 30px rgba(255, 107, 107, 0.25)',
        float: '0 20px 40px -15px rgba(30, 16, 53, 0.12)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 50%, #ff6b6b 100%)',
        'subtle-gradient': 'linear-gradient(180deg, #f8f5ff 0%, #fcfaff 100%)',
        'hero-gradient': 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.15) 0%, rgba(255, 107, 107, 0.05) 50%, transparent 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0f0919 0%, #1e1035 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
