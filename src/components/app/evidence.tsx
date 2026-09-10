import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Pill } from "@/components/app/primitives";
import { evidenceById, type EvidenceKind } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const kindLabel: Record<EvidenceKind, string> = {
  "verified-fact": "Verified fact",
  calculated: "Calculated",
  "ai-inference": "AI inference",
  recommendation: "Recommendation",
};

const kindTone: Record<EvidenceKind, "positive" | "signal" | "caution" | "neutral"> = {
  "verified-fact": "positive",
  calculated: "signal",
  "ai-inference": "caution",
  recommendation: "neutral",
};

export function EvidenceAccordion({
  ids,
  confidence,
  freshness,
  className,
}: {
  ids: string[];
  confidence: "high" | "medium" | "low";
  freshness: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const records = ids.map(evidenceById).filter(Boolean) as NonNullable<
    ReturnType<typeof evidenceById>
  >[];

  return (
    <div className={cn("rounded-lg border border-rule bg-surface", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left"
      >
        <span className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
          <span className="font-medium text-foreground">
            Sources &amp; evidence ({records.length})
          </span>
          <span>Freshness: {freshness}</span>
          <Pill
            tone={
              confidence === "high" ? "positive" : confidence === "medium" ? "caution" : "neutral"
            }
          >
            {confidence} confidence
          </Pill>
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <ul className="space-y-2 border-t border-rule p-3">
          {records.length === 0 ? (
            <li className="text-[13px] text-muted-foreground">
              No supporting record. Bearing will not infer one.
            </li>
          ) : (
            records.map((r) => (
              <li key={r.id} className="rounded-md border border-rule bg-card p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone={kindTone[r.kind]}>{kindLabel[r.kind]}</Pill>
                  <span className="text-[12px] text-muted-foreground">
                    {r.sourceName} · {r.dateRange} · synced {r.lastSyncedAt}
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] font-medium">{r.record}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">{r.reasoning}</p>
                {r.missingData ? (
                  <p className="mt-1 text-[12px] text-caution">Missing: {r.missingData}</p>
                ) : null}
                {r.qualityWarning ? (
                  <p className="mt-1 text-[12px] text-caution">Quality: {r.qualityWarning}</p>
                ) : null}
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
