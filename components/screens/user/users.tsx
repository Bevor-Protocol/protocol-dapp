"use client";

import { useState } from "react";

import { userAction } from "@/actions";
import { Row } from "@/components/Box";
import * as Form from "@/components/Form";
import { UserCard } from "@/components/User";
import { USERS } from "@/constants/queryKeys";
import { useDebounce } from "@/hooks/useDebounce";
import { UserSearchI } from "@/utils/types";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const UsersWrapper = ({ initialData }: { initialData: User[] }): JSX.Element => {
  const [filter, setFilter] = useState<UserSearchI>({
    search: "",
    isAuditor: false,
    isOwner: false,
  });

  const { timeoutPending, debouncedData } = useDebounce({
    data: filter,
  });

  const { data, isLoading } = useQuery({
    queryKey: [USERS, debouncedData],
    queryFn: () => userAction.searchUsers(debouncedData),
    initialData,
    refetchOnMount: false,
  });

  return (
    <>
      <Row className="gap-6">
        <Form.Search onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))} />
        <ul>
          <li>
            <Form.Checkbox
              name="ownerRole"
              checked={filter.isOwner}
              onChange={() => setFilter((prev) => ({ ...prev, isOwner: !filter.isOwner }))}
              onKeyDownCapture={(e) => {
                if (e.key === "Enter") {
                  setFilter((prev) => ({ ...prev, isOwner: !filter.isOwner }));
                }
              }}
              text="is protocol owner"
            />
          </li>
          <li>
            <Form.Checkbox
              name="auditorRole"
              checked={filter.isAuditor}
              onChange={() => setFilter((prev) => ({ ...prev, isAuditor: !filter.isAuditor }))}
              onKeyDownCapture={(e) => {
                if (e.key === "Enter") {
                  setFilter((prev) => ({ ...prev, isAuditor: !filter.isAuditor }));
                }
              }}
              text="is auditor"
            />
          </li>
        </ul>
      </Row>
      <div className="grid grid-cols-4 *:w-full gap-4 w-full">
        {data.map((user, ind) => (
          // Explicitly using a combination of user.id + ind to prevent flashing
          // and get the nice fade-in effect.
          <UserCard user={user} key={user.id + ind} isLoading={timeoutPending || isLoading} />
        ))}
        {data.length === 0 && <p className="px-1 text-center col-span-5">No results to show</p>}
      </div>
    </>
  );
};

export default UsersWrapper;
