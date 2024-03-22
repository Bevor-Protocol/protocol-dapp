import { Suspense } from "react";

import { Loader } from "@/components/Common";
import { UserContent } from "@/components/pages/User/server";

const UserPage = ({ params }: { params: { slug: string } }): JSX.Element => {
  return (
    <section className="flex flex-col h-full items-center px-screen">
      <Suspense fallback={<Loader $size="50px" />}>
        <UserContent address={params.slug} />
      </Suspense>
    </section>
  );
};

export default UserPage;
