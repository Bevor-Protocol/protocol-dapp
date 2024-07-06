"use client";

import Image from "next/image";
import { useAccount } from "wagmi";

import { useSiwe } from "@/hooks/useContexts";
import { Icon } from "@/components/Icon";
import { CoinbaseWallet, WalletConnect } from "@/assets/wallets";
import { Column } from "@/components/Box";
import { Loader } from "@/components/Loader";
import { trimAddress } from "@/utils/formatters";
import { Button } from "@/components/Button";

const IconMapper: Record<string, React.ReactNode> = {
  walletConnect: <WalletConnect height="20" width="20" />,
  coinbaseWalletSDK: <CoinbaseWallet height="20" width="20" />,
};

const RequestAccountChange = ({ verifiedAddress }: { verifiedAddress: string }): JSX.Element => {
  const { connector: activeConnector } = useAccount();
  const { logout, isPending } = useSiwe();

  if (!activeConnector) return <></>;

  return (
    <Column className="items-center justify-center">
      <div className="aspect-[1091/1685] relative h-20">
        <Image src="/logo.png" alt="brand logo" fill={true} sizes="any" />
      </div>
      <p className="font-bold text-xl my-4">Switch Wallet</p>
      <div className="relative h-14 w-14">
        {activeConnector.icon ? (
          <Icon
            image={activeConnector.icon}
            size="md"
            className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
          />
        ) : (
          <div className="h-10 w-10">{IconMapper[activeConnector.id]}</div>
        )}
        {isPending && <Loader className="h-14 w-14" />}
        {!isPending && <div className="conic-full h-14 w-14 bg-green-400" />}
      </div>
      <p className="text-sm text-center mt-4">
        Switch to wallet {trimAddress(verifiedAddress)} to make it active, or logout.
      </p>
      <p className="my-2">or</p>
      <Button onClick={logout} disabled={!isPending}>
        Log out
      </Button>
    </Column>
  );
};

export default RequestAccountChange;
