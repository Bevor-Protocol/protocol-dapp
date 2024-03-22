import { Suspense } from "react";

import { Arrow } from "@/assets";
import { HomeStat, HomeStatSkeleton } from "@/components/pages/Home";
import * as Actions from "@/lib/actions/protocolData";
import clsx from "clsx";

const Page = (): JSX.Element => {
  return (
    <section className="flex flex-col h-full justify-center items-center px-screen">
      <div className="grid grid-cols-2 w-full md:grid-cols-1 gap-6 items-center justify-center">
        <div className="flex flex-col items-start gap-8 text-left md:text-center md:items-center">
          <div className="grad-light text-grad">
            <h1 className="text-6xl font-bold md:text-5xl leading-[normal] md:leading-[normal]">
              Ensuring <br /> quality audits
            </h1>
          </div>
          <p className="text-base font-medium">
            On-chain solution for establishing terms and carrying out smart contract audits.
            Register as an auditee, auditor, or DAO participant.
          </p>
          <div className="flex flex-row flex-nowrap align-middle justify-center gap-2">
            <button
              className="outline-none border-none font-bold rounded-md 
            grad-light py-2 px-5 dim disabled:opacity-disable"
            >
              <div className="flex flex-row align-middle gap-1 text-dark text-sm">
                <span>Get Audited</span>
                <Arrow height="0.75rem" width="0.75rem" />
              </div>
            </button>
            <button
              className="outline-none border-none font-bold rounded-md 
            grad-light py-2 px-5 dim disabled:opacity-disable"
            >
              <div className="flex flex-row align-middle gap-1 text-dark text-sm">
                <span>Conduct Audit</span>
                <Arrow height="0.75rem" width="0.75rem" />
              </div>
            </button>
          </div>
        </div>
        <div
          className={clsx(
            "grid grid-cols-2 grid-rows-2 relative z-[1] gap-2",
            "before:flex before:absolute before:inset-0 before:scale-110 \
            before:blur-[50px] before:bg-dark-primary-50 before:-z-20",
            "sm:grid-cols-1 sm:grid-rows-4",
            "md:grid-cols-2 md:grid-rows-2",
            "xl:grid-cols-1 xl:grid-rows-4",
          )}
        >
          {/* <HomeStat action={Actions.protocolDataAudits} text="audits conducted" />
          <HomeStat action={Actions.protocolDataVulnerabilities} text="vulnerabilities uncovered" />
          <HomeStat action={Actions.protocolDataFunds} symbol="$" text="funds facilitated" />
          <HomeStat action={Actions.protocolDataAuditors} text="registered auditors" /> */}
          <Suspense fallback={<HomeStatSkeleton />}>
            <HomeStat action={Actions.protocolDataAudits} text="audits conducted" />
          </Suspense>
          <Suspense fallback={<HomeStatSkeleton />}>
            <HomeStat
              action={Actions.protocolDataVulnerabilities}
              text="vulnerabilities uncovered"
            />
          </Suspense>
          <Suspense fallback={<HomeStatSkeleton />}>
            <HomeStat action={Actions.protocolDataFunds} symbol="$" text="funds facilitated" />
          </Suspense>
          <Suspense fallback={<HomeStatSkeleton />}>
            <HomeStat action={Actions.protocolDataAuditors} text="registered auditors" />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default Page;
