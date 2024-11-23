import { db } from "@/db";
import { wishlist } from "@/db/schema/wishlist.sql";
import { WishlistWithReceiver } from "@/utils/types/relations";
import { Wishlist } from "@/utils/types/tables";
import { QueryResult } from "@neondatabase/serverless";
import { and, eq } from "drizzle-orm";

class WishlistService {
  getWishlistEntry(requestor: string, receiver: string): Promise<Wishlist | undefined> {
    return db.query.wishlist.findFirst({
      where: and(eq(wishlist.sender_id, requestor), eq(wishlist.receiver_id, receiver)),
    });
  }

  getUserWishlist(requestor: string): Promise<WishlistWithReceiver[]> {
    return db.query.wishlist.findMany({
      where: eq(wishlist.sender_id, requestor),
      with: {
        receiver: true,
      },
    });
  }

  addToWishlist(requestor: string, receiver: string): Promise<QueryResult> {
    return db.insert(wishlist).values({
      receiver_id: receiver,
      sender_id: requestor,
    });
  }

  removeFromWishlist(requestor: string, receiver: string): Promise<QueryResult> {
    return db
      .delete(wishlist)
      .where(and(eq(wishlist.receiver_id, receiver), eq(wishlist.sender_id, requestor)));
  }
}

const wishlistService = new WishlistService();
export default wishlistService;
