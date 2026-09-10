import { createFileRoute, Link } from "@tanstack/react-router";
import { AnswerChart } from "@/components/app/answer-chart";
import { Card, KpiCard, PageHeader, Pill } from "@/components/app/primitives";
import { CASH_SERIES, DELIVERY_BY_REGION, MARGIN_SERIES } from "@/lib/analytics";
import { FRESHNESS, ORG } from "@/lib/demo-data";
import { useWorkspace } from "@/lib/workspace";
import type { ChartSpec, Kpi } from "@/lib/ask";

export const Route = createFileRoute("/app/overview")({
  head: () => ({
    meta: [{ title: "Overview — Bearing" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: OverviewPage,
});

const TILES: Kpi[] = [
  { label: "Closing cash", value: "£3.96m", delta: "−£220k WoW", tone: "bad" },
  { label: "Cash cover", value: "6.4 wks", delta: "Floor 6.0", tone: "bad" },
  { label: "Gross margin", value: "25.9%", delta: "−5.5pt / 12 wks", tone: "bad" },
  { label: "Weekly revenue", value: "£2.27m", delta: "+7.6% vs W1", tone: "good" },
  { label: "Utilisation", value: "92%", delta: "+14pt", tone: "flat" },
  { label: "Pipeline cover", value: "1.54×", delta: "Target 2.0×", tone: "bad" },
];

const cashChart: ChartSpec = {
  kind: "area",
  title: "Cash and revenue",
  description: "£m per week, 12-week history",
  data: CASH_SERIES,
  xKey: "week",
  series: [
    { key: "cash", name: "Closing cash (£m)", color: "var(--navy)" },
    { key: "revenue", name: "Weekly revenue (£m)", color: "var(--signal)" },
  ],
  unit: "£m",
};

const marginChart: ChartSpec = {
  kind: "line",
  title: "Gross margin vs target",
  description: "Delivery gross margin, weekly",
  data: MARGIN_SERIES,
  xKey: "week",
  series: [
    { key: "margin", name: "Actual", color: "var(--critical)" },
    { key: "target", name: "Target", color: "var(--muted-foreground)", dashed: true },
  ],
  unit: "%",
  domain: [24, 33],
};

const deliveryChart: ChartSpec = {
  kind: "stacked",
  title: "Delivery and customer risk composition",
  description: "Jobs by region, last four weeks",
  data: DELIVERY_BY_REGION,
  xKey: "region",
  series: [
    { key: "onTime", name: "On time", color: "var(--positive)" },
    { key: "late", name: "Late", color: "var(--critical)" },
    { key: "atRisk", name: "At risk", color: "var(--caution)" },
  ],
};

export default function _unused() {
  return null;
}

function OverviewPage() {
  const { decisions, actions } = useWorkspace();
  const awaiting = decisions.filter((d) => d.status === "awaiting");
  const blocked = actions.filter((a) => a.status === "blocked");

  const attention = [
    {
      title: "Cash cover approaching the board floor",
      detail: "£860k supplier run committed in Week 13.",
      to: "/app/risks" as const,
      cta: "Open risk",
      tone: "critical" as const,
    },
    {
      title: `${awaiting.length} decisions awaiting approval`,
      detail: awaiting[0]?.statement ?? "No open decisions.",
      to: "/app/decisions" as const,
      cta: "Review",
      tone: "caution" as const,
    },
    {
      title: "Northgate renewal at risk",
      detail: "£2.4m ACV, renewal in 74 days, 14 sev-1 tickets.",
      to: "/app/ask" as const,
      cta: "Ask why",
      tone: "critical" as const,
    },
    {
      title: `${blocked.length} action blocked`,
      detail: blocked[0]?.blocker ?? "No blocked actions.",
      to: "/app/actions" as const,
      cta: "Open",
      tone: "caution" as const,
    },
    {
      title: "Support desk data is stale",
      detail: "Last sync yesterday, 22:15.",
      to: "/app/sources" as const,
      cta: "Sources",
      tone: "neutral" as const,
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Overview"
        description={`${ORG.name} · 12-week business health · data as at ${FRESHNESS.lastSyncedAt}`}
        actions={<Pill tone="signal">Demo workspace · Fictional data</Pill>}
      />

      <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {TILES.map((t) => (
          <KpiCard key={t.label} kpi={t} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <AnswerChart spec={cashChart} height={240} />
          <div className="grid gap-4 lg:grid-cols-2">
            <AnswerChart spec={marginChart} height={220} />
            <AnswerChart spec={deliveryChart} height={220} />
          </div>
        </div>

        <Card as="section" className="h-fit">
          <h2 className="border-b border-rule px-4 py-3 text-[13px] font-semibold">
            Needs attention
          </h2>
          <ul>
            {attention.map((a) => (
              <li key={a.title} className="border-b border-rule px-4 py-3 last:border-0">
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${
                      a.tone === "critical"
                        ? "bg-critical"
                        : a.tone === "caution"
                          ? "bg-caution"
                          : "bg-muted-foreground"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-medium">{a.title}</p>
                    <p className="mt-0.5 text-[12.5px] text-muted-foreground">{a.detail}</p>
                    <Link
                      to={a.to}
                      className="mt-1 inline-block text-[12.5px] font-medium text-signal underline underline-offset-2"
                    >
                      {a.cta}
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
