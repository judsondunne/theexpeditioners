"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

export const cipherKey = ["The map hides a secret.", "Follow the river to the canyon.", "Bring a compass and a friend."];
const words: string[][] = cipherKey.map(line => line.toLowerCase().match(/[a-z]+/g) ?? []);

export function CipherPractice() {
  const [message, setMessage] = useState("FOLLOW THE MAP");
  const [status, setStatus] = useState("");
  const tokens = message.toLowerCase().match(/[a-z]+/g) ?? [];
  const encoded = tokens.map(word => {
    const line = words.findIndex(line => line.includes(word));
    return line < 0 ? null : `1-${line + 1}-${words[line].indexOf(word) + 1}`;
  });
  const missing = [...new Set(tokens.filter((_, index) => !encoded[index]))];
  const code = encoded.join(" / ");
  return <section className="cipher-practice my-10 border border-sepia/35 bg-paper-2 p-5 sm:p-8" aria-labelledby="cipher-title">
    <p className="label text-rust">Page One · Your key</p>
    <h2 id="cipher-title" className="mt-3!">Try a book cipher</h2>
    <ol className="cipher-key">{cipherKey.map((line,index)=><li key={line}><span className="label text-rust">{index+1}</span><span>{line}</span></li>)}</ol>
    <label htmlFor="cipher-message" className="mt-6 block font-serif text-xl">Write a message using words from the key.</label>
    <input id="cipher-message" value={message} maxLength={100} onChange={event=>{setMessage(event.target.value);setStatus("");}} className="mt-3 w-full min-h-12 border border-sepia/40 bg-paper px-4 py-3 font-mono text-base" autoComplete="off" spellCheck={false} aria-describedby="cipher-help cipher-result" />
    <p id="cipher-help" className="mt-2 text-sm! text-ink-2">Each group is page–line–word. Repeated words use their first position.</p>
    <div id="cipher-result" aria-live="polite" className="mt-5 min-h-20 border-y border-sepia/25 py-4">
      {missing.length ? <p className="text-rust break-words">Not in the key: {missing.join(", ")}. Try a message made from the words above.</p> : <p className="font-mono break-words text-lg text-ink">{tokens.length ? code : "Your cipher will appear here."}</p>}
    </div>
    <div className="mt-4 flex flex-wrap gap-4 items-center"><button type="button" disabled={!tokens.length || missing.length > 0} className="label-lg min-h-12 bg-ink px-5 text-cream hover:bg-rust disabled:opacity-40" onClick={async()=>{
      try { await navigator.clipboard.writeText(code);setStatus("Cipher copied. Send the key separately!");track("activity_copy",{resource:"book-cipher"}); }
      catch {setStatus("Select the numbers above to copy your cipher.");}
    }}>Copy your cipher</button><span role="status" className="text-sm text-ink-2">{status}</span></div>
  </section>;
}
