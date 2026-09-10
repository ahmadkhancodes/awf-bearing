import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MonoLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("label-mono text-muted-foreground", className)}>{children}</span>;
}

export function Panel({
  children,
  className,
  as: As = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "article" | "div" | "li";
}) {
  return <As className={cn("border border-rule bg-card", className)}>{children}</As>;
}

type Tone = "neutral" | "critical" | "caution" | "positive" | "signal";

const toneClass: Record<Tone, string> = {
  neutral: "border-rule text-muted-foreground bg-muted",
  critical: "border-critical/35 text-critical bg-critical/6",
  caution: "border-caution/35 text-caution bg-caution/6",
  positive: "border-positive/35 text-positive bg-positive/6",
  signal: "border-signal/35 text-signal bg-signal/6",
};

export function StatePill({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center gap-1.5 border px-2 py-[3px]",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function urgencyTone(u: string): Tone {
  if (u === "today") return "critical";
  if (u === "this-week") return "caution";
  if (u === "this-month") return "signal";
  return "neutral";
}

export function urgencyLabel(u: string) {
  return (
    {
      today: "Act today",
      "this-week": "This week",
      "this-month": "This month",
      monitor: "Monitor",
    } as Record<string, string>
  )[u];
}

export function ConfidenceMeter({ level }: { level: "high" | "medium" | "low" }) {
  const filled = level === "high" ? 3 : level === "medium" ? 2 : 1;
  return (
    <span className="inline-flex items-center gap-1.5" title={`Confidence: ${level}`}>
      <span className="label-mono text-muted-foreground">Conf.</span>
      <span className="flex gap-[2px]" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "h-2.5 w-[6px] border border-navy/40",
              i < filled ? "bg-navy" : "bg-transparent",
            )}
          />
        ))}
      </span>
      <span className="sr-only">Confidence {level}</span>
      <span className="label-mono text-foreground">{level}</span>
    </span>
  );
}

export function Sparkline({
  values,
  label,
  invert = false,
}: {
  values: number[];
  label: string;
  invert?: boolean | undefined;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${28 - ((v - min) / span) * 26}`)
    .join(" ");
  const rising = (values.at(-1) ?? 0) >= (values[0] ?? 0);
  const good = invert ? !rising : rising;
  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      className="h-8 w-full"
      role="img"
      aria-label={label}
    >
      <polyline
        points={pts}
        fill="none"
        stroke={good ? "var(--positive)" : "var(--critical)"}
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function DefinitionRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-rule py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="label-mono text-muted-foreground pt-[3px]">{term}</dt>
      <dd className="text-[15px] text-foreground">{children}</dd>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  id?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <MonoLabel>{eyebrow}</MonoLabel> : null}
      <h1 id={id} className="mt-2 text-3xl font-semibold sm:text-4xl">
        {title}
      </h1>
      {description ? <p className="mt-3 text-[15px] text-muted-foreground">{description}</p> : null}
    </div>
  );
}
