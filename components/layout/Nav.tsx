import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import classNames from "classnames";

import { Arrow } from "@/assets";
import SmartLink from "@/components/elements/SmartLink";
import styles from "@/styles/layout.module.css";

const navItems = [
  {
    url: "/leaderboard",
    text: "leaderboard",
    external: false,
  },
  {
    url: "/audits",
    text: "audits",
    external: false,
  },
  {
    url: "/messaging",
    text: "messaging",
    external: false,
  },
  {
    url: "/dao",
    text: "DAO",
    external: false,
  },
  {
    url: "https://docs.bevor.io",
    text: "docs",
    external: true,
  },
];

export default ({ curPath }: { curPath: string }): JSX.Element => {
  return (
    <nav>
      <div className={styles.nav_div}>
        <div className={styles.nav_logo}>
          <Image src="/name.png" alt="brand name" fill={true} sizes="any" />
        </div>
        <div className={styles.nav_items}>
          {navItems.map((item, ind) => (
            <SmartLink
              external={item.external}
              className={classNames(styles.nav_item, { [styles.active]: curPath === item.text })}
              href={item.url}
              key={ind}
            >
              <div>
                {item.text}
                {item.external && <Arrow fill="white" height={10} width={10} />}
              </div>
            </SmartLink>
          ))}
          <ConnectButton label="Connect" accountStatus="address" />
        </div>
      </div>
    </nav>
  );
};
