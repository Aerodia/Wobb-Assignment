import { useEffect, useState } from "react";

/**
 * Delays propagating `value` until the user has stopped changing it
 * for `delay` milliseconds. Prevents expensive operations (filtering,
 * API calls) from firing on every single keystroke.
 */
export function useDebounce<T>(value: T, delay: number = 200): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
