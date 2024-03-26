"use client";
import { useAccount } from "wagmi";

import { useIsMounted } from "@/hooks/useIsMounted";
import { useModal } from "@/hooks/contexts";
import { Chevron } from "@/assets";
import { Icon } from "@/components/Icon";
import { ChainPresets } from "@/lib/constants/chains";
import Wallets from "@/components/Web3/wallets";
import Networks from "@/components/Web3/networks";
import Profile from "@/components/Web3/profile";
import { trimAddress } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { Row } from "@/components/Box";
import * as Dropdown from "@/components/Dropdown";
import * as Tooltip from "@/components/Tooltip";
import { useDropdown } from "@/hooks/useDropdown";

const Web3Network = (): JSX.Element => {
  const { chain } = useAccount();
  const dropdown = useDropdown();
  let imgSrc = 99999;
  if (chain && chain.id in ChainPresets) {
    imgSrc = chain.id;
  }

  return (
    <Dropdown.Main
      className={cn(
        "flex flex-row relative cursor-pointer rounded-lg focus-border",
        "hover:bg-dark-primary-30",
      )}
      dropdown={dropdown}
      tabIndex={0}
    >
      <Dropdown.Trigger dropdown={dropdown}>
        <Tooltip.Reference target="invalid-network" shouldShow={!chain}>
          <Row className="justify-center items-center gap-2 px-2 h-12">
            <Icon
              size="sm"
              image={ChainPresets[imgSrc]}
              className={cn(imgSrc === 99999 && "!bg-auto")}
            />
            <Chevron />
          </Row>
          <Tooltip.Content target="invalid-network" className="top-0 right-full">
            <div className="bg-dark shadow rounded-lg z-[999] cursor-default text-xs min-w-40">
              <div className="px-2 py-1">This is an unsupported network</div>
            </div>
          </Tooltip.Content>
        </Tooltip.Reference>
      </Dropdown.Trigger>
      <Dropdown.Content dropdown={dropdown} className="top-full right-0">
        <Networks close={dropdown.toggle} />
      </Dropdown.Content>
    </Dropdown.Main>
  );
};

const Web3Profile = (): JSX.Element => {
  const { address } = useAccount();
  const dropdown = useDropdown();

  return (
    <Dropdown.Main
      className={cn(
        "flex flex-row relative cursor-pointer rounded-lg focus-border",
        "hover:bg-dark-primary-30",
      )}
      dropdown={dropdown}
      tabIndex={0}
    >
      <Dropdown.Trigger dropdown={dropdown}>
        <Row
          className={cn(
            "items-center relative cursor-pointer rounded-lg focus-border h-12",
            "hover:bg-dark-primary-30 gap-2 text-sm px-2",
          )}
        >
          <Icon size="md" seed={address} />
          <span className="lg:hidden">{trimAddress(address)}</span>
        </Row>
      </Dropdown.Trigger>
      <Dropdown.Content dropdown={dropdown} className="top-full right-0 w-40">
        <Profile close={dropdown.toggle} />
      </Dropdown.Content>
    </Dropdown.Main>
  );
};

const Web3Holder = (): JSX.Element => {
  const { isConnected } = useAccount();
  const mounted = useIsMounted();
  const { setContent, toggleOpen } = useModal();

  const handleWalletModal = (): void => {
    setContent(<Wallets />);
    toggleOpen();
  };

  return (
    <Row className="gap-2 items-center relative">
      {isConnected && mounted && <Web3Network />}
      {isConnected && mounted && <Web3Profile />}
      {!isConnected && mounted && (
        <Button onClick={handleWalletModal}>
          <span>connect</span>
        </Button>
      )}
    </Row>
  );
};

export default Web3Holder;
