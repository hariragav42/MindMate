/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF874B',     // Bright Warm Orange
        secondary: '#B5C38F',   // Muted Sage / Olive
        background: '#FFF8E7',  // Warm Off-White
        surface: '#F8F7F4',     // Warm White
        accent: {
          purple: '#7C83F5',
          lavender: '#C98CEB',
          pink: '#E5A0D3',
          yellow: '#FFD886',
          green: '#91A84F'
        },
        text: '#171717',        // Deep Charcoal
        coral: '#FF6B6B',
        teal: '#4ECDC4'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
        '3xl': '28px', // MindMate standard default radius for cards
        '4xl': '36px', // Extra large
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'soft-hover': '0 15px 50px -10px rgba(0,0,0,0.12)',
        'glow': '0 0 20px rgba(255, 135, 75, 0.4)',
      },
      keyframes: {
        mindMateFloat: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(3%, -3%, 0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'float': 'mindMateFloat 12s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
}
