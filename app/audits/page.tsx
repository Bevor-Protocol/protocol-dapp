import { Suspense } from "react";

import { auditAction } from "@/actions";
import { Column } from "@/components/Box";
import { LoaderFill } from "@/components/Loader";
import Audits from "@/components/screens/audits";
import { AuditStatusType } from "@prisma/client";

const Fetcher = async (): Promise<JSX.Element> => {
  const data = await auditAction.getAuditsDetailed(AuditStatusType.DISCOVERY);

  return <Audits initialData={data} />;
};

const Audit = (): JSX.Element => {
  return (
    <section className="flex flex-col h-full items-center">
      <Column className="gap-4 py-8 justify-start items-center w-full max-w-[1000px] h-full">
        <div className="grad-light text-grad">
          <h2 className="text-4xl font-extrabold leading-[normal]">Audits</h2>
        </div>
        <Suspense fallback={<LoaderFill className="h-12 w-12" />}>
          <Fetcher />
        </Suspense>
      </Column>
    </section>
  );
};

export default Audit;
