import { useQuery } from "@tanstack/react-query";
import { getMeApi } from "./apis";
import { userKeys } from ".";

export const useGetMeQuery = () => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: getMeApi,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};