const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /bg-(red|green|yellow|indigo)-(100|200|600|700|900)/,
    },
    {
      pattern: /text-(red|green|yellow|indigo)-(100|200|600|700|900)/,
    },
  ],
  theme: {
    screens:{
      "xs": "475px",
      ...defaultTheme.screens
    },
    extend: {
      flex:{
        "2": "2 2 0%",
        "3": "3 3 0%",
        "4": "4 4 0%"
      },
      maxWidth: {
        "8xl": "1920px"
      }
    },
  },
  variants:{
    extend:{
      opacity:["disabled"],
      cursor:["disabled"]
    }
  },
  plugins: [],
}

