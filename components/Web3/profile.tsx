"use client";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

import { trimAddress } from "@/lib/utils";
import { Copy, Logout } from "@/assets";
import { Button } from "@/components/Button";
import { Column, Row } from "@/components/Box";
import { Card } from "@/components/Card";
import { Social } from "../Icon";

const Profile = ({ close }: { close: () => void }): JSX.Element => {
  const [copied, setCopied] = useState(false);
  const { address, chain, connector } = useAccount();
  const { disconnect } = useDisconnect({
    mutation: {
      onSuccess: close,
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
    <Card className="text-[0.65rem] divide-y divide-gray-200/20 text-white/60">
      <Column className="gap-2 pb-2 pt-1 px-2">
        <Row className="justify-between items-center">
          <p className="text-xs">Account</p>
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
        <p className="text-white">{trimAddress(address)}</p>
        <p className="">{connector?.name}</p>
        <Button onClick={(): void => disconnect()} className="text-xs justify-center">
          <Logout height="0.75rem" width="0.75rem" />
          <span>Disconnect</span>
        </Button>
      </Column>
      <Row className="justify-between p-2">
        <p>Network:</p>
        <p>
          <span className="inline-block h-1 w-1 bg-green-400 rounded-full mr-1 align-middle" />
          <span>{chain?.name}</span>
        </p>
      </Row>
    </Card>
  );
};

export default Profile;
