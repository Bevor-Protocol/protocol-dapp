import Link from "next/link";
import Audits from "@/components/screens/audits";
import { Suspense } from "react";
import { Column, Row } from "@/components/Box";
import { Toggle } from "@/components/Toggle";
import { AuditsSkeleton } from "@/components/Loader";

const Audit = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}): JSX.Element => {
  const status = searchParams.status ?? "open";

  return (
    <section className="flex flex-col h-full items-center px-content-limit">
      <Column className="gap-4 py-8 justify-start items-center w-full max-w-[1000px]">
        <div className="grad-light text-grad">
          <h2 className="text-4xl font-extrabold leading-[normal]">Audits</h2>
        </div>
        <Row className="gap-4">
          <Link href="/audits?status=open" className=" outline-none" scroll={false}>
            <Toggle active={status === "open"} title={"open"} />
          </Link>
          <Link href="/audits?status=pending" className=" outline-none" scroll={false}>
            <Toggle active={status === "pending"} title={"pending"} />
          </Link>
          <Link href="/audits?status=closed" className=" outline-none" scroll={false}>
            <Toggle active={status === "closed"} title={"closed"} />
          </Link>
        </Row>
        <Suspense fallback={<AuditsSkeleton />} key={JSON.stringify(searchParams)}>
          <Audits current={status} />
        </Suspense>
      </Column>
    </section>
  );
};

export default Audit;
