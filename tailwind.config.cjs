/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react");

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        dark_background: '#0a0a0a',
        dark_card: '#1a1a1a',
        dark_text: '#e2e8f0',
        light_background: '#f8fafc',
        light_card: '#ffffff',
        light_text: '#1f2937',
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: 'hsl(142, 70.5%, 46.5%)',
              foreground: 'hsl(0, 0%, 100%)',
            },
            background: 'hsl(210, 20%, 98%)',
            foreground: 'hsl(222.2, 84%, 4.9%)',
            default: {
                DEFAULT: 'hsl(210, 40%, 96.1%)',
                foreground: 'hsl(222.2, 47.4%, 11.2%)',
            },
            secondary: {
                DEFAULT: 'hsl(210, 40%, 96.1%)',
                foreground: 'hsl(222.2, 47.4%, 11.2%)',
            },
            success: {
                DEFAULT: 'hsl(142.1, 76.2%, 36.3%)',
                foreground: 'hsl(0, 0%, 100%)',
            },
            warning: {
                DEFAULT: 'hsl(48, 96%, 89%)',
                foreground: 'hsl(24, 9.8%, 10%)',
            },
            danger: {
                DEFAULT: 'hsl(0, 84.2%, 60.2%)',
                foreground: 'hsl(0, 0%, 100%)',
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: 'hsl(142, 70.5%, 46.5%)',
              foreground: 'hsl(0, 0%, 100%)',
            },
            background: 'hsl(222.2, 84%, 4.9%)',
            foreground: 'hsl(210, 40%, 96.1%)',
            default: {
                DEFAULT: 'hsl(217.2, 32.6%, 17.5%)',
                foreground: 'hsl(210, 40%, 96.1%)',
            },
            secondary: {
                DEFAULT: 'hsl(217.2, 32.6%, 17.5%)',
                foreground: 'hsl(210, 40%, 96.1%)',
            },
            success: {
                DEFAULT: 'hsl(142.1, 76.2%, 36.3%)',
                foreground: 'hsl(0, 0%, 100%)',
            },
            warning: {
                DEFAULT: 'hsl(48, 96%, 89%)',
                foreground: 'hsl(24, 9.8%, 10%)',
            },
            danger: {
                DEFAULT: 'hsl(0, 84.2%, 60.2%)',
                foreground: 'hsl(0, 0%, 100%)',
            },
          },
        },
      },
    }),
  ],
}
