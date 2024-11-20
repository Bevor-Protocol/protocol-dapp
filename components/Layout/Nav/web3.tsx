"use client";
import { useAccount } from "wagmi";

import { Chevron } from "@/assets";
import { Row } from "@/components/Box";
import { Button } from "@/components/Button";
import * as Dropdown from "@/components/Dropdown";
import Networks from "@/components/Dropdown/Content/networks";
import Profile from "@/components/Dropdown/Content/profile";
import { Icon } from "@/components/Icon";
import Wallets from "@/components/Panel/Content/wallets";
import * as Tooltip from "@/components/Tooltip";
import { useModal } from "@/hooks/useContexts";
import { cn } from "@/utils";
import { trimAddress } from "@/utils/formatters";
import { getNetworkImage } from "@/utils/helpers";
import { UserNotificationI } from "@/utils/types/prisma";
import { User } from "@/utils/types/tables";

const Web3Network = (): JSX.Element => {
  const { chain } = useAccount();
  const { supported, networkImg } = getNetworkImage(chain);

  return (
    <Dropdown.Main
      className="flex flex-row relative cursor-pointer rounded-lg focus-border"
      tabIndex={0}
    >
      <Dropdown.Trigger>
        <Tooltip.Reference shouldShow={!chain}>
          <Tooltip.Trigger>
            <Row className="justify-center items-center gap-2 px-2 h-12 rounded-lg hover:bg-dark-primary-30">
              <Icon
                size="sm"
                image={networkImg}
                className={cn(
                  !supported && "!bg-auto",
                  supported && networkImg.includes("unknown") && "!bg-auto", // for localhost for now.
                )}
              />
              <Chevron />
            </Row>
          </Tooltip.Trigger>
          <Tooltip.Content side="left" align="start">
            <div className="bg-dark shadow rounded-lg cursor-default min-w-40">
              <div className="px-2 py-1">This is an unsupported network</div>
            </div>
          </Tooltip.Content>
        </Tooltip.Reference>
      </Dropdown.Trigger>
      <Dropdown.Content className="top-full right-0" hasCloseTrigger>
        <Networks />
      </Dropdown.Content>
    </Dropdown.Main>
  );
};

const Web3Profile = ({
  address,
  user,
  notifications,
}: {
  address: string;
  user: User | null;
  notifications: Record<string, { meta: string; notifications: UserNotificationI[] }>;
}): JSX.Element => {
  return (
    <Dropdown.Main
      className="flex flex-row relative cursor-pointer rounded-lg focus-border"
      tabIndex={0}
    >
      <Dropdown.Trigger>
        <Row
          className={cn(
            "items-center relative cursor-pointer rounded-lg focus-border h-12",
            "hover:bg-dark-primary-30 gap-2 text-sm px-2",
          )}
        >
          <Icon size="md" image={user?.image} seed={address} />
          <span className="lg:hidden">{trimAddress(address)}</span>
        </Row>
      </Dropdown.Trigger>
      <Dropdown.Content className="top-full right-0" hasCloseTrigger>
        <Profile address={address} user={user} notifications={notifications} />
      </Dropdown.Content>
    </Dropdown.Main>
  );
};

const Web3Holder = ({
  address,
  user,
  notifications,
}: {
  address: string;
  user: User | null;
  notifications: Record<string, { meta: string; notifications: UserNotificationI[] }>;
}): JSX.Element => {
  // need to pass both because a user can get authenticated via SIWE,
  // but not have an account yet.

  const { show } = useModal();

  const handleWalletModal = (): void => {
    show(<Wallets />);
  };

  return (
    <Row className="gap-2 items-center relative">
      {!!address && (
        <>
          <Web3Network />
          <Web3Profile address={address} user={user} notifications={notifications} />
        </>
      )}
      {!address && <Button onClick={handleWalletModal}>connect</Button>}
    </Row>
  );
};

export default Web3Holder;
