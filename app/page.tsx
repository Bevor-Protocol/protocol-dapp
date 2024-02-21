import { Suspense } from "react";

import { Arrow } from "@/assets";
import { Section } from "@/components/Common";
import { H1, P, Span } from "@/components/Text";
import { Row } from "@/components/Box";
import { ButtonLight } from "@/components/Button";
import { HomeStat, HomeStatSkeleton } from "@/components/pages/Home";
import { Home, HomeText, HomeStatsGrid } from "@/components/pages/Home/styled";
import * as Actions from "@/lib/actions/protocolData";

const Page = (): JSX.Element => {
  return (
    <Section $padCommon $centerV $centerH>
      <Home $gap="lg">
        <HomeText $gap="xl" $align="flex-start">
          <H1>
            Ensuring <br /> quality audits
          </H1>
          <P>
            On-chain solution for establishing terms and carrying out smart contract audits.
            Register as an auditee, auditor, or DAO participant.
          </P>
          <Row $gap="sm">
            <ButtonLight $hover="dim">
              <Row $gap="xs" $align="flex-start">
                <Span>Get Audited</Span>
                <Arrow height="0.75rem" width="0.75rem" />
              </Row>
            </ButtonLight>
            <ButtonLight $hover="dim">
              <Row $gap="xs" $align="flex-start">
                <Span>Conduct Audit</Span>
                <Arrow height="0.75rem" width="0.75rem" />
              </Row>
            </ButtonLight>
          </Row>
        </HomeText>
        <HomeStatsGrid $gap="sm" $align="initial" $justify="initial">
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
        </HomeStatsGrid>
      </Home>
    </Section>
  );
};

export default Page;
