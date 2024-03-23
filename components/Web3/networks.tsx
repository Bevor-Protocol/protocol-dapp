import { useSwitchChain, Register } from "wagmi";
import clsx from "clsx";

import { Icon } from "@/components/Icon";
import { ChainPresets } from "@/lib/constants/chains";

const Wallets = ({ close }: { close: () => void }): JSX.Element => {
  const { chains, switchChain } = useSwitchChain({
    mutation: {
      onSettled: close,
    },
  });

  return (
    <div
      className={clsx(
        "absolute top-full right-0 bg-dark border border-gray-200/20 rounded-lg z-[999]",
        "cursor-default text-xs",
        "md:text-base md:top-[unset] md:-right-5 md:bottom-full md:w-svw md:rouned-t-lg",
      )}
    >
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
    </div>
  );
};

export default Wallets;
