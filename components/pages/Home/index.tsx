import { Arrow } from "@/assets";
import { stats } from "@/utils/constants";
import * as Styled from "@/styles/pages.styled";
import * as Common from "@/styles/elements.styled";

export default (): JSX.Element => {
  return (
    <Styled.Home>
      <Styled.HomeText>
        <h1 className="text-grad-light">
          Ensuring <br /> quality audits
        </h1>
        <p className="text-grad-light">
          On-chain solution for establishing terms and carrying out smart contract audits. Register
          as an auditee, auditor, or DAO participant.
        </p>
        <Styled.HomeButtons>
          <Common.Button $light={true}>
            <div>
              <span className="text-grad-dark">Get Audited</span>
              <Arrow height="0.75rem" width="0.75rem" />
            </div>
          </Common.Button>
          <Common.Button $light={true}>
            <div>
              <span className="text-grad-dark">Conduct Audit</span>
              <Arrow height="0.75rem" width="0.75rem" />
            </div>
          </Common.Button>
        </Styled.HomeButtons>
      </Styled.HomeText>
      <Styled.HomeStats>
        {stats.map((stat, ind) => (
          <div key={ind}>
            <div>
              <h3 className="text-grad-light">
                {stat.symbol}
                {stat.stat.toLocaleString()}
              </h3>
              <p className="text-grad-light">{stat.text}</p>
            </div>
          </div>
        ))}
      </Styled.HomeStats>
    </Styled.Home>
  );
};
