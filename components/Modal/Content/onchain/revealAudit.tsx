"use client";

import { useState } from "react";
import Image from "next/image";
import { useClient } from "wagmi";
import { Abi, Address } from "viem";
import { readContract } from "viem/actions";
import { Users } from "@prisma/client";

import { useModal } from "@/lib/hooks";
import { Column } from "@/components/Box";
import { Button } from "@/components/Button";
import { X } from "@/assets";
import { useContractWriteListen } from "@/lib/hooks";
import { AuditI } from "@/lib/types";
import { Loader } from "@/components/Loader";
import { cn } from "@/lib/utils";
import { getAuditFindings } from "@/actions/audits/general";
import { auditAddNftInfoId } from "@/actions/audits/auditee";

import BevorABI from "@/contracts/abis/BevorProtocol";
import ERC20ABI from "@/contracts/abis/ERC20Token";

const RevealAudit = ({ audit, user }: { audit: AuditI; user: Users }): JSX.Element => {
  const { toggleOpen } = useModal();
  const client = useClient();
  const [step, setStep] = useState(0);

  // following approvals overwrite previous ones, so we can safely call it again.
  const { state: stateApproval, writeContractWithEvents: writeApproval } = useContractWriteListen({
    abi: ERC20ABI.abi as Abi,
    address: ERC20ABI.address as Address,
    eventName: "Approval",
    functionName: "approve",
  });

  const { state, writeContractWithEvents } = useContractWriteListen({
    abi: BevorABI.abi as Abi,
    address: BevorABI.address as Address,
    eventName: "Transfer",
    functionName: "revealFindings",
  });

  const handleClose = (): void => {
    toggleOpen();
  };

  const handleSubmitApproval = (): void => {
    if (!client) return;
    if (user.address !== audit.auditee.address) return;
    writeApproval([BevorABI.address, BigInt(audit.price)])
      .then(() => {
        setStep(1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitReveal = (): void => {
    if (!client) return;
    if (user.address !== audit.auditee.address) return;
    let tokenIdGenerated = BigInt(0);
    let auditIdGenerated = "";
    let findings: string[] = [];
    getAuditFindings(audit.id)
      .then((result) => {
        if (!result) return;
        findings = result.auditors.map((auditor) => {
          const finding = auditor.findings!;
          return finding.substring(finding.lastIndexOf("/") + 1).replace(".md", "");
        });
        auditIdGenerated = result.onchainAuditInfoId as string;

        return readContract(client, {
          address: BevorABI.address as Address,
          abi: BevorABI.abi as Abi,
          functionName: "generateTokenId",
          args: [auditIdGenerated, findings],
        });
      })
      .then((tokenId) => {
        tokenIdGenerated = tokenId as bigint;
        return writeContractWithEvents([findings, auditIdGenerated]);
      })
      .then(() => {
        return auditAddNftInfoId(audit.id, BigInt(tokenIdGenerated as bigint).toString());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Column className="items-center justify-center">
      <div onClick={handleClose} className="absolute top-4 right-4 w-5 h-5 cursor-pointer z-10">
        <X height="1rem" width="1rem" />
      </div>
      <div className="aspect-[1091/1685] h-14 relative">
        <Image src="/logo.png" alt="brand logo" fill={true} sizes="any" />
      </div>
      <p className="text-lg my-2">Reveal Findings</p>
      <p className="text-sm">
        Taking this action will reveal the auditor findings to ONLY you until the cliff period is
        reached. This gives you time to implement the findings before exposing the uncovered
        vulnerabilities to others. This requires locking your payment in escrow.
      </p>
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <Column className="gap-4 justify-end">
        <Button
          onClick={handleSubmitApproval}
          disabled={stateApproval.isPendingSign || stateApproval.isSuccessSign}
          className="relative"
        >
          <span
            className={cn(
              (stateApproval.isPendingSign || stateApproval.isSuccessSign) && "invisible",
            )}
          >
            Approve Spend
          </span>
          {stateApproval.isPendingSign && <Loader className="h-4 w-4 absolute" />}
          {stateApproval.isSuccessSign && <span className="absolute">Success</span>}
        </Button>
        <Button
          onClick={handleSubmitReveal}
          disabled={state.isPendingSign || state.isSuccessSign || step == 0}
          className="relative"
        >
          <span className={cn((state.isPendingSign || state.isSuccessSign) && "invisible")}>
            Reveal Findings
          </span>
          {state.isPendingSign && <Loader className="h-4 w-4 absolute" />}
          {state.isSuccessSign && <span className="absolute">Success</span>}
        </Button>
      </Column>
    </Column>
  );
};

export default RevealAudit;
