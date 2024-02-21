import { HomeStatContainer, HomeStatSkeletonDiv } from "./styled";
import { P, Span, Strong } from "@/components/Text";
import { HomeStatI } from "@/lib/types";

export const HomeStat = async ({ action, symbol, text }: HomeStatI): Promise<JSX.Element> => {
  const data = await action();
  return (
    <HomeStatContainer $width="100%">
      <P>
        <Strong $large>
          <Span $gradient>{`${symbol || ""}${data.toLocaleString()}`}</Span>
        </Strong>
      </P>
      <P>{text}</P>
    </HomeStatContainer>
  );
};

export const HomeStatSkeleton = (): JSX.Element => {
  return (
    <HomeStatContainer $width="100%">
      <HomeStatSkeletonDiv>
        <P>Loading...</P>
      </HomeStatSkeletonDiv>
    </HomeStatContainer>
  );
};
