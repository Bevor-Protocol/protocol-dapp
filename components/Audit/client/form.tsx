/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { Column, Row } from "@/components/Box";
import { Button } from "@/components/Button";
import * as Form from "@/components/Form";
import { Loader } from "@/components/Loader";
import { searchAuditors } from "@/lib/actions/users";
import { AuditFull, UserProfile } from "@/lib/types/actions";
import { AuditorItem } from "@/components/Audit";

const AuditForm = ({
  address,
  query,
  auditors,
  setAuditors,
  handleSubmit,
  initialState,
}: {
  address: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
  auditors: UserProfile[];
  setAuditors: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  initialState?: AuditFull;
}): JSX.Element => {
  const [timoutPending, setTimoutPending] = useState(false);
  const [queryString, setQueryString] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data, isPending } = useQuery({
    queryKey: ["auditors", queryString],
    queryFn: () => searchAuditors(queryString),
  });

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
    setAuditors([...(initialState?.auditors || [])]);
  };

  const auditorsShow = useMemo(() => {
    const chosenAuditors = auditors.map((auditor) => auditor.id);
    return (
      data?.filter((item) => !chosenAuditors.includes(item.id) && item.address !== address) || []
    );
  }, [auditors, data, address]);

  return (
    <form onSubmit={handleSubmit} className="max-w-full w-[700px]">
      <h3>Create an Audit</h3>
      <Column className="gap-2 my-4">
        <Form.Input
          type="text"
          placeholder="Audit Title"
          name="title"
          defaultValue={initialState?.title}
          disabled={query.isPending}
          required
        />
        <Form.TextArea
          placeholder="Audit Description..."
          className="h-16"
          name="description"
          defaultValue={initialState?.description}
          disabled={query.isPending}
          required
        />
        <Row className="text-sm gap-2 mt-2">
          <p className="w-60">Find Auditors</p>
          <p>Selected Auditors:</p>
        </Row>
        <Row className="gap-2">
          <Form.Search disabled={query.isPending} onChange={handleChange}>
            <Column
              className="w-full overflow-scroll px-2 min-h-[32px] justify-center"
              style={{ maxHeight: "calc(5 * 32px)" }}
            >
              {(isPending || timoutPending) && <Loader className="h-5 w-5 self-center" />}
              {!isPending &&
                !timoutPending &&
                auditorsShow.length > 0 &&
                auditorsShow.map((auditor) => (
                  <AuditorItem
                    key={auditor.id}
                    auditor={auditor}
                    onClick={() => addAuditorSet(auditor)}
                    hover
                  />
                ))}
              {!isPending && !timoutPending && auditorsShow.length == 0 && (
                <p className="text-sm px-1">No results to show</p>
              )}
            </Column>
          </Form.Search>
          <Row className="gap-2 flex-wrap">
            {auditors.map((auditor) => (
              <AuditorItem
                key={auditor.id}
                auditor={auditor}
                onClick={() => removeAuditorSet(auditor.id)}
                canClose
              />
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
          defaultValue={initialState?.terms?.price}
          disabled={query.isPending}
        />
        <Form.Input
          type="number"
          placeholder="3"
          min={0}
          name="duration"
          text="Vesting Duration (months)"
          defaultValue={initialState?.terms?.duration}
          disabled={query.isPending}
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

export default AuditForm;
