import Image from "next/image";
import { useSwitchChain } from "wagmi";

import { DropDown } from "@/components/Tooltip";
import { Column } from "@/components/Box";
import { NavItem } from "@/components/Nav/styled";
import { Span } from "@/components/Text";
import { Icon } from "@/components/Icon";
import { ChainPresets } from "@/lib/constants/chains";

const Wallets = ({ close }: { close: () => void }): JSX.Element => {
  const { chains, switchChain } = useSwitchChain({
    mutation: {
      onSettled: close,
    },
  });

  return (
    <DropDown>
      <Column $gap="sm" $padding="5px 10px" $align="initial">
        {chains.map((chain) => (
          <NavItem
            key={chain.id}
            onClick={(): void => switchChain({ chainId: chain.id })}
            $height="fit-content"
            $justify="flex-start"
            $gap="sm"
            $active={false}
            $pad="5px 10px"
            style={{ cursor: "pointer" }}
          >
            <Icon $size="sm">
              <Image
                src={ChainPresets[chain && chain.id in ChainPresets ? chain.id : 99999]}
                alt="chain logo"
                sizes="any"
                fill={true}
              />
            </Icon>
            <Span>{chain.name}</Span>
          </NavItem>
        ))}
      </Column>
    </DropDown>
  );
};

export default Wallets;
