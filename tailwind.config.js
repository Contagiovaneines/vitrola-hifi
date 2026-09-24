/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface": "var(--color-surface, #161311)",
        "surface-dim": "var(--color-surface-dim, #161311)",
        "surface-bright": "var(--color-surface-bright, #3c3836)",
        "surface-container-lowest": "var(--color-surface-container-lowest, #100e0c)",
        "surface-container-low": "var(--color-surface-container-low, #1e1b19)",
        "surface-container": "var(--color-surface-container, #221f1d)",
        "surface-container-high": "var(--color-surface-container-high, #2d2927)",
        "surface-container-highest": "var(--color-surface-container-highest, #383432)",
        "on-surface": "var(--color-on-surface, #e9e1dd)",
        "on-surface-variant": "var(--color-on-surface-variant, #d4c4b5)",
        "inverse-surface": "#e9e1dd",
        "inverse-on-surface": "#33302d",
        "outline": "var(--color-outline, #9d8e81)",
        "outline-variant": "var(--color-outline-variant, #50453a)",
        "primary": "var(--color-primary, #fec486)",
        "on-primary": "var(--color-on-primary, #482900)",
        "primary-container": "var(--color-primary-container, #e0a96d)",
        "on-primary-container": "var(--color-on-primary-container, #633d09)",
        "primary-fixed": "#ffddbb",
        "primary-fixed-dim": "#f5bc7e",
        "secondary": "var(--color-secondary, #ffb95f)",
        "on-secondary": "#472a00",
        "secondary-container": "var(--color-secondary-container, #ee9800)",
        "on-secondary-container": "#5b3800",
        "secondary-fixed": "#ffddb8",
        "secondary-fixed-dim": "#ffb95f",
        "tertiary": "#ffc2a7",
        "on-tertiary": "#571e00",
        "tertiary-container": "#ff9a6b",
        "on-tertiary-container": "#7a2d00",
        "error": "#ffb4ab",
        "on-error": "#690005",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "sm": "0.125rem",
        "md": "0.375rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        "gutter": "1rem",
        "gutter-compact": "0.5rem",
        "gutter-loose": "1.5rem",
        "margin-window": "0.75rem"
      },
      fontFamily: {
        "display": ["Syne", "sans-serif"],
        "headline": ["Plus Jakarta Sans", "sans-serif"],
        "body": ["Plus Jakarta Sans", "sans-serif"],
        "mono": ["Space Mono", "monospace"]
      }
    },
  },
  plugins: [],
}
