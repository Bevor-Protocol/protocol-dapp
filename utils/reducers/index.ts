import { SortLeaderI, LeaderboardI } from "../types";

export const sortLeaderboardReducer = (
  state: SortLeaderI,
  action: { key: string },
): SortLeaderI => {
  const { key } = action;
  const { decrease, arr } = state;

  const newArr = arr.sort((a, b) => {
    const aVal = a[key as keyof LeaderboardI];
    const bVal = b[key as keyof LeaderboardI];
    return aVal > bVal ? 2 * Number(decrease) - 1 : bVal > aVal ? 2 * Number(!decrease) - 1 : 0;
  });
  return { key, decrease: !decrease, arr: newArr };
};
