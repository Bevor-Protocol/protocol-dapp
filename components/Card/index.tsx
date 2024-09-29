import { Column, Row } from "@/components/Box";
import { cn } from "@/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export const Main: React.FC<Props> = ({ children, className, hover = false, ...rest }) => {
  return (
    <Column
      className={cn(
        "bg-dark shadow rounded-lg divide-gray-200/10 divide-y divide-solid",
        hover && "transition-colors hover:bg-dark-primary-30",
        className,
      )}
      {...rest}
    >
      {children}
    </Column>
  );
};

export const Header: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <Row className={cn("flex-grow justify-between items-center", className)} {...rest}>
      {children}
    </Row>
  );
};

export const Content: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <Row className={cn("flex-grow", className)} {...rest}>
      {children}
    </Row>
  );
};

export const Footer: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <Row className={cn("flex-grow justify-between items-center ", className)} {...rest}>
      {children}
    </Row>
  );
};
