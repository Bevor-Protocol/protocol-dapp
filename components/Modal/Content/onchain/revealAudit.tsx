"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Abi, Address } from "viem";
import { readContract } from "viem/actions";
import { useClient } from "wagmi";

import { auditAction, contractAction } from "@/actions";
import { Check, X } from "@/assets";
import { Column } from "@/components/Box";
import { Button } from "@/components/Button";
import { Loader } from "@/components/Loader";
import { useModal } from "@/hooks/useContexts";
import { useContractWriteListen } from "@/hooks/useContractWriteListen";
import { cn } from "@/utils";
import { parseUnits } from "viem";

import { AvailableTokens } from "@/constants/web3";
import BevorABI from "@/contracts/abis/BevorProtocol";
import ERC20ABI from "@/contracts/abis/ERC20Token";
import { AuditWithOwnerSecure } from "@/utils/types/relations";
import { User } from "@/utils/types/tables";

const RevealAudit = ({ audit, user }: { audit: AuditWithOwnerSecure; user: User }): JSX.Element => {
  const { hide } = useModal();
  const client = useClient();
  const [step, setStep] = useState(0);

  useEffect(() => {
    // if user already has approved the necessary amount, move them to next step.
    const token = AvailableTokens.Localhost.find((t) => t.address == audit.token);
    if (!token) return;
    const convertedValue = parseUnits(audit.price.toString(), token.decimals);
    contractAction
      .getBalance(user.address)
      .then((result) => {
        if (result >= convertedValue) {
          setStep(1);
        }
      })
      .catch((error) => {
        console.log(error);
        setStep(0);
      });
  }, [user.address, audit.token, audit.price]);

  // following approvals overwrite previous ones, so we can safely call it again.
  const { state: stateApproval, writeContractWithEvents: writeApproval } = useContractWriteListen({
    abi: ERC20ABI.abi as Abi,
    address: ERC20ABI.address as Address,
    functionName: "approve",
  });

  const { state, writeContractWithEvents } = useContractWriteListen({
    abi: BevorABI.abi as Abi,
    address: BevorABI.address as Address,
    functionName: "revealFindings",
  });

  const handleClose = (): void => {
    hide();
  };

  const handleSubmitApproval = (): void => {
    if (!client) return;
    if (user.address !== audit.owner.address) return;
    const token = AvailableTokens.Localhost.find((t) => t.address == audit.token);
    if (!token) return;
    const convertedValue = parseUnits(audit.price.toString(), token.decimals);

    writeApproval([BevorABI.address, convertedValue])
      .then(() => {
        setStep(1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitReveal = (): void => {
    if (!client) return;
    if (user.address !== audit.owner.address) return;
    let tokenIdGenerated = BigInt(0);
    let auditIdGenerated = "";
    let findings: string[] = [];
    auditAction
      .getAuditFindings(audit.id)
      .then((result) => {
        if (!result) return;
        findings = result.auditMemberships.map((member) => {
          const finding = member.findings!;
          return finding.substring(finding.lastIndexOf("/") + 1).replace(".md", "");
        });
        auditIdGenerated = result.onchain_audit_info_id as string;

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
        return auditAction.addNftInfo(audit.id, BigInt(tokenIdGenerated as bigint).toString());
      })
      .then(() => {
        setStep(2);
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
        <div className="relative">
          <div
            className={cn(
              "absolute -left-8 top-1/2 -translate-y-1/2 rounded-full",
              "bg-green-500 p-0.5 border border-white",
              step < 1 && "hidden",
            )}
          >
            <Check height="0.75rem" width="0.75rem" fill="white" />
          </div>
          <Button
            onClick={handleSubmitApproval}
            disabled={stateApproval.isPendingSign || stateApproval.isSuccessSign || step != 0}
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
        </div>
        <div className="relative">
          <div
            className={cn(
              "absolute -left-8 top-1/2 -translate-y-1/2 rounded-full",
              "bg-green-500 p-0.5 border border-white",
              step < 2 && "hidden",
            )}
          >
            <Check height="0.75rem" width="0.75rem" fill="white" />
          </div>
          <Button
            onClick={handleSubmitReveal}
            disabled={state.isPendingSign || state.isSuccessSign || step != 1}
            className="relative"
          >
            <span className={cn((state.isPendingSign || state.isSuccessSign) && "invisible")}>
              Reveal Findings
            </span>
            {state.isPendingSign && <Loader className="h-4 w-4 absolute" />}
            {state.isSuccessSign && <span className="absolute">Success</span>}
          </Button>
        </div>
      </Column>
    </Column>
  );
};

export default RevealAudit;
