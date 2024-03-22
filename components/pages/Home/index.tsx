// "use client";

// import { useEffect, useState } from "react";
import { HomeStatSkeletonDiv } from "./styled";
import { Card } from "@/components/Card";
import { HomeStatI } from "@/lib/types";
import { Loader } from "@/components/Common";

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
      <p className="text-lg">
        <strong className="text-grad grad-light">{`${
          symbol || ""
        }${data?.toLocaleString()}`}</strong>
      </p>
      <p>{text}</p>
    </Card>
  );
};

export const HomeStatSkeleton = (): JSX.Element => {
  return (
    <Card className="text-center p-6 items-center justify-center">
      <HomeStatSkeletonDiv>
        <Loader $size="2rem" />
      </HomeStatSkeletonDiv>
    </Card>
  );
};
