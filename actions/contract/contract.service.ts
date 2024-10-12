import { AvailableTokens } from "@/constants/web3";
import BevorABI from "@/contracts/abis/BevorProtocol";
import ERC20ABI from "@/contracts/abis/ERC20Token";
import {
  AuditContractStructuredI,
  AuditContractView,
  VestingContractView,
  VestingScheduleStructuredI,
} from "@/utils/types/contracts";
import { ethers, JsonRpcProvider } from "ethers";
import {
  Abi,
  Address,
  Chain,
  createPublicClient,
  formatUnits,
  http,
  HttpTransport,
  PublicClient,
} from "viem";
import { base, baseSepolia, localhost } from "viem/chains";

/* 
TODO: I might need to store the network in the DB.
someone could not be connected to any network, but should still be able to
view an audit. Maybe we just constrain it to a single network, so we always
know exactly which network to read the contracts from.
*/

const getNetworkUse = (): Chain => {
  switch (process.env.NETWORK_USE) {
    case "localhost":
      return localhost;
    case "testnet":
      return baseSepolia;
  }
  return base;
};

class ContractService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publicClient: PublicClient<HttpTransport, any>;

  provider: JsonRpcProvider;

  constructor() {
    const chain = getNetworkUse();
    this.publicClient = createPublicClient({
      chain,
      transport: http(),
    });
    this.provider = new ethers.JsonRpcProvider();
  }

  getBalance(address: string): Promise<number> {
    return this.publicClient
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
  }

  getAudit(auditId: bigint): Promise<AuditContractStructuredI | null> {
    return this.publicClient
      .readContract({
        address: BevorABI.address as Address,
        abi: BevorABI.abi as Abi,
        functionName: "audits",
        args: [auditId],
      })
      .then((data) => {
        const dataTyped = data as AuditContractView;
        return {
          protocolOwner: dataTyped[0],
          token: dataTyped[1],
          amount: dataTyped[2],
          duration: dataTyped[3],
          cliff: dataTyped[4],
          start: dataTyped[5],
          invalidatingProposalId: dataTyped[6],
          isActive: dataTyped[7],
        };
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  }

  getAuditorVestingSchedule(
    auditId: bigint,
    user: Address,
    token: Address,
  ): Promise<VestingScheduleStructuredI> {
    const returnObj: VestingScheduleStructuredI = {
      vestingScheduleId: null,
      releasable: null,
      withdrawn: null,
    };
    // BE SURE TO REMOVE THIS WHEN OFF LOCALHOST.
    // WE MANUALLY FAST-FORWARD 1hr on every refresh.
    this.provider.send("evm_increaseTime", [3600]);
    this.provider.send("evm_mine", []);
    ///////////////////////////////////////////
    const tokenUse = AvailableTokens.localhost.find((t) => t.address == token);
    if (!tokenUse) {
      return Promise.resolve(returnObj);
    }

    return this.publicClient
      .readContract({
        address: BevorABI.address as Address,
        abi: BevorABI.abi as Abi,
        functionName: "getVestingScheduleIdByAddressAndAudit",
        args: [user, auditId],
      })
      .then((scheduleId: unknown) => {
        const scheduleIdTyped = scheduleId as bigint;
        returnObj.vestingScheduleId = scheduleIdTyped;
        return this.publicClient.readContract({
          address: BevorABI.address as Address,
          abi: BevorABI.abi as Abi,
          functionName: "vestingSchedules",
          args: [scheduleIdTyped],
        });
      })
      .then((vestingSchedule: unknown) => {
        const vestingScheduleTyped = vestingSchedule as VestingContractView;
        returnObj.withdrawn = formatUnits(vestingScheduleTyped[2], tokenUse.decimals);
        return this.publicClient.readContract({
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
  }
}

const contractService = new ContractService();
export default contractService;
