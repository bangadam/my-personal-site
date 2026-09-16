import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, description } = frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className:
      "text-[15.5px] font-medium tracking-tight text-[var(--foreground)]",
  };

  return (
    <li className="row-hover -mx-3 border-b border-[var(--border)] px-3 py-5 last:border-b-0">
      <a href={href} className="block">
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}
        <div className="mt-1">
          <Datetime datetime={pubDatetime} />
        </div>
        <p className="mt-2 text-[14.5px] leading-[1.6] text-[var(--muted-foreground)]">
          {description}
        </p>
      </a>
    </li>
  );
}
