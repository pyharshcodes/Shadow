/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#070709',
        surface: {
          50: '#1a1a22',
          100: '#14141a',
          200: '#0f0f14',
          300: '#0a0a0d',
          DEFAULT: '#0d0d12',
        },
        card: {
          DEFAULT: '#111116',
          muted: '#17171e',
        },
        border: {
          subtle: '#1e1e26',
          DEFAULT: '#262630',
          bright: '#3b3b4a',
        },
        accent: {
          DEFAULT: 'var(--color-accent, #d4f933)',
          hover: 'var(--color-accent-hover, #c1e52b)',
          glow: 'var(--color-accent-glow, rgba(212, 249, 51, 0.2))',
        },
      },
      fontFamily: {
        display: ['var(--font-barlow-condensed)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      letterSpacing: {
        'ultra-wide': '0.25em',
      },
    },
  },
  plugins: [],
};
