/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Icon } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import { Column, HoverItem, Row } from "@/components/Box";
import { Button } from "@/components/Button";
import * as Form from "@/components/Form";
import * as Dropdown from "@/components/Dropdown";
import { cn, trimAddress } from "@/lib/utils";
import { Loader } from "@/components/Loader";
import { Arrow } from "@/assets";
import { useDropdown } from "@/hooks/useDropdown";
import { Card } from "@/components/Card";
import { searchAuditors } from "@/lib/actions/users";
import { UserProfile } from "@/lib/types/actions";
import { createAudit } from "@/lib/actions/audits";
import { useUser } from "@/hooks/contexts";

const AuditForm = ({ address, userId }: { address: string; userId: string }): JSX.Element => {
  const router = useRouter();
  const [auditors, setAuditors] = useState<UserProfile[]>([]);
  const [queryString, setQueryString] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdown = useDropdown();

  const { data, isPending } = useQuery({
    queryKey: ["auditors", queryString],
    queryFn: () => searchAuditors(queryString),
  });

  const { mutate, isPending: mutationPending } = useMutation({
    mutationFn: (variables: { userId: string; formData: FormData; auditors: UserProfile[] }) =>
      createAudit(variables.userId, variables.formData, variables.auditors),
    onSuccess: () => {
      router.push(`/user/${address}`);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutate({ userId, formData, auditors });
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
          disabled={mutationPending}
          required
        />
        <Form.TextArea
          placeholder="Audit Description..."
          className="h-16"
          name="description"
          disabled={mutationPending}
          required
        />
        <p className="text-sm">Auditors</p>
        <Row className="gap-2">
          <Dropdown.Main dropdown={dropdown}>
            <Form.Search
              className="focus-visible:rounded-b-none"
              onFocus={!dropdown.isShowing ? dropdown.toggle : undefined}
              disabled={mutationPending}
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
                        <p className="text-sm">{trimAddress(auditor.address)}</p>
                        {auditor.profile?.name && (
                          <p className="text-sm whitespace-nowrap">{auditor.profile.name}</p>
                        )}
                      </div>
                    </HoverItem>
                  ))}
                {!isPending && auditorsShow.length == 0 && (
                  <p className="text-sm">No results to show</p>
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
                  <p className="text-sm">{trimAddress(auditor.address)}</p>
                  {auditor.profile?.name && (
                    <p className="text-sm whitespace-nowrap">{auditor.profile.name}</p>
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
          disabled={mutationPending}
        />
        <Form.Input
          type="number"
          placeholder="3"
          min={0}
          name="duration"
          disabled={mutationPending}
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
  const { user, isFetchedAfterMount, isPending } = useUser();

  useEffect(() => {
    if (!isFetchedAfterMount || isPending) return;
    if (!address) {
      router.push("/");
    }
    if (!user) {
      router.push(`/user/${address}`);
    }
  }, [isFetchedAfterMount, isPending, router, user, address]);

  if (!isFetchedAfterMount || isPending) return <Loader className="h-12" />;

  if (!user?.auditeeRole)
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

  return <AuditForm address={address as string} userId={user.id} />;
};
