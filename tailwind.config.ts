import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8ED',
        linen: '#F7EBDD',
        blush: '#F7C8D3',
        petal: '#FCE8EE',
        babyblue: '#B9DDF4',
        mistblue: '#E9F7FF',
        beige: '#DCC7AD',
        cocoa: '#6F5142',
        ink: '#3A2B2F'
      },
      boxShadow: {
        soft: '0 24px 70px rgba(111, 81, 66, 0.14)',
        glow: '0 24px 60px rgba(247, 200, 211, 0.35)',
        petal: '0 30px 80px rgba(247, 200, 211, 0.32), 0 12px 30px rgba(111, 81, 66, 0.08)',
        mist: '0 30px 80px rgba(185, 221, 244, 0.28), 0 12px 30px rgba(111, 81, 66, 0.08)',
        depth: '0 32px 90px rgba(111, 81, 66, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.68)'
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'memory-glow':
          'radial-gradient(circle at top left, rgba(247,200,211,0.55), transparent 36%), radial-gradient(circle at bottom right, rgba(185,221,244,0.62), transparent 36%), linear-gradient(135deg, #fff8ed 0%, #fce8ee 48%, #e9f7ff 100%)'
      }
    }
  },
  plugins: []
} satisfies Config;
