"use client";

import { wishlistAction } from "@/actions";
import { Heart } from "@/assets";
import * as Tooltip from "@/components/Tooltip";
import { cn } from "@/utils";
import { User } from "@/utils/types/tables";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const UserWishlist = ({
  isWishlistedFlag,
  receiver,
}: {
  isWishlistedFlag: boolean;
  receiver: User;
}): JSX.Element => {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: () => {
      if (isWishlistedFlag) {
        return wishlistAction.removeFromWishlist(receiver.id);
      }
      return wishlistAction.addToWishlist(receiver.id);
    },
    onSuccess: () => router.refresh(),
  });

  return (
    <div className="absolute right-0 top-0">
      <Tooltip.Reference>
        <Tooltip.Trigger>
          <div className="cursor-pointer" onClick={() => mutate()}>
            <Heart
              height="1.5rem"
              width="1.5rem"
              className={cn(isWishlistedFlag ? "fill-red-400" : "fill-gray-400")}
            />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <div className="bg-dark shadow rounded-lg cursor-default">
            <div className="px-2 py-1 whitespace-nowrap">add/remove auditor from wishlist</div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </div>
  );
};

export default UserWishlist;
