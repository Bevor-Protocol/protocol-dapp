"use client";
import { useState } from "react";
import { useAccount } from "wagmi";

import { cn, trimAddress } from "@/lib/utils";
import { Copy, Heart, Logout } from "@/assets";
import { Button } from "@/components/Button";
import { Column, Row } from "@/components/Box";
import * as Card from "@/components/Card";
import { Social } from "@/components/Icon";
import { useModal, useSiwe } from "@/lib/hooks";
import { Users } from "@prisma/client";
import { WishlistPanel } from "@/components/Panel/Content/wishlist";

const Profile = ({ address, user }: { address: string; user: Users | null }): JSX.Element => {
  const [copied, setCopied] = useState(false);
  const { chain, connector } = useAccount();
  const { toggleOpen, setContent } = useModal();
  const { logout } = useSiwe();

  const handleClick = (): void => {
    setCopied(true);
    navigator.clipboard.writeText(address as string);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const handleWishlist = (): void => {
    if (!user) return;
    setContent(<WishlistPanel userId={user.id} />);
    toggleOpen("panel");
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
        <Button onClick={(): void => logout()} className="text-xs mt-2" variant="gradient">
          <Logout height="0.75rem" width="0.75rem" />
          <span>Disconnect</span>
        </Button>
      </Column>
      <Card.Footer className="p-2 text-white/60">
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
      {user && user.auditeeRole && (
        <Card.Footer className="p-2 text-white/60">
          <Row className="gap-1 items-center cursor-pointer" onClick={handleWishlist}>
            <Heart height="0.65rem" width="0.65rem" className="fill-gray-400" />
            <p>see my wishlist</p>
          </Row>
        </Card.Footer>
      )}
    </Card.Main>
  );
};

export default Profile;
