import Leaderboard from "@/components/pages/Leaderboard";

import { Section } from "@/components/Common";

export default (): JSX.Element => {
  return (
    <Section $fillHeight $padCommon $centerH $centerV>
      <Leaderboard />
    </Section>
  );
};
