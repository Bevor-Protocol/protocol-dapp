import { Arrow } from "@/assets";
import { stats } from "@/utils/constants";
import * as Styled from "@/styles/pages.styled";

import { H1, H3, P, Span } from "@/components/Text";
import { ButtonLight } from "@/components/Button";

// const Span = styled.span`
//   ${TextGradDark}
// `;

export default (): JSX.Element => {
  return (
    <Styled.Home>
      <Styled.HomeText>
        <H1 $gradient>
          Ensuring <br /> quality audits
        </H1>
        <P $gradient>
          On-chain solution for establishing terms and carrying out smart contract audits. Register
          as an auditee, auditor, or DAO participant.
        </P>
        <Styled.HomeButtons>
          <ButtonLight>
            <div>
              <Span>Get Audited</Span>
              <Arrow height="0.75rem" width="0.75rem" />
            </div>
          </ButtonLight>
          <ButtonLight>
            <div>
              <Span>Conduct Audit</Span>
              <Arrow height="0.75rem" width="0.75rem" />
            </div>
          </ButtonLight>
        </Styled.HomeButtons>
      </Styled.HomeText>
      <Styled.HomeStats>
        {stats.map((stat, ind) => (
          <div key={ind}>
            <div>
              <H3 $gradient>
                {stat.symbol}
                {stat.stat.toLocaleString()}
              </H3>
              <P $gradient>{stat.text}</P>
            </div>
          </div>
        ))}
      </Styled.HomeStats>
    </Styled.Home>
  );
};
