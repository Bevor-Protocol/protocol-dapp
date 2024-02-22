import { useIsMounted } from "@/hooks/useIsMounted";
import { Span } from "@/components/Text";
import DynamicLink from "@/components/Link";
import { NavItem } from "./styled";
import { useAccount } from "wagmi";

const DashboardNav = ({ active }: { active: boolean }): JSX.Element => {
  const mounted = useIsMounted();
  const { address } = useAccount();

  return (
    <DynamicLink href={mounted && address ? `/user/${address}` : "/"}>
      <NavItem $active={active}>
        <Span>dashboard</Span>
      </NavItem>
    </DynamicLink>
  );
};

export default DashboardNav;
