import { LOCALE } from "@config";

export interface Props {
  datetime: string | Date;
  size?: "sm" | "lg";
  className?: string;
}

export default function Datetime({ datetime, size = "sm", className }: Props) {
  return (
    <span
      className={`font-mono text-[var(--muted-foreground)] ${
        size === "sm" ? "text-[12px]" : "text-[13px]"
      } ${className ?? ""}`}
    >
      <FormattedDatetime datetime={datetime} />
    </span>
  );
}

const FormattedDatetime = ({ datetime }: { datetime: string | Date }) => {
  const myDatetime = new Date(datetime);

  const date = myDatetime.toLocaleDateString(LOCALE, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  return <>{date}</>;
};
