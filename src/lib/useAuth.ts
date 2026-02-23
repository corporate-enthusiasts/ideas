"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useAuth() {
  const { data } = useSWR<{ authenticated: boolean }>("/api/auth/status", fetcher);
  return { isAuthenticated: data?.authenticated ?? false };
}
