export const configThemeMantineMain: any = {
  // * COLORS & SHADES
  colors: {
    brand: [
      "#f2fbf6", // 50
      "#d3f4e3", // 100
      "#a6e9c7", // 200
      "#72d6a7", // 300
      "#45bc88", // 400
      "#2ca070", // 500
      "#20815a", // 600
      "#1e674a", // 700
      "#1c533e", // 800
      "#1c4536", // 900
      "#010403", // 950
    ],
  },
  primaryColor: "brand",
  primaryShade: {
    light: 6,
    dark: 5,
  },
  autoContrast: true,
  luminanceThreshold: 0.5,

  white: "#fefefe",
  black: "#111",

  // * FONTS
  fontFamily: `"Stack Sans Headline", sans-serif`,
  fontSmoothing: true,

  headings: {
    fontFamily: `"Stack Sans Headline", sans-serif`,
    sizes: {
      h1: { fontSize: "36" },
    },
  },
};
