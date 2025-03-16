
import { useRef, useCallback, useEffect } from 'react';

export const useRequestController = () => {
  const loadingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const createAbortController = useCallback(() => {
    // Abort any in-progress request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller
    abortControllerRef.current = new AbortController();
    
    // Set up a timeout to abort the request if it takes too long
    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }, 20000); // 20-second timeout
    
    return { 
      abortController: abortControllerRef.current,
      signal: abortControllerRef.current.signal, 
      timeoutId 
    };
  }, []);
  
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    loadingRef.current = false;
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
  
  return {
    loadingRef,
    abortControllerRef,
    createAbortController,
    cleanup
  };
};
