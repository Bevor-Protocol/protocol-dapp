import { cn } from "@/lib/utils";
import { Column, Row } from "../Box";
import * as Card from "@/components/Card";

export const Loader = ({ className }: { className: string }): JSX.Element => {
  return <div className={cn("conic animate-spin duration-1250", className)} />;
};

export const Skeleton = ({ className }: { className: string }): JSX.Element => {
  return <div className={cn("bg-muted animate-pulse rounded-md", className)} />;
};

export const AuditsSkeleton = (): JSX.Element => {
  return (
    <Column className="gap-4 justify-center items-center w-full">
      {Array.from({ length: 5 }).map((_, ind) => (
        <Card.Main className="w-full" key={ind}>
          <Card.Content className="gap-8">
            <Skeleton className="aspect-square h-[77px] md:h-[62px] !rounded-full" />
            <Column className="justify-start items-start overflow-hidden w-full gap-1">
              <Row className="justify-between w-full">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-7 w-12" />
              </Row>
              <Skeleton className="h-7 w-full" />
            </Column>
          </Card.Content>
          <Card.Footer>
            <Row className="justify-center items-center gap-2">
              <span className="text-white/60">auditors:</span>
              <Skeleton className="h-6 w-[60px]" />
            </Row>
            <span className="block p-1 opacity-disable border border-transparent">View Audit</span>
          </Card.Footer>
        </Card.Main>
      ))}
    </Column>
  );
};

export const AuditDetailedSkeleton = (): JSX.Element => {
  return (
    <Column className="w-full gap-1 justify-center items-center h-full">
      <Loader className="h-12" />
    </Column>
  );
};

export const LeaderboardSkeleton = (): JSX.Element => {
  return (
    <Column className="w-full gap-1 justify-center items-center h-full">
      <Loader className="h-12" />
    </Column>
  );
};

export const HomeStatSkeleton = (): JSX.Element => {
  return (
    <Card.Main className="p-6 items-center justify-center">
      <Loader className="h-12" />
    </Card.Main>
  );
};
