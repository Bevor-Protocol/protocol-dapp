"use client";
import { useSwitchChain, useAccount, Register } from "wagmi";

import { Icon } from "@/components/Icon";
import * as Card from "@/components/Card";
import { ChainPresets } from "@/lib/constants/chains";
import { Column, HoverItem } from "@/components/Box";
import { Check } from "@/assets";
import { cn } from "@/lib/utils";

const Networks = ({ close }: { close?: () => void }): JSX.Element => {
  const { chain: currentChain } = useAccount();
  const { chains, switchChain } = useSwitchChain({
    mutation: {
      onSettled: close,
    },
  });

  return (
    <Card.Main className="text-sm">
      <Column className="px-2 py-2 gap-2">
        <p className="text-white/60 pl-2">Select Network:</p>
        {chains.map((chain) => (
          <HoverItem
            className={cn(
              "justify-start gap-2 pl-2 pr-6 py-1",
              currentChain?.id != chain.id && "cursor-pointer",
            )}
            disable={currentChain?.id == chain.id}
            key={chain.id}
            onClick={(): void =>
              switchChain({ chainId: chain.id as Register["config"]["chains"][number]["id"] })
            }
          >
            <Icon
              size="sm"
              image={ChainPresets[chain && chain.id in ChainPresets ? chain.id : 99999]}
              className={cn(currentChain?.id == chain.id && "opacity-disable")}
            />
            <span
              className={cn("whitespace-nowrap", currentChain?.id == chain.id && "opacity-disable")}
            >
              {chain.name}
            </span>
            {currentChain?.id == chain.id && (
              <Check height="1rem" width="1rem" className="absolute right-0 fill-blue-600/50" />
            )}
          </HoverItem>
        ))}
      </Column>
    </Card.Main>
  );
};

export default Networks;
