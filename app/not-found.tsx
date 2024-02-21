import { Section } from "@/components/Common";

const NotFound = (): JSX.Element => {
  return (
    <Section $padCommon $centerV $centerH>
      <h2>Could not find requested resource</h2>
    </Section>
  );
};

export default NotFound;
