import styles from "./styles.module.css";
import Button from "@/components/elements/Button";
import { Arrow } from "@/assets";
import { stats } from "@/utils/constants";

export default (): JSX.Element => {
  return (
    <div className={styles.home_holder}>
      <div className={styles.home_text}>
        <h1 className="text-grad-light">
          Ensuring <br /> quality audits
        </h1>
        <p className="text-grad-light">
          On-chain solution for establishing terms and carrying out smart contract audits. Register
          as an auditee, auditor, or DAO participant.
        </p>
        <div className={styles.button_wrapper}>
          <Button theme="light">
            <div>
              <span className="text-grad-dark">Get Audited</span>
              <Arrow height="0.75rem" width="0.75rem" />
            </div>
          </Button>
          <Button theme="light">
            <div>
              <span className="text-grad-dark">Conduct Audit</span>
              <Arrow height="0.75rem" width="0.75rem" />
            </div>
          </Button>
        </div>
      </div>
      <div className={styles.stats_grid}>
        {stats.map((stat, ind) => (
          <div className={styles.stat} key={ind}>
            <div>
              <h3 className="text-grad-light">
                {stat.symbol}
                {stat.stat.toLocaleString()}
              </h3>
              <p className="text-grad-light">{stat.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
