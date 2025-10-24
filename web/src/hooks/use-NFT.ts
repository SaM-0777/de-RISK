import { fetcher } from "@/app/fetcher";
import { usePrivy } from "@privy-io/react-auth";
import useSWR from "swr";
import { Hex } from "viem";

export function useBalance(policyAddress: Hex) {
  const { user } = usePrivy();
  const route = `/api/policy/nft`;
  const mutationKey = route + "-" + policyAddress.toString();
  const {
    data: userNFT,
    error: userNFTError,
    isLoading: userNFTIsLoading,
  } = useSWR<UserPolicyNFT>(
    user?.wallet?.address ? mutationKey : null,
    async () =>
      fetcher(route, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userWalletAddress: user?.wallet?.address,
          policyAddress: policyAddress.toString(),
        }),
      }),
    {
      revalidateOnMount: true,
      revalidateIfStale: true,
      revalidateOnReconnect: true,
      revalidateOnFocus: true,
    }
  );

  return {
    userNFTMutationKey: mutationKey,
    userNFT,
    userNFTIsLoading,
    userNFTError,
  };
}
