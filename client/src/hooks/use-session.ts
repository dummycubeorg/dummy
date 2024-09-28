import { ServerResponse } from "@/lib/types";
import ky from "ky";
import { useMemo } from "react";
import useSWR from "swr";

type UserSession = {
  id: number;
  username: string;
  email: string;
};

const getUser = async (): Promise<UserSession | null> => {
  const response = await ky
    .get<ServerResponse>(`${import.meta.env.VITE_API_URL}/v1/me`, {
      credentials: "include",
    })
    .json();

  if (response.error) {
    return null;
  }

  return response.data as UserSession;
};

export function useSession() {
  const { data, error, isLoading } = useSWR("/api/v1/me", getUser);

  return useMemo(() => {
    if (isLoading) {
      return { isLoading: true, user: null };
    }

    if (error) {
      return { isLoading: false, user: null };
    }

    return { isLoading: false, user: data };
  }, [data, error, isLoading]);
}
