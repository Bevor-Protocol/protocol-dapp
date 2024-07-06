import { X } from "@/assets";
import { Column, Row } from "@/components/Box";
import { useModal } from "@/hooks/useContexts";
import { useEffect, useState } from "react";
import { Connector, useConnect, useConnectors } from "wagmi";
import { config } from "@/providers/wallet/config";
import { sortWallets } from "@/utils/sorters";
import { Icon } from "@/components/Icon";
import { CoinbaseWallet, WalletConnect } from "@/assets/wallets";

const IconMapper: Record<string, React.ReactNode> = {
  walletConnect: <WalletConnect height="20" width="20" />,
  coinbaseWalletSDK: <CoinbaseWallet height="20" width="20" />,
};

const Wallets = (): JSX.Element => {
  const [recentConnector, setRecentConnector] = useState("");
  const { connectAsync } = useConnect();
  const { toggleOpen } = useModal();

  const connectors = useConnectors();

  useEffect(() => {
    const getRecent = async (): Promise<void> => {
      const recentPromise = config.storage?.getItem("recentConnectorId") || "";
      if (recentPromise) {
        setRecentConnector((await Promise.resolve(recentPromise)) || "");
      }
    };
    getRecent();
  }, []);

  const handleConnect = ({ connector }: { connector: Connector }): void => {
    connectAsync({ connector })
      .catch((error) => console.log(error))
      .finally(() => toggleOpen());
  };

  const walletsShow = sortWallets([...connectors], recentConnector, true);

  return (
    <Column className="relative max-h-full">
      <div onClick={(): void => toggleOpen()} className="cursor-pointer absolute top-0 right-4">
        <X height="1.25rem" width="1.25rem" />
      </div>
      <div className="mb-4">Connect a Wallet</div>
      <Column className="gap-2 text-left overflow-y-scroll flex-grow">
        {walletsShow.map((connector) => (
          <Row
            key={connector.uid}
            onClick={(): void => handleConnect({ connector })}
            className="justify-start items-center rounded-lg gap-2 relative
px-2 py-1 border border-transparent transition-colors hover:bg-dark-primary-30 cursor-pointer"
          >
            {connector.icon ? (
              <Icon image={connector.icon} size="sm" />
            ) : (
              <div className="h-5 w-5">{IconMapper[connector.id]}</div>
            )}
            <span className="whitespace-nowrap text-sm">{connector.name}</span>
            {recentConnector == connector.id && (
              <div className="flex bg-blue-600/50 rounded-xl px-2 py-1 h-fit">
                <span className="text-blue-600 text-xxs">recent</span>
              </div>
            )}
          </Row>
        ))}
      </Column>
    </Column>
  );
};

export default Wallets;
