import { Fragment } from "react";
import { normalize } from "@/lib/search";

export function Highlight({ text, query }: { text: string; query: string }) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return <>{text}</>;

  const haystack = normalize(text);
  const marked = new Array<boolean>(text.length).fill(false);
  for (const term of terms) {
    let from = 0;
    let idx: number;
    while ((idx = haystack.indexOf(term, from)) !== -1) {
      for (let i = idx; i < idx + term.length; i++) marked[i] = true;
      from = idx + term.length;
    }
  }

  const segments: { text: string; hit: boolean }[] = [];
  for (let i = 0; i < text.length; i++) {
    const last = segments[segments.length - 1];
    if (last && last.hit === marked[i]) last.text += text[i];
    else segments.push({ text: text[i], hit: marked[i] });
  }

  return (
    <>
      {segments.map((s, i) =>
        s.hit ? (
          <mark key={i} className="rounded-sm bg-amber-100 text-inherit">
            {s.text}
          </mark>
        ) : (
          <Fragment key={i}>{s.text}</Fragment>
        ),
      )}
    </>
  );
}
