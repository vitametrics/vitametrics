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
        primary2: "#32354f",
        primary3: "#2b2e47",
        whitePrimary: "#f7faff",
        secondary: "#7d8bae",
        secondary2: "#6b6f8e",
        tertiary: "#e5857b",
        quaternary: "#f1b2b2",
        quinary: "#e8ccc7",
        hoverPrimary: "#5B5F7F",
        hoverSecondary: "#707D9C",
        hoverTertiary: "#CE776E",
        hoverQuaternary: "#D8A0A0",
        hoverQuinary: "#D0B7B3",
        lightmodePrimary: "#f5f5f5",
        lightmodeSecondary: "#F7FAFF",
        logoColor: "#F28D59",
      },
      textColor: {
        primary: "#45496a",
        primary2: "#32354f",
        primary3: "#2b2e47",
        secondary: "#7d8bae",
        secondary2: "#6b6f8e",
        tertiary: "#e5857b",
        quaternary: "#f1b2b2",
        quinary: "#e8ccc7",
        lightPrimary: "#EBEBEB",
        desc: "#868686",
      },
    },
    fontFamily: {
      raleway: ["Raleway-Regular", "sans-serif"],
      ralewayBold: ["Raleway-Bold", "sans-serif"],
      ralewaySemibold: ["Raleway-Semibold", "sans-serif"],
      leagueSpartanBold: ["LeagueSpartan-Bold", "sans-serif"],
      leagueSpartan: ["LeagueSpartan-Regular", "sans-serif"],
      leagueSpartanLight: ["LeagueSpartan-Light", "sans-serif"],
      libreFranklinBold: ["Libre Franklin", "sans-serif"],
      libreFranklin: ["Libre Franklin", "sans-serif"],
    },
  },
  plugins: ["@tailwindcss/forms"],
};
