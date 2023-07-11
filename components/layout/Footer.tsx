import { Twitter, Discord, Gitbook, Github } from "@/assets";
import * as Styled from "@/styles/layout.styled";
import SmartLink from "@/components/elements/SmartLink";

export default (): JSX.Element => {
  return (
    <footer>
      <Styled.Footer>
        <div>
          <p>de-risk. incentivize. audit. decentralize.</p>
        </div>
        <Styled.FooterItems>
          <SmartLink href="https://twitter.com/BevorProtocol" external={true}>
            <Twitter height="1.5rem" width="1.5rem" fill="white" />
          </SmartLink>
          <SmartLink href="https://docs.bevor.io" external={true}>
            <Gitbook height="1.5rem" width="1.5rem" fill="white" />
          </SmartLink>
          <SmartLink href="https://github.com/Bevor-Protocol" external={true}>
            <Github height="1.5rem" width="1.5rem" fill="white" />
          </SmartLink>
          <SmartLink href="https://discord.gg/MDfNgatN" external={true}>
            <Discord height="1.5rem" width="1.5rem" fill="white" />
          </SmartLink>
        </Styled.FooterItems>
        <div className="copy">
          <p>Bevor &copy; {`${new Date().getFullYear()}`}</p>
        </div>
      </Styled.Footer>
    </footer>
  );
};
