"use server";

import { UserStats } from "@/utils/types";
import * as StatService from "./stat.service";

export const getUserStats = async (address: string): Promise<UserStats> => {
  const [moneyPaid, moneyEarned, numAuditsCreated, numAuditsAudited, numWishlist] =
    await Promise.all([
      StatService.getUserMoneyPaid(address),
      StatService.getUserMoneyEarned(address),
      StatService.getUserNumAuditsOwner(address),
      StatService.getUserNumAuditsAuditor(address),
      StatService.getUserNumWishlistReciever(address),
    ]);

  return {
    moneyPaid,
    moneyEarned,
    numAuditsCreated,
    numAuditsAudited,
    numWishlist,
  };
};

export const getProtocolNumAudits = async (): Promise<number> => {
  return await StatService.getProtocolNumAudits();
};

export const getProtocolFunds = async (): Promise<number> => {
  return await StatService.getProtocolDataFunds();
};

export const getProtocolVulnerabilities = async (): Promise<number> => {
  return await StatService.getProtocolDataVulnerabilities();
};

export const getProtocolNumAuditors = async (): Promise<number> => {
  return await StatService.getProtocolDataAuditors();
};
