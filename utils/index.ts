export const cn = (...args: unknown[]): string => {
  return args
    .flat()
    .filter((x) => typeof x === "string")
    .join(" ")
    .trim();
};
