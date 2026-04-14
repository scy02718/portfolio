/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        generalsans: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        black: {
          DEFAULT: '#000',
          100: '#000308',
          200: '#04080a',
          300: '#0a1a10',
          500: '#13301a',
          600: '#061206',
        },
        white: {
          DEFAULT: '#e8ffe8',
          800: '#d4f5d4',
          700: '#b8e6b8',
          600: '#7ea87e',
          500: '#4a6b4a',
        },
        neon: {
          DEFAULT: '#22c55e',
          dim: '#16a34a',
          bright: '#4ade80',
          glow: '#86efac',
        },
      },
      backgroundImage: {
        terminal: "url('/assets/terminal.png')",
      },
      boxShadow: {
        'neon-sm': '0 0 12px rgba(34,197,94,0.15)',
        'neon': '0 0 24px rgba(34,197,94,0.22)',
        'neon-lg': '0 0 40px rgba(34,197,94,0.3)',
      },
    },
  },
  plugins: [],
};
