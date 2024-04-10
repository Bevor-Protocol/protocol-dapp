import { cn } from "@/lib/utils";
import { Column, Row } from "../Box";
import * as Card from "@/components/Card";

export const Loader = ({ className }: { className: string }): JSX.Element => {
  return <div className={cn("conic animate-spin duration-1250", className)} />;
};

export const Skeleton = ({ className }: { className: string }): JSX.Element => {
  return <div className={cn("bg-muted animate-pulse rounded-md", className)} />;
};

export const AuditsSkeleton = ({ nItems }: { nItems: number }): JSX.Element => {
  const nUse = Math.min(nItems, 10);
  return (
    <Column className="gap-4 justify-center items-center w-full">
      {Array.from({ length: nUse }).map((_, ind) => (
        <Card.Main className="w-full" key={ind}>
          <Card.Content className="gap-8">
            <Skeleton className="aspect-square h-[77px] md:h-[62px] !rounded-full" />
            <Column className="justify-start items-start overflow-hidden w-full gap-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-11 w-full" />
            </Column>
            <Column className="h-[3.75rem] justify-between">
              <Skeleton className="w-48 h-4" />
              <Skeleton className="w-48 h-4" />
              <Skeleton className="w-48 h-4" />
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

export const LeaderboardSkeleton = ({ nItems }: { nItems: number }): JSX.Element => {
  const nUse = Math.min(nItems, 10);
  return (
    <Column className="w-full gap-1">
      {Array.from({ length: nUse }).map((_, ind) => (
        <Skeleton key={ind} className="h-[calc(1rem+32px)] border border-transparent" />
      ))}
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

export const LoaderFill = ({ className }: { className?: string }): JSX.Element => {
  return (
    <Column className="h-full justify-center">
      <Loader className={className ?? "h-12"} />
    </Column>
  );
};
