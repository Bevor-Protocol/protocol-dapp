import { useConnect } from "wagmi";

import { useModal } from "@/hooks/contexts";

const Wallets = (): JSX.Element => {
  const { toggleOpen } = useModal();
  const { connect, connectors } = useConnect({
    mutation: {
      // Close the modal even if user denies request.
      onSettled: () => toggleOpen(),
    },
  });

  return (
    <div>
      {connectors.map((connector) => (
        <div key={connector.uid}>
          <button onClick={(): void => connect({ connector })}>{connector.name}</button>
        </div>
      ))}
    </div>
  );
};

export default Wallets;
