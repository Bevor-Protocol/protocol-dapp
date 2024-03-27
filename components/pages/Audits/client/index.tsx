/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useRef, useMemo, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, Profile } from "@prisma/client";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";

import { Icon } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import { Column, HoverItem, Row } from "@/components/Box";
import { Button } from "@/components/Button";
import { Toggle } from "@/components/Toggle";
import * as Tooltip from "@/components/Tooltip";
import * as Form from "@/components/Form";
import * as Dropdown from "@/components/Dropdown";
import { cn, trimAddress } from "@/lib/utils";
import { getUserProfile } from "@/lib/actions/users";
import { Loader } from "@/components/Loader";
import { Arrow } from "@/assets";
import { useDropdown } from "@/hooks/useDropdown";
import { Card } from "@/components/Card";
import { searchAuditors } from "@/lib/actions/users";
import { UserProfile } from "@/lib/types/actions";
import { createAudit } from "@/lib/actions/audits";

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

const AuditForm = ({ address, userId }: { address: string; userId: string }): JSX.Element => {
  const [auditors, setAuditors] = useState<UserProfile[]>([]);
  const [actionPending, startTransition] = useTransition();
  const [queryString, setQueryString] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdown = useDropdown();

  const { data, isPending } = useQuery({
    queryKey: ["auditors", queryString],
    queryFn: () => searchAuditors(queryString),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const response = await createAudit(userId, formData, auditors);
      // Do something. Redirect, change UI, etc...
      console.log(response);
    });
  };

  const addAuditorSet = (auditor: UserProfile): void => {
    setAuditors((prev) => [...prev, auditor]);
  };

  const removeAuditorSet = (id: string): void => {
    const interAuditors = [...auditors].filter((auditor) => auditor.id != id);
    setAuditors(interAuditors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // throttling to prevent too many requests.
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setQueryString(e.target.value);
    }, 500);
  };

  const auditorsShow = useMemo(() => {
    const chosenAuditors = auditors.map((auditor) => auditor.id);
    return (
      data?.filter((item) => !chosenAuditors.includes(item.id) && item.address !== address) || []
    );
  }, [auditors, data, address]);

  return (
    <form onSubmit={handleSubmit} className="w-[500px] max-w-full">
      <h3>Create an Audit</h3>
      <Column className="gap-2 my-4">
        <Form.Input
          type="text"
          placeholder="Audit Title"
          name="title"
          disabled={actionPending}
          required
        />
        <Form.TextArea
          placeholder="Audit Description..."
          className="max-h-10 resize-y"
          name="description"
          disabled={actionPending}
          required
        />
        <p className="text-xs">Auditors</p>
        <Row className="gap-2">
          <Dropdown.Main dropdown={dropdown}>
            <Form.Search
              className="focus-visible:rounded-b-none"
              onFocus={!dropdown.isShowing ? dropdown.toggle : undefined}
              disabled={actionPending}
              onChange={handleChange}
            />
            <Dropdown.Content
              dropdown={dropdown}
              className="w-full overflow-scroll"
              style={{ maxHeight: "calc(5*(2rem + 8px)" }}
            >
              <Card
                className={cn(
                  "rounded-t-none divide-y divide-gray-200/20 border border-gray-200/20",
                  "overflow-hidden min-h-10 items-center justify-center border-t-0",
                )}
              >
                {isPending && <Loader className="h-5" />}
                {!isPending &&
                  auditorsShow.length > 0 &&
                  auditorsShow.map((auditor) => (
                    <HoverItem
                      key={auditor.id}
                      onClick={() => addAuditorSet(auditor)}
                      className="px-1 w-full cursor-pointer gap-1 rounded-none h-10 items-center"
                    >
                      <Icon image={auditor.profile?.image} seed={auditor.address} size="sm" />
                      <div>
                        <p className="text-xs">{trimAddress(auditor.address)}</p>
                        {auditor.profile?.name && (
                          <p className="text-xs whitespace-nowrap">{auditor.profile.name}</p>
                        )}
                      </div>
                    </HoverItem>
                  ))}
                {!isPending && auditorsShow.length == 0 && (
                  <p className="text-xs">No results to show</p>
                )}
              </Card>
            </Dropdown.Content>
          </Dropdown.Main>
          <Row className="gap-2 flex-wrap">
            {auditors.map((auditor) => (
              <Row
                key={auditor.id}
                onClick={() => removeAuditorSet(auditor.id)}
                className="px-1 cursor-pointer gap-1 rounded-none h-10 items-center w-fit"
              >
                <Icon image={auditor.profile?.image} seed={auditor.address} size="sm" />
                <div>
                  <p className="text-xs">{trimAddress(auditor.address)}</p>
                  {auditor.profile?.name && (
                    <p className="text-xs whitespace-nowrap">{auditor.profile.name}</p>
                  )}
                </div>
              </Row>
            ))}
          </Row>
        </Row>
      </Column>
      <hr className="border-gray-200/20 my-4" />
      <p>Terms:</p>
      <Row className="max-w-full gap-4 my-4 justify-start items-center flex-wrap">
        <Form.Input
          type="number"
          placeholder="1000"
          min={0}
          name="price"
          text="Total Price ($)"
          disabled={actionPending}
        />
        <Form.Input
          type="number"
          placeholder="3"
          min={0}
          name="duration"
          disabled={actionPending}
          text="Vesting Duration (months)"
        />
      </Row>
      <hr className="border-gray-200/20 my-4" />
      <Row className="my-4 gap-4">
        <Button type="submit">Submit</Button>
        <Button type="reset">Reset</Button>
      </Row>
    </form>
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

  return <AuditForm address={address as string} userId={data.id} />;
};
