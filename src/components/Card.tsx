import { ArrowUpRight } from "lucide-react";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
  external?: boolean;
  accent?: boolean;
}

export default function Card({
  href,
  frontmatter,
  secHeading = true,
  external = false,
  accent = false,
}: Props) {
  const { title, pubDatetime, description } = frontmatter;

  const headerProps = {
    className: `${
      accent ? "text-[18px]" : "text-[14px]"
    } font-normal leading-[1.65] text-[var(--foreground)]`,
  };

  return (
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="icon-link motion-external flex flex-col gap-1 sm:flex-row sm:gap-6"
      >
        <div className="shrink-0 sm:w-[108px]">
          <Datetime datetime={pubDatetime} />
        </div>
        <div className="min-w-0 flex-1">
          {secHeading ? (
            <h2 {...headerProps}>
              {title}{" "}
              <ArrowUpRight
                className="interaction-icon inline h-3.5 w-3.5"
                aria-hidden="true"
              />
            </h2>
          ) : (
            <h3 {...headerProps}>
              {title}{" "}
              <ArrowUpRight
                className="interaction-icon inline h-3.5 w-3.5"
                aria-hidden="true"
              />
            </h3>
          )}
          <p className="mt-1.5 text-[14px] leading-[1.65] text-[var(--foreground-90)]">
            {description}
          </p>
        </div>
      </a>
    </li>
  );
}
