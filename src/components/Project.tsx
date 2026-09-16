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

  return (
    <article className="row-hover rounded-md border border-[var(--border)] bg-[var(--card)] p-5">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <h2 className="text-[15.5px] font-medium tracking-tight text-[var(--foreground)]">
          {title}
        </h2>
        <div className="mt-1">
          <Datetime datetime={pubDatetime} />
        </div>
        <p className="mt-3 text-[14px] leading-[1.6] text-[var(--muted-foreground)]">
          {description}
        </p>
      </a>
    </article>
  );
}
