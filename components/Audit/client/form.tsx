/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuditorStatus, Users } from "@prisma/client";

import { Column, Row } from "@/components/Box";
import { Button } from "@/components/Button";
import * as Form from "@/components/Form";
import { Loader } from "@/components/Loader";
import { searchAuditors } from "@/actions/users";
import { AuditViewI } from "@/lib/types";
import { AuditorItem } from "@/components/Audit";

const AuditFormEntries = ({
  address,
  query,
  auditors,
  setAuditors,
  initialState,
  initialAuditors = [],
  errors,
}: {
  address: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
  auditors: Users[];
  setAuditors: React.Dispatch<React.SetStateAction<Users[]>>;
  initialState?: AuditViewI;
  initialAuditors?: Users[];
  errors: Record<string, string>;
}): JSX.Element => {
  const mockFileDefault = initialState?.details ? new File([], "") : undefined;

  const [timoutPending, setTimoutPending] = useState(false);
  const [queryString, setQueryString] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(mockFileDefault);

  const { data, isPending } = useQuery({
    queryKey: ["auditors", queryString],
    queryFn: () => searchAuditors(queryString),
  });

  const addAuditorSet = (auditor: Users): void => {
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
    setAuditors([...initialAuditors]);
    setSelectedFile(mockFileDefault);
  };

  const auditorsShow = useMemo(() => {
    // search on query string is done server-side, however we still
    // do client-side additional filtering to ensure we don't show auditors
    // that were already selected

    // 1) Filter the verified auditors from the search results
    // 2) Filter the requested or rejected auditors from the search results -> managed separately.
    const chosenAuditors = auditors.map((auditor) => auditor.id);
    const alreadyRequested =
      initialState?.auditors
        .filter(
          (auditor) =>
            auditor.status === AuditorStatus.REQUESTED || auditor.status === AuditorStatus.REJECTED,
        )
        .map((auditor) => auditor.userId) || [];
    // also want to exclude auditors who has previously requested to audit. Managing those will
    // be a different task.
    return (
      data?.filter((item) => {
        return (
          !chosenAuditors.includes(item.id) &&
          item.address !== address &&
          !alreadyRequested.includes(item.id)
        );
      }) || []
    );
  }, [auditors, data, address, initialState]);

  return (
    <>
      <Column className="gap-2 my-4">
        <Form.Input
          type="text"
          placeholder="Lorem ipsum..."
          name="title"
          text="Title"
          defaultValue={initialState?.title}
          disabled={query.isPending}
          isError={"title" in errors}
        />
        <Form.TextArea
          placeholder="Sed ut perspiciatis unde omnis iste natus error sit voluptatem..."
          className="h-16"
          name="description"
          text="Description"
          defaultValue={initialState?.description}
          disabled={query.isPending}
          isError={"description" in errors}
        />
        <Form.Dropbox
          name="details"
          text="Audit Details"
          disabled={query.isPending}
          aria-disabled={query.isPending}
          selected={selectedFile}
          setSelected={setSelectedFile}
        />
        <hr className="border-gray-200/20 my-4" />
        <Row className="text-sm gap-4">
          <p className="w-80">Find Auditors</p>
          <p>Selected Verified Auditors:</p>
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
          <Row className="gap-x-4 gap-y-0 flex-wrap content-start">
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
          defaultValue={initialState?.price}
          disabled={query.isPending}
          isError={"price" in errors}
        />
        <Form.Input
          type="number"
          placeholder="3"
          min={0}
          name="duration"
          text="Vesting Duration (months)"
          defaultValue={initialState?.duration}
          disabled={query.isPending}
          isError={"duration" in errors}
        />
      </Row>
      <hr className="border-gray-200/20 my-4" />
      <Row className="my-4 gap-4">
        <Button type="submit" variant="gradient">
          Submit
        </Button>
        {/* combines both controlled and uncontrolled elements */}
        <Button type="reset" onClick={uncontrolledReset} variant="gradient">
          Reset
        </Button>
      </Row>
      {errors &&
        Object.values(errors).map((error, ind) => (
          <p key={ind} className="text-xs text-red-500">
            {error}
          </p>
        ))}
    </>
  );
};

export default AuditFormEntries;
