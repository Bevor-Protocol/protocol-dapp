// import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { HomeStatI } from "@/lib/types";

export const HomeStat = async ({ action, symbol, text }: HomeStatI): Promise<JSX.Element> => {
  // const [data, setData] = useState<number | null>();
  // useEffect(() => {
  //   const fetcher = async (): Promise<void> => {
  //     const d = await action();
  //     setData(d);
  //   };
  //   fetcher();
  // }, [action]);
  const data = await action();
  return (
    <Card hover className="text-center p-6 items-center justify-center">
      <p className="text-lg font-bold">{`${symbol || ""}${data?.toLocaleString()}`}</p>
      <p className="text-sm">{text}</p>
    </Card>
  );
};
