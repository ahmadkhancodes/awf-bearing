import { useState, type ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MonoLabel, StatePill } from "@/components/ui-kit";
import { EVIDENCE, evidenceById, type EvidenceKind } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const kindLabel: Record<EvidenceKind, string> = {
  "verified-fact": "Verified fact",
  calculated: "Calculated value",
  "ai-inference": "AI inference",
  recommendation: "Recommendation",
};

const kindTone: Record<EvidenceKind, "positive" | "signal" | "caution" | "neutral"> = {
  "verified-fact": "positive",
  calculated: "signal",
  "ai-inference": "caution",
  recommendation: "neutral",
};

export function EvidenceButton({
  ids,
  label = "Evidence",
  relatedTo,
  className,
}: {
  ids: string[];
  label?: string;
  relatedTo?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const records = ids.map(evidenceById).filter(Boolean) as (typeof EVIDENCE)[number][];
  const none = records.length === 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "label-mono inline-flex min-h-11 items-center gap-2 border border-rule px-3 text-foreground transition-colors hover:border-navy hover:bg-muted",
          className,
        )}
        aria-haspopup="dialog"
      >
        {label}
        <span aria-hidden="true" className="text-muted-foreground">
          {none ? "0" : records.length}
        </span>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto border-l border-rule bg-background p-0 sm:max-w-xl"
        >
          <SheetHeader className="border-b border-rule p-5 text-left sm:p-6">
            <MonoLabel>Evidence</MonoLabel>
            <SheetTitle className="font-display text-xl">
              {relatedTo ?? "Supporting evidence"}
            </SheetTitle>
            <SheetDescription className="text-[14px]">
              Every record below comes from the sample company dataset. Bearing does not assert
              operational facts without a record behind them.
            </SheetDescription>
          </SheetHeader>

          <div className="p-5 sm:p-6">
            {none ? (
              <div className="border border-rule bg-muted p-5">
                <MonoLabel>Insufficient evidence</MonoLabel>
                <p className="mt-2 text-[15px]">
                  There is no supporting record for this item. Bearing will not infer one. Load the
                  relevant source in Connections before acting on it.
                </p>
              </div>
            ) : (
              <ol className="space-y-5">
                {records.map((r) => (
                  <li key={r.id} className="border border-rule">
                    <div className="flex flex-wrap items-center gap-2 border-b border-rule bg-muted px-4 py-2.5">
                      <StatePill tone={kindTone[r.kind]}>{kindLabel[r.kind]}</StatePill>
                      <MonoLabel>{r.sourceCategory}</MonoLabel>
                    </div>
                    <dl className="px-4 py-3 text-[14px]">
                      <Row term="Record">{r.record}</Row>
                      <Row term="Source">{r.sourceName}</Row>
                      <Row term="Date range">{r.dateRange}</Row>
                      <Row term="Last synchronised">{r.lastSyncedAt}</Row>
                      <Row term="Reasoning">{r.reasoning}</Row>
                      <Row term="Confidence">{r.confidence}</Row>
                      {r.missingData ? <Row term="Missing data">{r.missingData}</Row> : null}
                      {r.qualityWarning ? (
                        <Row term="Data-quality warning">{r.qualityWarning}</Row>
                      ) : null}
                    </dl>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function Row({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="grid gap-0.5 border-b border-rule py-2.5 last:border-b-0 sm:grid-cols-[150px_1fr] sm:gap-3">
      <dt className="label-mono text-muted-foreground pt-1">{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}
