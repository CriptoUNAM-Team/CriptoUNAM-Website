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
        /**
         * Paleta de Goya Hack, muestreada del cartel oficial
         * (Goya-post-IG.png): ámbar sobre negro casi puro, con azul marino
         * profundo en las formas geométricas y la retícula.
         */
        goya: {
          /** Ámbar de la G de píxeles y de los subrayados. */
          amber: '#E9AF3C',
          /** Ámbar apagado, para estados hover y bordes. */
          ember: '#B0842E',
          /** Blanco frío del lettering "GOYA HACK". */
          paper: '#ECF7FF',
          /** Negro base del cartel: no es #000, tira ligeramente a azul. */
          void: '#010004',
          /** Azul marino de las formas y del degradado inferior. */
          navy: '#112441',
          /** Azul de la retícula de fondo. */
          grid: 'rgba(56, 112, 189, 0.14)',
        },

        /** Cian eléctrico del rediseño general del sitio (fuera del hackathon). */
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        /**
         * Display del cartel: esquinas achaflanadas. Solo la usa el hackathon,
         * de ahí el nombre propio en vez de pisar `sans`.
         */
        display: ['"Chakra Petch"', 'Inter', 'system-ui', 'sans-serif'],
        /** Etiquetas técnicas y snippets de código, como en el cartel. */
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
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
