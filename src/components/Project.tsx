import { ArrowUpRight } from "lucide-react";
import Datetime from "./Datetime";

export interface Props {
  href?: string;
  frontmatter: {
    title: string;
    pubDatetime: string | Date;
    description: string;
  };
}

export default function Project({ href, frontmatter }: Props) {
  const { title, pubDatetime, description } = frontmatter;

  const content = (
    <>
      <div className="shrink-0 sm:w-[108px]">
        <Datetime datetime={pubDatetime} />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-[14px] font-normal leading-[1.65] text-[var(--foreground)]">
          {title}{" "}
          {href && (
            <ArrowUpRight
              className="interaction-icon inline h-3.5 w-3.5"
              aria-hidden="true"
            />
          )}
        </h2>
        <p className="mt-1.5 text-[14px] leading-[1.65] text-[var(--foreground-90)]">
          {description}
        </p>
      </div>
    </>
  );

  return (
    <li>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="icon-link motion-external flex flex-col gap-1 sm:flex-row sm:gap-6"
        >
          {content}
        </a>
      ) : (
        <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
          {content}
        </div>
      )}
    </li>
  );
}
