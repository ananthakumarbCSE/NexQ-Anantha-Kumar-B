/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F172A", // slate-900
        card: "#1E293B",       // slate-800
        border: "#334155",     // slate-700
        primary: "#2563EB",    // blue-600
        success: "#22C55E",    // emerald-500
        warning: "#F59E0B",    // amber-500
        danger: "#EF4444",     // red-500
        surface: "#1E293B",
        muted: "#94A3B8",      // slate-400
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
