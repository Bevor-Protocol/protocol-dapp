import { useIsMounted } from "@/hooks/useIsMounted";
import { Span } from "@/components/Text";
import SmartLink from "@/components/Link";
import { NavItem } from "./styled";
import { useAccount } from "wagmi";

export default ({ pathname }: { pathname: string }): JSX.Element => {
  const mounted = useIsMounted();
  const { address } = useAccount();

  return (
    <SmartLink external={false} href={address ? `/user/${address}` : "/"}>
      <NavItem $active={pathname.split("/")[1] === "user"} $hover="bg">
        <Span>dashboard</Span>
      </NavItem>
    </SmartLink>
  );
};
