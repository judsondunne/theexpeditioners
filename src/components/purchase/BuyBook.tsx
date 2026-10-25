import { PurchaseButton } from "@/components/purchase/PurchaseButton";
import { purchaseBook } from "@/lib/purchase";
import type { Book } from "@/content/types";

export function BuyBook({ book, ...props }: Omit<Parameters<typeof PurchaseButton>[0], "book"> & { book: Book }) {
  return <PurchaseButton book={purchaseBook(book)} {...props} />;
}
