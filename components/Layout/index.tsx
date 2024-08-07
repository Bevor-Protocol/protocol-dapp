import Image from "next/image";

import { NavDashboard, NavMenuItems, NavDropdown } from "./Nav/menuItems";
import NavWeb3 from "./Nav/web3";
import DynamicLink from "@/components/Link";
import { Row, Column } from "@/components/Box";
import { Suspense } from "react";
import { userController } from "@/actions";

export const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return <div className="min-h-svh flex flex-col px-content-limit">{children}</div>;
};

export const Footer = (): JSX.Element => {
  return (
    <footer>
      <Column className="gap-4 w-full py-7 text-center text-xs md:hidden">
        <p className="opacity-disable">audit. incentivize. de-risk. decentralize.</p>
        <span className="opacity-disable">Bevor &copy; {`${new Date().getFullYear()}`}</span>
      </Column>
    </footer>
  );
};

export const Nav = async (): Promise<JSX.Element> => {
  const { address, user } = await userController.currentUser();
  return (
    <nav className="py-6 w-full flex flex-row justify-between items-center md:py-4">
      <Row className="gap-6">
        <DynamicLink href="/">
          <div className="aspect-[1091/1685] relative h-16">
            <Image src="/logo.png" alt="brand logo" fill={true} sizes="any" />
          </div>
        </DynamicLink>
        <Row className="gap-2 items-center sm:nav-fixed-bottom sm:text-sm">
          <Suspense>
            <NavDashboard address={address} />
          </Suspense>
          <NavMenuItems />
          <NavDropdown />
        </Row>
      </Row>
      <Suspense>
        <NavWeb3 address={address} user={user} />
      </Suspense>
    </nav>
  );
};
