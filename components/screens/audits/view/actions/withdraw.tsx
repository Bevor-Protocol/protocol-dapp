"use client";

import React from "react";
import { Progress } from "@/components/Progress";
import { Button } from "@/components/Button";
// import { withdraw } from "@/contracts/bevor";

const Withdraw = () => {
  // TODO: Replace this with the actual withdraw function when contract is deployed
  const withdraw = () => {
    alert("Call withdraw method from SC");
  };

  return (
    <>
      <h3 className="text-sm font-medium mt-4 mb-2 text-center">Vesting Progress</h3>
      <p className="text-sm font-medium mt-4 mb-2 text-center">$3,234/$10,000</p>
      <Progress value={33} className="bg-gray-200 white-200 w-full" />
      <div className="flex justify-center mt-4 mb-2 w-full">
        <Button type="reset" onClick={withdraw} variant="gradient" className="max-w-[200px]">
          Withdraw
        </Button>
      </div>
    </>
  );
};

export default Withdraw;
