import Home from "@/components/pages/Home";

import { Section } from "@/components/Section";

export default (): JSX.Element => {
  return (
    <main>
      <Section $padCommon $centerV $centerH>
        <Home />
      </Section>
      {/* <div className="content pad-common center-v center-h">
        <Home />
      </div> */}
    </main>
  );
};
