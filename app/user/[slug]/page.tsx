"use client";
import { usePathname } from "next/navigation";

import { Section, Loader } from "@/components/Common";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useAccount } from "wagmi";

const UserPage = (): JSX.Element => {
  const pathname = usePathname();
  const mounted = useIsMounted();
  const { address } = useAccount();

  const routeAddress = pathname.substring(pathname.lastIndexOf("/") + 1);

  const isOwner = address == routeAddress;

  return (
    <Section $padCommon $centerV $centerH>
      {!mounted && <Loader $size="50px" />}
      {mounted && isOwner && <h2>You own this address, you can see everything.</h2>}
      {mounted && !isOwner && <h2>You don`t own this address, what you see is limited.</h2>}
      {mounted && <p>requesting to view {address}</p>}
    </Section>
  );
};

export default UserPage;
