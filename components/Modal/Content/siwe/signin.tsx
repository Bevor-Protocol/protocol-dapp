"use client";

import { useAccount } from "wagmi";

import { CoinbaseWallet, WalletConnect } from "@/assets/wallets";
import { Column, Row } from "@/components/Box";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Loader } from "@/components/Loader";
import { useSiwe } from "@/hooks/useContexts";
import Image from "next/image";

const IconMapper: Record<string, React.ReactNode> = {
  walletConnect: <WalletConnect height="20" width="20" />,
  coinbaseWalletSDK: <CoinbaseWallet height="20" width="20" />,
};

const SignIn = (): JSX.Element => {
  const { connector: activeConnector } = useAccount();
  const { login, logout, isPending, isAuthenticated } = useSiwe();

  // will be closed regardless, due to the SIWE provider.
  if (!activeConnector) return <></>;

  return (
    <Column className="items-center justify-center">
      <div className="aspect-[1091/1685] relative h-20">
        <Image src="/logo.png" alt="brand logo" fill={true} sizes="any" />
      </div>
      <p className="font-bold text-xl my-4">Sign In</p>
      <div className="relative h-14 w-14">
        {activeConnector.icon ? (
          <Icon
            image={activeConnector.icon}
            size="md"
            className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
          />
        ) : activeConnector.id in IconMapper ? (
          <div className="h-10 w-10">{IconMapper[activeConnector.id]}</div>
        ) : (
          <></>
        )}
        {!isPending && !isAuthenticated && <div className="conic-full h-14 w-14 bg-gray-400/40" />}
        {isPending && <Loader className="h-14 w-14" />}
        {isAuthenticated && <div className="conic-full h-14 w-14 bg-green-400" />}
      </div>
      <p className="text-sm my-4 text-center">
        This is purely an off-chain interaction. It does not give us permissions, but it confirms
        that you own this account.
      </p>
      <Row className="gap-2">
        <Button disabled={isPending || isAuthenticated} onClick={login}>
          Sign In
        </Button>
        <Button disabled={isPending || isAuthenticated} onClick={logout}>
          Disconnect
        </Button>
      </Row>
    </Column>
  );
};

export default SignIn;
