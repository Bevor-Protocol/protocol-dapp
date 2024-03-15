const Copy = ({ copied, ...rest }: { copied: boolean; [key: string]: any }): JSX.Element => {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M14 9.5V7C14 5.89543 13.1046 5 12 5H7C5.89543 5 5 5.89543 5 7V12C5 13.1046 5.89543 14 7 14H9.5"
        strokeWidth="2"
        style={{ opacity: copied ? 0 : 1 }}
      ></path>
      <rect
        x="10"
        y="10"
        width="9"
        height="9"
        rx="2"
        strokeWidth="2"
        style={{ opacity: copied ? 0 : 1 }}
      />
      <path
        d="M1 3L3 5L7 1"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          opacity: copied ? 1 : 0,
          transform: "translate(7.75px, 9.5px) scale(1.2)",
        }}
      ></path>
    </svg>
  );
};

export default Copy;
