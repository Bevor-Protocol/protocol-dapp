import Image from "next/image";
import { useRef } from "react";

import { Row } from "@/components/Box";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useNetwork } from "wagmi";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Chevron } from "@/assets";
import { WalletHolder } from "./styled";
import { JazziconClient, IconMedium, IconSmall } from "@/components/Icon";
import { ButtonLight } from "@/components/Button";
import { DropDown } from "@/components/Tooltip";
// import { Loader } from "@/components/Common";
import { ChainPresets } from "@/utils/constants/chains";

export default (): JSX.Element => {
  const { open } = useWeb3Modal();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const mounted = useIsMounted();
  const ref = useRef<HTMLDivElement>(null);

  const handleToolTip = (): void => {
    if (!ref.current) return;
    if (!chain) return;
    if (mounted && chain.unsupported) {
      ref.current.style.display = "block";
    }
  };

  const clearToolTip = (): void => {
    if (!ref.current) return;
    ref.current.style.display = "none";
  };

  const handleOpenW3M = (route?: string): void => {
    open({ route });
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
          onClick={(): void => handleOpenW3M("SelectNetwork")}
          onMouseOver={handleToolTip}
          onMouseOut={clearToolTip}
        >
          <Row $gap="sm">
            <IconSmall>
              <Image
                src={ChainPresets[imgSrc as keyof typeof ChainPresets]}
                alt="chain logo"
                sizes="any"
                fill={true}
              />
            </IconSmall>
            <Chevron />
          </Row>
        </WalletHolder>
      )}
      {isConnected && mounted && (
        <WalletHolder as="button" $gap="sm" onClick={(): void => handleOpenW3M()}>
          {!!address && mounted && (
            <IconMedium>
              <JazziconClient
                mounted={mounted}
                randVal={parseInt(address?.slice(2, 10), 16)}
                paperStyles={{ minWidth: "30px", minHeight: "30px" }}
              />
            </IconMedium>
          )}
          {isConnected && mounted
            ? address?.substring(0, 6) +
              "..." +
              address?.substring(address.length - 3, address.length)
            : "connect"}
        </WalletHolder>
      )}
      {!isConnected && mounted && (
        <ButtonLight
          $pad="7px 10px"
          $hover="dim"
          $border="1px solid transparent"
          onClick={(): void => handleOpenW3M()}
        >
          connect
        </ButtonLight>
      )}
      <DropDown ref={ref} $top="105%" style={{ display: "none", left: 0, right: "unset" }}>
        <Row $padding="10px 15px">
          This is an unsupported network. Switch it to use the protocol.
        </Row>
      </DropDown>
    </Row>
  );
};
