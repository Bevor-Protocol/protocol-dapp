"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { userAction } from "@/actions";
import { Column, Row } from "@/components/Box";
import * as Form from "@/components/Form";
import { UserCard } from "@/components/User";
import { USERS } from "@/constants/queryKeys";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/utils";
import { UserSearchI } from "@/utils/types";
import { User } from "@prisma/client";

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
  });

  return (
    <Column className="gap-10 py-8 justify-center items-center w-full max-w-[1000px]">
      <div className="grad-light text-grad">
        <h2 className="text-4xl font-extrabold leading-[normal]">Users</h2>
      </div>
      <Row className="gap-6">
        <Form.Search onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))} />
        <ul>
          <li>
            <label className="flex gap-2 *:text-sm w-fit *:cursor-pointer items-center">
              <input
                type="checkbox"
                className={cn(
                  "appearance-none bg-transparent checked:bg-primary-light-50",
                  "border border-1 border-white",
                  "h-3 w-3 rounded-sm",
                )}
                name="ownerRole"
                checked={filter.isOwner}
                onChange={() => setFilter((prev) => ({ ...prev, isOwner: !filter.isOwner }))}
                onKeyDownCapture={() =>
                  setFilter((prev) => ({ ...prev, isOwner: !filter.isOwner }))
                }
              />
              <p>is protocol owner</p>
            </label>
          </li>
          <li>
            <label className="flex gap-2 *:text-sm w-fit *:cursor-pointer items-center">
              <input
                type="checkbox"
                className={cn(
                  "appearance-none bg-transparent checked:bg-primary-light-50",
                  "border border-1 border-white",
                  "h-3 w-3 rounded-sm",
                )}
                name="auditorRole"
                checked={filter.isAuditor}
                onChange={() => setFilter((prev) => ({ ...prev, isAuditor: !filter.isAuditor }))}
                onKeyDownCapture={() =>
                  setFilter((prev) => ({ ...prev, isAuditor: !filter.isAuditor }))
                }
              />
              <p>is auditor</p>
            </label>
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
    </Column>
  );
};

export default UsersWrapper;
