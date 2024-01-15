import { Arrow } from "@/assets";
import { stats } from "@/utils/constants";
import { Section } from "@/components/Common";
import { H1, P, Span, Strong } from "@/components/Text";
import { Row } from "@/components/Box";
import { ButtonLight } from "@/components/Button";
import { Home, HomeText, HomeStat, HomeStats } from "@/components/pages/Home";

export default (): JSX.Element => {
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
        <HomeStats $gap="sm" $align="initial" $justify="initial">
          {stats.map((stat, ind) => (
            <HomeStat key={ind} $width="100%">
              <P>
                <Strong $large>
                  <Span $gradient>
                    {stat.symbol}
                    {stat.stat.toLocaleString()}
                  </Span>
                </Strong>
              </P>
              <P>{stat.text}</P>
            </HomeStat>
          ))}
        </HomeStats>
      </Home>
    </Section>
  );
};
