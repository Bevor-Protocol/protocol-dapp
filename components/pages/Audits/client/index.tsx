/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, Profile } from "@prisma/client";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";

import { Icon } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import { Column, Row } from "@/components/Box";
import { Button } from "@/components/Button";
import { Toggle } from "@/components/Toggle";
import * as Tooltip from "@/components/Tooltip";
import { cn, trimAddress } from "@/lib/utils";
import { getUserProfile } from "@/lib/actions/users";
import { Loader } from "@/components/Loader";
import { Arrow } from "@/assets";

export const AuditDashboardHeader = ({ display }: { display: string }): JSX.Element => {
  const router = useRouter();
  const pathname = usePathname();

  const handleMarkdownChange = (event: React.MouseEvent<HTMLDivElement>): void => {
    const { name } = event.currentTarget.dataset;
    if (name == display) return;
    const path = `${pathname}?display=${name}`;
    router.replace(path, { scroll: false });
  };

  return (
    <Row className="gap-4 justify-start">
      <Toggle onClick={handleMarkdownChange} active={display === "details"} title={"details"} />
      <Toggle onClick={handleMarkdownChange} active={display === "audit"} title={"audit"} />
    </Row>
  );
};

export const AuditAuditor = ({
  position,
  auditor,
}: {
  position: string;
  auditor: User & {
    profile: Profile | null;
  };
}): JSX.Element => {
  return (
    <div style={{ transform: `translateX(${position})` }}>
      <DynamicLink href={`/user/${auditor.address}`}>
        <Tooltip.Reference target={auditor.address}>
          <Icon
            image={auditor.profile?.image}
            size="md"
            seed={auditor.address}
            data-auditoradd={auditor.address}
          />
          <Tooltip.Content
            target={auditor.address}
            className={cn(
              "text-xs max-w-28 overflow-hidden text-ellipsis bg-dark-primary-20",
              "px-2 py-1 -translate-x-1/2 border border-gray-200/20 rounded-lg",
              "bottom-full left-1/2",
            )}
          >
            {trimAddress(auditor.address)}
          </Tooltip.Content>
        </Tooltip.Reference>
      </DynamicLink>
    </div>
  );
};

export const AuditDashboardBtn = ({
  auditors,
}: {
  auditors: (User & {
    profile: Profile | null;
  })[];
}): JSX.Element => {
  const { address } = useAccount();

  const buttonLabel = (): string => {
    const auditorsAddresses = auditors.map((auditor) => auditor.address);
    if (auditorsAddresses.includes(address?.toString() || "")) {
      return "Withdraw";
      // } else if (data.auditee.toString() === account.toLocaleString()) {
      //   return "Challenge Validity";
    } else {
      return "Disabled";
    }
  };
  return (
    <Button aria-disabled={true} disabled={true}>
      <span>{buttonLabel()}</span>
    </Button>
  );
};

export const AuditCreation = (): JSX.Element => {
  const { address } = useAccount();
  const router = useRouter();

  const { data, isFetchedAfterMount, isPending } = useQuery({
    queryKey: ["user", address || ""],
    queryFn: () => {
      if (!address) return null;
      return getUserProfile(address as string);
    },
  });

  useEffect(() => {
    if (!isFetchedAfterMount || isPending) return;
    if (!address) {
      router.push("/");
    }
    if (!data) {
      router.push(`/user/${address}`);
    }
  }, [isFetchedAfterMount, isPending, router, data, address]);

  if (!isFetchedAfterMount || isPending) return <Loader className="h-12" />;

  if (!data?.auditeeRole)
    return (
      <Column className="items-center gap-4">
        <p>Claim the Auditee role before creating an audit</p>
        <DynamicLink href={`/user/${address}`}>
          <Button>
            <span>Dashboard</span>
            <Arrow height="0.75rem" width="0.75rem" />
          </Button>
        </DynamicLink>
      </Column>
    );

  return <p>k</p>;
};
