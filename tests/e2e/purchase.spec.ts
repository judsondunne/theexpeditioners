import { expect, test } from "@playwright/test";

const bookPath="/books/the-treasure-of-drowned-mans-canyon";

test("the hero opens the correct bookstore chooser and Escape restores focus",async({page})=>{
  await page.goto("/");
  const cta=page.locator('[data-purchase-location="hero"]');
  await cta.click();
  const dialog=page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading")).toHaveText("The Treasure of Drowned Man's Canyon");
  const retailer=dialog.getByRole("link",{name:/Buy at Bookshop.org/});
  await expect(retailer).toHaveAttribute("href",/ean=9780960083503/);
  await expect(retailer).toHaveAttribute("target","_blank");
  await dialog.screenshot({path:test.info().outputPath("bookstore-chooser.png")});
  expect(await page.evaluate(()=>document.body.style.overflow)).toBe("hidden");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(cta).toBeFocused();
  expect(await page.evaluate(()=>document.body.style.overflow)).not.toBe("hidden");
  await cta.click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button",{name:"Close bookstore chooser"}).click();
  await expect(dialog).toBeHidden();
});

test("retailer events identify the book and placement without claiming a sale",async({page,context})=>{
  await page.addInitScript(()=>{
    (window as unknown as { recorded:unknown[] }).recorded=[];
    window.plausible=(event,options)=>(window as unknown as { recorded:unknown[] }).recorded.push({event,props:options?.props});
  });
  await context.route("https://bookshop.org/**",route=>route.fulfill({body:"Retailer test destination"}));
  await page.goto(bookPath);
  await page.locator('[data-purchase-location="book-hero"]').click();
  const popup=page.waitForEvent("popup");
  await page.getByRole("dialog").getByRole("link",{name:/Buy at Bookshop.org/}).click();
  await (await popup).close();
  const events=await page.evaluate(()=>(window as unknown as {recorded:{event:string;props:Record<string,unknown>}[]}).recorded);
  expect(events).toContainEqual({event:"purchase_open",props:{book:"the-treasure-of-drowned-mans-canyon",location:"book-hero",page:bookPath}});
  expect(events).toContainEqual({event:"retailer_click",props:{retailer:"bookshop",book:"the-treasure-of-drowned-mans-canyon",format:"paperback",location:"book-hero",page:bookPath}});
  expect(events.some(event=>event.event==="purchase")).toBe(false);
});

test("the buying page presents all books and the correct retailer editions",async({page})=>{
  await page.goto("/buy");
  for(const [number,isbn] of [[1,"9780960083503"],[2,"9780960083510"],[3,"9780960083527"]] as const){
    const card=page.locator(`#book-${number}`);
    await expect(card.getByRole("heading")).toBeVisible();
    const amazon=card.getByRole("link",{name:/Buy at Amazon/});
    await expect(amazon).toHaveAttribute("href",/^https:\/\/www.amazon.com\/dp\//);
    await expect(card).toContainText(isbn);
    await expect.poll(() => card.locator("img").evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  await page.screenshot({path:test.info().outputPath("buying-page.png")});
});

test("the interactive cipher handles valid and missing key words",async({page})=>{
  await page.goto("/journal/how-to-make-a-book-cipher");
  const result=page.locator("#cipher-result");
  await expect(result).toHaveText("1-2-1 / 1-1-1 / 1-1-2");
  const input=page.getByLabel("Write a message using words from the key.");
  await input.fill("Bring a compass");
  await expect(result).toHaveText("1-3-1 / 1-1-4 / 1-3-3");
  await input.fill("Follow an airship");
  await expect(result).toContainText("Not in the key: an, airship");
  await expect(page.getByRole("button",{name:"Copy your cipher"})).toBeDisabled();
});

test("purchase links and all content work without JavaScript",async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto("/");
  const cta=page.locator('[data-purchase-location="hero"]');
  await expect(cta).toHaveAttribute("href",`${bookPath}#buy`);
  await cta.click();
  await expect(page).toHaveURL(new RegExp(`${bookPath}#buy$`));
  await expect(page.locator("#buy").getByRole("link",{name:/Buy at Bookshop.org/})).toBeVisible();
  await context.close();
});

test("the header sells the book the visitor is reading about",async({page,isMobile})=>{
  test.skip(Boolean(isMobile),"The compact mobile header uses its menu instead.");
  await page.goto("/books/the-secret-of-king-tritons-lair");
  const headerCta=page.locator('[data-purchase-location="header"]');
  await expect(headerCta).toHaveText("Buy Book Two→");
  await headerCta.click();
  await expect(page.getByRole("dialog").getByRole("heading")).toHaveText("The Secret of King Triton's Lair");
});

test("the book purchase dock yields to the full buying section",async({page})=>{
  await page.goto(`${bookPath}#about-book`);
  const dock=page.getByRole("complementary",{name:"Get Book One"});
  await expect(dock).toBeVisible();
  await dock.getByRole("link",{name:"Choose bookstore"}).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.locator("#buy").scrollIntoViewIfNeeded();
  await expect(dock).toBeHidden();
});

test("each guide serves its own working social preview",async({page,request,isMobile})=>{
  test.skip(Boolean(isMobile),"Metadata resource check is shared by devices.");
  const images=new Set<string>();
  for(const slug of ["what-is-steampunk-for-young-readers","how-to-make-a-book-cipher"]){
    await page.goto(`/journal/${slug}`);
    const image=await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(image).toContain(slug);
    images.add(image!);
    const url=new URL(image!);
    const response=await request.get(`${url.pathname}${url.search}`);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/png");
    expect((await response.body()).byteLength).toBeGreaterThan(1000);
  }
  expect(images.size).toBe(2);
});
