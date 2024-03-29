/* eslint-disable @next/next/no-img-element */
import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import { AuditAuditor, AuditDashboardBtn } from "../client";
import { getAudits, getAudit, getMarkdown } from "@/lib/actions/audits";
import { AuditFull } from "@/lib/types/actions";
import { Column, Row } from "@/components/Box";

export const AuditCard = ({
  audit,
  disabled,
}: {
  audit: AuditFull;
  disabled: boolean;
}): JSX.Element => {
  return (
    <Card hover className="divide-y divide-gray-200/20 w-full">
      <Row className="items-stretch justify-start gap-8 p-4 w-full">
        <DynamicLink href={`/user/${audit.auditee.address}`}>
          <Icon image={audit.auditee.profile?.image} seed={audit.auditee.address} size="lg" />
        </DynamicLink>
        <Column className="justify-start items-start overflow-hidden w-full">
          <Row className="justify-between w-full">
            <p className="text-lg font-bold">{audit.title}</p>
            <p>${audit.terms?.price.toLocaleString() || 0}</p>
          </Row>
          <p className="whitespace-nowrap text-ellipsis overflow-hidden w-full">
            {audit.description}
          </p>
        </Column>
      </Row>
      <Row className="justify-between items-center p-2">
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
        <DynamicLink href={`/audits/view/${audit.id}`} disabled={disabled} transition>
          <span className="block p-1">View Audit</span>
        </DynamicLink>
      </Row>
    </Card>
  );
};

export const Audits = async ({ current }: { current: string }): Promise<JSX.Element> => {
  const audits = await getAudits(current);

  return (
    <Column className="gap-4 justify-center items-center w-full">
      {audits.length == 0 && <p>Currently no {current} audits</p>}
      {audits.map((audit, ind) => (
        <AuditCard audit={audit} key={ind} disabled={current !== "closed"} />
      ))}
    </Column>
  );
};

export const AuditDetailed = async ({ auditId }: { auditId: string }): Promise<JSX.Element> => {
  const audit = await getAudit(auditId);

  return (
    <Column>
      <div className="flex flex-col w-full gap-2 py-4 items-center">
        <p className="text-white/60">Vesting Progress</p>
        <div className="h-4 bg-dark-primary-20 rounded-xl border-2 border-gray-200/20 w-full max-w-sm">
          <div className="h-full w-[20%] grad-light rounded-[inherit]" />
        </div>
        <p className="text-white/60">200 / 1000 ETH Vested</p>
      </div>
      <Card className="divide-y divide-gray-200/20 w-full">
        <Row className="items-stretch justify-start gap-8 p-4 w-full">
          <DynamicLink href={`/user/${audit.auditee.address}`}>
            <Icon image={audit.auditee.profile?.image} seed={audit.auditee.address} size="lg" />
          </DynamicLink>
          <Column className="justify-start items-start overflow-hidden w-full">
            <Row className="justify-between w-full">
              <p className="text-lg font-bold">{audit.title}</p>
              <p>${audit.terms?.price.toLocaleString() || 0}</p>
            </Row>
            <p className="whitespace-nowrap text-ellipsis overflow-hidden w-full">
              {audit.description}
            </p>
            <p className="text-sm">Months: {audit.terms?.duration}</p>
            <p className="text-sm">Created: {new Date(audit.createdAt).toLocaleDateString()}</p>
          </Column>
        </Row>
        <Row className="justify-between items-center p-2">
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
          <AuditDashboardBtn auditors={audit.auditors} />
        </Row>
      </Card>
    </Column>
  );
};

export const AuditMarkdown = async ({ display }: { display: string }): Promise<JSX.Element> => {
  const content = await getMarkdown(display);
  return <div className="markdown" dangerouslySetInnerHTML={{ __html: content }} />;
};
