import {
  CASH_SERIES,
  CUSTOMER_EXPOSURE,
  DAILY_CHANGES,
  DELAY_TREND,
  DELIVERY_BY_REGION,
  MARGIN_BRIDGE,
  MARGIN_SERIES,
} from "./analytics";
import { DECISIONS, FRESHNESS, RISKS, money, type Decision } from "./demo-data";

export type Confidence = "high" | "medium" | "low";

export interface Kpi {
  label: string;
  value: string;
  delta?: string;
  tone?: "good" | "bad" | "flat";
  hint?: string;
}

export interface ChartSpec {
  kind: "line" | "area" | "bar" | "hbar" | "stacked";
  title: string;
  description: string;
  data: Record<string, string | number>[];
  xKey: string;
  series: { key: string; name: string; color: string; dashed?: boolean }[];
  unit?: string;
  domain?: [number | "auto", number | "auto"];
}

export interface AskAnswer {
  question: string;
  headline: string;
  kpis: Kpi[];
  chart?: ChartSpec;
  findings: string[];
  nextAction?: {
    label: string;
    detail: string;
    to?: "/app/decisions" | "/app/actions" | "/app/risks" | "/app/sources" | "/app/overview";
  };
  table?: { columns: string[]; rows: string[][] };
  evidenceIds: string[];
  freshness: string;
  confidence: Confidence;
  insufficient?: boolean;
  missing?: string[];
}

export const SUGGESTED_QUESTIONS = [
  "What changed since yesterday?",
  "Why is gross margin falling?",
  "Which customers are at risk?",
  "What decisions need me today?",
  "Show our 12-week cash position.",
  "Where are delivery delays increasing?",
];

const has = (q: string, ...terms: string[]) => terms.some((t) => q.includes(t));
const C = {
  navy: "var(--navy)",
  signal: "var(--signal)",
  critical: "var(--critical)",
  caution: "var(--caution)",
  positive: "var(--positive)",
  muted: "var(--muted-foreground)",
};

