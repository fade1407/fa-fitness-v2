"use client";

import { useEffect, useRef, useState } from "react";

export function useSessionTimer() {
  const startedAt = useRef<number | null>(null);
  const pausedAt = useRef<number | null>(null);
  const pausedSeconds = useRef(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (startedAt.current === null) startedAt.current = Date.now();
    if (!isRunning) return;
    const refresh = () => setElapsedSeconds(Math.floor((Date.now() - (startedAt.current ?? Date.now())) / 1000) - pausedSeconds.current);
    refresh();
    const interval = window.setInterval(refresh, 1000);
    return () => window.clearInterval(interval);
  }, [isRunning]);

  function pause() { if (startedAt.current === null) startedAt.current = Date.now(); pausedAt.current = Date.now(); setIsRunning(false); }
  function resume() {
    if (pausedAt.current) pausedSeconds.current += Math.floor((Date.now() - pausedAt.current) / 1000);
    pausedAt.current = null; setIsRunning(true);
  }
  return { elapsedSeconds, isRunning, pause, resume };
}
