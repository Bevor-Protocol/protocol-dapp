import { Suspense } from "react";

import { Loader } from "@/components/Loader";
import { getAudits } from "@/actions/audits/general";
import Audits from "@/components/screens/audits";

const Fetcher = async (): Promise<JSX.Element> => {
  const data = await getAudits("open");
  return <Audits initialData={data} />;
};

const Audit = (): JSX.Element => {
  return (
    <section className="flex flex-col h-full items-center">
      <Suspense fallback={<Loader className="h-12 w-12" />}>
        <Fetcher />
      </Suspense>
    </section>
  );
};

export default Audit;
