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
  primaryMix15: "color-mix(in oklab, #121212, #004080 15%)",
  primaryMix25: "color-mix(in oklab, #121212, #004080 25%)",
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
  cardBg: colors.primaryMix25,
  cardBgHover: colors.primaryMix15,
  greyBorder: opacify(colors.grey, 0.2),
  textGradDark: `linear-gradient(180deg, ${colors.boldBlue} 0%, ${colors.darkBlue} 100%)`,
  textGradLight: `linear-gradient(180deg, ${colors.offWhite} 6.58%, ${colors.darkWhite} 81.58%)`,
  textPrimary: opacify(colors.white, 0.87),
  textSecondary: opacify(colors.white, 0.6),
  textFaint: colors.grey,
  textDark: colors.black,
  whiteHover: opacify(colors.white, 0.5),
};
