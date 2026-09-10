import type { ReactNode } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Kpi } from "@/lib/ask";

export function Card({
  children,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  return <As className={cn("rounded-lg border border-rule bg-card", className)}>{children}</As>;
}

export function UiLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("ui-label", className)}>{children}</span>;
}

type Tone = "neutral" | "critical" | "caution" | "positive" | "signal";

const toneClass: Record<Tone, string> = {
  neutral: "border-rule text-muted-foreground bg-muted",
  critical: "border-critical/30 text-critical bg-critical/8",
  caution: "border-caution/30 text-caution bg-caution/8",
  positive: "border-positive/30 text-positive bg-positive/8",
  signal: "border-signal/30 text-signal bg-signal/8",
};

export function Pill({
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
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = kpi.tone === "good" ? ArrowUpRight : kpi.tone === "bad" ? ArrowDownRight : ArrowRight;
  return (
    <Card className="px-3.5 py-3">
      <p className="text-[12px] font-medium text-muted-foreground">{kpi.label}</p>
      <p className="mt-1 text-[20px] font-semibold tracking-tight tabular-nums">{kpi.value}</p>
      {kpi.delta ? (
        <p
          className={cn(
            "mt-0.5 inline-flex items-center gap-1 text-[12px] font-medium",
            kpi.tone === "good"
              ? "text-positive"
              : kpi.tone === "bad"
                ? "text-critical"
                : "text-muted-foreground",
          )}
        >
          <Icon className="size-3.5" aria-hidden="true" />
          {kpi.delta}
        </p>
      ) : null}
      {kpi.hint ? <p className="mt-0.5 text-[12px] text-muted-foreground">{kpi.hint}</p> : null}
    </Card>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-rule pb-4">
      <div>
        <h1 className="text-[19px] font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "default",
  type = "button",
  disabled,
  className,
  ...rest
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "default" | "primary" | "ghost" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
} & Record<string, unknown>) {
  const v = {
    default: "border border-rule bg-card text-foreground hover:bg-muted",
    primary: "border border-navy bg-navy text-white hover:bg-navy-deep",
    ghost: "border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
    danger: "border border-critical/40 text-critical hover:bg-critical/8",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 text-[13px] font-medium transition-colors disabled:opacity-50",
        v,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <Card className="p-8 text-center">
      <p className="text-[14px] font-medium">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-[13px] text-muted-foreground">{detail}</p>
    </Card>
  );
}

export function ConfidenceBadge({ level }: { level: "high" | "medium" | "low" }) {
  const tone: Tone = level === "high" ? "positive" : level === "medium" ? "caution" : "neutral";
  return <Pill tone={tone}>Confidence: {level}</Pill>;
}
