import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import { AuditAuditor } from "./client";
import { AuditFull } from "@/lib/types/actions";
import { Column, Row } from "@/components/Box";

export const AuditCard = ({ audit }: { audit: AuditFull }): JSX.Element => {
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
        <DynamicLink href={`/audits/view/${audit.id}`} transition>
          <span className="block p-1">View Audit</span>
        </DynamicLink>
      </Row>
    </Card>
  );
};
