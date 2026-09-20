/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1A1A',
        secondary: '#666666',
        'btn-dark': '#222222',
        'section-bg': '#F8F8F8',
      },
      fontFamily: {
        sans: ['Otterco Display', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-12deg)' },
          '50%': { transform: 'translateY(-10px) rotate(-12deg)' }
        },
        particle: {
          '0%': {
            transform: 'translate(0, 0) scale(1)',
            opacity: 1
          },
          '100%': {
            transform: 'translate(var(--tx, 20px), var(--ty, -50px)) scale(0)',
            opacity: 0
          }
        },
        "seamless-scroll": {
          '0%': { transform: 'translateX(0)' }, // 从开头开始
          '100%': { transform: 'translateX(-50%)' } // 滑动到一半（克隆后无缝循环）
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'particle': 'particle 2s ease-out forwards',
        "seamless-scroll": 'seamless-scroll 15s linear infinite'
      }
    },
  },
  plugins: [],
}
