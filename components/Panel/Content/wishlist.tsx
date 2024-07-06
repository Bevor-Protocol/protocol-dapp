import { wishlistController } from "@/actions";
import { Arrow, Heart, X } from "@/assets";
import { AuditorItemSimple } from "@/components/Audit";
import { Column, Row } from "@/components/Box";
import { WISHLIST } from "@/constants/queryKeys";
import { useModal } from "@/hooks/useContexts";
import { cn } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

export const WishlistPanel = ({ userId }: { userId: string }): JSX.Element => {
  // We won't remove people from the panel immediately upon being removed.
  // Meaning we won't requery or invalidate tags. We'll allow users to re-add a user
  // to the wishlist. Once the panel is reset, then we'll lose the state.
  const { toggleOpen } = useModal();
  const [isWishlisted, setIsWishlisted] = useState<{ id: string; wishlisted: boolean }[]>([]);

  const { data, isPending } = useQuery({
    queryKey: [WISHLIST],
    queryFn: async () => {
      const result = await wishlistController.getUserWishlist(userId);
      if (result) {
        setIsWishlisted(result.map((d) => ({ id: d.receiver.id, wishlisted: true })));
        return result;
      }
    },
  });

  const { mutate } = useMutation({
    mutationFn: (variables: { receiver: string; type: string }) => {
      if (variables.type == "remove") {
        return wishlistController.removeFromWishlist(userId, variables.receiver);
      }
      return wishlistController.addToWishlist(userId, variables.receiver);
    },
    onSuccess: (_, variables: { receiver: string; type: string }) => {
      const updatedWishlist = isWishlisted.map((item) => {
        if (item.id == variables.receiver) {
          return { ...item, wishlisted: variables.type == "add" };
        }
        return { ...item };
      });
      setIsWishlisted(updatedWishlist);
    },
  });

  return (
    <Column className="relative max-h-full">
      <div onClick={(): void => toggleOpen()} className="cursor-pointer absolute top-0 right-4">
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
                <Link href={`/user/${wishlist.receiver.address}`}>
                  <Arrow height="0.75rem" fill="currentColor" />
                </Link>
                <div
                  onClick={() =>
                    mutate({
                      receiver: wishlist.receiver.id,
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
