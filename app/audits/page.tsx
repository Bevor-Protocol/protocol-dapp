import { Suspense } from "react";

import { Loader } from "@/components/Loader";
import { auditController } from "@/actions";
import Audits from "@/components/screens/audits";

const Fetcher = async (): Promise<JSX.Element> => {
  const data = await auditController.getAuditsDetailed("open");

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
