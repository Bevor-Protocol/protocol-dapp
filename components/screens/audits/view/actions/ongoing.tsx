"use client";

import { Abi, Address } from "viem";
import { useClient } from "wagmi";
import { Users } from "@prisma/client";

import { Row, Column } from "@/components/Box";
import { Button } from "@/components/Button";
import * as Tooltip from "@/components/Tooltip";
import { Info } from "@/assets";
import { useContractWriteListen, useModal } from "@/lib/hooks";
import UploadFindings from "@/components/Modal/Content/uploadFindings";
import { AuditI, AuditStateI } from "@/lib/types";
import { readContract } from "viem/actions";
import { getAuditFindings } from "@/actions/audits/general";

import AuditABI from "@/contracts/abis/Audit";
import ERC20ABI from "@/contracts/abis/ERC20Token";
import { auditAddNftInfoId } from "@/actions/audits/auditee";

const AuditorSubmitFindings = ({
  auditId,
  userId,
  disabled,
}: {
  auditId: string;
  userId: string;
  disabled: boolean;
}): JSX.Element => {
  const { toggleOpen, setContent } = useModal();

  const handleUploadModal = (): void => {
    setContent(<UploadFindings auditId={auditId} userId={userId} />);
    toggleOpen();
  };
  return (
    <Row className="items-center gap-4">
      <Button className="flex-1" onClick={handleUploadModal} disabled={disabled}>
        Submit Findings
      </Button>
      <Tooltip.Reference>
        <Tooltip.Trigger>
          <Info height="1rem" width="1rem" />
        </Tooltip.Trigger>
        <Tooltip.Content side="top" align="end">
          <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
            <div className="p-2">
              Submit your findings. The Auditee will not be able to see these yet until the
              selective disclosure period.
            </div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </Row>
  );
};

const AuditeePendingFindings = (): JSX.Element => {
  return (
    <Row className="items-center gap-4">
      <Button disabled={true} className="flex-1">
        Pending Findings
      </Button>
      <Tooltip.Reference>
        <Tooltip.Trigger>
          <Info height="1rem" width="1rem" />
        </Tooltip.Trigger>
        <Tooltip.Content side="top" align="end">
          <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
            <div className="p-2">
              This audit is still pending the submission of the audit findings from all auditors.
            </div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </Row>
  );
};

const AuditeeLockStake = ({
  audit,
  user,
  // disabled,
  // setDisabled,
}: {
  audit: AuditI;
  user: Users;
  // disabled: boolean;
  // setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const client = useClient();

  const { state, writeContractWithEvents, txn } = useContractWriteListen({
    abi: AuditABI.abi as Abi,
    address: AuditABI.address as Address,
    eventName: "Transfer",
    functionName: "mint",
  });

  // currently requires 2-3 signs. Update the contracts.
  const handleSubmit = async (): Promise<void> => {
    if (!client) return;
    if (user.address !== audit.auditee.address) return;
    let tokenIdGenerated = BigInt(0);
    let auditIdGenerated = "";
    // setDisabled(true);
    getAuditFindings(audit.id)
      .then((result) => {
        if (!result) return;
        const auditorsPass = result.auditors.map((auditor) => auditor.user.address);
        const findingsConcat = result.auditors
          .map((auditor) => {
            const finding = auditor.findings!;
            return finding.substring(finding.lastIndexOf("/") + 1).replace(".md", "");
          })
          .join("|");
        auditIdGenerated = result.onchainAuditInfoId as string;

        return readContract(client, {
          address: AuditABI.address as Address,
          abi: AuditABI.abi as Abi,
          functionName: "generateTokenId",
          args: [
            auditorsPass,
            audit.auditee.address,
            findingsConcat,
            0,
            0,
            result.duration,
            0,
            0,
            result.price,
            0,
            ERC20ABI.address,
            result.onchainAuditInfoId,
            0,
          ],
        });
      })
      .then((tokenId) => {
        tokenIdGenerated = tokenId as bigint;
        return writeContractWithEvents([user.address, auditIdGenerated, tokenIdGenerated]);
      })
      .then(() => {
        console.log("MINT SUCCESS", BigInt(tokenIdGenerated as bigint).toString());
        return auditAddNftInfoId(audit.id, BigInt(tokenIdGenerated as bigint).toString());
      })
      .catch((error) => {
        console.log(error);
      });

    // call the pure on-chain fct to generate the AuditId
    // readContract(client, {
    //   address: AuditABI.address as Address,
    //   abi: AuditABI.abi as Abi,
    //   functionName: "generateAuditId",
    //   args: readArgs,
    // })
    //   .then((auditId) => {
    //     console.log(auditId);
    //     tokenIdGenerated = auditId as bigint;
    //     // POST THE AUDITID OFF-CHAIN.
    //     return writeContractWithEvents([auditId]);
    //   })
    //   // .then(() => {
    //   //   return auditAddAuditInfoId(audit.id, BigInt(auditIdGenerated as bigint).toString());
    //   // })
    //   .catch((error) => {
    //     console.log(error);
    //   })
    //   .finally(() => {
    //     setDisabled(false);
    //   });
  };

  console.log(state, txn);

  return (
    <Row className="items-center gap-4">
      <Button onClick={handleSubmit} className="flex-1">
        Unlock Findings
      </Button>
      <Tooltip.Reference>
        <Tooltip.Trigger>
          <Info height="1rem" width="1rem" />
        </Tooltip.Trigger>
        <Tooltip.Content side="top" align="end">
          <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
            <div className="p-2">
              All auditors have submitted their audit. In order to view them, you must put up your
              stake. You will have a period of time to implement the findings before the findings
              become visible to everyone. Do NOT share the findings with anyone, this will only put
              your protocol at risk.
            </div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </Row>
  );
};

const AuditOngoingActions = ({
  user,
  audit,
  actionData,
}: {
  user: Users;
  audit: AuditI;
  actionData: AuditStateI;
}): JSX.Element => {
  if (actionData.isAnAuditor) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        <AuditorSubmitFindings
          auditId={audit.id}
          userId={user.id}
          disabled={actionData.userSubmitted}
        />
      </Column>
    );
  }

  if (actionData.isTheAuditee) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        {!actionData.allSubmitted && <AuditeePendingFindings />}
        {actionData.allSubmitted && <AuditeeLockStake user={user} audit={audit} />}
      </Column>
    );
  }

  return (
    <Column className="gap-2 items-end w-fit *:w-full">
      <Button disabled>Ongoing Audit</Button>
    </Column>
  );
};

export default AuditOngoingActions;
