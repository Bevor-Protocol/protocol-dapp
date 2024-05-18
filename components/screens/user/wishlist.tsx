"use client";

import { addToWishlist, removeFromWishlist } from "@/actions/users";
import { Heart } from "@/assets";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

const UserWishlist = ({
  isWishlistedFlag,
  requestor,
  receiver,
}: {
  isWishlistedFlag: boolean;
  requestor: string;
  receiver: string;
}): JSX.Element => {
  const { mutate } = useMutation({
    mutationKey: ["wishlist", requestor, receiver],
    mutationFn: () => {
      if (isWishlistedFlag) {
        return removeFromWishlist(requestor, receiver);
      }
      return addToWishlist(requestor, receiver);
    },
  });

  return (
    <div className="absolute -right-10 top-0 cursor-pointer" onClick={() => mutate()}>
      <Heart
        height="1.5rem"
        width="1.5rem"
        className={cn(isWishlistedFlag ? "fill-red-400" : "fill-gray-400")}
      />
    </div>
  );
};

export default UserWishlist;
