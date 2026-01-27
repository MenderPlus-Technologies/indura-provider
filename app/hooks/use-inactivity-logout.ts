import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type UseInactivityLogoutOptions = {
  timeoutMs?: number;
  checkEveryMs?: number;
  storageKey?: string;
};

/**
 * Logs out the current user after a period of inactivity.
 * - Tracks activity events (mouse/keyboard/scroll/touch).
 * - Syncs last activity across tabs using localStorage.
 */
export function useInactivityLogout(
  onTimeout: () => void,
  { timeoutMs = 10 * 60 * 1000, checkEveryMs = 2_000, storageKey = 'indura:lastActivityAt' }: UseInactivityLogoutOptions = {}
) {
  const [isExpired, setIsExpired] = useState(false);

  const isExpiredRef = useRef(false);
  const lastActivityRef = useRef<number>(Date.now());
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const readLastActivity = useCallback((): number => {
    if (typeof window === 'undefined') return Date.now();
    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) ? parsed : Date.now();
  }, [storageKey]);

  const writeLastActivity = useCallback(
    (ts: number) => {
      if (typeof window === 'undefined') return;
      try {
        window.localStorage.setItem(storageKey, String(ts));
      } catch {
        // ignore quota / privacy mode errors
      }
    },
    [storageKey]
  );

  const markActivity = useCallback(() => {
    if (isExpiredRef.current) return;
    const now = Date.now();
    lastActivityRef.current = now;
    writeLastActivity(now);
  }, [writeLastActivity]);

  const events = useMemo(
    () =>
      [
        'mousemove',
        'mousedown',
        'keydown',
        'scroll',
        'touchstart',
        'click',
        'focus',
      ] as const,
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize from storage (supports multiple tabs)
    const initial = readLastActivity();
    lastActivityRef.current = initial;

    const onStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      const ts = readLastActivity();
      lastActivityRef.current = ts;
    };

    const onVisibility = () => {
      if (!document.hidden) markActivity();
    };

    // Light throttling to avoid over-writing on mousemove/scroll
    let lastWrite = 0;
    const throttled = () => {
      const now = Date.now();
      if (now - lastWrite < 1_000) return;
      lastWrite = now;
      markActivity();
    };

    events.forEach((evt) => window.addEventListener(evt, throttled, { passive: true } as AddEventListenerOptions));
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVisibility);

    const interval = window.setInterval(() => {
      if (isExpiredRef.current) return;
      const last = readLastActivity();
      lastActivityRef.current = last;
      if (Date.now() - last >= timeoutMs) {
        isExpiredRef.current = true;
        setIsExpired(true);
        onTimeoutRef.current();
      }
    }, checkEveryMs);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, throttled as any));
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearInterval(interval);
    };
  }, [checkEveryMs, events, markActivity, readLastActivity, storageKey, timeoutMs]);

  const reset = useCallback(() => {
    isExpiredRef.current = false;
    setIsExpired(false);
    markActivity();
  }, [markActivity]);

  return { isExpired, reset };
}

