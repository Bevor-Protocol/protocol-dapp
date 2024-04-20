"use client";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

import { cn, trimAddress } from "@/lib/utils";
import { Copy, Logout } from "@/assets";
import { Button } from "@/components/Button";
import { Column, Row } from "@/components/Box";
import * as Card from "@/components/Card";
import { Social } from "@/components/Icon";

const Profile = (): JSX.Element => {
  const [copied, setCopied] = useState(false);
  const { address, chain, connector } = useAccount();
  const { disconnect } = useDisconnect();

  const handleClick = (): void => {
    setCopied(true);
    navigator.clipboard.writeText(address as string);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Card.Main className="text-xs">
      <Column className="gap-2 pb-2 pt-1 px-2">
        <Row className="justify-between items-center">
          <p className="text-sm text-white/60">Account</p>
          <Social>
            <Copy
              stroke="white"
              className="cursor-pointer"
              copied={copied}
              onClick={handleClick}
              height="1rem"
              width="1rem"
            />
          </Social>
        </Row>
        <p>{trimAddress(address)}</p>
        <p className="text-white/60">{connector?.name}</p>
        <Button onClick={(): void => disconnect()} className="text-xs mt-2" variant="gradient">
          <Logout height="0.75rem" width="0.75rem" />
          <span>Disconnect</span>
        </Button>
      </Column>
      <Card.Footer className="justify-between p-2 text-white/60">
        <p>Network:</p>
        <p>
          <span>{chain?.name}</span>
          <span
            className={cn(
              "inline-block h-1 w-1 rounded-full ml-1 align-middle",
              chain && "bg-green-400",
              !chain && "bg-red-400",
            )}
          />
        </p>
      </Card.Footer>
    </Card.Main>
  );
};

export default Profile;
