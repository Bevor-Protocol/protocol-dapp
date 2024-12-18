"use client";

import Image from "next/image";
import { Abi, Address } from "viem";
import { readContract } from "viem/actions";
import { useClient } from "wagmi";

import { auditAction } from "@/actions";
import { X } from "@/assets";
import { Column, Row } from "@/components/Box";
import { Button } from "@/components/Button";
import { useModal } from "@/hooks/useContexts";
import { useContractWriteListen } from "@/hooks/useContractWriteListen";

import { Loader } from "@/components/Loader";
import { Contracts } from "@/constants/web3";
import BevorABI from "@/contracts/abis/BevorProtocol";
import { cn } from "@/utils";
import { AuditWithOwnerSecure } from "@/utils/types/relations";
import { useMemo } from "react";

const InitiateAudit = ({
  audit,
  setDisabled,
}: {
  audit: AuditWithOwnerSecure;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const { hide } = useModal();
  const client = useClient();

  const { state, writeContractWithEvents } = useContractWriteListen({
    abi: BevorABI.abi as Abi,
    address: Contracts.Localhost.bevorProtocol.address,
    functionName: "prepareAudit",
  });

  const args = useMemo(() => {
    const auditorsPass: Address[] = audit.auditMemberships
      .filter((member) => member.accepted_terms)
      .map((member) => member.user.address as Address);
    const DETAILS = audit
      .details!.substring(audit.details!.lastIndexOf("/") + 1)
      .replace(".md", "");
    const DURATION = audit.duration * 24 * 60 * 60;
    const CLIFF = audit.cliff * 24 * 60 * 60;
    return [
      audit.owner.address,
      auditorsPass,
      CLIFF,
      DURATION,
      DETAILS,
      audit.price,
      audit.token,
      "I am salt",
    ];
  }, [audit]);

  const handleClose = (): void => {
    setDisabled(false);
    hide();
  };

  const handleSubmit = (): void => {
    if (!client) return;
    let auditIdGenerated = BigInt(0);
    readContract(client, {
      address: Contracts.Localhost.bevorProtocol.address,
      abi: BevorABI.abi as Abi,
      functionName: "generateAuditId",
      args: args,
    })
      .then((auditId) => {
        auditIdGenerated = auditId as bigint;
        return writeContractWithEvents(args.slice(1));
      })
      .then(() => {
        // POST THE AUDITID OFF-CHAIN if user signed the transaction.
        return auditAction.addAuditInfo(audit.id, BigInt(auditIdGenerated as bigint).toString());
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
      <p className="text-lg my-2">Kick off Audit</p>
      <p className="text-sm">
        Taking this action will lock the audit on-chain, and kick off the auditing period. You will
        not be able to make updates.
      </p>
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <Row className="gap-4 justify-end">
        <Button
          onClick={handleSubmit}
          disabled={state.isPendingSign || state.isSuccessSign}
          className="relative"
        >
          <span className={cn((state.isPendingSign || state.isSuccessSign) && "invisible")}>
            Kick Off Audit
          </span>
          {state.isPendingSign && <Loader className="h-4 w-4 absolute" />}
          {state.isSuccessSign && <span className="absolute">Success</span>}
        </Button>
      </Row>
    </Column>
  );
};

export default InitiateAudit;
