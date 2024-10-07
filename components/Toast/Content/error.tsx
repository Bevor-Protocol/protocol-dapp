import { X } from "@/assets";
import { Row } from "@/components/Box";

const ErrorToast = ({ text }: { text: string }): JSX.Element => {
  return (
    <Row className="text-sm gap-2 items-center relative py-4">
      <X height="1rem" width="1rem" className="stroke-red-400" />
      <span>{text}</span>
    </Row>
  );
};

export default ErrorToast;
