import { DECISIONS, FRESHNESS, METRICS, RISKS, SIGNALS, money, type Decision } from "./demo-data";

export interface AskAnswer {
  answer: string;
  impact?: string;
  detail?: string[];
  evidenceIds: string[];
  freshness: string;
  confidence: "high" | "medium" | "low";
  uncertainty?: string;
  insufficient?: boolean;
  missing?: string[];
}

export const SUGGESTED_QUESTIONS = [
  "What changed in cash this week?",
  "Which customer issue has the largest revenue exposure?",
  "What decisions are waiting for me?",
  "Why is delivery margin falling?",
  "What happens if we defer the hiring decision?",
];

const has = (q: string, ...terms: string[]) => terms.some((t) => q.includes(t));

export function ask(question: string, decisions: Decision[] = DECISIONS): AskAnswer {
  const q = question.trim().toLowerCase();
  const base = { freshness: FRESHNESS.lastSyncedAt };

  if (!q) {
    return {
      ...base,
      answer: "Ask a question about what changed, what is at risk, or what needs a decision.",
      evidenceIds: [],
      confidence: "high",
    };
  }

  if (has(q, "cash", "runway", "liquidity", "burn")) {
    const last = METRICS.cash.at(-1) ?? 0;
    const prev = METRICS.cash.at(-2) ?? 0;
    return {
      ...base,
      answer: `Cash closed at £${last.toFixed(2)}m, down £${Math.round((prev - last) * 1000)}k on the week — the largest single-week fall in the twelve-week history.`,
      impact:
        "£860k supplier payment run is committed next week; cover is 6.4 weeks against a 6-week board floor.",
      detail: [
        "Verified fact: closing balances reconciled across all accounts to Week 12.",
        "Calculated: four-week net movement of −£220k per week average.",
        "Recommendation: decision dec-01 stages the payment run and holds cover above the floor.",
      ],
      evidenceIds: ["ev-cash-01", "ev-cash-02", "ev-ar-01", "ev-audit-01"],
      confidence: "high",
      uncertainty:
        "Two of the nine aged receivable accounts carry disputed lines and may not collect in full.",
    };
  }

  if (has(q, "customer", "account", "churn", "renewal", "exposure", "northgate")) {
    return {
      ...base,
      answer:
        "Northgate Facilities carries the largest exposure: £2.4m of annual contract value with a renewal in 74 days, after 14 severity-1 tickets in 21 days.",
      impact:
        "£2.4m annual contract value, plus the account sits inside the fixed-price margin erosion.",
      detail: [
        "Verified fact: ticket counts and severity from the sample service desk export.",
        "Verified fact: contract value and renewal date from the sample CRM export.",
        "AI inference: the service pattern and the margin pattern share the same three contracts.",
      ],
      evidenceIds: ["ev-cust-01", "ev-cust-02", "ev-margin-02"],
      confidence: "high",
      uncertainty:
        "Service desk data was last synchronised yesterday at 22:15. Tickets raised since then are not included.",
    };
  }

  if (has(q, "decision", "waiting", "approve", "my desk")) {
    const awaiting = decisions.filter((d) => d.status === "awaiting");
    const first = awaiting[0];
    return {
      ...base,
      answer: first
        ? `${awaiting.length} decisions are waiting for you. The most urgent is due ${first.deadline.toLowerCase()}: ${first.statement}`
        : "No decisions are waiting for you. Everything raised has been approved, deferred, or sent back for clarification.",
      ...(first ? { impact: `Earliest deadline: ${first.deadline}.` } : {}),
      detail: awaiting.map((d) => `${d.deadline} · ${d.statement}`),
      evidenceIds: awaiting.flatMap((d) => d.evidenceIds).slice(0, 4),
      confidence: "high",
    };
  }

  if (has(q, "margin", "profit", "delivery", "contract")) {
    return {
      ...base,
      answer:
        "Delivery margin fell from 31.4% to 25.9% over twelve weeks, with the decline steepening from Week 6.",
      impact: "Roughly £1.3m of annualised gross profit at the current run rate.",
      detail: [
        "Calculated: weekly delivery revenue less direct labour and subcontract cost.",
        "AI inference: Northgate, Kestrel Rail and Bexley Water carry 71% of the decline.",
        "Recommendation: decision dec-02 re-baselines scope before the next milestone billing.",
      ],
      evidenceIds: ["ev-margin-01", "ev-margin-02"],
      confidence: "medium",
      uncertainty:
        "Attribution rests on cost coding that is 88% complete; 12% of Week 12 timesheets are unapproved.",
    };
  }

  if (
    has(
      q,
      "hiring",
      "hire",
      "capacity",
      "defer",
      "workforce",
      "engineer",
      "utilisation",
      "utilization",
    )
  ) {
    return {
      ...base,
      answer:
        "If the capacity decision is deferred past the 10-working-day notice window, contract hire is no longer available and the only remaining option is re-sequencing — including a Northgate site.",
      impact:
        "£310k of committed delivery at risk; re-sequencing adds pressure to a £2.4m renewal-risk account.",
      detail: [
        "Verified fact: billable utilisation at 92% across 148 field engineers.",
        "AI inference: a nine-engineer shortfall against the Week 14–17 committed schedule.",
        "Recommendation: decision dec-03 must be resolved within 11 days.",
      ],
      evidenceIds: ["ev-people-01", "ev-people-02", "ev-cust-02"],
      confidence: "medium",
      uncertainty:
        "Two subcontract framework rates for Week 15 onwards are not loaded, so cost estimates may move.",
    };
  }

  if (has(q, "risk", "worst", "biggest")) {
    const top = RISKS.filter((r) => r.state !== "resolved").sort(
      (a, b) => b.impactValue - a.impactValue,
    )[0];
    if (top) {
      return {
        ...base,
        answer: `The largest open exposure is: ${top.title}.`,
        impact: `${money(top.impactValue)} · ${top.horizon} · owner ${top.owner}`,
        detail: [top.summary, `Recommended response: ${top.response}`],
        evidenceIds: top.evidenceIds,
        confidence: "medium",
      };
    }
  }

  if (has(q, "pipeline", "sales", "revenue target", "cover")) {
    return {
      ...base,
      answer:
        "Pipeline cover slipped to 1.54× against a 2.0× target, falling for a fifth consecutive week.",
      impact: "Cover gap of 0.46× against the next-quarter target.",
      detail: [
        "Calculated: weighted qualified pipeline over the next-quarter target.",
        "Recommendation: refresh stale close dates before acting on this signal.",
      ],
      evidenceIds: ["ev-pipe-01"],
      confidence: "low",
      uncertainty:
        "Close dates on 14 opportunities are older than 30 days, which lowers confidence in the weighting.",
    };
  }

  if (has(q, "what changed", "brief", "today", "summary")) {
    const open = SIGNALS.filter((s) => s.state !== "resolved");
    return {
      ...base,
      answer: `${open.length} signals need attention today. Cash cover is the most urgent, followed by delivery margin and the Northgate renewal.`,
      detail: open.map((s) => `${s.headline} · ${s.impactLabel}`),
      evidenceIds: open.flatMap((s) => s.evidenceIds).slice(0, 5),
      confidence: "high",
    };
  }

  return {
    ...base,
    answer: "I don't have enough current evidence to answer that reliably.",
    insufficient: true,
    evidenceIds: [],
    confidence: "low",
    missing: [
      "This preview holds twelve weeks of sample finance, revenue, customer, delivery and workforce records only.",
      "No connected source covers the subject of this question.",
      "Safest next step: rephrase around cash, margin, customers, pipeline, capacity, risks or decisions — or load the relevant data in Connections.",
    ],
  };
}
