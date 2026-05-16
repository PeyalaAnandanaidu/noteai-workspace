import { useState, useEffect } from 'react';

// Delays updating a value until the user stops typing
// Used for search to avoid API calls on every keystroke
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // Cleanup prevents memory leaks
  }, [value, delay]);

  return debouncedValue;
}