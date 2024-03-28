import { Suspense } from "react";

import { Loader } from "@/components/Loader";
import UserContent from "@/components/pages/User";

const UserPage = ({ params }: { params: { slug: string } }): JSX.Element => {
  return (
    <section className="flex flex-col h-full items-center px-content-limit">
      <Suspense fallback={<Loader className="h-12" />}>
        <UserContent address={params.slug} />
      </Suspense>
    </section>
  );
};

export default UserPage;
