/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "outline-variant": "#bac9c9",
        "primary-container": "#00ced1",
        "error": "#ba1a1a",
        "tertiary-container": "#a4b7ff",
        "inverse-surface": "#2d3133",
        "on-secondary-container": "#007070",
        "on-background": "#191c1e",
        "tertiary-fixed": "#dce1ff",
        "surface-container-lowest": "#ffffff",
        "outline": "#6b7a7a",
        "on-tertiary-container": "#2a4494",
        "on-primary": "#ffffff",
        "primary-fixed-dim": "#2ddbde",
        "surface-variant": "#e0e3e5",
        "on-primary-fixed": "#002020",
        "on-error-container": "#93000a",
        "on-surface": "#191c1e",
        "on-secondary-fixed-variant": "#004f4f",
        "surface-container-low": "#f2f4f6",
        "error-container": "#ffdad6",
        "surface-container": "#eceef0",
        "surface-tint": "#00696b",
        "on-tertiary": "#ffffff",
        "inverse-primary": "#2ddbde",
        "background": "#f7f9fb",
        "on-secondary": "#ffffff",
        "surface-container-high": "#e6e8ea",
        "secondary": "#006a6a",
        "surface": "#f7f9fb",
        "on-primary-container": "#005354",
        "secondary-fixed-dim": "#6fd7d6",
        "tertiary": "#4059aa",
        "primary": "#00696b",
        "surface-container-highest": "#e0e3e5",
        "on-primary-fixed-variant": "#004f51",
        "primary-fixed": "#5af8fb",
        "inverse-on-surface": "#eff1f3",
        "surface-bright": "#f7f9fb",
        "on-error": "#ffffff",
        "surface-dim": "#d8dadc",
        "on-secondary-fixed": "#002020",
        "tertiary-fixed-dim": "#b6c4ff",
        "on-tertiary-fixed-variant": "#264191",
        "secondary-fixed": "#8cf3f3",
        "on-tertiary-fixed": "#00164e",
        "on-surface-variant": "#3b4949",
        "secondary-container": "#8cf3f3"
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px"
      },
      spacing: {
        "margin-desktop": "48px",
        "margin-mobile": "16px",
        base: "8px",
        gutter: "24px",
        "container-max": "1280px"
      },
      fontFamily: {
        "display-lg-mobile": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"]
      },
      fontSize: {
        "display-lg-mobile": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-sm": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "500" }]
      }
    }
  },
  plugins: []
}