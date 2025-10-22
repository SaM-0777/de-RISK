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

export function usePremium(slug: string) {
  const { user } = usePrivy();
  const mutationKey = `/api/policy/premium`;
  const {
    data: premiums,
    isLoading: isLoadingPremiums,
    error: errorPremiums,
  } = useSWR<{
    data: { premiums: Premium[]; userPolicies: UserPolicy[] };
    totalCount: number;
  }>(user?.wallet?.address ? mutationKey : null, async () =>
    fetcher(`${mutationKey}/${user?.wallet?.address}/${slug}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    })
  );

  return {
    mutationKey,
    premiums,
    isLoadingPremiums,
    errorPremiums,
  };
}
