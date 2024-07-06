import { ethers } from "ethers";
import { Abi, Address, createPublicClient, formatUnits, http } from "viem";
import { localhost } from "viem/chains";
import ERC20ABI from "@/contracts/abis/ERC20Token";
import BevorABI from "@/contracts/abis/BevorProtocol";
import { AuditContractView, VestingContractView } from "@/utils/types";
import { AvailableTokens } from "@/constants/web3";

const publicClient = {
  localhost: createPublicClient({
    chain: localhost,
    transport: http(),
  }),
};
const provider = new ethers.JsonRpcProvider();

export const getBalance = async (address: string): Promise<number> => {
  return publicClient.localhost
    .readContract({
      address: ERC20ABI.address as Address,
      abi: ERC20ABI.abi as Abi,
      functionName: "allowance",
      args: [address, BevorABI.address],
    })
    .then((data) => {
      return data as number;
    })
    .catch((error) => {
      console.log(error);
      return 0;
    });
};

export const getAudit = async (auditId: bigint): Promise<AuditContractView | null> => {
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

export const getAuditorVestingSchedule = async (
  auditId: bigint,
  user: Address,
  token: Address,
): Promise<{
  vestingScheduleId: bigint | null;
  releasable: string | null;
  withdrawn: string | null;
}> => {
  /*
    Multi-step contract read process.
    1. get the corresponding vestingScheduleID for an audit and auditor
      we'll need this later to be able to write to that vestingScheduleID
    2. get the corresponding vestingSchedule for that ID, we need to see the total withdrawn
    3. get the releasable amount (current amount claimable)
    */

  const returnObj = {
    vestingScheduleId: null as bigint | null,
    releasable: null as string | null,
    withdrawn: null as string | null,
  };
  // BE SURE TO REMOVE THIS WHEN OFF LOCALHOST.
  // WE MANUALLY FAST-FORWARD 1hr on every refresh.
  provider.send("evm_increaseTime", [3600]);
  provider.send("evm_mine", []);
  ///////////////////////////////////////////
  const tokenUse = AvailableTokens.localhost.find((t) => t.address == token);
  if (!tokenUse) {
    return Promise.resolve(returnObj);
  }

  return publicClient.localhost
    .readContract({
      address: BevorABI.address as Address,
      abi: BevorABI.abi as Abi,
      functionName: "getVestingScheduleIdByAddressAndAudit",
      args: [user, auditId],
    })
    .then((scheduleId: unknown) => {
      const scheduleIdTyped = scheduleId as bigint;
      returnObj.vestingScheduleId = scheduleIdTyped;
      return publicClient.localhost.readContract({
        address: BevorABI.address as Address,
        abi: BevorABI.abi as Abi,
        functionName: "vestingSchedules",
        args: [scheduleIdTyped],
      });
    })
    .then((vestingSchedule: unknown) => {
      const vestingScheduleTyped = vestingSchedule as VestingContractView;
      returnObj.withdrawn = formatUnits(vestingScheduleTyped[2], tokenUse.decimals);
      return publicClient.localhost.readContract({
        address: BevorABI.address as Address,
        abi: BevorABI.abi as Abi,
        functionName: "computeReleasableAmount",
        args: [returnObj.vestingScheduleId],
      });
    })
    .then((result) => {
      const resultTyped = result as bigint;
      returnObj.releasable = formatUnits(resultTyped, tokenUse.decimals);
      return returnObj;
    })
    .catch((error) => {
      console.log(error);
      return returnObj;
    });
};
