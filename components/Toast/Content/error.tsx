import { Row } from "@/components/Box";
import { X } from "@/assets";

const ErrorToast = ({ text }: { text: string }): JSX.Element => {
  if (!open) return <></>;
  return (
    <Row className="text-xs gap-2 items-center relative">
      <X height="1rem" width="1rem" className="stroke-red-400" />
      <span>{text}</span>
    </Row>
  );
};

export default ErrorToast;
