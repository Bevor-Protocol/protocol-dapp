import { statAction } from "@/actions";
import { Arrow } from "@/assets";
import { Column, Row } from "@/components/Box";
import DynamicLink from "@/components/Link";
import { HomeStat } from "@/components/screens/home";
import { cn } from "@/utils";

const Page = (): JSX.Element => {
  return (
    <section className="flex flex-col h-full justify-center items-center">
      <div className="grid grid-cols-2 w-full md:grid-cols-1 gap-6 items-center justify-center">
        <Column className="items-start gap-8 text-left md:text-center md:items-center">
          <div className="grad-light text-grad">
            <h1 className="text-6xl font-bold md:text-5xl leading-[normal] md:leading-[normal]">
              Facilitating <br /> quality audits
            </h1>
          </div>
          <p className="font-medium">
            An on-chain solution for facilitating smart contract audits in an efficient, fair, and
            robust manner. Sign in and claim your role to get started.
          </p>
          <Row className="flex-nowrap align-middle justify-center gap-2">
            <DynamicLink href="/leaderboard" asButton>
              <Row className="btn-gradient grad-light">
                <span>Get Audited</span>
                <Arrow height="0.75rem" width="0.75rem" />
              </Row>
            </DynamicLink>
            <DynamicLink href="/audits" asButton>
              <Row className="btn-gradient grad-light">
                <span>Conduct Audit</span>
                <Arrow height="0.75rem" width="0.75rem" />
              </Row>
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
          <HomeStat
            action={statAction.getProtocolNumAudits}
            text="audits conducted"
            queryKey="audits"
          />
          <HomeStat
            action={statAction.getProtocolVulnerabilities}
            text="vulnerabilities uncovered"
            queryKey="vulnerabilities"
          />
          <HomeStat
            action={statAction.getProtocolFunds}
            symbol="$"
            text="funds facilitated"
            queryKey="funds"
          />
          <HomeStat
            action={statAction.getProtocolNumAuditors}
            text="registered auditors"
            queryKey="auditors"
          />
        </div>
      </div>
    </section>
  );
};

export default Page;
