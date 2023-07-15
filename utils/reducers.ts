type ArrI = {
  name: string;
  money: number;
  active: number;
  completed: number;
  available: boolean;
};

type SortLeaderI = {
  key: string;
  decrease: boolean;
  arr: ArrI[];
};

export const sortLeaderboardReducer = (
  state: SortLeaderI,
  action: { key: string },
): SortLeaderI => {
  const { key } = action;
  const { decrease, arr } = state;

  const newArr = arr.sort((a, b) => {
    const aVal = a[key as keyof ArrI];
    const bVal = b[key as keyof ArrI];
    return aVal > bVal ? 2 * Number(decrease) - 1 : bVal > aVal ? 2 * Number(!decrease) - 1 : 0;
  });
  return { key, decrease: !decrease, arr: newArr };
};
