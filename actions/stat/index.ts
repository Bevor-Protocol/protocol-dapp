"use server";

import { UserStats } from "@/utils/types";
import statController from "./stat.controller";

const getUserStats = async (address: string): Promise<UserStats> => {
  return statController.getUserStats(address);
};

const getProtocolNumAudits = async (): Promise<number> => {
  return statController.getProtocolNumAudits();
};

const getProtocolFunds = async (): Promise<number> => {
  return statController.getProtocolFunds();
};

const getProtocolVulnerabilities = async (): Promise<number> => {
  return statController.getProtocolVulnerabilities();
};

const getProtocolNumAuditors = async (): Promise<number> => {
  return statController.getProtocolNumAuditors();
};

export {
  getProtocolFunds,
  getProtocolNumAuditors,
  getProtocolNumAudits,
  getProtocolVulnerabilities,
  getUserStats,
};
