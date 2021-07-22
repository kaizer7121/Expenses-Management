module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        "1/8": "12.5%",
        "5/24": "20.83%",
      },
      minHeight: {
        small: "11rem",
        large: "14rem",
        "5/6": "83.3333%",
      },
      maxHeight: {
        84: "21rem",
        88: "22rem",
        132: "32rem",
        "85%": "85%",
      },
      colors: {
        "coral-reef": "#C1BC9E",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
