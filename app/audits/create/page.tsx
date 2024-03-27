import { AuditCreation } from "@/components/pages/Audits/client";

const CreateAudit = (): JSX.Element => {
  return (
    <section className="flex flex-col h-full items-center px-content-limit">
      <AuditCreation />
    </section>
  );
};

export default CreateAudit;
