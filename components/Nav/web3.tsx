import Image from "next/image";
import { useRef } from "react";

import { Row } from "@/components/Box";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Chevron } from "@/assets";
import { WalletHolder } from "./styled";
import { Avatar, Icon } from "@/components/Icon";
import { ButtonLight } from "@/components/Button";
import { DropDown } from "@/components/Tooltip";
import { ChainPresets } from "@/lib/constants/chains";

const Web3Holder = (): JSX.Element => {
  const modal = useWeb3Modal();
  const { address, isConnected, chain } = useAccount();
  const mounted = useIsMounted();
  const ref = useRef<HTMLDivElement>(null);

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

  let imgSrc = 99999;
  if (chain && chain.id in ChainPresets) {
    imgSrc = chain.id;
  }

  return (
    <Row $gap="sm" style={{ position: "relative" }}>
      {isConnected && mounted && (
        <WalletHolder
          as="button"
          onClick={(): Promise<void> => modal.open({ view: "Networks" })}
          onMouseOver={handleToolTip}
          onMouseOut={clearToolTip}
        >
          <Row $gap="sm">
            <Icon $size="sm">
              <Image
                src={ChainPresets[imgSrc as keyof typeof ChainPresets]}
                alt="chain logo"
                sizes="any"
                fill={true}
              />
            </Icon>
            <Chevron />
          </Row>
        </WalletHolder>
      )}
      {isConnected && mounted && (
        <WalletHolder
          as="button"
          $gap="sm"
          onClick={(): Promise<void> => modal.open({ view: "Account" })}
        >
          {!!address && mounted && <Avatar $size="md" $seed={address} />}
          <span>
            {isConnected && mounted
              ? address?.substring(0, 6) +
                "..." +
                address?.substring(address.length - 3, address.length)
              : "connect"}
          </span>
        </WalletHolder>
      )}
      {!isConnected && mounted && (
        <ButtonLight
          $pad="7px 10px"
          $hover="dim"
          $border="1px solid transparent"
          onClick={(): Promise<void> => modal.open({ view: "Connect" })}
        >
          connect
        </ButtonLight>
      )}
      <DropDown ref={ref} style={{ display: "none" }}>
        <Row $padding="10px 15px">
          This is an unsupported network. Switch it to use the protocol.
        </Row>
      </DropDown>
    </Row>
  );
};

export default Web3Holder;
