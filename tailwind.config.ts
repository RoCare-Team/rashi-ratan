import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Royal / deep purple — the brand spine */
        royal: {
          50: '#f6f4ff',
          100: '#ece7ff',
          200: '#dbd2ff',
          300: '#c0adff',
          400: '#a07dfb',
          500: '#8450f0',
          600: '#722ee0',
          700: '#5f1fbd',
          800: '#4c1a95',
          900: '#3d1877',
          950: '#250a4f',
        },
        /* Dark navy — deep backgrounds */
        navy: {
          700: '#1a1b3a',
          800: '#13142c',
          900: '#0d0e20',
          950: '#070815',
        },
        /* Gold — the luxury accent */
        gold: {
          100: '#fdf6e0',
          200: '#f8e9b6',
          300: '#f0d98a',
          400: '#e5c15c',
          500: '#d4a933',
          600: '#b8891f',
          700: '#946818',
          800: '#6f4d14',
        },
        /* Warm light beige page background */
        sand: {
          50: '#fdfbf7',
          100: '#faf6ee',
          200: '#f3ece0',
          300: '#e8dcc9',
          400: '#d8c6a8',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(37, 10, 79, 0.06), 0 8px 24px -8px rgba(37, 10, 79, 0.10)',
        lift: '0 12px 40px -12px rgba(37, 10, 79, 0.28), 0 4px 12px -4px rgba(37, 10, 79, 0.12)',
        glow: '0 0 0 1px rgba(212, 169, 51, 0.25), 0 18px 50px -18px rgba(114, 46, 224, 0.55)',
        inset: 'inset 0 1px 0 0 rgba(255,255,255,0.6)',
      },
      backgroundImage: {
        'gold-sheen': 'linear-gradient(100deg,#946818 0%,#d4a933 22%,#f8e9b6 46%,#d4a933 70%,#946818 100%)',
        'royal-deep': 'linear-gradient(135deg,#250a4f 0%,#3d1877 45%,#13142c 100%)',
        'aurora': 'radial-gradient(60% 60% at 15% 10%, rgba(132,80,240,.35) 0%, transparent 60%), radial-gradient(50% 50% at 85% 20%, rgba(212,169,51,.25) 0%, transparent 60%), radial-gradient(60% 70% at 60% 100%, rgba(96,31,189,.35) 0%, transparent 65%)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(6deg)' },
        },
        'float-slow': {
          '0%,100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-26px) translateX(10px)' },
        },
        twinkle: {
          '0%,100%': { opacity: '0.15', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(.94)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(14px) scale(.96)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        confetti: {
          '0%': { transform: 'translateY(-12vh) rotate(0deg)', opacity: '0' },
          '12%': { opacity: '1' },
          '100%': { transform: 'translateY(88vh) rotate(720deg)', opacity: '0' },
        },
        pop: {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '60%': { transform: 'scale(1.12)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'ring-pulse': {
          '0%': { transform: 'scale(0.9)', opacity: '0.55' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float-slow 11s ease-in-out infinite',
        twinkle: 'twinkle 3.5s ease-in-out infinite',
        shimmer: 'shimmer 2.6s linear infinite',
        'spin-slow': 'spin-slow 40s linear infinite',
        'fade-up': 'fade-up .6s cubic-bezier(.16,1,.3,1) both',
        'scale-in': 'scale-in .25s cubic-bezier(.16,1,.3,1) both',
        'slide-in-right': 'slide-in-right .35s cubic-bezier(.16,1,.3,1) both',
        'toast-in': 'toast-in .3s cubic-bezier(.16,1,.3,1) both',
        confetti: 'confetti 3.4s cubic-bezier(.3,.7,.4,1) forwards',
        pop: 'pop .6s cubic-bezier(.16,1,.3,1) both',
        'ring-pulse': 'ring-pulse 2.2s ease-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
