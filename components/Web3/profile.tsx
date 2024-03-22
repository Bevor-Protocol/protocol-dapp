import { useState } from "react";

import { useAccount } from "wagmi";
import { useDisconnect } from "wagmi";

import { useModal } from "@/hooks/contexts";
import { Icon } from "@/components/Icon";
import { trimAddress } from "@/lib/utils";
import { Column, Card, Row } from "@/components/Box";
import { NavItem } from "../Nav/styled";
import { Copy, Logout } from "@/assets";

const Profile = (): JSX.Element => {
  const [copied, setCopied] = useState(false);
  const { toggleOpen } = useModal();
  const { address } = useAccount();
  const { disconnect } = useDisconnect({
    mutation: {
      onSuccess: () => toggleOpen(),
    },
  });

  const handleClick = (): void => {
    setCopied(true);
    navigator.clipboard.writeText(address as string);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Column $gap="lg">
      {!!address && <Icon size="xl" seed={address} />}
      <Row
        $gap="md"
        style={{ position: "relative", cursor: "pointer" }}
        onClick={handleClick}
        $width="100%"
      >
        <span>{trimAddress(address)}</span>
        <Copy stroke="white" style={{ position: "absolute", right: 0 }} copied={copied} />
      </Row>
      <Card $padding="0" style={{ cursor: "pointer" }} onClick={(): void => disconnect()}>
        <NavItem $active={true} $height="2rem" $gap="md">
          <Logout />
          Disconnect
        </NavItem>
      </Card>
    </Column>
  );
};

export default Profile;
