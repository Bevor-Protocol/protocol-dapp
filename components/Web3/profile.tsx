"use client";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

import { useModal } from "@/hooks/contexts";
import { Icon } from "@/components/Icon";
import { trimAddress } from "@/lib/utils";
import { Copy, Logout } from "@/assets";

const Profile = (): JSX.Element => {
  const [copied, setCopied] = useState(false);
  const { toggleOpen } = useModal();
  const { address } = useAccount();
  const { disconnect } = useDisconnect({
    mutation: {
      onSuccess: () => toggleOpen(),
    },
  });

  const handleClick = (): void => {
    setCopied(true);
    navigator.clipboard.writeText(address as string);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full">
      {!!address && <Icon size="xl" seed={address} />}
      <div
        className="flex flex-row gap-3 relative cursor-pointer w-full justify-center"
        onClick={handleClick}
      >
        <span>{trimAddress(address)}</span>
        <Copy stroke="white" copied={copied} className="absolute right-0" />
      </div>
      <button
        className="outline-none border-none font-bold rounded-md 
            grad-light py-2 px-3 dim disabled:opacity-disable"
        onClick={(): void => disconnect()}
      >
        <div className="flex flex-row items-center gap-1 text-dark text-sm">
          <Logout />
          <span>Disconnect</span>
        </div>
      </button>
    </div>
  );
};

export default Profile;
