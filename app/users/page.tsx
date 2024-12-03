import { userAction } from "@/actions";
import { Column } from "@/components/Box";
import { LoaderFill } from "@/components/Loader";
import UsersWrapper from "@/components/screens/user/users";
import { Suspense } from "react";

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
    <section className="flex flex-col h-full items-center sm:pb-14">
      <Column className="gap-10 py-8 justify-start items-center w-full max-w-[1000px] h-full">
        <div className="grad-light text-grad">
          <h2 className="text-4xl font-extrabold leading-[normal]">Users</h2>
        </div>
        <Suspense fallback={<LoaderFill className="h-12 w-12" />}>
          <Fetcher />
        </Suspense>
      </Column>
    </section>
  );
};

export default UsersPage;
