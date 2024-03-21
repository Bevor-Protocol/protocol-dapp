import { Suspense } from "react";

import { Section, Loader } from "@/components/Common";
import { UserContent } from "@/components/pages/User/server";

const UserPage = ({ params }: { params: { slug: string } }): JSX.Element => {
  return (
    <Section $padCommon $centerH>
      <Suspense fallback={<Loader $size="50px" />}>
        <UserContent address={params.slug} />
      </Suspense>
    </Section>
  );
};

export default UserPage;
