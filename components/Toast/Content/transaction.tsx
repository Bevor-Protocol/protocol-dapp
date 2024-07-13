import { trimTxn } from "@/utils/formatters";
import { Row } from "@/components/Box";
import { Arrow, Check, X } from "@/assets";
import { Loader } from "@/components/Loader";
import { TransactionEnum } from "@/utils/types/enum";

const Transaction = ({ txn, status }: { txn?: string; status: TransactionEnum }): JSX.Element => {
  if (!open) return <></>;
  return (
    <>
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
        {status == TransactionEnum.PENDING && <Loader className="h-4 w-4" />}
        {status == TransactionEnum.ERROR && (
          <X height="1rem" width="1rem" className="stroke-red-400" />
        )}
        {status == TransactionEnum.SUCCESS && (
          <Check height="1rem" width="1rem" className="fill-green-400" />
        )}
      </Row>
    </>
  );
};

export default Transaction;
