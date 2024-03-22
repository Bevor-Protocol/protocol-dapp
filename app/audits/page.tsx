import { AuditHeader } from "@/components/pages/Audits/client";
import { Audits, AuditsSkeleton } from "@/components/pages/Audits/server";
import { Suspense } from "react";

const Audit = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}): JSX.Element => {
  const status = searchParams.status ?? "open";

  return (
    <section className="flex flex-col h-full items-center px-screen">
      <div className="flex flex-col gap-4 py-8 justify-start items-center w-full max-w-[1000px] h-full">
        <div className="grad-light text-grad">
          <h2 className="text-4xl font-extrabold leading-[normal]">
            {status.charAt(0).toUpperCase() + status.substring(1).toLowerCase()} Audits
          </h2>
        </div>
        <AuditHeader current={status} />
        <Suspense fallback={<AuditsSkeleton />} key={JSON.stringify(searchParams)}>
          <Audits current={status} />
        </Suspense>
      </div>
    </section>
  );
};

export default Audit;
