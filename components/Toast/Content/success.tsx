import { Check } from "@/assets";
import { Row } from "@/components/Box";

const SuccessToast = ({ text, subText }: { text: string; subText?: string }): JSX.Element => {
  return (
    <Row className="text-sm gap-2 items-start relative">
      <Check height="1rem" width="1rem" className="fill-green-400 mt-1" />
      <div>
        <p>{text}</p>
        {subText && <p className="text-white/60 text-xs pt-1">{subText}</p>}
      </div>
    </Row>
  );
};

export default SuccessToast;
