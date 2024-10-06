import { Suspense } from "react";

import { auditAction } from "@/actions";
import { Loader } from "@/components/Loader";
import Audits from "@/components/screens/audits";
import { AuditStatusType } from "@prisma/client";

const Fetcher = async (): Promise<JSX.Element> => {
  const data = await auditAction.getAuditsDetailed(AuditStatusType.DISCOVERY);

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
