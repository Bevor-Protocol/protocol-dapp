"use client";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import classNames from "classnames";
import { usePathname } from "next/navigation";

import { Arrow } from "@/assets";
import SmartLink from "@/components/elements/SmartLink";
import styles from "./styles.module.css";
import { navItems } from "@/utils/constants";

export default (): JSX.Element => {
  const pathname = usePathname();
  return (
    <nav>
      <div className={styles.nav_div}>
        <SmartLink external={false} href="/" className={styles.nav_logo}>
          <Image src="/name.png" alt="brand name" fill={true} sizes="any" />
        </SmartLink>
        <div className={styles.nav_items}>
          {navItems.map((item, ind) => (
            <SmartLink
              external={item.external}
              className={classNames(styles.nav_item, { [styles.active]: pathname === item.url })}
              href={item.url}
              key={ind}
            >
              <div>
                {item.text}
                {item.external && <Arrow fill="white" height={10} width={10} />}
              </div>
            </SmartLink>
          ))}
          <ConnectButton
            label="connect"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </div>
      </div>
    </nav>
  );
};
