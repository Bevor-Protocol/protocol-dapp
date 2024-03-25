import { cn } from "@/lib/utils";
import { Column, Row } from "../Box";
import { Card } from "../Card";
import { Button } from "../Button";

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
        <Card className="divide-y divide-gray-200/20 w-full" key={ind}>
          <Row className="items-stretch justify-start gap-8 p-4 w-full">
            <Skeleton className="aspect-square h-[77px] md:h-[62px] !rounded-full" />
            <Column className="justify-start items-start overflow-hidden w-full gap-1">
              <Row className="justify-between w-full">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-7 w-12" />
              </Row>
              <Skeleton className="h-7 w-full" />
            </Column>
          </Row>
          <Row className="justify-between items-center p-2">
            <Row className="justify-center items-center gap-2">
              <span className="text-white/60">auditors:</span>
              <Skeleton className="h-6 w-[60px]" />
            </Row>
            <span className="block p-1 opacity-disable border border-transparent">View Audit</span>
          </Row>
        </Card>
      ))}
    </Column>
  );
};

export const AuditDetailedSkeleton = (): JSX.Element => {
  return (
    <Column>
      <div className="flex flex-col w-full gap-2 py-4 items-center">
        <p className="text-white/60">Vesting Progress</p>
        <Skeleton className="!rounded-xl w-full max-w-sm h-4" />
        <Row className="items-center gap-1">
          <Skeleton className="h-4 w-10" />
          <p className="text-white/60">ETH Vested</p>
        </Row>
      </div>
      <Card className="divide-y divide-gray-200/20 w-full">
        <Row className="items-stretch justify-start gap-8 p-4 w-full">
          <Skeleton className="aspect-square h-[77px] md:h-[62px] !rounded-full" />
          <Column className="justify-start items-start overflow-hidden w-full gap-1">
            <Row className="justify-between w-full">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-7 w-12" />
            </Row>
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </Column>
        </Row>
        <Row className="justify-between items-center p-2">
          <Row className="justify-center items-center gap-2">
            <span className="text-white/60">auditors:</span>
            <Skeleton className="h-6 w-[60px]" />
          </Row>
          <Button disabled>
            <Loader className="h-5" />
          </Button>
        </Row>
      </Card>
    </Column>
  );
};

export const LeaderboardSkeleton = (): JSX.Element => {
  return (
    <Column className="w-full gap-1">
      {Array.from({ length: 20 }).map((_, ind) => (
        <Skeleton className="p-2 border h-12 border-transparent" key={ind} />
      ))}
    </Column>
  );
};
