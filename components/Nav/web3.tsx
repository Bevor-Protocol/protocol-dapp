import Image from "next/image";
import { useRef, useReducer } from "react";

import { Row } from "@/components/Box";
import { useAccount } from "wagmi";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useModal } from "@/hooks/contexts";
import { Chevron } from "@/assets";
import { WalletHolder } from "./styled";
import { Avatar, Icon } from "@/components/Icon";
import { ButtonLight } from "@/components/Button";
import { DropDown } from "@/components/Tooltip";
import { ChainPresets } from "@/lib/constants/chains";
import Wallets from "@/components/Web3/wallets";
import Networks from "@/components/Web3/networks";
import Profile from "@/components/Web3/profile";
import { NavItem, MenuHolder } from "./styled";
import { useClickOutside } from "@/hooks/useClickOutside";
import { trimAddress } from "@/lib/utils";

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

  return (
    <Row $gap="sm" $align="stretch" style={{ position: "relative" }}>
      {isConnected && mounted && (
        <MenuHolder ref={refNetwork} tabIndex={0}>
          <NavItem onClick={setShow} $active={true}>
            <Row $gap="sm" onMouseOver={handleToolTip} onMouseOut={clearToolTip}>
              <Icon $size="sm">
                <Image src={ChainPresets[imgSrc]} alt="chain logo" sizes="any" fill={true} />
              </Icon>
              <Chevron />
            </Row>
          </NavItem>
          {show && <Networks close={setShow} />}
        </MenuHolder>
      )}
      {isConnected && mounted && (
        <WalletHolder as="button" $gap="sm" onClick={handleProfileModal}>
          {!!address && mounted && <Avatar $size="md" $seed={address} />}
          <span>{isConnected && mounted ? trimAddress(address) : "connect"}</span>
        </WalletHolder>
      )}
      {!isConnected && mounted && (
        <ButtonLight
          $pad="7px 10px"
          $hover="dim"
          $border="1px solid transparent"
          onClick={handleWalletModal}
        >
          connect
        </ButtonLight>
      )}
      <DropDown ref={ref} style={{ display: "none", top: 0, right: "100%", height: "90%" }}>
        <Row $padding="10px 15px">This is an unsupported network</Row>
      </DropDown>
    </Row>
  );
};

export default Web3Holder;
