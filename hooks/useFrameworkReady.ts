import { useEffect } from 'react';

export function useFrameworkReady() {
  useEffect(() => {
    const globalObj = globalThis as { frameworkReady?: () => void };
    if (typeof globalObj.frameworkReady === 'function') {
      globalObj.frameworkReady();
    }
  });
}
