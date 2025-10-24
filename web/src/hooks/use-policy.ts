import useSWR from "swr";
import { usePrivy } from "@privy-io/react-auth";
import { fetcher, gFetcher } from "@/app/fetcher";
import { gql } from "graphql-request";

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

export function useUserPolicies() {
  const { user } = usePrivy();
  const mutationKey = gql`
    query Policies($owner: String!) {
      PolicyContract_PolicyPurchased(where: { owner: { _eq: $owner } }) {
        amount
        expiry
        id
        owner
        policySlug
        tokenId
        tokenURI
      }
    }
  `;

  const { data, error, isLoading } = useSWR<{
    PolicyContract_PolicyPurchased: PolicyContractPolicyPurchased[];
  }>(
    user?.wallet?.address
      ? [mutationKey, { owner: user?.wallet?.address }]
      : null,
    gFetcher
  );

  return {
    data,
    error,
    isLoading,
  };
}

export function usePolicyPurchasedByPolicySlug(policySlug: string) {
  const { user } = usePrivy();
  const mutationKey = gql`
    query Policies($owner: String!, $policySlug: String!) {
      PolicyContract_PolicyPurchased(
        where: { owner: { _eq: $owner }, policySlug: { _eq: $policySlug } }
      ) {
        amount
        expiry
        id
        owner
        policySlug
        tokenId
        tokenURI
      }
    }
  `;

  const { data, error, isLoading } = useSWR<{
    PolicyContract_PolicyPurchased: PolicyContractPolicyPurchased[];
  }>(
    user?.wallet?.address
      ? [mutationKey, { owner: user?.wallet?.address, policySlug }]
      : null,
    gFetcher
  );

  return {
    data,
    error,
    isLoading,
  };
}
