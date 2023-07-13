import Audits from "@/components/pages/Audits";

import { Section } from "@/components/Section";

export default (): JSX.Element => {
  return (
    <main>
      <Section $fillHeight $padCommon $centerH $centerV>
        <Audits />
      </Section>
    </main>
  );
};
