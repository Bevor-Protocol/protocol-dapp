import { Arrow } from "@/assets";
import { stats } from "@/utils/constants";
import { Section } from "@/components/Common";
import { H1, H3, P, Span } from "@/components/Text";
import { Row } from "@/components/Box";
import { ButtonLight } from "@/components/Button";
import { Home, HomeText, HomeStat, HomeStats } from "@/components/pages/Home";

export default (): JSX.Element => {
  return (
    <Section $padCommon $centerV $centerH>
      <Home $gap="lg">
        <HomeText $gap="xl" $align="flex-start">
          <H1 $gradient>
            Ensuring <br /> quality audits
          </H1>
          <P $gradient>
            On-chain solution for establishing terms and carrying out smart contract audits.
            Register as an auditee, auditor, or DAO participant.
          </P>
          <Row $gap="sm">
            <ButtonLight>
              <Row $gap="xs" $align="flex-start">
                <Span>Get Audited</Span>
                <Arrow height="0.75rem" width="0.75rem" />
              </Row>
            </ButtonLight>
            <ButtonLight>
              <Row $gap="xs" $align="flex-start">
                <Span>Conduct Audit</Span>
                <Arrow height="0.75rem" width="0.75rem" />
              </Row>
            </ButtonLight>
          </Row>
        </HomeText>
        <HomeStats $gap="sm" $align="initial" $justify="initial">
          {stats.map((stat, ind) => (
            <HomeStat key={ind}>
              <div>
                <H3 $gradient>
                  {stat.symbol}
                  {stat.stat.toLocaleString()}
                </H3>
                <P $gradient>{stat.text}</P>
              </div>
            </HomeStat>
          ))}
        </HomeStats>
      </Home>
    </Section>
  );
};
