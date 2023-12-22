import { useIsMounted } from "@/hooks/useIsMounted";
import { Span } from "@/components/Text";
import SmartLink from "@/components/Link";
import { NavItem } from "./styled";
import { useAccount } from "wagmi";

export default ({ active }: { active: boolean }): JSX.Element => {
  const mounted = useIsMounted();
  const { address } = useAccount();

  return (
    <SmartLink external={false} href={mounted && address ? `/user/${address}` : "/"}>
      <NavItem $active={active} $hover="bg">
        <Span>dashboard</Span>
      </NavItem>
    </SmartLink>
  );
};
