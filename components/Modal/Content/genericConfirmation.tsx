"use client";

import { useModal } from "@/lib/hooks";
import { Row } from "@/components/Box";
import { Button } from "@/components/Button";
import { X } from "@/assets";

const GenericConfirmation = ({
  action,
  title,
  text,
}: {
  action: () => void;
  title: string;
  text: string;
}): JSX.Element => {
  const { toggleOpen } = useModal();
  return (
    <div>
      <div onClick={toggleOpen} className="absolute top-4 right-4 w-5 h-5 cursor-pointer z-10">
        <X height="1rem" width="1rem" />
      </div>
      <p>{title}</p>
      <p className="text-sm my-2">{text}</p>
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <Row className="gap-4 justify-end">
        <Button onClick={action}>Submit</Button>
        <Button onClick={toggleOpen}>Cancel</Button>
      </Row>
    </div>
  );
};

export default GenericConfirmation;
