import { Suspense } from "react";

import { userAction } from "@/actions";
import { Loader } from "@/components/Loader";
import UsersWrapper from "@/components/screens/user/users";

const Fetcher = async (): Promise<JSX.Element> => {
  const data = await userAction.searchUsers({
    search: "",
    isAuditor: false,
    isOwner: false,
  });
  return <UsersWrapper initialData={data} />;
};

const UsersPage = (): JSX.Element => {
  return (
    <section className="flex flex-col h-full items-center">
      <Suspense fallback={<Loader className="h-12 w-12" />}>
        <Fetcher />
      </Suspense>
    </section>
  );
};

export default UsersPage;
