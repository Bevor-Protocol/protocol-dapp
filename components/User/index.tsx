import { User } from "@prisma/client";
import DynamicLink from "../Link";
import * as Card from "@/components/Card";
import { Icon } from "../Icon";
import { trimAddress } from "@/utils/formatters";
import { cn } from "@/utils";
import { Column, Row } from "../Box";

export const UserCard = ({ user, isLoading }: { user: User; isLoading: boolean }): JSX.Element => {
  return (
    <div className="animate-fade-in">
      <DynamicLink href={`/users/${user.address}`} className="w-full" disabled={isLoading}>
        <Card.Main
          className={cn(
            "w-full cursor-pointer transition-colors hover:bg-dark-primary-30",
            isLoading && "opacity-50",
          )}
        >
          <Card.Content className="gap-4 relative p-4">
            <Row className="gap-2">
              <Icon image={user.image} seed={user.address} size="md" />
              <Column className="text-sm h-9">
                <p className="line-clamp-1">{trimAddress(user.address)}</p>
                <p className="text-xs line-clamp-1">{user.name}</p>
              </Column>
            </Row>
          </Card.Content>
          <Card.Footer className="text-xxs p-2">
            <Row className="justify-start gap-2">
              <div
                className={cn(
                  user.auditeeRole ? " bg-primary-light-20" : " bg-gray-400/20",
                  !user.auditeeRole && "opacity-50",
                  "rounded-md px-1",
                )}
              >
                protocol owner
              </div>
              <div
                className={cn(
                  user.auditorRole ? " bg-primary-light-20" : " bg-gray-400/20",
                  !user.auditorRole && "opacity-50",
                  "rounded-md px-2",
                )}
              >
                auditor
              </div>
            </Row>
          </Card.Footer>
        </Card.Main>
      </DynamicLink>
    </div>
  );
};
