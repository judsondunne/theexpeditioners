import { expect, test } from "@playwright/test";
import { resolveSiteConfig } from "../../src/lib/site-config";
import { bookListSchema } from "../../src/lib/schema";
import { books } from "../../src/content/books";
import { purchaseBook } from "../../src/lib/purchase";

test("indexing requires an explicit, public HTTPS origin", () => {
  expect(resolveSiteConfig({})).toEqual({url:"http://localhost:3000",indexable:false});
  for (const origin of [undefined,"http://example.com","https://localhost","https://127.0.0.1","https://192.168.1.1"]) expect(()=>resolveSiteConfig({origin,indexable:"true"})).toThrow();
  expect(resolveSiteConfig({origin:"https://books.example/",indexable:"true"})).toEqual({url:"https://books.example",indexable:true});
  expect(resolveSiteConfig({origin:"https://books.example",indexable:"true",deployment:"preview"}).indexable).toBe(false);
});

test("canonical configuration rejects paths and credentials",()=>{
  for(const origin of ["https://books.example/books","https://user:password@books.example","https://books.example?preview=1","javascript:alert(1)"]) expect(()=>resolveSiteConfig({origin})).toThrow();
});

test("the purchase chooser carries verified links for the correct edition",()=>{
  for(const book of books){
    const purchase=purchaseBook(book);
    expect(purchase.links.length).toBeGreaterThan(1);
    for(const link of purchase.links){expect(link.verified).toBe(true);expect(link.url).toMatch(/^https:\/\//);if(link.isbn13)expect(link.isbn13).toBe(purchase.isbn);}
  }
});

test("reading-order schema links exactly three distinct book works",()=>{
  const list=bookListSchema();
  expect(list.numberOfItems).toBe(3);
  expect(list.itemListElement.map(item=>item.position)).toEqual([1,2,3]);
  expect(new Set(list.itemListElement.map(item=>item.item["@id"])).size).toBe(3);
});
