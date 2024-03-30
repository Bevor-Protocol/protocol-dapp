/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Icon } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import { Column, HoverItem, Row } from "@/components/Box";
import { Button } from "@/components/Button";
import * as Form from "@/components/Form";
import { trimAddress } from "@/lib/utils";
import { Loader } from "@/components/Loader";
import { Arrow } from "@/assets";
import { searchAuditors } from "@/lib/actions/users";
import { UserProfile } from "@/lib/types/actions";
import { createAudit } from "@/lib/actions/audits";
import { useUser } from "@/hooks/contexts";

const AuditForm = ({ address, userId }: { address: string; userId: string }): JSX.Element => {
  const router = useRouter();
  const [timoutPending, setTimoutPending] = useState(false);
  const [auditors, setAuditors] = useState<UserProfile[]>([]);
  const [queryString, setQueryString] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data, isPending } = useQuery({
    queryKey: ["auditors", queryString],
    queryFn: () => searchAuditors(queryString),
  });

  const { mutate, isPending: mutationPending } = useMutation({
    mutationFn: (variables: { userId: string; formData: FormData; auditors: UserProfile[] }) =>
      createAudit(variables.userId, variables.formData, variables.auditors),
    onSuccess: () => {
      router.push(`/user/${address}`);
      router.refresh();
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
    setTimoutPending(true);
    timeoutRef.current = setTimeout(() => {
      setTimoutPending(false);
      setQueryString(e.target.value);
    }, 500);
  };

  const uncontrolledReset = (): void => {
    setQueryString("");
    setAuditors([]);
  };

  const auditorsShow = useMemo(() => {
    const chosenAuditors = auditors.map((auditor) => auditor.id);
    return (
      data?.filter((item) => !chosenAuditors.includes(item.id) && item.address !== address) || []
    );
  }, [auditors, data, address]);

  return (
    <form onSubmit={handleSubmit} className="max-w-[700px] w-full">
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
          <Form.Search disabled={mutationPending} onChange={handleChange}>
            <Column
              className="w-full overflow-scroll px-2 min-h-[32px] justify-center"
              style={{ maxHeight: "calc(5 * 32px)" }}
            >
              {(isPending || timoutPending) && <Loader className="h-5 w-5 self-center" />}
              {!isPending &&
                !timoutPending &&
                auditorsShow.length > 0 &&
                auditorsShow.map((auditor) => (
                  <HoverItem
                    key={auditor.id}
                    onClick={() => addAuditorSet(auditor)}
                    className="px-1 w-full cursor-pointer gap-1 h-[32px] min-h-[32px] items-center"
                  >
                    <Icon image={auditor.profile?.image} seed={auditor.address} size="sm" />
                    <div className="overflow-hidden">
                      <p className="text-sm text-ellipsis overflow-hidden">
                        <span>{trimAddress(auditor.address)}</span>
                        {auditor.profile?.name && (
                          <>
                            <span className="mx-1">|</span>
                            <span className="whitespace-nowrap overflow-ellipsis m-w-full">
                              {auditor.profile.name}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </HoverItem>
                ))}
              {!isPending && !timoutPending && auditorsShow.length == 0 && (
                <p className="text-sm px-1">No results to show</p>
              )}
            </Column>
          </Form.Search>
          <Row className="gap-2 flex-wrap">
            {auditors.map((auditor) => (
              <Row
                key={auditor.id}
                onClick={() => removeAuditorSet(auditor.id)}
                className="px-1 cursor-pointer gap-1 h-[32px] min-h-[32px] items-center relative"
              >
                <Icon image={auditor.profile?.image} seed={auditor.address} size="sm" />
                <div className="overflow-hidden">
                  <p className="text-sm text-ellipsis overflow-hidden">
                    <span>{trimAddress(auditor.address)}</span>
                    {auditor.profile?.name && (
                      <>
                        <span className="mx-1">|</span>
                        <span className="whitespace-nowrap overflow-ellipsis m-w-full">
                          {auditor.profile.name}
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <span className="absolute -right-1 -top-1 text-xs">x</span>
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
        {/* combines both controlled and uncontrolled elements */}
        <Button type="reset" onClick={uncontrolledReset}>
          Reset
        </Button>
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
