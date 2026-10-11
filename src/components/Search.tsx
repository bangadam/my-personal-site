import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import Card from "@components/Card";
import slugify from "@utils/slugify";
import type { CollectionEntry } from "astro:content";

export type SearchItem = {
  title: string;
  description: string;
  data: CollectionEntry<"blog">["data"];
};

interface Props {
  searchList: SearchItem[];
}

export default function SearchBar({ searchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setInputVal(value);
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    history.replaceState(
      history.state,
      "",
      url.pathname + url.search + url.hash
    );
  };

  const fuse = useMemo(
    () =>
      new Fuse(searchList, {
        keys: ["title", "description"],
        includeMatches: true,
        minMatchCharLength: 2,
        threshold: 0.5,
      }),
    [searchList]
  );

  const query = inputVal.trim();
  const searchResults = useMemo(
    () => (query.length > 1 ? fuse.search(query) : []),
    [fuse, query]
  );

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("q") ?? "";
    setInputVal(value);
    inputRef.current?.setSelectionRange(value.length, value.length);
  }, []);

  return (
    <>
      <label className="search-field relative block">
        <span className="sr-only">Search posts</span>
        <span
          className="search-icon pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--muted-foreground)]"
          aria-hidden="true"
        >
          <Search className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <input
          className="block w-full rounded-md border border-[var(--input)] bg-[var(--card)] py-2.5 pl-10 pr-3 font-sans text-[14px] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
          placeholder="Search posts..."
          type="text"
          name="search"
          value={inputVal}
          onChange={handleChange}
          autoComplete="off"
          autoFocus
          ref={inputRef}
        />
      </label>

      <div role="status" aria-live="polite">
        {query.length > 1 && searchResults.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <img
              src="/assets/mascot/rsmQV.webp"
              alt=""
              aria-hidden="true"
              width="120"
              height="120"
              className="pointer-events-none h-[120px] w-[120px]"
            />
            <h2 className="text-[18px]">No articles found</h2>
            <p className="text-[14px] text-[var(--muted-foreground)]">
              Try a different keyword or browse all writing.
            </p>
            <a
              href="/posts"
              className="icon-link motion-next inline-flex items-center gap-1 text-[13px]"
            >
              All writing{" "}
              <span className="interaction-icon" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        ) : query.length > 1 ? (
          <p className="mt-6 font-mono text-[12.5px] text-[var(--muted-foreground)]">
            Found {searchResults.length}{" "}
            {searchResults.length === 1 ? "result" : "results"} for '{inputVal}'
          </p>
        ) : null}
      </div>

      <ul className="mt-6 space-y-7">
        {searchResults.map(({ item, refIndex }) => (
          <Card
            href={`/posts/${slugify(item.data)}`}
            frontmatter={item.data}
            key={`${refIndex}-${slugify(item.data)}`}
          />
        ))}
      </ul>
    </>
  );
}
