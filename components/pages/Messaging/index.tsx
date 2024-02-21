"use client";
import { useWalletClient } from "wagmi";

const Messages = (): JSX.Element => {
  const { data: signer } = useWalletClient();
  console.log(signer);
  return <div></div>;
};

export default Messages;
