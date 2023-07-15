"use client";

import { useState, useEffect, useRef } from "react";
import { DropDown } from "@/components/Tooltip";
import { MenuHolder, MenuDots } from "./styled";

export default ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleShow = (): void => {
    console.log(show);
    if (show) return;
    setShow(true);
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent): void => {
      if (!show || !ref.current) return;
      const el = event.target as HTMLElement;

      if (el !== ref.current) {
        console.log("contains");
        setShow(false);
      }
    };

    window.addEventListener("mousedown", handleClick);

    return () => window.removeEventListener("mousedown", handleClick);
  }, [show]);

  return (
    <MenuHolder onClick={handleShow}>
      <MenuDots />
      <DropDown $active={show} ref={ref}>
        {children}
      </DropDown>
    </MenuHolder>
  );
};
