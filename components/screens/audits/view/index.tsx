import { getMarkdown } from "@/lib/actions/audits";
import { getAudit } from "@/lib/actions/audits";
import { Column, Row } from "@/components/Box";
import DynamicLink from "@/components/Link";
import { trimAddress } from "@/lib/utils";
import { Icon } from "@/components/Icon";
import { AuditAuditor } from "@/components/Audit/client";
import { AuditDashboardAction } from "./client";

export const AuditMarkdown = async ({ display }: { display: string }): Promise<JSX.Element> => {
  const content = await getMarkdown(display);
  return <div className="markdown" dangerouslySetInnerHTML={{ __html: content }} />;
};

export const AuditPage = async ({ auditId }: { auditId: string }): Promise<JSX.Element> => {
  const audit = await getAudit(auditId);

  if (!audit) return <h2>This audit does not exist</h2>;

  return (
    <Column className="items-stretch gap-4">
      <Row className="justify-between">
        <div>
          <DynamicLink href={`/user/${audit.auditee.address}`}>
            <Icon image={audit.auditee.profile?.image} seed={audit.auditee.address} size="xxl" />
          </DynamicLink>
          <p className="text-sm mt-4 mb-1">
            {audit.auditee.profile?.name && <span>{audit.auditee.profile.name} | </span>}
            <span>{trimAddress(audit.auditee.address)}</span>
          </p>
        </div>
        <Column className="gap-1 text-sm whitespace-nowrap min-w-44">
          <p className="text-right text-lg">
            Audit is{" "}
            <span className="uppercase">
              {audit.isFinal ? "Closed" : audit.isLocked ? "Locked" : "Open"}
            </span>
          </p>
          <p>
            <span className="inline-block w-32 text-right mr-4">Prize Pool: </span>
            <span className="float-right">${audit.terms?.price.toLocaleString() || 0}</span>
          </p>
          <p>
            <span className="inline-block w-32 text-right mr-4">Vesting Duration: </span>
            <span className="float-right">{audit.terms?.duration || "TBD"} month(s)</span>
          </p>
          <p>
            <span className="inline-block w-32 text-right mr-4">Created: </span>
            <span className="float-right">{new Date(audit.createdAt).toLocaleDateString()}</span>
          </p>
        </Column>
      </Row>
      <div>
        <p className="text-lg font-bold">{audit.title}</p>
        <p className="text-base my-2">{audit.description}</p>
      </div>
      <Row className="justify-between">
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
