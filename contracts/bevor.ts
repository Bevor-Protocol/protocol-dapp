import { Contract, JsonRpcProvider } from "ethers";
import vestingContractJSON from "./abis/AuditPayment.json";

const VESTING_ADDRESS = process.env.TOKENVESTING_ADDRESS || "";
const vestingContractAbi = vestingContractJSON.abi;

const provider = new JsonRpcProvider(process.env.RPC_URL);
const signer = await provider.getSigner();
const vestingContract = new Contract(VESTING_ADDRESS, vestingContractAbi, signer);

export async function withdraw(vestingScheduleId: string) {
  try {
    const tx = await vestingContract.withdraw(vestingScheduleId);
    await tx.wait();
    console.log("Withdrawal successful");
  } catch (error) {
    console.error("Withdrawal failed", error);
  }
}

export async function createVestingSchedule(
  _auditor: string,
  _start: number,
  _cliff: number,
  _duration: number,
  _slicePeriodSeconds: number,
  _amount: string,
  _token: string,
  _tokenId: string,
) {
  try {
    const tx = await vestingContract.createVestingSchedule(
      _auditor,
      _start,
      _cliff,
      _duration,
      _slicePeriodSeconds,
      _amount,
      _token,
      _tokenId,
    );
    await tx.wait();
    console.log("Vesting schedule creation successful");
  } catch (error) {
    console.error("Vesting schedule creation failed", error);
  }
}

export async function proposeCancelVesting(vestingScheduleId: string, calldata: string) {
  try {
    const tx = await vestingContract.proposeCancelVesting(vestingScheduleId, calldata);
    await tx.wait();
    console.log("Vesting cancellation proposal successful");
  } catch (error) {
    console.error("Vesting cancellation proposal failed", error);
  }
}

export async function invalidateAudit(vestingScheduleId: string) {
  try {
    const tx = await vestingContract.invalidateAudit(vestingScheduleId);
    await tx.wait();
    console.log("Audit invalidation successful");
  } catch (error) {
    console.error("Audit invalidation failed", error);
  }
}
