"use client";

import { useState, useCallback } from "react";
import { Match } from "./types";
import { parseMatch } from "./scoring";
import { usePolling } from "./usePolling";

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch("/api/matches");
      if (!res.ok) {
        if (res.status === 401) {
          setError("sign-in");
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch");
      }
      const data = await res.json();
      const parsed = (data.matches as string[][])
        .map(parseMatch)
        .filter((m): m is Match => m !== null);
      setMatches(parsed);
      setError(null);
    } catch {
      setError("Failed to load match data");
    } finally {
      setLoading(false);
    }
  }, []);

  usePolling(fetchMatches);

  return { matches, loading, error, refetch: fetchMatches };
}
