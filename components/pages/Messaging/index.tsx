"use client";
import { useWalletClient } from "wagmi";

export default (): JSX.Element => {
  const { data: signer } = useWalletClient();
  console.log(signer);
  return <div></div>;
};
