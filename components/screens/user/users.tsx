"use client";

import { useState } from "react";

import { userAction } from "@/actions";
import { Row } from "@/components/Box";
import * as Form from "@/components/Form";
import { Loader } from "@/components/Loader";
import { UserCard } from "@/components/User";
import { USERS } from "@/constants/queryKeys";
import { useDebounce } from "@/hooks/useDebounce";
import { useQueryWithHydration } from "@/hooks/useQueryWithHydration";
import { UserSearch } from "@/utils/types/custom";
import { User } from "@/utils/types/tables";

const UsersWrapper = ({ initialData }: { initialData: User[] }): JSX.Element => {
  const [filter, setFilter] = useState<UserSearch>({
    search: "",
    isAuditor: false,
    isOwner: false,
  });

  const { timeoutPending, debouncedData } = useDebounce({
    data: filter,
  });

  const { data, loading } = useQueryWithHydration({
    initialData,
    queryKey: [USERS, debouncedData],
    queryFct: () => userAction.searchUsers(debouncedData),
  });

  return (
    <>
      <Row className="gap-x-6 gap-y-4 flex-wrap justify-center">
        <Form.Search onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))} />
        <ul className="md:w-full md:flex md:flex-row gap-x-4 justify-center">
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
      {/* We'll unmount here since the # of data will change, and this prevents flashing */}
      {loading || timeoutPending ? (
        <Loader className="h-12 w-12" />
      ) : data.length === 0 ? (
        <p className="px-1 text-center col-span-5">No results to show</p>
      ) : (
        <div className="grid grid-cols-4 *:w-full gap-4 w-full md:grid-cols-3 sm:grid-cols-2">
          {data.map((user) => (
            <UserCard user={user} key={user.id} />
          ))}
        </div>
      )}
    </>
  );
};

export default UsersWrapper;
