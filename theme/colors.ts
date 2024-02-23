/**
 * Converts Hex #RRGGBB to RGB() value
 * @param {string} hexColor
 * @returns {{r: number; g: number; b: number}} r g b channel
 */
export const hexToRgb = (hexColor: string): { r: number; g: number; b: number } => {
  const hex = hexColor.replace(/^#/, "");

  const bigInt = parseInt(hex, 16);
  const r = (bigInt >> 16) & 255;
  const g = (bigInt >> 8) & 255;
  const b = bigInt & 255;

  return { r, g, b };
};

/**
 * Opacifies an input Hex color
 * @param {number} amount
 * @param {string} hexColor #RRBBGG
 * @returns {string} rgba color rgba(r,g,b,a)
 */
export const opacify = (hexColor: string, amount: number): string => {
  const { r, g, b } = hexToRgb(hexColor);

  return `rgba(${r}, ${g}, ${b}, ${amount})`;
};

export const colors = {
  primary: "#004080",
  dark: "#121212",
  boldBlue: "#001062",
  darkBlue: "#000626",
  offWhite: "#F4F5F7",
  darkWhite: "#C8D0E7",
  grey: "#CCCCCC",
  darkGrey: "#0D111C",
  white: "#FFFFFF",
  black: "#000000",
  darkShadow: "rgba(0, 0, 0, 0.25)",
};

export const mainTheme = {
  bg: colors.dark,
  primary00: colors.primary,
  primary10: "color-mix(in oklab, #004080, #FFFFFF 15%)",
  primary20: "color-mix(in oklab, #004080, #FFFFFF 20%)",
  primary30: "color-mix(in oklab, #004080, #FFFFFF 25%)",
  primary40: "color-mix(in oklab, #004080, #FFFFFF 30%)",
  primary50: "color-mix(in oklab, #004080, #FFFFFF 35%)",
  primary60: "color-mix(in oklab, #004080, #FFFFFF 40%)",
  primary70: "color-mix(in oklab, #004080, #FFFFFF 50%)",
  primaryMix10: "color-mix(in oklab, #121212, #004080 15%)",
  primaryMix20: "color-mix(in oklab, #121212, #004080 20%)",
  primaryMix30: "color-mix(in oklab, #121212, #004080 25%)",
  primaryMix40: "color-mix(in oklab, #121212, #004080 30%)",
  primaryMix50: "color-mix(in oklab, #121212, #004080 35%)",
  primaryMix60: "color-mix(in oklab, #121212, #004080 40%)",
  primaryMix70: "color-mix(in oklab, #121212, #004080 50%)",
  dark10: "color-mix(in oklab, #121212, #FFFFFF 3%)",
  dark20: "color-mix(in oklab, #121212, #FFFFFF 5%)",
  dark30: "color-mix(in oklab, #121212, #FFFFFF 10%)",
  dark40: "color-mix(in oklab, #121212, #FFFFFF 15%)",
  dark50: "color-mix(in oklab, #121212, #FFFFFF 20%)",
  dark60: "color-mix(in oklab, #121212, #FFFFFF 25%)",
  dark70: "color-mix(in oklab, #121212, #FFFFFF 30%)",
  tagBg: opacify("#0d6efd", 0.5),
  tagText: "#0d6efd",
  greyBorder: opacify(colors.grey, 0.2),
  boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.145), 0px 1px 2px rgba(0,0,0,.16)",
  textGradDark: `linear-gradient(180deg, ${colors.boldBlue} 0%, ${colors.darkBlue} 100%)`,
  textGradLight: `linear-gradient(180deg, ${colors.offWhite} 6.58%, ${colors.darkWhite} 81.58%)`,
  textPrimary: opacify(colors.white, 0.87),
  textSecondary: opacify(colors.white, 0.6),
  textFaint: colors.grey,
  textDark: colors.black,
  whiteHover: opacify(colors.white, 0.5),
};
