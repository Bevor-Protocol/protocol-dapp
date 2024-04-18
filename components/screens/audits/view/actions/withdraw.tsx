"use client";

import { Button } from "@/components/Button";
// import { withdraw } from "@/contracts/bevor";

const Withdraw = (): JSX.Element => {
  // TODO: Replace this with the actual withdraw function when contract is deployed
  const VALUE = 33;
  const withdraw = (): void => {
    alert("Call withdraw method from SC");
  };

  return (
    <div className="text-sm font-medium text-center">
      <h3>Vesting Progress</h3>
      <p>$3,234/$10,000</p>
      <div className="relative h-2 overflow-hidden rounded-full bg-primary-light-20 w-full">
        <div
          className="h-full w-full flex-1 bg-white transition-all"
          style={{ transform: `translateX(-${100 - (VALUE || 0)}%)` }}
        ></div>
      </div>
      <div className="flex justify-center mt-4 mb-2 w-full">
        <Button type="reset" onClick={withdraw} variant="gradient" className="max-w-[200px]">
          Withdraw
        </Button>
      </div>
    </div>
  );
};

export default Withdraw;
