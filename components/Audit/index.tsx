import * as Card from "@/components/Card";
import { Icon } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import { AuditAuditor } from "./client";
import { AuditFull } from "@/lib/types/actions";
import { Column, Row } from "@/components/Box";
import { trimAddress } from "@/lib/utils";
import { AuditDashboardAction } from "./client";

export const AuditCard = ({ audit }: { audit: AuditFull }): JSX.Element => {
  return (
    <Card.Main className="w-full">
      <Card.Content className="gap-4">
        <DynamicLink href={`/user/${audit.auditee.address}`}>
          <Icon image={audit.auditee.profile?.image} seed={audit.auditee.address} size="lg" />
        </DynamicLink>
        <Column className="justify-start items-start overflow-hidden w-full">
          <p className="text-lg font-bold">{audit.title}</p>
          <p className="text-ellipsis overflow-hidden w-full text-base line-clamp-2">
            {audit.description}
          </p>
        </Column>
        <Column className="whitespace-nowrap items-end text-sm">
          <p>
            Prize Pool:
            <span className="w-[100px] inline-block text-right">
              {" "}
              ${audit.terms?.price.toLocaleString() || 0}
            </span>
          </p>
          <p>
            Vesting Duration:
            <span className="w-[100px] inline-block text-right">
              {" "}
              {audit.terms?.duration || "TBD"} month(s)
            </span>
          </p>
          <p>
            Created:{" "}
            <span className="w-[100px] inline-block text-right">
              {" "}
              {new Date(audit.createdAt).toLocaleDateString()}
            </span>
          </p>
        </Column>
      </Card.Content>
      <Card.Footer>
        <Row className="justify-center items-center gap-2">
          <span className="text-white/60">auditors:</span>
          {audit.auditors.length > 0 ? (
            <Row>
              {audit.auditors.map((auditor, ind2) => (
                <AuditAuditor position={`-${ind2 * 12.5}px`} key={ind2} auditor={auditor} />
              ))}
            </Row>
          ) : (
            <span className="text-white/60">TBD</span>
          )}
        </Row>
        <DynamicLink href={`/audits/view/${audit.id}`} transition>
          <span className="block p-1">View Audit</span>
        </DynamicLink>
      </Card.Footer>
    </Card.Main>
  );
};

export const AuditDetailed = ({ audit }: { audit: AuditFull }): JSX.Element => {
  return (
    <Column className="gap-4">
      <Row className="w-full justify-between">
        <p>{audit.auditee.profile?.name || trimAddress(audit.auditee.address)}</p>
        <p className="text-right text-lg">
          Audit is <span>{audit.isFinal ? "Closed" : audit.isLocked ? "Locked" : "Open"}</span>
        </p>
      </Row>
      <Row className="justify-between">
        <DynamicLink href={`/user/${audit.auditee.address}`}>
          <Icon image={audit.auditee.profile?.image} seed={audit.auditee.address} size="xl" />
        </DynamicLink>
        <Column className="whitespace-nowrap items-end text-sm">
          <p>
            Prize Pool:
            <span className="w-[100px] inline-block text-right">
              {" "}
              ${audit.terms?.price.toLocaleString() || 0}
            </span>
          </p>
          <p>
            Vesting Duration:
            <span className="w-[100px] inline-block text-right">
              {" "}
              {audit.terms?.duration || "TBD"} month(s)
            </span>
          </p>
          <p>
            Created:{" "}
            <span className="w-[100px] inline-block text-right">
              {" "}
              {new Date(audit.createdAt).toLocaleDateString()}
            </span>
          </p>
        </Column>
      </Row>
      <Row className="items-stretch justify-start gap-8 w-full">
        <Column className="justify-start items-start overflow-hidden w-full">
          <p className="text-lg font-bold">{audit.title}</p>
          <p className="text-ellipsis overflow-hidden w-full text-base my-2">{audit.description}</p>
        </Column>
      </Row>
      <Row className="justify-between w-full">
        <Row className="justify-start items-center gap-2">
          <span className="text-white/60">auditors:</span>
          {audit.auditors.length > 0 ? (
            <Row>
              {audit.auditors.map((auditor, ind2) => (
                <AuditAuditor position={`-${ind2 * 12.5}px`} key={ind2} auditor={auditor} />
              ))}
            </Row>
          ) : (
            <span className="text-white/60">TBD</span>
          )}
        </Row>
        <AuditDashboardAction audit={audit} />
      </Row>
    </Column>
  );
};
