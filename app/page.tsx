// import Image from "next/image";
import classNames from "classnames";

import layout from "@/styles/layout.module.css";
import styles from "@/styles/home.module.css";
import Button from "@/components/elements/Button";
import { Arrow } from "@/assets";

export default (): JSX.Element => {
  return (
    <main>
      <div
        className={classNames(
          layout.section,
          layout.fill_height,
          layout.pad_common,
          layout.center_v,
          layout.center_h,
        )}
      >
        <div className={styles.home_holder}>
          <div className={styles.home_text}>
            <h1 className="text-grad-light">
              Ensuring <br /> quality audits
            </h1>
            <p className="text-grad-light">
              On-chain solution for establishing terms and carrying out smart contract audits.
              Register as an auditee, auditor, or DAO participant.
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
            <div className={styles.stat}>
              <div>
                <h3 className="text-grad-light">100</h3>
                <p className="text-grad-light">audits conducted</p>
              </div>
            </div>
            <div className={styles.stat}>
              <div>
                <h3 className="text-grad-light">1,000</h3>
                <p className="text-grad-light">unique vulnerabilities discovered</p>
              </div>
            </div>
            <div className={styles.stat}>
              <div>
                <h3 className="text-grad-light">$10,000</h3>
                <p className="text-grad-light">processed funds</p>
              </div>
            </div>
            <div className={styles.stat}>
              <div>
                <h3 className="text-grad-light">50</h3>
                <p className="text-grad-light">registered auditors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
