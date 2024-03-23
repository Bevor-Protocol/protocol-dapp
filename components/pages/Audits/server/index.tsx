/* eslint-disable @next/next/no-img-element */
import { Card } from "@/components/Card";
import { Loader } from "@/components/Loader";
import { Icon } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import { AuditAuditor, AuditDashboardBtn, AuditDashboardHeader } from "../client";
import { getAudits, getAudit, getMarkdown } from "@/lib/actions/audits";
import { AuditFull } from "@/lib/types/actions";

export const AuditCard = ({
  audit,
  disabled,
}: {
  audit: AuditFull;
  disabled: boolean;
}): JSX.Element => {
  return (
    <Card hover className="divide-y divide-gray-200/20 w-full">
      <div className="flex flex-row items-stretch justify-start gap-8 p-4 w-full">
        <DynamicLink href={`/user/${audit.auditee.address}`}>
          <Icon image={audit.auditee.profile?.image} seed={audit.auditee.address} size="lg" />
        </DynamicLink>
        <div className="flex flex-col justify-start items-start overflow-hidden w-full">
          <div className="flex flex-row justify-between w-full">
            <p className="text-lg">
              <strong>{audit.title}</strong>
            </p>
            <p>${audit.terms?.price.toLocaleString() || 0}</p>
          </div>
          <p className=" whitespace-nowrap text-ellipsis overflow-hidden w-full">
            {audit.description}
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center p-2">
        <div className="flex flex-row justify-center items-center">
          <span className="text-white/60">auditors:</span>
          {audit.auditors.length > 0 ? (
            audit.auditors.map((auditor, ind2) => (
              <AuditAuditor position={`-${ind2 * 12.5}px`} key={ind2} auditor={auditor} />
            ))
          ) : (
            <span className="text-white/60">TBD</span>
          )}
        </div>
        <DynamicLink href={`/audits/${audit.id}`} disabled={disabled} transition>
          <span className="block p-1">View Audit</span>
        </DynamicLink>
      </div>
    </Card>
  );
};

export const Audits = async ({ current }: { current: string }): Promise<JSX.Element> => {
  const audits = await getAudits(current);

  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full">
      {audits.length == 0 && <p>Currently no {current} audits</p>}
      {audits.map((audit, ind) => (
        <AuditCard audit={audit} key={ind} disabled={current !== "closed"} />
      ))}
    </div>
  );
};

export const AuditDashboard = async ({
  auditId,
  display,
}: {
  auditId: string;
  display: string;
}): Promise<JSX.Element> => {
  const audit = await getAudit(auditId);
  const content = await getMarkdown(display);
  return (
    <Card className="divide-y divide-gray-200/20 w-full">
      <div className="flex flex-row justify-start items-stretch gap-8 p-4 w-full">
        <Icon image={audit.auditee.profile?.image} seed={audit.auditee.address} size="lg" />
        <div className="flex flex-col justify-start items-start overflow-hidden w-full">
          <div className="flex flex-row justify-between w-full">
            <p className="text-lg">
              <strong>{audit.title}</strong>
            </p>
            <p>${audit.terms?.price.toLocaleString() || 0}</p>
          </div>
          <p>{audit.description}</p>
          <p>Months: {audit.terms?.duration}</p>
          <p>Created: {new Date(audit.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex flex-col w-full gap-4 py-6 items-center">
        <p className="text-white/60">Vesting Progress</p>
        <div className="h-5 bg-dark-primary-20 rounded-xl border-2 border-gray-200/20 w-full max-w-sm">
          <div className="h-full w-[20%] grad-light rounded-[inherit]" />
        </div>
        <p className="text-white/60">200 / 1000 ETH Vested</p>
      </div>
      <div className="flex flex-col items-start gap-6 p-4">
        <AuditDashboardHeader display={display} />
        <div className="markdown" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      <div className="flex flex-row justify-between items-center border-t-gray-200 px-2 py-4">
        <div className="flex flex-row justify-center items-center">
          <span className="text-white/60">auditors:</span>
          {audit.auditors.length > 0 ? (
            audit.auditors.map((auditor, ind2) => (
              <AuditAuditor position={`-${ind2 * 12.5}px`} key={ind2} auditor={auditor} />
            ))
          ) : (
            <span className="text-white/60">TBD</span>
          )}
        </div>
        <AuditDashboardBtn auditors={audit.auditors} />
      </div>
    </Card>
  );
};

export const AuditsSkeleton = (): JSX.Element => {
  return (
    <div className="flex flex-col p-16 justify-center items-center">
      <Loader className="h-12" />
    </div>
  );
};
