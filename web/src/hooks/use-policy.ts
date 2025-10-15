import useSWR from "swr";
import { usePrivy } from "@privy-io/react-auth";
import { fetcher } from "@/app/fetcher";

export function useGetPolicies() {
  const { ready } = usePrivy();
  const mutationKey = `/api/policy`;
  const {
    data: policies,
    isLoading: isLoadingPolicies,
    error: errorPolicies,
  } = useSWR<Policy[]>(ready ? mutationKey : null, async () =>
    fetcher(mutationKey, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    })
  );

  return {
    mutationKey,
    policies,
    isLoadingPolicies,
    errorPolicies,
  };
}
