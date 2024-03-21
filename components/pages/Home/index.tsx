// "use client";

// import { useEffect, useState } from "react";
import { HomeStatSkeletonDiv } from "./styled";
import { Card } from "@/components/Box";
import { P, Span, Strong } from "@/components/Text";
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
    <Card $width="100%" $hover style={{ textAlign: "center" }}>
      <P>
        <Strong $large>
          <Span $gradient>{`${symbol || ""}${data?.toLocaleString()}`}</Span>
        </Strong>
      </P>
      <P>{text}</P>
    </Card>
  );
};

export const HomeStatSkeleton = (): JSX.Element => {
  return (
    <Card $width="100%">
      <HomeStatSkeletonDiv>
        <Loader $size="2rem" />
      </HomeStatSkeletonDiv>
    </Card>
  );
};
