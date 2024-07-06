import { cn } from "@/utils";
import { trimTxn } from "@/utils/formatters";
import { Column, Row } from "@/components/Box";
import { Arrow, Check, X } from "@/assets";
import { Loader } from "../Loader";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  txn?: string;
  status: string;
}

export const Wrapper: React.FC<Props> = ({ open, txn, status, ...rest }) => {
  if (!open) return <></>;
  return (
    <Column
      className={cn(
        "fixed right-2 bottom-2 z-[999] bg-black py-2 px-4",
        "rounded-md border border-gray-200/20 gap-2",
        status == "pending" && "animate-toast-in",
        status != "pending" && "animate-toast-out",
      )}
      {...rest}
    >
      <Row className="text-xs gap-2">
        <span>view transaction</span>
        <Arrow
          height="0.5rem"
          width="0.5rem"
          style={{ transform: "rotate(0deg)" }}
          fill="currentColor"
        />
      </Row>
      <Row className="text-xs gap-2">
        <div className="opacity-disable">{trimTxn(txn)}</div>
        {status == "pending" && <Loader className="h-4 w-4" />}
        {status == "error" && <X height="1rem" width="1rem" className="fill-red-400" />}
        {status == "success" && <Check height="1rem" width="1rem" className="fill-green-400" />}
      </Row>
    </Column>
  );
};

Wrapper.displayName = "Wrapper";
