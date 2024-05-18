import { Users } from "@prisma/client";

import * as Card from "@/components/Card";
import { Icon } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import { AuditDetailedI, AuditTruncatedI } from "@/lib/types";
import { Column, Row } from "@/components/Box";
import { Bell } from "@/assets";
import { trimAddress, cn } from "@/lib/utils";
import { AuditAuditor } from "./client";

export const AuditCardTruncated = ({
  audit,
  isProtocolOwner,
  showNoti,
}: {
  audit: AuditTruncatedI;
  isProtocolOwner: boolean;
  showNoti: boolean;
}): JSX.Element => {
  return (
    <div className="w-1/2 p-2">
      <DynamicLink href={`/audits/view/${audit.id}`} className="w-full">
        <Card.Main className="w-full cursor-pointer transition-colors hover:bg-dark-primary-30">
          <Card.Content className="gap-4 relative">
            <Icon image={audit.auditee.image} seed={audit.auditee.address} size="lg" />
            <Column className="justify-start items-start overflow-hidden w-full">
              <p className="text-lg font-bold line-clamp-1">{audit.title}</p>
              <p className="text-ellipsis overflow-hidden w-full text-xs line-clamp-2">
                {audit.description}
              </p>
            </Column>
            <p className="w-full text-right text-white/60 text-xs absolute bottom-1 right-2">
              {isProtocolOwner ? "Protocol Owner" : "Auditor"}
            </p>
            {showNoti && (
              <div className="absolute top-2 right-2">
                <Bell className="h-2 w-2" fill="currentColor" />
                <span className="h-1 w-1 rounded-full mb-auto bg-red-400 absolute -top-1 -right-1" />
              </div>
            )}
          </Card.Content>
        </Card.Main>
      </DynamicLink>
    </div>
  );
};

export const AuditCard = ({ audit }: { audit: AuditDetailedI }): JSX.Element => {
  return (
    <Card.Main className="w-full">
      <Card.Content className="gap-4">
        <DynamicLink href={`/user/${audit.auditee.address}`}>
          <Icon image={audit.auditee.image} seed={audit.auditee.address} size="lg" />
        </DynamicLink>
        <Column className="justify-start items-start overflow-hidden w-full">
          <p className="text-lg font-bold">{audit.title}</p>
          <p className="text-ellipsis overflow-hidden w-full text-base line-clamp-2">
            {audit.description}
          </p>
        </Column>
        <Column className="text-sm whitespace-nowrap min-w-fit">
          <p>
            <span className="inline-block w-32 text-right mr-4">Prize Pool: </span>
            <span className="float-right">${audit.price.toLocaleString()}</span>
          </p>
          <p className="text-white/60 text-xs">
            <span className="inline-block w-32 text-right mr-4">Vesting Duration: </span>
            <span className="float-right">{audit.duration.toLocaleString() || "TBD"} days</span>
          </p>
          <p className="text-white/60 text-xs">
            <span className="inline-block w-32 text-right mr-4">Vesting Cliff: </span>
            <span className="float-right">{audit.cliff.toLocaleString() || "TBD"} days</span>
          </p>
          <p className="text-white/60 text-xs">
            <span className="inline-block w-32 text-right mr-4">Created: </span>
            <span className="float-right">{new Date(audit.createdAt).toLocaleDateString()}</span>
          </p>
        </Column>
      </Card.Content>
      <Card.Footer>
        <Row className="justify-center items-center gap-2">
          <span className="text-white/60">auditors:</span>
          {audit.auditors.length > 0 ? (
            <Row>
              {audit.auditors.map(({ user }, ind2) => (
                <AuditAuditor position={`-${ind2 * 12.5}px`} key={ind2} auditor={user} />
              ))}
            </Row>
          ) : (
            <span className="text-white/60">TBD</span>
          )}
        </Row>
        <DynamicLink href={`/audits/view/${audit.id}`}>
          <span className="block p-1 hover:opacity-hover">View Audit</span>
        </DynamicLink>
      </Card.Footer>
    </Card.Main>
  );
};

interface AuditorItemI extends React.HTMLAttributes<HTMLDivElement> {
  auditor: Users;
  hover?: boolean;
  disabled?: boolean;
  canClose?: boolean;
}

export const AuditorItem: React.FC<AuditorItemI> = ({
  auditor,
  hover = false,
  disabled = false,
  canClose = false,
  ...rest
}) => {
  return (
    <Row
      className={cn(
        "px-1 gap-1 h-[32px] min-h-[32px] items-center relative",
        !disabled && "cursor-pointer",
        disabled && "pointer-events-none",
        hover && "items-center relative rounded-lg transition-colors",
        hover && !disabled && "hover:bg-dark-primary-30",
      )}
      {...rest}
    >
      <span
        className={cn(
          "h-1 w-1 rounded-full mb-auto",
          auditor.available && "bg-green-400",
          !auditor.available && "bg-gray-600",
        )}
      />
      <Icon image={auditor.image} seed={auditor.address} size="sm" />
      <div className="overflow-hidden">
        <p className="text-sm text-ellipsis overflow-hidden">
          <span>{trimAddress(auditor.address)}</span>
          {auditor.name && (
            <>
              <span className="mx-1">|</span>
              <span className="whitespace-nowrap overflow-ellipsis m-w-full">{auditor.name}</span>
            </>
          )}
        </p>
      </div>
      {canClose && <span className="absolute -right-1 -top-1 text-xs">x</span>}
    </Row>
  );
};

export const AuditorItemSimple: React.FC<{ auditor: Users }> = ({ auditor }) => {
  return (
    <Row className="gap-1 h-[32px] min-h-[32px] items-center">
      <Icon image={auditor.image} seed={auditor.address} size="sm" />
      <div className="overflow-hidden">
        <p className="text-xs text-ellipsis overflow-hidden">
          <span>{trimAddress(auditor.address)}</span>
          {auditor.name && (
            <>
              <span className="mx-1">|</span>
              <span className="whitespace-nowrap overflow-ellipsis m-w-full">{auditor.name}</span>
            </>
          )}
        </p>
      </div>
    </Row>
  );
};
