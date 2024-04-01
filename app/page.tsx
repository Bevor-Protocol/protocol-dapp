import { Arrow } from "@/assets";
import { HomeStat } from "@/components/screens/home";
import { Button } from "@/components/Button";
import * as Actions from "@/lib/actions/protocolData";
import { cn } from "@/lib/utils";
import { Column, Row } from "@/components/Box";
import DynamicLink from "@/components/Link";

const Page = (): JSX.Element => {
  return (
    <section className="flex flex-col h-full justify-center items-center">
      <div className="grid grid-cols-2 w-full md:grid-cols-1 gap-6 items-center justify-center">
        <Column className="items-start gap-8 text-left md:text-center md:items-center">
          <div className="grad-light text-grad">
            <h1 className="text-6xl font-bold md:text-5xl leading-[normal] md:leading-[normal]">
              Ensuring <br /> quality audits
            </h1>
          </div>
          <p className="font-medium">
            On-chain solution for establishing terms and carrying out smart contract audits.
            Register as an auditee, auditor, or DAO participant.
          </p>
          <Row className="flex-nowrap align-middle justify-center gap-2">
            <DynamicLink href="/leaderboard">
              <Button>
                <span>Get Audited</span>
                <Arrow height="0.75rem" width="0.75rem" />
              </Button>
            </DynamicLink>
            <DynamicLink href="/audits?status=open">
              <Button>
                <span>Conduct Audit</span>
                <Arrow height="0.75rem" width="0.75rem" />
              </Button>
            </DynamicLink>
          </Row>
        </Column>
        <div
          className={cn(
            "grid grid-cols-2 grid-rows-2 relative z-[1] gap-2",
            "before:flex before:absolute before:inset-0 before:scale-110 \
            before:blur-[50px] before:bg-dark-primary-50 before:-z-20",
            "sm:grid-cols-1 sm:grid-rows-4",
            "md:grid-cols-2 md:grid-rows-2",
            "xl:grid-cols-1 xl:grid-rows-4",
          )}
        >
          <HomeStat action={Actions.protocolDataAudits} text="audits conducted" queryKey="audits" />
          <HomeStat
            action={Actions.protocolDataVulnerabilities}
            text="vulnerabilities uncovered"
            queryKey="vulnerabilities"
          />
          <HomeStat
            action={Actions.protocolDataFunds}
            symbol="$"
            text="funds facilitated"
            queryKey="funds"
          />
          <HomeStat
            action={Actions.protocolDataAuditors}
            text="registered auditors"
            queryKey="auditors"
          />
        </div>
      </div>
    </section>
  );
};

export default Page;
