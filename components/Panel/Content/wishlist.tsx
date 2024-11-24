import { wishlistAction } from "@/actions";
import { Arrow, Heart, X } from "@/assets";
import { AuditorItemSimple } from "@/components/Audit";
import { Column, Row } from "@/components/Box";
import DynamicLink from "@/components/Link";
import { WISHLIST } from "@/constants/queryKeys";
import { usePanel } from "@/hooks/useContexts";
import { cn } from "@/utils";
import { User } from "@/utils/types/tables";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const WishlistPanel = ({ userId }: { userId: string }): JSX.Element => {
  // We won't remove people from the panel immediately upon being removed.
  // Meaning we won't requery or invalidate tags. We'll allow users to re-add a user
  // to the wishlist. Once the panel is reset, then we'll lose the state.
  const { hide } = usePanel();
  const [isWishlisted, setIsWishlisted] = useState<{ id: string; wishlisted: boolean }[]>([]);

  const { data, isPending } = useQuery({
    queryKey: [WISHLIST, userId],
    queryFn: async () => {
      const result = await wishlistAction.getUserWishlist(userId);
      if (result) {
        setIsWishlisted(result.map((d) => ({ id: d.receiver.id, wishlisted: true })));
        return result;
      }
    },
  });

  const { mutate } = useMutation({
    mutationFn: (variables: { receiver: User; type: string }) => {
      if (variables.type == "remove") {
        return wishlistAction.removeFromWishlist(variables.receiver.id);
      }
      return wishlistAction.addToWishlist(variables.receiver.id);
    },
    onSuccess: (response, variables: { receiver: User; type: string }) => {
      if (response.success) {
        const updatedWishlist = isWishlisted.map((item) => {
          if (item.id == variables.receiver.id) {
            return { ...item, wishlisted: variables.type == "add" };
          }
          return { ...item };
        });
        setIsWishlisted(updatedWishlist);
      }
    },
  });

  return (
    <Column className="relative max-h-full">
      <div onClick={hide} className="cursor-pointer absolute top-0 right-4">
        <X height="1.25rem" width="1.25rem" />
      </div>
      <div className="mb-4">My Wishlist</div>
      {!isPending && !!data && isWishlisted.length > 0 && (
        <Column className="gap-6 text-left overflow-y-scroll flex-grow">
          {data.map((wishlist, ind) => (
            <Row key={ind} className="pr-4 items-center justify-between">
              <div className="max-w-60">
                <AuditorItemSimple auditor={wishlist.receiver} showStatus={true} />
              </div>
              <Row className="gap-2 items-center">
                <DynamicLink href={`/users/${wishlist.receiver.address}`} onClick={hide}>
                  <Arrow height="0.75rem" fill="currentColor" />
                </DynamicLink>
                <div
                  onClick={() =>
                    mutate({
                      receiver: wishlist.receiver,
                      type: isWishlisted[ind].wishlisted ? "remove" : "add",
                    })
                  }
                  className="cursor-pointer"
                >
                  <Heart
                    height="0.75rem"
                    className={cn(isWishlisted[ind].wishlisted ? "fill-red-400" : "fill-gray-400")}
                  />
                </div>
              </Row>
            </Row>
          ))}
        </Column>
      )}
    </Column>
  );
};