export function ask(question: string, decisions: Decision[] = DECISIONS): AskAnswer {
  const q = question.trim().toLowerCase();
  const base = { question, freshness: FRESHNESS.lastSyncedAt };

  // 1 — What changed since yesterday
  if (has(q, "changed", "since yesterday", "brief", "overnight", "update")) {
    return {
      ...base,
      headline:
        "Five metrics moved overnight. Cash fell 4.6% and late jobs rose 9.1% — both are decision-relevant today.",
      kpis: [
        { label: "Cash", value: "£3.96m", delta: "−£220k WoW", tone: "bad" },
        { label: "Gross margin", value: "25.9%", delta: "−0.7pt", tone: "bad" },
        { label: "Late jobs", value: "48", delta: "+9.1%", tone: "bad" },
        { label: "Order intake", value: "£2.27m", delta: "+2.4%", tone: "good" },
      ],
      chart: {
        kind: "bar",
        title: "Movement since yesterday",
        description: "Percentage change by metric, sample dataset",
        data: DAILY_CHANGES,
        xKey: "metric",
        series: [{ key: "change", name: "Change %", color: C.signal }],
        unit: "%",
      },
      findings: [
        "Cash movement is driven by a £220k unplanned outflow ahead of an £860k supplier run.",
        "Late jobs concentrate in the South East region (17 of 48).",
        "Order intake improvement does not offset margin: pipeline cover is still 1.54× vs 2.0×.",
      ],
      nextAction: {
        label: "Resolve the supplier payment run decision",
        detail: "dec-01 closes in 4 days and cannot be amended after the batch releases.",
        to: "/app/decisions",
      },
      evidenceIds: ["ev-cash-01", "ev-cash-02", "ev-audit-01", "ev-margin-01"],
      confidence: "high",
    };
  }

  // 2 — Gross margin
  if (has(q, "margin", "gross profit", "profitability")) {
    return {
      ...base,
      headline:
        "Gross margin fell 5.5 points over twelve weeks. Three fixed-price contracts carry 71% of the decline.",
      kpis: [
        { label: "Margin now", value: "25.9%", delta: "−5.5pt vs W1", tone: "bad" },
        { label: "Target", value: "31.0%", delta: "5.1pt gap", tone: "bad" },
        { label: "Annualised GP at risk", value: "£1.3m", tone: "bad" },
        { label: "Cost coding complete", value: "88%", hint: "12% of W12 timesheets unapproved" },
      ],
      chart: {
        kind: "line",
        title: "Delivery gross margin vs target",
        description: "Weekly, Week 1 to Week 12",
        data: MARGIN_SERIES,
        xKey: "week",
        series: [
          { key: "margin", name: "Actual margin", color: C.critical },
          { key: "target", name: "Target", color: C.muted, dashed: true },
        ],
        unit: "%",
        domain: [24, 33],
      },
      table: {
        columns: ["Contract", "Points of decline", "Primary cause"],
        rows: MARGIN_BRIDGE.map((r) => [r.contract, `${r.points.toFixed(1)}pt`, r.cause]),
      },
      findings: [
        "Northgate alone accounts for 1.9 points, driven by unpriced scope growth.",
        "Decline steepens from Week 6, matching the subcontract rate uplift.",
        "Attribution is an inference on 88%-complete cost coding, so treat the split as indicative.",
      ],
      nextAction: {
        label: "Decide the commercial reset on the three contracts",
        detail: "dec-02 must land before the next milestone billing locks scope in 26 days.",
        to: "/app/decisions",
      },
      evidenceIds: ["ev-margin-01", "ev-margin-02"],
      confidence: "medium",
    };
  }

  // 3 — Customers at risk
  if (has(q, "customer", "account", "churn", "renewal", "northgate", "client")) {
    return {
      ...base,
      headline:
        "Northgate Facilities is the largest exposure: £2.4m of annual contract value renewing in 74 days after 14 severity-1 tickets.",
      kpis: [
        { label: "Accounts at risk", value: "3", delta: "+1 this week", tone: "bad" },
        { label: "Revenue exposed", value: "£5.8m", hint: "Northgate, Kestrel, Bexley" },
        { label: "Nearest renewal", value: "74 days", tone: "bad" },
        { label: "Sev-1 tickets, 21d", value: "27", delta: "+7.7%", tone: "bad" },
      ],
      chart: {
        kind: "hbar",
        title: "Revenue exposure by account",
        description: "Annual contract value, £m, top six accounts",
        data: CUSTOMER_EXPOSURE,
        xKey: "customer",
        series: [{ key: "acv", name: "Annual contract value (£m)", color: C.navy }],
        unit: "£m",
      },
      findings: [
        "Northgate is both a renewal risk and one of the three margin-eroding contracts.",
        "Kestrel Rail and Bexley Water together add £3.4m of exposure with rising ticket volume.",
        "Support desk data last synced yesterday at 22:15, so today's tickets are not included.",
      ],
      nextAction: {
        label: "Run the Northgate executive service review",
        detail: "act-04 is unstarted and due in 8 days; the renewal window opens in 14.",
        to: "/app/actions",
      },
      evidenceIds: ["ev-cust-01", "ev-cust-02", "ev-margin-02"],
      confidence: "high",
    };
  }

  // 4 — Decisions
  if (has(q, "decision", "approve", "need me", "waiting", "sign off", "sign-off")) {
    const open = decisions.filter((d) => d.status === "awaiting");
    return {
      ...base,
      headline: open.length
        ? `${open.length} decisions are waiting on you. The supplier payment run is the only one that expires this week.`
        : "No decisions are waiting on you. All open items are approved, deferred or awaiting clarification.",
      kpis: [
        { label: "Awaiting you", value: String(open.length), tone: open.length ? "bad" : "good" },
        { label: "Closest deadline", value: open[0]?.deadline ?? "—" },
        { label: "Value in play", value: "£2.5m", hint: "Sum of decision impact" },
        { label: "Cost of delay", value: "£25k/wk", hint: "Margin reset only" },
      ],
      chart: {
        kind: "bar",
        title: "Days remaining by decision",
        description: "Open decisions ranked by deadline",
        data: open.map((d) => ({
          decision: d.id.toUpperCase(),
          days: Number(d.deadline.replace(/\D/g, "")) || 0,
        })),
        xKey: "decision",
        series: [{ key: "days", name: "Days remaining", color: C.caution }],
        unit: " days",
      },
      table: {
        columns: ["Decision", "Owner", "Deadline"],
        rows: open.map((d) => [d.statement, d.owner, d.deadline]),
      },
      findings: open.slice(0, 3).map((d) => `${d.id.toUpperCase()}: ${d.whyNow}`),
      nextAction: {
        label: "Open the decisions queue",
        detail: "Approve, defer or request clarification — each writes to the audit trail.",
        to: "/app/decisions",
      },
      evidenceIds: open.flatMap((d) => d.evidenceIds).slice(0, 4),
      confidence: "high",
    };
  }

  // 5 — Cash
  if (has(q, "cash", "runway", "liquidity", "burn", "12-week", "12 week")) {
    return {
      ...base,
      headline:
        "Cash closed at £3.96m, down £220k on the week — the largest single-week fall in the twelve-week history.",
      kpis: [
        { label: "Closing cash", value: "£3.96m", delta: "−£220k WoW", tone: "bad" },
        { label: "Cover", value: "6.4 weeks", delta: "Board floor 6.0", tone: "bad" },
        { label: "Committed W13", value: "£860k", hint: "Supplier payment run" },
        { label: "Aged receivables", value: "£1.14m", hint: "9 accounts past 60 days" },
      ],
      chart: {
        kind: "area",
        title: "Cash and revenue, 12 weeks",
        description: "£m per week, sample ledger",
        data: CASH_SERIES,
        xKey: "week",
        series: [
          { key: "cash", name: "Closing cash (£m)", color: C.navy },
          { key: "revenue", name: "Weekly revenue (£m)", color: C.signal },
        ],
        unit: "£m",
      },
      findings: [
        "Average net movement over the last four weeks is −£220k per week.",
        "Paying the £860k run in full drops cover to about 5.3 weeks before receivables land.",
        "Two of the nine aged accounts carry disputed lines and may not collect in full.",
      ],
      nextAction: {
        label: "Stage the supplier payment run",
        detail: "Recommended option in dec-01 holds cover above the 6-week floor for about £7k.",
        to: "/app/decisions",
      },
      evidenceIds: ["ev-cash-01", "ev-cash-02", "ev-ar-01", "ev-audit-01"],
      confidence: "high",
    };
  }

  // 6 — Delivery delays
  if (has(q, "delay", "delivery", "late", "on time", "on-time", "schedule", "capacity", "region")) {
    return {
      ...base,
      headline:
        "Late jobs more than doubled in four weeks, from 22 to 48. The South East carries 17 of the current 48.",
      kpis: [
        { label: "Late jobs", value: "48", delta: "+118% vs W9", tone: "bad" },
        { label: "At risk", value: "24", delta: "+9 vs W9", tone: "bad" },
        { label: "Utilisation", value: "92%", hint: "148 field engineers" },
        { label: "Capacity gap", value: "9 engineers", hint: "Weeks 14–17" },
      ],
      chart: {
        kind: "stacked",
        title: "Delivery status by region",
        description: "Jobs completed, late and at risk, last four weeks",
        data: DELIVERY_BY_REGION,
        xKey: "region",
        series: [
          { key: "onTime", name: "On time", color: C.positive },
          { key: "late", name: "Late", color: C.critical },
          { key: "atRisk", name: "At risk", color: C.caution },
        ],
      },
      table: {
        columns: ["Week", "Late", "At risk"],
        rows: DELAY_TREND.map((d) => [d.week, String(d.late), String(d.atRisk)]),
      },
      findings: [
        "Utilisation at 92% leaves no absorption for the committed Week 14–17 schedule.",
        "South East delays overlap with the Northgate sites already at renewal risk.",
        "Two subcontract framework rates for Week 15 onwards are not loaded.",
      ],
      nextAction: {
        label: "Resolve the capacity decision",
        detail:
          "dec-03 needs 10 working days' notice for contract hire; Week 14 starts in 11 days.",
        to: "/app/decisions",
      },
      evidenceIds: ["ev-people-01", "ev-people-02"],
      confidence: "medium",
    };
  }

  // Risks
  if (has(q, "risk", "worst", "biggest", "exposure", "threat")) {
    const open = RISKS.filter((r) => r.state !== "resolved").sort(
      (a, b) => b.impactValue - a.impactValue,
    );
    const top = open[0];
    return {
      ...base,
      headline: top
        ? `The largest open exposure is ${top.title.toLowerCase()} at ${money(top.impactValue)}.`
        : "No open risks.",
      kpis: [
        { label: "Open risks", value: String(open.length), tone: "bad" },
        {
          label: "Critical",
          value: String(open.filter((r) => r.materiality === "critical").length),
        },
        { label: "Largest exposure", value: top ? money(top.impactValue) : "—" },
        { label: "Nearest horizon", value: top?.horizon ?? "—" },
      ],
      chart: {
        kind: "hbar",
        title: "Open risks by financial exposure",
        description: "£ value at risk",
        data: open.map((r) => ({ risk: r.title, value: Math.round(r.impactValue / 1000) })),
        xKey: "risk",
        series: [{ key: "value", name: "Exposure (£k)", color: C.critical }],
        unit: "£k",
      },
      findings: open.slice(0, 3).map((r) => `${r.title}: ${r.summary}`),
      nextAction: {
        label: "Review the risk register",
        detail: "Each risk links to its evidence and, where relevant, an open decision.",
        to: "/app/risks",
      },
      evidenceIds: top?.evidenceIds ?? [],
      confidence: "medium",
    };
  }

  // Pipeline
  if (has(q, "pipeline", "sales", "cover", "win rate", "bookings")) {
    return {
      ...base,
      headline: "Pipeline cover slipped to 1.54× against a 2.0× target, a fifth consecutive fall.",
      kpis: [
        { label: "Cover", value: "1.54×", delta: "−0.46 vs target", tone: "bad" },
        { label: "Weeks falling", value: "5", tone: "bad" },
        { label: "Stale close dates", value: "14", hint: "Older than 30 days" },
        { label: "Confidence", value: "Low", tone: "flat" },
      ],
      chart: {
        kind: "line",
        title: "Pipeline cover and utilisation",
        description: "Weekly, Week 1 to Week 12",
        data: CASH_SERIES.map((c, i) => ({
          week: c.week,
          cover: MARGIN_SERIES[i]?.margin ? (CASH_SERIES[i]?.revenue ?? 0) / 1.5 : 0,
        })),
        xKey: "week",
        series: [{ key: "cover", name: "Pipeline cover (×)", color: C.signal }],
        unit: "×",
      },
      findings: [
        "Cover below 1.8× has preceded a revenue miss two quarters out in this sample history.",
        "Fourteen opportunities have close dates older than 30 days, which lowers the weighting quality.",
      ],
      nextAction: {
        label: "Refresh the stale pipeline records",
        detail: "act-05 is unstarted and due in 5 days.",
        to: "/app/actions",
      },
      evidenceIds: ["ev-pipe-01"],
      confidence: "low",
    };
  }

  return {
    ...base,
    headline: "I don't have enough current evidence to answer that reliably.",
    insufficient: true,
    kpis: [],
    findings: [],
    evidenceIds: [],
    confidence: "low",
    missing: [
      "This demo workspace holds twelve weeks of fictional finance, revenue, customer, delivery and workforce records only.",
      "No connected source covers the subject of this question.",
      "Try rephrasing around cash, margin, customers, pipeline, delivery, capacity, risks or decisions.",
    ],
  };
}
