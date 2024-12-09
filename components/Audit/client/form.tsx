/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";

import { userAction, wishlistAction } from "@/actions";
import { AuditorItem } from "@/components/Audit";
import { Column, Row } from "@/components/Box";
import { Button } from "@/components/Button";
import * as Form from "@/components/Form";
import { Loader } from "@/components/Loader";
import { AUDITORS, WISHLIST } from "@/constants/queryKeys";
import { AvailableTokens } from "@/constants/web3";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/utils";
import { MembershipStatusEnum } from "@/utils/types/enum";
import { AuditWithOwnerSecure } from "@/utils/types/relations";
import { User } from "@/utils/types/tables";

const AuditFormEntries = ({
  userId,
  disabled,
  auditors,
  setAuditors,
  initialState,
  initialAuditors = [],
  errors,
}: {
  userId: string;
  disabled: boolean;
  auditors: User[];
  setAuditors: React.Dispatch<React.SetStateAction<User[]>>;
  initialState?: AuditWithOwnerSecure;
  initialAuditors?: User[];
  errors: Record<string, string>;
}): JSX.Element => {
  const mockFileDefault = initialState?.details ? new File([], "") : undefined;

  const [queryString, setQueryString] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>(mockFileDefault);
  const [showOnlyWishlist, setShowOnlyWishlist] = useState(false);

  const { timeoutPending, debouncedData } = useDebounce({
    data: queryString,
  });

  const { data, isPending } = useQuery({
    queryKey: [AUDITORS, debouncedData],
    queryFn: () => userAction.searchAuditors(debouncedData),
  });

  const { data: dataWishlist } = useQuery({
    queryKey: [WISHLIST, userId],
    queryFn: () => wishlistAction.getUserWishlist(userId),
  });

  const addAuditorSet = (auditor: User): void => {
    setAuditors((prev) => [...prev, auditor]);
  };

  const removeAuditorSet = (id: string): void => {
    setAuditors((prev) => prev.filter((auditor) => auditor.id != id));
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
    const wishlistedAuditors = dataWishlist?.map((auditors) => auditors.id);
    const alreadyRequested =
      initialState?.auditMemberships
        .filter(
          (member) =>
            member.status === MembershipStatusEnum.REQUESTED ||
            member.status === MembershipStatusEnum.REJECTED,
        )
        .map((member) => member.user.id) || [];
    return (
      data?.filter((item) => {
        return (
          !chosenAuditors.includes(item.id) &&
          item.id !== userId &&
          !alreadyRequested.includes(item.id) &&
          (!showOnlyWishlist || wishlistedAuditors?.includes(item.id))
        );
      }) || []
    );
  }, [auditors, data, userId, initialState, showOnlyWishlist, dataWishlist]);

  return (
    <>
      <Column className="gap-2 my-4 md:w-full">
        <Form.Input
          type="text"
          placeholder="audit title..."
          name="title"
          text="Title"
          defaultValue={initialState?.title}
          disabled={disabled}
          isError={"title" in errors}
          className="w-1/2 md:w-full"
        />
        <Form.TextArea
          placeholder="audit description..."
          className="h-16"
          name="description"
          text="Description"
          defaultValue={initialState?.description}
          disabled={disabled}
          isError={"description" in errors}
        />
        <Form.Dropbox
          name="details"
          text="Audit Details"
          disabled={disabled}
          aria-disabled={disabled}
          selected={selectedFile}
          setSelected={setSelectedFile}
        />
        <hr className="border-gray-200/20 my-4" />
        <Row className="gap-4 md:flex-wrap">
          <Column className="gap-2 basis-1/2 flex-grow">
            <Form.Search
              disabled={disabled}
              onChange={(e) => setQueryString(e.target.value)}
              text="Find Auditors"
              className="w-1/2"
            >
              <Column
                className="w-full overflow-scroll px-2 justify-start"
                style={{ maxHeight: "calc(5 * 32px)", height: "calc(5 * 32px)" }}
              >
                {(isPending || timeoutPending) && (
                  <Column className="h-full justify-center">
                    <Loader className="h-5 w-5 self-center" />
                  </Column>
                )}
                {!isPending &&
                  !timeoutPending &&
                  auditorsShow.length > 0 &&
                  auditorsShow.map((auditor) => (
                    <AuditorItem
                      key={auditor.id}
                      auditor={auditor}
                      disabled={disabled}
                      onClick={() => addAuditorSet(auditor)}
                      hover
                    />
                  ))}
                {!isPending && !timeoutPending && auditorsShow.length == 0 && (
                  <p className="text-sm px-1">No results to show</p>
                )}
              </Column>
            </Form.Search>
            <label className="flex gap-2 *:text-sm w-fit *:cursor-pointer items-center">
              <input
                type="checkbox"
                name="wishlist-toggle"
                className={cn(
                  "appearance-none bg-transparent checked:bg-primary-light-50",
                  "border border-1 border-white",
                  "h-3 w-3 rounded-sm",
                )}
                checked={showOnlyWishlist}
                onChange={() => setShowOnlyWishlist(!showOnlyWishlist)}
                onKeyDownCapture={() => setShowOnlyWishlist(!showOnlyWishlist)}
              />
              <p>show wishlisted auditors</p>
            </label>
          </Column>
          <div className="basis-1/2 flex-grow">
            <p className="mb-1 text-sm">Verified Auditors:</p>
            <Column className="gap-x-4 gap-y-0 flex-wrap content-start">
              {auditors.map((auditor) => (
                <AuditorItem
                  key={auditor.id}
                  auditor={auditor}
                  disabled={disabled}
                  onClick={() => removeAuditorSet(auditor.id)}
                  canClose
                />
              ))}
            </Column>
          </div>
        </Row>
      </Column>
      <hr className="border-gray-200/20 my-4" />
      <p className="my-2">Terms:</p>
      <div className="grid grid-cols-3 gap-4 md:grid-cols-4">
        <Form.Select
          text="Select a Token"
          placeholder="-- token --"
          name="token"
          defaultValue={initialState?.token ?? ""}
          disabled={disabled}
          isError={"token" in errors}
          className="col-start-1 col-span-1 md:col-span-2"
        >
          {AvailableTokens.Localhost.map((option) => (
            <option key={option.symbol} value={option.address}>
              {option.symbol}
            </option>
          ))}
        </Form.Select>
        <Form.Input
          type="number"
          placeholder="1000"
          min={0}
          name="price"
          text="Total Price (# tokens)"
          defaultValue={initialState?.price}
          disabled={disabled}
          isError={"price" in errors}
          className="col-span-1 md:col-span-2"
        />
        <Form.Input
          type="number"
          placeholder="30"
          min={0}
          name="duration"
          text="Vesting Duration (days)"
          defaultValue={initialState?.duration}
          disabled={disabled}
          isError={"duration" in errors}
          className="col-start-1 col-span-1 md:col-span-2"
        />
        <Form.Input
          type="number"
          placeholder="3"
          min={0}
          name="cliff"
          text="Vesting Cliff (days)"
          defaultValue={initialState?.cliff}
          disabled={disabled}
          isError={"cliff" in errors}
          className="col-span-1 md:col-span-2"
        />
      </div>
      <hr className="border-gray-200/20 my-4" />
      <Row className="my-4 gap-4">
        {/* combines both controlled and uncontrolled elements */}
        <Button type="reset" onClick={uncontrolledReset} variant="gradient" disabled={disabled}>
          Reset
        </Button>
        <Button type="submit" variant="gradient" disabled={disabled}>
          Submit
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
