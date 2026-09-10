import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EvidenceAccordion } from "@/components/app/evidence";
import { Btn, Card, EmptyState, PageHeader, Pill } from "@/components/app/primitives";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FRESHNESS } from "@/lib/demo-data";
import type { Decision } from "@/lib/demo-data";
import { ROLE_RIGHTS, useWorkspace } from "@/lib/workspace";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/decisions")({
  head: () => ({
    meta: [{ title: "Decisions — Bearing" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: DecisionsPage,
});

const statusTone = {
  awaiting: "caution",
  approved: "positive",
  deferred: "neutral",
  clarification: "signal",
} as const;

const statusLabel = {
  awaiting: "Awaiting you",
  approved: "Approved",
  deferred: "Deferred",
  clarification: "Clarification requested",
} as const;

const FILTERS = ["All", "Awaiting", "Resolved"] as const;

function DecisionsPage() {
  const { decisions, setDecisionStatus, session } = useWorkspace();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Awaiting");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [option, setOption] = useState<string | null>(null);

  const canApprove = session ? ROLE_RIGHTS[session.role].approve : false;
  const rows = decisions
    .filter((d) =>
      filter === "Awaiting"
        ? d.status === "awaiting"
        : filter === "Resolved"
          ? d.status !== "awaiting"
          : true,
    )
    .filter((d) => (d.statement + d.owner).toLowerCase().includes(query.toLowerCase()));

  const selected = decisions.find((d) => d.id === openId) ?? null;

  const act = (d: Decision, status: Decision["status"], label: string) => {
    if (!canApprove) {
      toast.error("Your role cannot resolve decisions.", {
        description: "Only an Executive can approve, defer or request clarification.",
      });
      return;
    }
    const chosen = d.options.find((o) => o.id === option)?.label;
    setDecisionStatus(d.id, status, chosen);
    toast.success(`${label} · written to the audit trail`);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Decisions"
        description={`Executive decision queue · data as at ${FRESHNESS.lastSyncedAt}`}
        actions={<Pill tone="signal">Demo workspace · Fictional data</Pill>}
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-md border border-rule bg-card p-0.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "h-8 rounded px-2.5 text-[12.5px] font-medium transition-colors",
                filter === f ? "bg-signal-soft text-navy" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search decisions"
          aria-label="Search decisions"
          className="h-9 w-full max-w-[240px] rounded-md border border-rule bg-card px-3 text-[13px] outline-none focus:border-signal"
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="Nothing in this view"
          detail="No decision matches the current filter or search."
        />
      ) : (
        <ul className="grid gap-2">
          {rows.map((d) => (
            <Card as="li" key={d.id} className="p-0">
              <button
                type="button"
                onClick={() => {
                  setOpenId(d.id);
                  setOption(d.options.find((o) => o.recommended)?.id ?? null);
                }}
                className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left hover:bg-muted"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium">{d.statement}</span>
                  <span className="mt-0.5 block text-[12.5px] text-muted-foreground">
                    {d.owner} · {d.deadline} · {d.id.toUpperCase()}
                  </span>
                </span>
                <Pill tone={statusTone[d.status]}>{statusLabel[d.status]}</Pill>
              </button>
            </Card>
          ))}
        </ul>
      )}

      <Sheet
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) setOpenId(null);
        }}
      >
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          {selected ? (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="text-[16px]">{selected.statement}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-8">
                <div className="flex flex-wrap gap-2">
                  <Pill tone={statusTone[selected.status]}>{statusLabel[selected.status]}</Pill>
                  <Pill tone="caution">{selected.deadline}</Pill>
                  <Pill>{selected.owner}</Pill>
                </div>
                <p className="text-[13.5px] text-muted-foreground">{selected.context}</p>
                <p className="text-[13.5px]">
                  <span className="font-medium">Why now:</span> {selected.whyNow}
                </p>

                <fieldset>
                  <legend className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
                    Options
                  </legend>
                  <div className="mt-2 grid gap-2">
                    {selected.options.map((o) => (
                      <label
                        key={o.id}
                        className={cn(
                          "cursor-pointer rounded-md border p-3 text-[13px]",
                          option === o.id ? "border-signal bg-signal-soft" : "border-rule bg-card",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="option"
                            checked={option === o.id}
                            onChange={() => setOption(o.id)}
                            className="size-3.5 accent-[var(--navy)]"
                          />
                          <span className="font-medium">{o.label}</span>
                          {o.recommended ? <Pill tone="positive">Recommended</Pill> : null}
                        </span>
                        <span className="mt-1 block text-muted-foreground">{o.detail}</span>
                        <span className="mt-1 block text-[12.5px] text-muted-foreground">
                          Trade-off: {o.tradeoff} · {o.expectedImpact}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <p className="text-[12.5px] text-muted-foreground">
                  Cost of delay: {selected.costOfDelay}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Btn variant="primary" onClick={() => act(selected, "approved", "Approved")}>
                    Approve
                  </Btn>
                  <Btn onClick={() => act(selected, "deferred", "Deferred")}>Defer</Btn>
                  <Btn onClick={() => act(selected, "clarification", "Clarification requested")}>
                    Request clarification
                  </Btn>
                </div>
                {!canApprove ? (
                  <p className="text-[12.5px] text-caution">
                    Your role is read-only for decisions. Sign in as an Executive to resolve them.
                  </p>
                ) : null}

                <EvidenceAccordion
                  ids={selected.evidenceIds}
                  confidence={selected.confidence}
                  freshness={FRESHNESS.lastSyncedAt}
                />
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
