/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        shake: "shake 0.5s ease-in-out",
        glitter: "glitter 1.5s linear infinite", // Add glitter animation
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "50%": { transform: "translateX(5px)" },
          "75%": { transform: "translateX(-5px)" },
        },
        glitter: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "100% 100%" },
        },
      },
    },
  },
  plugins: [],
};
