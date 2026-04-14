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
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          dim: 'rgb(var(--accent-dim) / <alpha-value>)',
          bright: 'rgb(var(--accent-bright) / <alpha-value>)',
          faint: 'rgb(var(--accent-faint) / <alpha-value>)',
          glow: 'rgb(var(--accent-glow) / <alpha-value>)',
        },
      },
      backgroundImage: {
        terminal: "url('/assets/terminal.png')",
      },
      boxShadow: {
        'neon-sm': '0 0 12px rgb(var(--accent) / 0.18)',
        'neon': '0 0 24px rgb(var(--accent) / 0.26)',
        'neon-lg': '0 0 40px rgb(var(--accent) / 0.32)',
      },
    },
  },
  plugins: [],
};
