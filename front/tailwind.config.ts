import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:    '#0a0a0f',
        surf:  '#12121a',
        surf2: '#1a1a24',
        surf3: '#22222e',
        line:  'rgba(255,255,255,0.08)',
        line2: 'rgba(255,255,255,0.14)',
        ink:   '#f0f0f0',
        dim:   '#8b8b9a',
        dim2:  '#5a5a6a',
        cyan:  '#00b4d8',
        cyan2: '#00d4ff',
        ok:    '#10b981',
        warn:  '#f59e0b',
        err:   '#ef4444',
        info:  '#3b82f6',
        purp:  '#8b5cf6',
        pink:  '#ec4899',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        btn:  '10px',
        chip: '999px',
      },
    },
  },
  plugins: [],
} satisfies Config;
