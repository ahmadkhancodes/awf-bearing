import { cn } from "@/lib/utils";

/** AWF vector mark, reconstructed as a clean SVG. */
export function AwfMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="AWF Consulting mark"
      className={cn("h-6 w-6", className)}
      fill="none"
    >
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M7 23 L12.5 9 L18 23" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.6 18.5 H15.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 9 V23 H25.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ProductLogo({
  className,
  tone = "navy",
  subtitle = true,
}: {
  className?: string;
  tone?: "navy" | "light";
  subtitle?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5",
        tone === "light" ? "text-white" : "text-navy",
        className,
      )}
    >
      <AwfMark />
      <span className="flex flex-col leading-tight">
        <span className="text-[15px] font-semibold tracking-tight">Bearing</span>
        {subtitle ? (
          <span className="text-[11px] font-medium text-muted-foreground">by AWF Consulting</span>
        ) : null}
      </span>
    </span>
  );
}
