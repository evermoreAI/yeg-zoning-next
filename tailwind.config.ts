import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:     '#0a0c10',
        card:   '#141820',
        border: '#2a2e38',
        gold:   '#c8a951',
        danger: '#8b1a1a',
        green:  '#2d6a2d',
        amber:  '#b8860b',
        text:   '#e8e0d0',
        muted:  '#8a8070',
      },
      fontFamily: {
        heading: ['var(--font-rajdhani)', 'Rajdhani', 'sans-serif'],
        body:    ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono:    ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
