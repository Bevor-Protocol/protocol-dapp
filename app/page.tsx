import Home from "@/components/pages/Home";

import { Section } from "@/components/Section";

export default (): JSX.Element => {
  return (
    <Section $padCommon $centerV $centerH>
      <Home />
    </Section>
  );
};
