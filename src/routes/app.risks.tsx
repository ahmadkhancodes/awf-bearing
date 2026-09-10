import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MonoLabel, Panel, SectionHeading, StatePill } from "@/components/ui-kit";
import { EvidenceButton } from "@/components/evidence-drawer";
import { RISKS, money, type Risk } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/risks")({
  head: () => ({ meta: [{ title: "Risks — Bearing" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: Risks,
});

const FILTERS = ["Open", "All", "Resolved"] as const;

const stateTone = (s: Risk["state"]) =>
  s === "new" ? "signal" : s === "changed" ? "caution" : s === "improving" ? "positive" : s === "resolved" ? "positive" : "neutral";

const matTone = (m: Risk["materiality"]) =>
  m === "critical" ? "critical" : m === "high" ? "caution" : m === "moderate" ? "signal" : "neutral";

function Risks() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Open");

  const list = RISKS.filter((r) =>
    filter === "All" ? true : filter === "Resolved" ? r.state === "resolved" : r.state !== "resolved",
  ).sort((a, b) => b.impactValue * b.probability - a.impactValue * a.probability);

  return (
    <div>
      <SectionHeading
        eyebrow="Risks"
        title="Ranked by money at stake and time remaining"
        description="Bearing ranks exposure by materiality weighted by probability. Every risk carries an owner, a recommended response, and the evidence behind it."
      />

      <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-rule pb-3" role="group" aria-label="Filter risks">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "label-mono min-h-11 border px-3 transition-colors",
              filter === f ? "border-navy bg-navy text-white" : "border-rule hover:border-navy hover:bg-muted",
            )}
          >
            {f}
          </button>
        ))}
        <MonoLabel className="ml-auto">{list.length} shown</MonoLabel>
      </div>

      {list.length === 0 ? (
        <div className="mt-8 border border-rule bg-muted p-6">
          <MonoLabel>Empty</MonoLabel>
          <p className="mt-2 text-[15px]">No risks match this filter.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-5">
          {list.map((r) => (
            <Panel as="li" key={r.id} className={cn(r.state === "resolved" && "opacity-80")}>
              <div id={r.id} className="scroll-mt-32 flex flex-wrap items-center gap-2 border-b border-rule bg-muted px-4 py-2.5 sm:px-5">
                <StatePill tone={matTone(r.materiality)}>{r.materiality}</StatePill>
                <StatePill tone={stateTone(r.state)}>{r.state}</StatePill>
                <MonoLabel>{r.domain}</MonoLabel>
                <span className="label-mono text-foreground ml-auto">
                  {r.impactValue > 0 ? `${money(r.impactValue)} exposure` : "No direct £ exposure yet"}
                </span>
              </div>
              <div className="px-4 py-4 sm:px-5">
                <h2 className="text-xl font-semibold">{r.title}</h2>
                <p className="mt-2 text-[15px] text-muted-foreground">{r.summary}</p>
                <dl className="mt-4 grid gap-4 border-t border-rule pt-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Cell term="Probability">{Math.round(r.probability * 100)}%</Cell>
                  <Cell term="Time horizon">{r.horizon}</Cell>
                  <Cell term="Owner">{r.owner}</Cell>
                  <Cell term="Recommended response">{r.response}</Cell>
                </dl>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-rule pt-4">
                  <EvidenceButton ids={r.evidenceIds} relatedTo={r.title} />
                  {r.decisionId ? (
                    <Link
                      to="/app/decisions"
                      hash={r.decisionId}
                      className="label-mono inline-flex min-h-11 items-center border border-navy bg-navy px-3 text-white hover:opacity-90"
                    >
                      Related decision
                    </Link>
                  ) : (
                    <span className="label-mono inline-flex min-h-11 items-center border border-rule px-3 text-muted-foreground">
                      No decision required yet
                    </span>
                  )}
                  <Link
                    to="/app/actions"
                    className="label-mono inline-flex min-h-11 items-center border border-rule px-3 hover:border-navy hover:bg-muted"
                  >
                    Follow-through
                  </Link>
                </div>
              </div>
            </Panel>
          ))}
        </ul>
      )}
    </div>
  );
}

function Cell({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="label-mono text-muted-foreground">{term}</dt>
      <dd className="mt-1 text-[15px]">{children}</dd>
    </div>
  );
}
