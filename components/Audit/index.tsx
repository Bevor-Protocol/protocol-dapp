import { Bell } from "@/assets";
import { Column, Row } from "@/components/Box";
import * as Card from "@/components/Card";
import { Icon } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import { AvailableTokens } from "@/constants/web3";
import { cn } from "@/utils";
import { trimAddress } from "@/utils/formatters";
import { AuditStatusEnum, MembershipStatusEnum, RoleTypeEnum } from "@/utils/types/enum";
import { AuditWithUsersSecure, UserAudit } from "@/utils/types/relations";
import { User } from "@/utils/types/tables";
import { AuditAuditor } from "./client";

const statusMapper: Record<AuditStatusEnum, string> = {
  [AuditStatusEnum.DISCOVERY]: "open",
  [AuditStatusEnum.ATTESTATION]: "locked",
  [AuditStatusEnum.AUDITING]: "ongoing",
  [AuditStatusEnum.CHALLENGEABLE]: "challengeable",
  [AuditStatusEnum.FINALIZED]: "completed",
};

export const AuditCardTruncated = ({
  audit,
  isProtocolOwner,
  showNoti,
}: {
  audit: UserAudit;
  isProtocolOwner: boolean;
  showNoti: boolean;
}): JSX.Element => {
  const token = AvailableTokens.Localhost.find((t) => t.address == audit.token);
  return (
    <div className="w-1/2 p-2 animate-fade-in">
      <DynamicLink href={`/audits/view/${audit.id}`} className="w-full">
        <Card.Main className="w-full cursor-pointer transition-colors hover:bg-dark-primary-30">
          <Card.Content className="gap-4 relative p-4">
            <div className="absolute -top-2 left-1 bg-primary-light-20 rounded-md text-xxs px-1">
              {statusMapper[audit.status as keyof typeof AuditStatusEnum]}
            </div>
            <Icon image={audit.owner.image} seed={audit.owner.address} size="lg" />
            <Column className="justify-start items-start w-full">
              <p className="text-lg font-bold line-clamp-1">{audit.title}</p>
              <p className="text-ellipsis overflow-hidden w-full text-xs line-clamp-2 h-8">
                {audit.description}
              </p>
              <Row className="w-full text-white/60 text-xs justify-between mt-1 translate-y-2">
                <p>${token?.symbol}</p>
                <p>{isProtocolOwner ? "Protocol Owner" : "Auditor"}</p>
              </Row>
            </Column>
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

export const AuditCard = ({ audit }: { audit: AuditWithUsersSecure }): JSX.Element => {
  const token = AvailableTokens.Localhost.find((t) => t.address == audit.token);
  const verifiedAuditors = audit.auditMemberships.filter(
    (member) =>
      member.role === RoleTypeEnum.AUDITOR &&
      member.status === MembershipStatusEnum.VERIFIED &&
      member.is_active,
  );
  return (
    <Card.Main className="w-full animate-fade-in">
      <Card.Content className="gap-4 p-4">
        <DynamicLink href={`/users/${audit.owner.address}`}>
          <Icon image={audit.owner.image} seed={audit.owner.address} size="lg" />
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
            <span className="float-right">
              {audit.price.toLocaleString()} {token?.symbol}
            </span>
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
            <span className="float-right">{new Date(audit.created_at).toLocaleDateString()}</span>
          </p>
        </Column>
      </Card.Content>
      <Card.Footer className="p-2">
        <Row className="justify-center items-center gap-2">
          <span className="text-white/60">auditors:</span>
          {verifiedAuditors.length > 0 ? (
            <Row>
              {verifiedAuditors.map(({ user }, ind2) => (
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
  auditor: User;
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

export const AuditorItemSimple: React.FC<{ auditor: User; showStatus?: boolean }> = ({
  auditor,
  showStatus = false,
}) => {
  return (
    <Row className="gap-1 h-[32px] min-h-[32px] items-center relative">
      {showStatus && (
        <span
          className={cn(
            "h-1 w-1 rounded-full mb-auto",
            auditor.available && "bg-green-400",
            !auditor.available && "bg-gray-600",
          )}
        />
      )}
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
