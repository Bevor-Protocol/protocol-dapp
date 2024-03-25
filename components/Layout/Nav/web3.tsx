"use client";
import { useRef, useReducer } from "react";
import { useAccount } from "wagmi";

import { useIsMounted } from "@/hooks/useIsMounted";
import { useModal } from "@/hooks/contexts";
import { Chevron } from "@/assets";
import { Icon } from "@/components/Icon";
import { ChainPresets } from "@/lib/constants/chains";
import Wallets from "@/components/Web3/wallets";
import Networks from "@/components/Web3/networks";
import Profile from "@/components/Web3/profile";
import { useClickOutside } from "@/hooks/useClickOutside";
import { trimAddress } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";

const Web3Holder = (): JSX.Element => {
  const { address, isConnected, chain } = useAccount();
  const mounted = useIsMounted();
  const { setContent, toggleOpen } = useModal();

  const ref = useRef<HTMLDivElement>(null);

  const [show, setShow] = useReducer((s) => !s, false);
  const refNetwork = useRef<HTMLDivElement>(null);
  useClickOutside(refNetwork, show ? setShow : undefined);

  const handleToolTip = (): void => {
    if (!ref.current) return;
    if (mounted && !chain) {
      ref.current.style.display = "block";
    }
  };

  const clearToolTip = (): void => {
    if (!ref.current) return;
    ref.current.style.display = "none";
  };

  const handleWalletModal = (): void => {
    setContent(<Wallets />);
    toggleOpen();
  };

  const handleProfileModal = (): void => {
    setContent(<Profile />);
    toggleOpen();
  };

  let imgSrc = 99999;
  if (chain && chain.id in ChainPresets) {
    imgSrc = chain.id;
  }

  // console.log(isConnected, status, address, mounted, chainId);

  return (
    <div className="flex flex-row gap-2 items-center relative">
      {isConnected && mounted && (
        <div
          className={cn(
            "flex flex-row relative cursor-pointer rounded-lg focus-border h-12",
            "hover:bg-dark-primary-30",
          )}
          ref={refNetwork}
          tabIndex={0}
        >
          <div
            className="flex flex-row justify-center items-center gap-2 px-2"
            onMouseOver={handleToolTip}
            onMouseOut={clearToolTip}
            onClick={setShow}
          >
            <Icon
              size="sm"
              image={ChainPresets[imgSrc]}
              className={cn(imgSrc === 99999 && "!bg-auto")}
            />
            <Chevron />
          </div>
          {show && <Networks close={setShow} />}
        </div>
      )}
      {isConnected && mounted && (
        <div
          className={cn(
            "flex flex-row items-center relative cursor-pointer rounded-lg focus-border h-12",
            "hover:bg-dark-primary-30 gap-2 text-sm px-2",
          )}
          onClick={handleProfileModal}
          tabIndex={0}
        >
          {!!address && mounted && <Icon size="md" seed={address} />}
          <span className="lg:hidden">
            {isConnected && mounted ? trimAddress(address) : "connect"}
          </span>
        </div>
      )}
      {!isConnected && mounted && (
        <Button onClick={handleWalletModal}>
          <span>connect</span>
        </Button>
      )}
      <div
        className={cn(
          "absolute top-0 right-full bg-dark shadow rounded-lg z-[999]",
          "cursor-default text-xs min-w-40 hidden",
        )}
        ref={ref}
      >
        <div className="px-2 py-1">This is an unsupported network</div>
      </div>
    </div>
  );
};

export default Web3Holder;
