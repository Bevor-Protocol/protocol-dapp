import { useEffect, useRef, useState } from "react";

export const useDebounce = <T,>({
  data,
  duration = 500,
}: {
  data: T;
  duration?: number;
}): {
  timeoutPending: boolean;
  debouncedData: T;
} => {
  const [timeoutPending, setTimeoutPending] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [debouncedData, setDebouncedData] = useState<T>(data);

  useEffect(() => {
    // this prevents unwanted "loading state" on initial mount.
    // these values will be equal ONLY on mount.
    if (data === debouncedData) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setTimeoutPending(true);
    timeoutRef.current = setTimeout(() => {
      setTimeoutPending(false);
      setDebouncedData(data);
    }, duration);

    return (): void => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, duration]);

  // timeoutPending can be used to mock a loading state on the client
  return {
    timeoutPending,
    debouncedData,
  };
};
