import useSWR from "swr";
import { usePrivy } from "@privy-io/react-auth";
import { fetcher } from "@/app/fetcher";

export function useGetUserPolicies() {
  const { user } = usePrivy();
  const mutationKey = `/api/policy`;
  const {
    data: userPolicies,
    isLoading: isLoadingUserPolicies,
    error: errorUserPolicies,
  } = useSWR<{
    data: {
      userPolicies: {
        user_policy: UserPolicy;
        policy_template: PolicyTemplate;
      }[];
      premiums: Premium[];
    };
  }>(user?.wallet?.address ? mutationKey : null, async () =>
    fetcher(`${mutationKey}/${user?.wallet?.address}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    })
  );

  return {
    mutationKey,
    userPolicies,
    isLoadingUserPolicies,
    errorUserPolicies,
  };
}

export function usePremium(slug: string) {
  const { user } = usePrivy();
  const mutationKey = `/api/policy`;
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
