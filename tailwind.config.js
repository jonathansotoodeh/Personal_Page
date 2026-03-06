/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#08040f',
        hud: '#12081d',
        neonPink: '#ff00aa',
        neonCyan: '#00ffff',
        neonYellow: '#ffff00',
        neonPurple: '#8b5cf6'
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif']
      },
      boxShadow: {
        neon: '0 0 24px rgba(255, 0, 170, 0.45)',
        cyan: '0 0 22px rgba(0, 255, 255, 0.3)'
      }
    }
  },
  plugins: []
};
