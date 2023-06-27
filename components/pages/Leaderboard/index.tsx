"use client";

import { useState } from "react";
import { leaderboard } from "@/utils/constants";
import { Arrow } from "@/assets";
import classNames from "classnames";

import styles from "./styles.module.css";

type ArrI = {
  name: string;
  money: number;
  active: number;
  completed: number;
  available: boolean;
};

const headers = ["name", "money", "active", "completed", "available"];

export default (): JSX.Element => {
  const [keyOrder, setKeyOrder] = useState("name");
  const [decOrder, setDecOrder] = useState(true);
  const [arrOrdered, setArrOrdered] = useState<ArrI[]>([...leaderboard]);

  const handleOrder = (key: string): void => {
    setKeyOrder(key);
    setDecOrder(!decOrder);
    setArrOrdered((prev) => {
      return prev.sort((a, b) => {
        const aVal = a[key as keyof ArrI];
        const bVal = b[key as keyof ArrI];
        return aVal > bVal ? 2 * Number(decOrder) - 1 : bVal > aVal ? 2 * Number(!decOrder) - 1 : 0;
      });
    });
  };

  return (
    <div className={styles.grid_holder}>
      <div className={styles.header}>
        <ul className={styles.grid}>
          {headers.map((header, ind) => (
            <li key={ind} onClick={(): void => handleOrder(header)}>
              {header}
              {header === keyOrder && (
                <Arrow
                  fill="white"
                  height="0.6rem"
                  className={classNames(styles.arrow, { [styles.decrease]: decOrder })}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.data}>
        {arrOrdered.map((arr, ind) => (
          <ul key={ind} className={styles.grid}>
            {headers.map((header, ind2) => (
              <li key={ind2}>{arr[header as keyof ArrI].toLocaleString()}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};
