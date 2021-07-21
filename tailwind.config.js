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
        "132": "32rem",
        "85%": "85%",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
