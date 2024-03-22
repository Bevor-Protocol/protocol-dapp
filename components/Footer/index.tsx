const Footer = (): JSX.Element => {
  return (
    <footer>
      <div
        className="flex flex-col justify-center items-center gap-4 w-full p-screen py-[30px] 
      text-center relative text-[0.85rem] leading-4 md:hidden"
      >
        <p className=" text-inherit leading-[inherit] opacity-disable">
          de-risk. incentivize. audit. decentralize.
        </p>
        <span className=" text-inherit leading-[inherit] opacity-disable">
          Bevor &copy; {`${new Date().getFullYear()}`}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
