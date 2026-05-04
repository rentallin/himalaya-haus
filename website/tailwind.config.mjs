import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'brand-ocker':       '#C17F45',
        'brand-erde':        '#8B5E2F',
        'brand-rot':         '#8B2E2E',
        'brand-blau':        '#4A7FA5',
        'brand-creme':       '#F9F4EE',
        'brand-text':        '#2D2D2D',
        'brand-ocker-light': '#D9A472',
        'brand-ocker-dark':  '#9E6330',
        'brand-blau-light':  '#6DA0C0',
        'brand-creme-dark':  '#EDE5D8',
      },
      fontFamily: {
        serif: ['Lora', ...defaultTheme.fontFamily.serif],
        sans:  ['Source Sans 3', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 5vw, 4rem)',    { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h1':      ['clamp(2rem, 4vw, 3rem)',       { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'h2':      ['clamp(1.5rem, 3vw, 2.25rem)',  { lineHeight: '1.25' }],
        'h3':      ['clamp(1.25rem, 2.5vw, 1.75rem)',{ lineHeight: '1.3' }],
        'h4':      ['1.125rem',                     { lineHeight: '1.4'  }],
        'body-lg': ['1.125rem',                     { lineHeight: '1.7'  }],
        'body':    ['1rem',                         { lineHeight: '1.7'  }],
        'small':   ['0.875rem',                     { lineHeight: '1.5'  }],
        'caption': ['0.75rem',                      { lineHeight: '1.5'  }],
      },
      spacing: {
        'section-sm': '4rem',
        'section':    '6rem',
        'section-lg': '8rem',
      },
      maxWidth: {
        'content':      '72rem',
        'content-wide': '90rem',
        'prose':        '68ch',
      },
      borderRadius: {
        'card': '0.75rem',
      },
      boxShadow: {
        'card':    '0 2px 12px 0 rgba(45,45,45,0.08)',
        'card-lg': '0 8px 32px 0 rgba(45,45,45,0.12)',
        'btn':     '0 2px 8px 0 rgba(193,127,69,0.30)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(to bottom, rgba(45,45,45,0.55) 0%, rgba(45,45,45,0.2) 60%, rgba(45,45,45,0) 100%)',
        'gradient-cta':  'linear-gradient(135deg, #C17F45 0%, #8B5E2F 100%)',
        'gradient-rot':  'linear-gradient(135deg, #8B2E2E 0%, #5C1E1E 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
