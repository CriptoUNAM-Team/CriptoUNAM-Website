/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  corePlugins: {
    /**
     * El reset de Tailwind pisaría las ~3200 líneas de CSS propio del sitio
     * (global.css, puma-animations.css, WalletButton.css) y rompería todas las
     * páginas aún sin migrar. Se activa cuando la migración termine y ese CSS
     * se retire.
     */
    preflight: false,
  },

  theme: {
    extend: {
      colors: {
        /** Cian eléctrico del nuevo lenguaje visual. */
        accent: {
          DEFAULT: '#00D9FF',
          soft: 'rgba(0, 217, 255, 0.1)',
          border: 'rgba(0, 217, 255, 0.3)',
        },
        /** Acento secundario para degradados. */
        violet: {
          brand: '#7C3AED',
        },
        /** Fondo base: negro puro, no el gris de Tailwind. */
        ink: '#0a0a0a',
        /** Dorado heredado, para convivir con lo no migrado. */
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F4D03F',
        },
      },

      fontFamily: {
        // El diseño usa Inter también para las etiquetas `font-mono`.
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Inter', 'system-ui', 'sans-serif'],
      },

      letterSpacing: {
        label: '0.15em',
      },

      transitionDuration: {
        reveal: '700ms',
      },

      backdropBlur: {
        glass: '12px',
      },
    },
  },

  plugins: [],
}
