import { Abi, Address, createPublicClient, http } from "viem";
import { localhost } from "viem/chains";

import ERC20Abi from "@/contracts/abis/ERC20Token";
import BevorABI from "@/contracts/abis/BevorProtocol";
import { AuditContractView } from "@/lib/types";

const publicClient = {
  localhost: createPublicClient({
    chain: localhost,
    transport: http(),
  }),
};

export const getBalance = (): Promise<number> => {
  return publicClient.localhost
    .readContract({
      address: ERC20Abi.address as Address,
      abi: ERC20Abi.abi as Abi,
      functionName: "allowance",
      args: ["0x97a25B755D6Df6e171d03B46F16D9b806827fcCd", BevorABI.address],
    })
    .then((data) => {
      return data as number;
    })
    .catch((error) => {
      console.log(error);
      return 0;
    });
};

export const getAudit = (auditId: bigint): Promise<AuditContractView | null> => {
  return publicClient.localhost
    .readContract({
      address: BevorABI.address as Address,
      abi: BevorABI.abi as Abi,
      functionName: "audits",
      args: [auditId],
    })
    .then((data) => {
      const dataTyped = data as AuditContractView;
      return dataTyped;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
};
