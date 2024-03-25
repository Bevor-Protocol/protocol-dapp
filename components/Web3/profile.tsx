"use client";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

import { useModal } from "@/hooks/contexts";
import { Icon } from "@/components/Icon";
import { trimAddress } from "@/lib/utils";
import { Copy, Logout } from "@/assets";
import { Button } from "../Button";
import { Column, Row } from "../Box";

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
    <Column className="gap-6 items-center w-full">
      {!!address && <Icon size="xl" seed={address} />}
      <Row className="gap-3 relative cursor-pointer w-full justify-center" onClick={handleClick}>
        <span>{trimAddress(address)}</span>
        <Copy stroke="white" copied={copied} className="absolute right-0" />
      </Row>
      <Button onClick={(): void => disconnect()}>
        <Logout />
        <span>Disconnect</span>
      </Button>
    </Column>
  );
};

export default Profile;
