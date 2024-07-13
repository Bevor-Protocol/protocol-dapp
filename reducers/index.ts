export const contractWriteReducer = (
  state: Record<string, boolean>,
  action: Record<string, boolean>,
): { [key: string]: boolean } => {
  Object.entries(action).forEach(([key, value]) => {
    if (key in state) {
      state[key] = value;
    }
  });
  return state;
};

export const modalReducer = (state: string, action?: string): string => {
  if (state == "none") {
    return action || "modal";
  }
  return "none";
};

export const toggleReducer = (state: boolean): boolean => {
  return !state;
};

export const genericToggleReducer = (s: boolean): boolean => !s;
