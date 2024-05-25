"use client";
import { useAccount } from "wagmi";

import { useModal } from "@/lib/hooks";
import { Chevron } from "@/assets";
import { Icon } from "@/components/Icon";
import { ChainPresets } from "@/lib/constants";
import SignIn from "@/components/Modal/Content/signin";
import Networks from "@/components/Dropdown/Content/networks";
import Profile from "@/components/Dropdown/Content/profile";
import { trimAddress } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { Row } from "@/components/Box";
import * as Dropdown from "@/components/Dropdown";
import * as Tooltip from "@/components/Tooltip";
import { Users } from "@prisma/client";

const Web3Network = (): JSX.Element => {
  const { chain } = useAccount();
  let imgSrc = 99999;
  if (chain && chain.id in ChainPresets) {
    imgSrc = chain.id;
  }

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
                image={ChainPresets[imgSrc]}
                className={cn(imgSrc === 99999 && "!bg-auto")}
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

const Web3Profile = ({ user }: { user: Users }): JSX.Element => {
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
          <Icon size="md" image={user.image} seed={user.address} />
          <span className="lg:hidden">{trimAddress(user.address)}</span>
        </Row>
      </Dropdown.Trigger>
      <Dropdown.Content className="top-full right-0 w-40">
        <Profile user={user} />
      </Dropdown.Content>
    </Dropdown.Main>
  );
};

const Web3Holder = ({ user }: { user: Users | null }): JSX.Element => {
  const { setContent, toggleOpen } = useModal();

  const handleWalletModal = (): void => {
    setContent(<SignIn />);
    toggleOpen();
  };

  return (
    <Row className="gap-2 items-center relative">
      {!!user && (
        <>
          <Web3Network />
          <Web3Profile user={user} />
        </>
      )}
      {!user && <Button onClick={handleWalletModal}>connect</Button>}
    </Row>
  );
};

export default Web3Holder;
