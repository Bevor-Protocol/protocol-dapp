import Audits from "@/components/pages/Audits";

import { Section } from "@/components/Section";

export default (): JSX.Element => {
  return (
    <Section $fillHeight $padCommon $centerH $centerV>
      <Audits />
    </Section>
  );
};
