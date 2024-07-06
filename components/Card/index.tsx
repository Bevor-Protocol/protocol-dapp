import { cn } from "@/utils";
import { Column, Row } from "@/components/Box";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export const Main: React.FC<Props> = ({ children, className, hover = false, ...rest }) => {
  return (
    <Column
      className={cn(
        "bg-dark shadow rounded-lg",
        hover && "transition-colors hover:bg-dark-primary-30",
        className,
      )}
      {...rest}
    >
      {children}
    </Column>
  );
};

export const Content: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <Row className={cn("flex-grow p-4", className)} {...rest}>
      {children}
    </Row>
  );
};

export const Footer: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <Row
      className={cn(
        "flex-grow justify-between items-center p-2 border-t border-t-gray-200/20",
        className,
      )}
      {...rest}
    >
      {children}
    </Row>
  );
};
