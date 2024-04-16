/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./frontend/src/**/*.{js,jsx,ts,tsx}",
    "./frontend/src/pages/*.{js,jsx,ts,tsx}",
    "./frontend/src/components/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      backgroundImage: {
        "hero-texture": "url('/src/assets/images/hero-texture.png')",
        "hero-texture-1": "url('/src/assets/images/hero-texture-1.png')",
      },
      backgroundColor: {
        primary: "#45496a",
        secondary: "#7d8bae",
        tertiary: "#e5857b",
        quaternary: "#f1b2b2",
        quinary: "#e8ccc7",
        hoverSecondary: "#707D9C",
        hoverTertiary: "#CE776E",
        hoverQuaternary: "#D8A0A0",
        hoverQuinary: "#D0B7B3",
      },
      textColor: {
        primary: "#45496a",
        secondary: "#7d8bae",
        tertiary: "#e5857b",
        quaternary: "#f1b2b2",
        quinary: "#e8ccc7",
        desc: "#868686",
      },
    },

    /*
    screens: {
      sm: { min: "0", max: "767px" },
      // => @media (min-width: 640px and max-width: 767px) { ... }

      md: { min: "768px" },
      // => @media (min-width: 768px and max-width: 1023px) { ... }

      lg: { min: "768px", max: "1279px" },
      // => @media (min-width: 1024px and max-width: 1279px) { ... }

      xl: { min: "1280px", max: "1535px" },
      // => @media (min-width: 1280px and max-width: 1535px) { ... }

      "2xl": { min: "1536px" },
      // => @media (min-width: 1536px) { ... }
    },*/
    fontFamily: {
      raleway: ["Raleway-Regular", "sans-serif"],
      ralewayBold: ["Raleway-Bold", "sans-serif"],
      ralewaySemibold: ["Raleway-Semibold", "sans-serif"],
      leagueSpartanBold: ["LeagueSpartan-Bold", "sans-serif"],
      leagueSpartan: ["LeagueSpartan-Regular", "sans-serif"],
    },
  },
  plugins: ["@tailwindcss/forms"],
};
