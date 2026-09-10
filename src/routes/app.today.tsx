import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  ConfidenceMeter,
  MonoLabel,
  Panel,
  Sparkline,
  StatePill,
  urgencyLabel,
  urgencyTone,
} from "@/components/ui-kit";
import { EvidenceButton } from "@/components/evidence-drawer";
import { FRESHNESS, METRICS, SIGNALS } from "@/lib/demo-data";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/app/today")({
  head: () => ({ meta: [{ title: "Today — Bearing" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: Today,
});

function Today() {
  const { session, decisions, actions } = useWorkspace();
  const [greeting, setGreeting] = useState("Here's what changed");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);

  const open = SIGNALS.filter((s) => s.state !== "resolved");
  const awaiting = decisions.filter((d) => d.status === "awaiting");
  const openActions = actions.filter((a) => a.status !== "done");
  const first = session?.name.split(" ")[0] ?? "there";

  return (
    <div>
      <header>
        <MonoLabel>Today · daily executive briefing</MonoLabel>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          {greeting === "Here's what changed" ? `${first}, here's what changed.` : `${greeting}, ${first}. Here's what changed.`}
        </h1>
      </header>

      <dl className="mt-8 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
        <Stat term="Data freshness" value={FRESHNESS.lastSyncedAt} note="1 source stale — service desk" tone="caution" />
        <Stat term="Needs attention" value={`${open.length} signals`} note="Ranked by money and time" />
        <Stat term="Waiting on you" value={`${awaiting.length} decisions`} note={awaiting[0] ? `Earliest: ${awaiting[0].deadline.toLowerCase()}` : "Nothing outstanding"} />
        <Stat term="Material change" value="Cash −£220k" note="Largest weekly fall in 12 weeks" tone="critical" />
      </dl>

      {FRESHNESS.staleSources > 0 ? (
        <p className="mt-3 flex items-start gap-2 border border-caution/40 bg-caution/6 px-4 py-3 text-[14px] text-caution">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            Service desk data was last synchronised yesterday at 22:15. Customer signals may not
            reflect activity since then.{" "}
            <Link to="/app/connections" className="underline">
              Review connections
            </Link>
            .
          </span>
        </p>
      ) : null}

      <section className="mt-10" aria-labelledby="signals">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule pb-3">
          <h2 id="signals" className="text-2xl font-semibold">
            Ranked signals
          </h2>
          <MonoLabel>{open.length} of 11 candidates surfaced</MonoLabel>
        </div>

        <ul className="mt-6 space-y-5">
          {open.map((s) => (
            <Panel as="li" key={s.id}>
              <div className="flex flex-wrap items-center gap-2 border-b border-rule bg-muted px-4 py-2.5 sm:px-5">
                <StatePill tone={urgencyTone(s.urgency)}>{urgencyLabel(s.urgency)}</StatePill>
                <MonoLabel>{s.domain}</MonoLabel>
                {s.state === "new" ? <StatePill tone="signal">New</StatePill> : <StatePill>Changed</StatePill>}
                <span className="label-mono text-foreground ml-auto">{s.impactLabel}</span>
              </div>
              <div className="px-4 py-4 sm:px-5">
                <h3 className="text-xl font-semibold">{s.headline}</h3>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="label-mono text-muted-foreground">What changed</dt>
                    <dd className="mt-1 text-[15px]">{s.whatChanged}</dd>
                  </div>
                  <div>
                    <dt className="label-mono text-muted-foreground">Why it matters</dt>
                    <dd className="mt-1 text-[15px]">{s.whyItMatters}</dd>
                  </div>
                </dl>
                <p className="mt-4 border-l-2 border-signal pl-3 text-[15px]">
                  <span className="label-mono text-muted-foreground mr-2">Recommended</span>
                  {s.recommendation}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-rule pt-4">
                  <MonoLabel>Owner · {s.owner}</MonoLabel>
                  <ConfidenceMeter level={s.confidence} />
                  <div className="ml-auto flex flex-wrap gap-2">
                    <EvidenceButton ids={s.evidenceIds} relatedTo={s.headline} />
                    {s.decisionId ? (
                      <Link
                        to="/app/decisions"
                        hash={s.decisionId}
                        className="label-mono inline-flex min-h-11 items-center border border-navy bg-navy px-3 text-white hover:opacity-90"
                      >
                        Open decision
                      </Link>
                    ) : (
                      <Link
                        to="/app/risks"
                        hash={s.riskId}
                        className="label-mono inline-flex min-h-11 items-center border border-rule px-3 hover:border-navy hover:bg-muted"
                      >
                        View risk
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Panel>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="trends">
        <h2 id="trends" className="border-b border-rule pb-3 text-2xl font-semibold">
          Twelve-week movement
        </h2>
        <div className="mt-6 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          <Trend label="Cash (£m)" values={METRICS.cash} last="3.96" delta="−£220k this week" />
          <Trend label="Delivery margin (%)" values={METRICS.deliveryMargin} last="25.9" delta="−5.5 pts over 12 weeks" />
          <Trend label="Pipeline cover (×)" values={METRICS.pipelineCover} last="1.54" delta="Target 2.0×" />
          <Trend label="Billable utilisation (%)" values={METRICS.billableUtil} last="92" delta="No absorption left" invert />
        </div>
        <p className="mt-3 text-[14px] text-muted-foreground">
          Shown because each one supports a signal above. Sample data.
        </p>
      </section>

      <section className="mt-12" aria-labelledby="followthrough">
        <h2 id="followthrough" className="border-b border-rule pb-3 text-2xl font-semibold">
          Follow-through
        </h2>
        <p className="mt-4 text-[15px] text-muted-foreground">
          {openActions.length} open actions, {actions.filter((a) => a.status === "blocked").length}{" "}
          blocked.{" "}
          <Link to="/app/actions" className="text-signal underline">
            Review actions
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

function Stat({
  term,
  value,
  note,
  tone,
}: {
  term: string;
  value: string;
  note: string;
  tone?: "critical" | "caution";
}) {
  return (
    <div className="bg-card p-4">
      <dt className="label-mono text-muted-foreground">{term}</dt>
      <dd
        className={
          "mt-1.5 font-display text-2xl font-semibold " +
          (tone === "critical" ? "text-critical" : tone === "caution" ? "text-caution" : "text-foreground")
        }
      >
        {value}
      </dd>
      <p className="mt-1 text-[14px] text-muted-foreground">{note}</p>
    </div>
  );
}

function Trend({
  label,
  values,
  last,
  delta,
  invert,
}: {
  label: string;
  values: number[];
  last: string;
  delta: string;
  invert?: boolean;
}) {
  return (
    <div className="bg-card p-4">
      <MonoLabel>{label}</MonoLabel>
      <p className="mt-1 font-display text-2xl font-semibold">{last}</p>
      <Sparkline values={values} label={`${label} over twelve weeks`} invert={invert} />
      <p className="mt-1 text-[14px] text-muted-foreground">{delta}</p>
    </div>
  );
}
