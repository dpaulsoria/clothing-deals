import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Añade esta línea para habilitar el modo oscuro
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      height: {
        '1/10-screen': '10vh',
        '2/10-screen': '20vh',
        '3/10-screen': '30vh',
        '4/10-screen': '40vh',
        '5/10-screen': '50vh',
        '6/10-screen': '60vh',
        '7/10-screen': '70vh',
        '8/10-screen': '80vh',
        '9/10-screen': '90vh',
      },
      width: {
        '1/10-screen': '10vw',
        '2/10-screen': '20vw',
        '3/10-screen': '30vw',
        '4/10-screen': '40vw',
        '5/10-screen': '50vw',
        '6/10-screen': '60vw',
        '7/10-screen': '70vw',
        '8/10-screen': '80vw',
        '9/10-screen': '90vw',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-5px)' },
        },
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;
