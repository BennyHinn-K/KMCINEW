/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          soft: "hsl(var(--primary-soft))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          soft: "hsl(var(--accent-soft))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          elevated: "hsl(var(--card-elevated))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          elevated: "hsl(var(--surface-elevated))",
        },
        ink: {
          DEFAULT: "hsl(var(--ink))",
          muted: "hsl(var(--ink-muted))",
          subtle: "hsl(var(--ink-subtle))",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        headline: ["var(--font-headline)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        label: ["var(--font-label)", "ui-sans-serif", "system-ui", "sans-serif"],
        metric: ["var(--font-metric)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
      },
      fontSize: {
        "display": ["clamp(2.75rem, 6vw + 1rem, 5.5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-sm": ["clamp(2.25rem, 4.5vw + 0.5rem, 4rem)", { lineHeight: "1", letterSpacing: "-0.025em", fontWeight: "700" }],
        "headline": ["clamp(1.875rem, 3vw + 0.5rem, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-sm": ["clamp(1.5rem, 2vw + 0.5rem, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "700" }],
        "lead": ["clamp(1.05rem, 0.6vw + 0.9rem, 1.375rem)", { lineHeight: "1.65", letterSpacing: "-0.005em", fontWeight: "400" }],
        "eyebrow": ["0.72rem", { lineHeight: "1", letterSpacing: "0.22em", fontWeight: "700" }],
      },
      spacing: {
        "2xs": "0.25rem",
        "xs": "0.5rem",
        "sm": "0.75rem",
        "md": "1rem",
        "lg": "1.5rem",
        "xl": "2rem",
        "2xl": "3rem",
        "3xl": "4.5rem",
        "4xl": "6rem",
        "section": "clamp(3.5rem, 10vw, 8rem)",
      },
      borderRadius: {
        "sm": "var(--radius-sm)",
        "md": "var(--radius-md)",
        "lg": "var(--radius-lg)",
        "xl": "calc(var(--radius-lg) + 8px)",
        "2xl": "calc(var(--radius-lg) + 16px)",
        "pill": "9999px",
        "organic": "42% 58% 63% 37% / 44% 40% 60% 56%",
        DEFAULT: "var(--radius-md)",
      },
      boxShadow: {
        "1": "0 1px 2px hsl(var(--shadow) / 0.04), 0 1px 3px hsl(var(--shadow) / 0.06)",
        "2": "0 2px 4px hsl(var(--shadow) / 0.05), 0 4px 12px hsl(var(--shadow) / 0.08)",
        "3": "0 8px 16px hsl(var(--shadow) / 0.08), 0 16px 32px hsl(var(--shadow) / 0.10)",
        "4": "0 16px 32px hsl(var(--shadow) / 0.10), 0 32px 64px hsl(var(--shadow) / 0.14)",
        "inner": "inset 0 1px 2px hsl(var(--shadow) / 0.08)",
        "glow": "0 0 0 1px hsl(var(--accent) / 0.25), 0 0 40px hsl(var(--accent) / 0.20)",
        "glow-strong": "0 0 0 1px hsl(var(--accent) / 0.45), 0 0 80px hsl(var(--accent) / 0.35)",
        "glass": "0 1px 0 hsl(0 0% 100% / 0.06) inset, 0 -1px 0 hsl(0 0% 0% / 0.08) inset, 0 8px 24px hsl(var(--shadow) / 0.18)",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>\")",
        "mesh-aurora": "radial-gradient(1200px 600px at 10% -10%, hsl(var(--accent) / 0.28), transparent 60%), radial-gradient(900px 500px at 110% 10%, hsl(var(--primary) / 0.22), transparent 55%), radial-gradient(700px 500px at 50% 120%, hsl(var(--accent) / 0.18), transparent 60%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-40% 0" },
          "100%": { backgroundPosition: "140% 0" },
        },
        "spotlight-pan": {
          "0%, 100%": { transform: "translate3d(-10%, -10%, 0) scale(1.05)" },
          "50%": { transform: "translate3d(10%, 10%, 0) scale(1.1)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.22s var(--ease-standard)",
        "accordion-up": "accordion-up 0.22s var(--ease-standard)",
        "fade-up": "fade-up 0.7s var(--ease-emphasis) both",
        "fade-in": "fade-in 0.5s var(--ease-standard) both",
        "shimmer": "shimmer 2.2s linear infinite",
        "spotlight-pan": "spotlight-pan 14s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
      },
      transitionTimingFunction: {
        "standard": "var(--ease-standard)",
        "emphasis": "var(--ease-emphasis)",
        "spring": "var(--ease-spring)",
      },
      transitionDuration: {
        "fast": "120ms",
        "normal": "220ms",
        "slow": "420ms",
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
