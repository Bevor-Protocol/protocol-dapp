import { X } from "@/assets";
import { Row } from "@/components/Box";

const ErrorToast = ({ text, subText }: { text: string; subText?: string }): JSX.Element => {
  return (
    <Row className="text-sm gap-2 items-start relative">
      <X height="1rem" width="1rem" className="stroke-red-400 mt-1" />
      <div>
        <p>{text}</p>
        {subText && <p className="text-white/60 text-xs pt-1">{subText}</p>}
      </div>
    </Row>
  );
};

export default ErrorToast;
