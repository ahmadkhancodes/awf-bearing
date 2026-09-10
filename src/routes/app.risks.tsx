import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { EvidenceAccordion } from "@/components/app/evidence";
import { Card, EmptyState, PageHeader, Pill } from "@/components/app/primitives";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FRESHNESS, RISKS, money, type Risk } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/risks")({
  head: () => ({
    meta: [{ title: "Risks — Bearing" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: RisksPage,
});

const materialityTone = {
  critical: "critical",
  high: "caution",
  moderate: "signal",
  low: "neutral",
} as const;

const FILTERS = ["All", "Open", "Critical & high", "Resolved"] as const;

function RisksPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Open");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Risk | null>(null);

  const rows = RISKS.filter((r) => {
    if (filter === "Open") return r.state !== "resolved";
    if (filter === "Resolved") return r.state === "resolved";
    if (filter === "Critical & high")
      return r.materiality === "critical" || r.materiality === "high";
    return true;
  })
    .filter((r) => (r.title + r.summary + r.owner).toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.probability * b.impactValue - a.probability * a.impactValue);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Risks"
        description={`Ranked by expected exposure · data as at ${FRESHNESS.lastSyncedAt}`}
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
          placeholder="Search risks"
          aria-label="Search risks"
          className="h-9 w-full max-w-[240px] rounded-md border border-rule bg-card px-3 text-[13px] outline-none focus:border-signal"
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No risks match" detail="Adjust the filter or clear the search term." />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead>
              <tr className="border-b border-rule text-left text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Risk</th>
                <th className="px-4 py-2.5 font-medium">Materiality</th>
                <th className="px-4 py-2.5 font-medium">Likelihood</th>
                <th className="px-4 py-2.5 font-medium">Exposure</th>
                <th className="px-4 py-2.5 font-medium">Horizon</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(r);
                    }
                  }}
                  className="cursor-pointer border-b border-rule last:border-0 hover:bg-muted"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{r.title}</p>
                    <p className="text-[12px] text-muted-foreground">{r.owner}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone={materialityTone[r.materiality]}>{r.materiality}</Pill>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-16 rounded-full bg-muted">
                        <span
                          className="block h-1.5 rounded-full bg-navy"
                          style={{ width: `${r.probability * 100}%` }}
                        />
                      </span>
                      <span className="tabular-nums">{Math.round(r.probability * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {r.impactValue ? money(r.impactValue) : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.horizon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
          {selected ? (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="text-[16px]">{selected.title}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <div className="flex flex-wrap gap-2">
                  <Pill tone={materialityTone[selected.materiality]}>{selected.materiality}</Pill>
                  <Pill>{selected.state}</Pill>
                  <Pill>{selected.horizon}</Pill>
                </div>
                <p className="text-[14px]">{selected.summary}</p>
                <dl className="grid gap-2 text-[13px]">
                  <Row term="Owner">{selected.owner}</Row>
                  <Row term="Likelihood">{Math.round(selected.probability * 100)}%</Row>
                  <Row term="Exposure">
                    {selected.impactValue ? money(selected.impactValue) : "Not quantified"}
                  </Row>
                  <Row term="Planned response">{selected.response}</Row>
                </dl>
                {selected.decisionId ? (
                  <Link
                    to="/app/decisions"
                    className="inline-flex h-9 items-center rounded-md border border-navy bg-navy px-3 text-[13px] font-medium text-white"
                  >
                    Open linked decision
                  </Link>
                ) : null}
                <EvidenceAccordion
                  ids={selected.evidenceIds}
                  confidence="medium"
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

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-2 border-t border-rule pt-2">
      <dt className="text-muted-foreground">{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}
