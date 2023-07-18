import Image from "next/image";

import { Row } from "@/components/Box";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useNetwork } from "wagmi";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Chevron } from "@/assets";
import { AddressHolder, NetworkHolder } from "./styled";
import { JazziconClient, IconMedium } from "@/components/Icon";
// import { Loader } from "@/components/Common";
import { ChainPresets } from "@/utils/constants/chains";

export default (): JSX.Element => {
  const { open } = useWeb3Modal();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const mounted = useIsMounted();

  const handleOpenW3M = (route?: string): void => {
    open({ route });
  };

  let imgSrc = 99999;
  if (chain && chain.id in ChainPresets) {
    imgSrc = chain.id;
  }

  return (
    <Row $gap="sm">
      {isConnected && mounted && (
        <NetworkHolder
          $invalid={chain?.unsupported ?? false}
          onClick={(): void => handleOpenW3M("SelectNetwork")}
        >
          <Row $gap="sm">
            <IconMedium>
              <Image
                src={ChainPresets[imgSrc as keyof typeof ChainPresets]}
                alt="chain logo"
                sizes="any"
                fill={true}
              />
            </IconMedium>
            <Chevron />
          </Row>
        </NetworkHolder>
      )}
      <AddressHolder $active={isConnected && mounted} onClick={(): void => handleOpenW3M()}>
        <Row $gap="sm">
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
        </Row>
      </AddressHolder>
    </Row>
  );
};
