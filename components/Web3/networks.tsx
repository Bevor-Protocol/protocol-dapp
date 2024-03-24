"use client";
import { useSwitchChain, Register } from "wagmi";

import { Icon } from "@/components/Icon";
import { Card } from "@/components/Card";
import { ChainPresets } from "@/lib/constants/chains";

const Wallets = ({ close }: { close: () => void }): JSX.Element => {
  const { chains, switchChain } = useSwitchChain({
    mutation: {
      onSettled: close,
    },
  });

  return (
    <Card className="absolute top-full right-0 z-[999] cursor-default text-xs">
      <div className="flex flex-col px-2 py-2 gap-2">
        {chains.map((chain) => (
          <div
            className="flex flex-row justify-start items-center relative rounded-lg gap-2
px-2 py-1 border border-transparent transition-colors hover:bg-dark-primary-30 cursor-pointer"
            key={chain.id}
            onClick={(): void =>
              switchChain({ chainId: chain.id as Register["config"]["chains"][number]["id"] })
            }
          >
            <Icon
              size="sm"
              image={ChainPresets[chain && chain.id in ChainPresets ? chain.id : 99999]}
            />
            <span className="whitespace-nowrap">{chain.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Wallets;
