"use client";

import { useMutation } from "@tanstack/react-query";

import { useModal } from "@/lib/hooks";
import { Row } from "@/components/Box";
import { AuditViewDetailedI } from "@/lib/types";
// import * as Form from "@/components/Form";
import { attestToTerms } from "@/actions/audits";
import { Users } from "@prisma/client";
import { Button } from "@/components/Button";
import { X } from "@/assets";

const AuditorAttest = ({
  audit,
  user,
}: {
  audit: AuditViewDetailedI;
  user: Users;
}): JSX.Element => {
  const { toggleOpen } = useModal(); // const [showRejected, setShowRejected] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { id: string; userId: string; status: boolean }) => {
      return attestToTerms(variables.id, variables.userId, variables.status);
    },
    onSettled: (data) => {
      console.log(data);
      toggleOpen();
    },
  });

  return (
    <div>
      <div onClick={toggleOpen} className="absolute top-4 right-4 w-5 h-5 cursor-pointer z-10">
        <X height="1rem" width="1rem" />
      </div>
      <p>Attest to the Terms</p>
      <p className="text-sm my-2">
        Make sure you review the audit details and the terms of the audit before agreeing to, or
        rejecting, the terms set. This is irreversible. Once all verified auditors agree to the
        terms, the audit process will beging. If you reject, the auditor will adjust the terms
        accordingly and the attestation statuses will be reset. If an auditor leaves the audit, the
        attestation statuses will be reset for everyone as well.
      </p>
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <Row className="gap-4 justify-end">
        <Button
          onClick={() => mutate({ id: audit.id, userId: user.id, status: true })}
          disabled={isPending}
        >
          Accept Terms
        </Button>
        <Button
          onClick={() => mutate({ id: audit.id, userId: user.id, status: false })}
          disabled={isPending}
        >
          Reject Terms
        </Button>
      </Row>
    </div>
  );
};

export default AuditorAttest;
