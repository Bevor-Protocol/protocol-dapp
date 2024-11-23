"use client";
import { useAccount } from "wagmi";

import { Bell, Copy, Dashboard, Heart, Logout } from "@/assets";
import { Column, HoverItem, Row } from "@/components/Box";
import * as Card from "@/components/Card";
import { Social } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import { NotificationPanel } from "@/components/Panel/Content/notifications";
import { WishlistPanel } from "@/components/Panel/Content/wishlist";
import { usePanel, useSiwe } from "@/hooks/useContexts";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/utils";
import { trimAddress } from "@/utils/formatters";
import { User } from "@/utils/types/tables";

const Profile = ({
  address,
  user,
  notifications,
  close,
}: {
  address: string;
  user: User | null;
  notifications: Record<string, { meta: string; notifications: UserNotificationI[] }>;
  close?: () => void;
}): JSX.Element => {
  const { chain, connector } = useAccount();
  const { isCopied, copy } = useCopyToClipboard();
  const { show } = usePanel();
  const { logout } = useSiwe();

  const handleWishlist = (): void => {
    if (!user) return;
    show(<WishlistPanel userId={user.id} />);
  };

  const handleNotifications = (): void => {
    if (!Object.keys(history).length) return;
    show(<NotificationPanel notifications={notifications} />);
  };

  return (
    <Card.Main className="text-xs min-w-52">
      <Card.Content>
        <Column className="gap-1 pt-2 pb-1 px-2 w-full">
          <p className="text-sm ">Account</p>
          <Row className="justify-between items-center">
            <p>{trimAddress(address)}</p>
            <Social>
              <Copy
                stroke="white"
                className="cursor-pointer"
                copied={isCopied}
                onClick={() => copy(address)}
                height="1rem"
                width="1rem"
              />
            </Social>
          </Row>
          <Row className="justify-between items-center text-xxs text-white/60 flex-nowrap">
            <p>{connector?.name}</p>
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
          </Row>
        </Column>
      </Card.Content>
      <Card.Footer className="p-1">
        <Column className="w-full">
          {Object.keys(history).length > 0 && (
            <HoverItem
              className="px-1 py-2 w-full justify-start gap-2 cursor-pointer"
              onClick={handleNotifications}
            >
              <Bell height="0.85rem" width="0.85rem" className="fill-gray-400" />
              <span>Notifications</span>
            </HoverItem>
          )}
          <HoverItem
            className="px-1 py-2 w-full justify-start gap-2 cursor-pointer"
            onClick={handleWishlist}
          >
            <Heart height="0.85rem" width="0.85rem" className="fill-gray-400" />
            <span>See my wishlist</span>
          </HoverItem>
          <DynamicLink href={`/users/${address}`} className="w-full" onClick={close}>
            <HoverItem className="px-1 py-2 w-full justify-start gap-2">
              <Dashboard height="0.85rem" width="0.85rem" stroke="currentColor" />
              <span>Dashboard</span>
            </HoverItem>
          </DynamicLink>
          <HoverItem
            onClick={(): void => logout()}
            className="px-1 py-2 w-full justify-start gap-2 cursor-pointer border border-1 border-transparent"
          >
            <Logout height="0.85rem" width="0.85rem" />
            <span>Disconnect</span>
          </HoverItem>
        </Column>
      </Card.Footer>
    </Card.Main>
  );
};

export default Profile;
