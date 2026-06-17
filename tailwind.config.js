/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-background)',
        sidebar: 'var(--bg-sidebar)',
        card: 'var(--bg-card)',
        borderLight: 'var(--border-color)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        primary: {
          main: 'var(--color-primary)',
        },
        success: {
          main: 'var(--color-success)',
        },
        warning: {
          main: 'var(--color-warning)',
        },
        danger: {
          main: 'var(--color-danger)',
        }
      }
    },
  },
  plugins: [],
}
