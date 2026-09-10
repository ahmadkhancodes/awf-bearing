/**
 * Seeded sample organization for Bearing by AWF Consultants.
 * All figures below are fictional sample data for demonstration.
 */

export type Confidence = "high" | "medium" | "low";
export type Urgency = "today" | "this-week" | "this-month" | "monitor";
export type SignalDomain = "finance" | "revenue" | "customers" | "delivery" | "workforce";
export type EvidenceKind = "verified-fact" | "calculated" | "ai-inference" | "recommendation";

export interface EvidenceRecord {
  id: string;
  kind: EvidenceKind;
  sourceCategory: "Finance" | "Revenue & customers" | "Operations & delivery";
  sourceName: string;
  record: string;
  dateRange: string;
  lastSyncedAt: string;
  reasoning: string;
  confidence: Confidence;
  missingData?: string;
  qualityWarning?: string;
}

export interface Signal {
  id: string;
  domain: SignalDomain;
  headline: string;
  whatChanged: string;
  whyItMatters: string;
  impactLabel: string;
  impactValue: number;
  urgency: Urgency;
  confidence: Confidence;
  owner: string;
  recommendation: string;
  evidenceIds: string[];
  riskId?: string;
  decisionId?: string;
  state: "new" | "changed" | "resolved";
}

export interface Risk {
  id: string;
  title: string;
  domain: SignalDomain;
  summary: string;
  state: "new" | "changed" | "improving" | "stable" | "resolved";
  materiality: "critical" | "high" | "moderate" | "low";
  probability: number;
  impactValue: number;
  horizon: string;
  owner: string;
  response: string;
  evidenceIds: string[];
  decisionId?: string;
}

export interface DecisionOption {
  id: string;
  label: string;
  detail: string;
  tradeoff: string;
  expectedImpact: string;
  recommended?: boolean;
}

export interface Decision {
  id: string;
  statement: string;
  domain: SignalDomain;
  whyNow: string;
  context: string;
  options: DecisionOption[];
  costOfDelay: string;
  confidence: Confidence;
  owner: string;
  deadline: string;
  evidenceIds: string[];
  riskId?: string;
  status: "awaiting" | "approved" | "deferred" | "clarification";
}

export interface ActionItem {
  id: string;
  outcome: string;
  owner: string;
  due: string;
  status: "not-started" | "in-progress" | "blocked" | "done";
  priority: "high" | "medium" | "low";
  blocker?: string;
  riskId?: string;
  decisionId?: string;
  completionEvidence?: string;
}

export interface AuditEvent {
  id: string;
  at: string;
  actor: string;
  action: string;
  object: string;
  detail: string;
}

export interface ConnectionSource {
  id: string;
  name: string;
  category: "Finance" | "Revenue & customers" | "Operations & delivery";
  status:
    | "connected"
    | "needs-attention"
    | "synchronizing"
    | "read-only"
    | "permission-required"
    | "error"
    | "not-configured";
  detail: string;
  permission: string;
  lastSyncedAt?: string;
  live: boolean;
}

export const ORG = {
  name: "Harbourline Industrial Services",
  employees: 620,
  fiscalNote: "Sample company · 12 weeks of history",
  executive: { name: "Maya Ellison", role: "Chief Executive Officer" },
};

export const FRESHNESS = {
  lastSyncedAt: "Today, 06:10",
  staleSources: 1,
};

const wk = (n: number) => `Week ${n}`;

export const WEEKS = Array.from({ length: 12 }, (_, i) => wk(i + 1));

export const METRICS = {
  cash: [4.82, 4.79, 4.71, 4.66, 4.74, 4.68, 4.55, 4.49, 4.4, 4.31, 4.18, 3.96],
  revenue: [2.11, 2.15, 2.09, 2.2, 2.24, 2.18, 2.29, 2.31, 2.26, 2.34, 2.3, 2.27],
  deliveryMargin: [31.4, 31.1, 30.8, 30.9, 30.2, 29.6, 29.1, 28.7, 28.0, 27.4, 26.6, 25.9],
  pipelineCover: [1.9, 1.95, 1.88, 2.0, 2.05, 1.98, 1.92, 1.85, 1.78, 1.7, 1.62, 1.54],
  billableUtil: [78, 79, 80, 81, 83, 84, 86, 87, 89, 90, 91, 92],
};

export const EVIDENCE: EvidenceRecord[] = [
  {
    id: "ev-cash-01",
    kind: "verified-fact",
    sourceCategory: "Finance",
    sourceName: "Sample ledger export",
    record: "Consolidated cash position, all accounts",
    dateRange: "Week 1 – Week 12",
    lastSyncedAt: "Today, 06:10",
    reasoning: "Closing balances per weekly bank reconciliation in the sample ledger.",
    confidence: "high",
  },
  {
    id: "ev-cash-02",
    kind: "calculated",
    sourceCategory: "Finance",
    sourceName: "Sample ledger export",
    record: "Net cash movement, trailing 4 weeks",
    dateRange: "Week 9 – Week 12",
    lastSyncedAt: "Today, 06:10",
    reasoning: "Closing cash Week 12 minus Week 8, divided across four weekly periods.",
    confidence: "high",
  },
  {
    id: "ev-ar-01",
    kind: "verified-fact",
    sourceCategory: "Finance",
    sourceName: "Sample receivables ledger",
    record: "Aged receivables >60 days: £1.14m across 9 accounts",
    dateRange: "As at Week 12",
    lastSyncedAt: "Today, 06:10",
    reasoning: "Invoice-level ageing from the sample receivables ledger.",
    confidence: "high",
    qualityWarning: "Two accounts have disputed line items and may not collect in full.",
  },
  {
    id: "ev-margin-01",
    kind: "calculated",
    sourceCategory: "Operations & delivery",
    sourceName: "Sample delivery records",
    record: "Delivery gross margin by week",
    dateRange: "Week 1 – Week 12",
    lastSyncedAt: "Today, 05:40",
    reasoning:
      "Recognised delivery revenue less direct labour and subcontract cost, per project, aggregated weekly.",
    confidence: "high",
  },
  {
    id: "ev-margin-02",
    kind: "ai-inference",
    sourceCategory: "Operations & delivery",
    sourceName: "Sample delivery records",
    record: "Margin decline concentrated in 3 fixed-price contracts",
    dateRange: "Week 6 – Week 12",
    lastSyncedAt: "Today, 05:40",
    reasoning:
      "Contract-level margin variance ranked; Northgate, Kestrel Rail and Bexley Water account for 71% of the decline. Attribution is inferred from cost coding, which is 88% complete.",
    confidence: "medium",
    missingData: "12% of Week 12 timesheets are not yet approved.",
  },
  {
    id: "ev-pipe-01",
    kind: "calculated",
    sourceCategory: "Revenue & customers",
    sourceName: "Sample CRM export",
    record: "Qualified pipeline cover ratio vs. next-quarter target",
    dateRange: "Week 1 – Week 12",
    lastSyncedAt: "Today, 04:55",
    reasoning: "Weighted qualified pipeline divided by the next-quarter revenue target.",
    confidence: "medium",
    qualityWarning: "Close dates on 14 opportunities are older than 30 days.",
  },
  {
    id: "ev-cust-01",
    kind: "verified-fact",
    sourceCategory: "Revenue & customers",
    sourceName: "Sample service desk export",
    record: "Northgate Facilities: 14 severity-1 tickets, 21-day rolling",
    dateRange: "Week 10 – Week 12",
    lastSyncedAt: "Yesterday, 22:15",
    reasoning: "Ticket records tagged severity 1 for the Northgate account.",
    confidence: "high",
  },
  {
    id: "ev-cust-02",
    kind: "calculated",
    sourceCategory: "Revenue & customers",
    sourceName: "Sample CRM export",
    record: "Northgate annual contract value: £2.4m, renewal in 74 days",
    dateRange: "As at Week 12",
    lastSyncedAt: "Today, 04:55",
    reasoning: "Contract value and renewal date from the sample CRM account record.",
    confidence: "high",
  },
  {
    id: "ev-people-01",
    kind: "verified-fact",
    sourceCategory: "Operations & delivery",
    sourceName: "Sample workforce roster",
    record: "Billable utilisation 92% across 148 field engineers",
    dateRange: "Week 12",
    lastSyncedAt: "Today, 05:40",
    reasoning: "Scheduled billable hours divided by available hours from the sample roster.",
    confidence: "high",
  },
  {
    id: "ev-people-02",
    kind: "ai-inference",
    sourceCategory: "Operations & delivery",
    sourceName: "Sample workforce roster",
    record: "Capacity shortfall of ~9 engineers against committed Week 14–17 schedule",
    dateRange: "Week 13 – Week 17",
    lastSyncedAt: "Today, 05:40",
    reasoning:
      "Committed schedule hours compared with available capacity after planned leave. Assumes current attrition rate holds.",
    confidence: "medium",
    missingData: "Two subcontract framework rates for Week 15 onwards are not loaded.",
  },
  {
    id: "ev-audit-01",
    kind: "verified-fact",
    sourceCategory: "Finance",
    sourceName: "Sample ledger export",
    record: "Supplier payment run scheduled Week 13: £860k",
    dateRange: "Week 13",
    lastSyncedAt: "Today, 06:10",
    reasoning: "Scheduled payments in the sample accounts-payable batch.",
    confidence: "high",
  },
];

export const SIGNALS: Signal[] = [
  {
    id: "sig-01",
    domain: "finance",
    headline: "Cash cover fell to 6.4 weeks after a £220k unplanned outflow",
    whatChanged:
      "Closing cash dropped from £4.18m to £3.96m in the last week — the largest single-week fall in the twelve-week history.",
    whyItMatters:
      "A £860k supplier payment run is scheduled for next week. At the current burn, cover falls below the 6-week board floor.",
    impactLabel: "£220k weekly outflow · £860k committed next week",
    impactValue: 860000,
    urgency: "today",
    confidence: "high",
    owner: "Priya Raman, CFO",
    recommendation:
      "Decide whether to stage the supplier run and accelerate the aged receivables push.",
    evidenceIds: ["ev-cash-01", "ev-cash-02", "ev-ar-01", "ev-audit-01"],
    riskId: "risk-01",
    decisionId: "dec-01",
    state: "changed",
  },
  {
    id: "sig-02",
    domain: "delivery",
    headline: "Delivery margin has fallen 5.5 points across twelve weeks",
    whatChanged:
      "Weekly delivery gross margin moved from 31.4% to 25.9%, with the decline steepening from Week 6.",
    whyItMatters:
      "Three fixed-price contracts carry 71% of the erosion. At the current run rate this is roughly £1.3m of annualised gross profit.",
    impactLabel: "≈ £1.3m annualised gross profit",
    impactValue: 1300000,
    urgency: "this-week",
    confidence: "medium",
    owner: "Tomas Lind, COO",
    recommendation:
      "Approve a commercial reset on the three contracts before the next milestone billing.",
    evidenceIds: ["ev-margin-01", "ev-margin-02"],
    riskId: "risk-02",
    decisionId: "dec-02",
    state: "changed",
  },
  {
    id: "sig-03",
    domain: "customers",
    headline: "Northgate Facilities is at renewal risk with £2.4m exposed",
    whatChanged:
      "Fourteen severity-1 tickets in 21 days against an account that renews in 74 days.",
    whyItMatters:
      "Northgate is the second-largest account and also one of the three contracts driving the margin decline.",
    impactLabel: "£2.4m annual contract value at renewal",
    impactValue: 2400000,
    urgency: "this-week",
    confidence: "high",
    owner: "Alina Novak, Client Director",
    recommendation: "Run an executive service review before the commercial reset conversation.",
    evidenceIds: ["ev-cust-01", "ev-cust-02"],
    riskId: "risk-03",
    state: "new",
  },
  {
    id: "sig-04",
    domain: "workforce",
    headline: "Field capacity is 9 engineers short of the committed Week 14–17 schedule",
    whatChanged:
      "Billable utilisation reached 92%, leaving no absorption for the committed schedule.",
    whyItMatters:
      "Missed committed dates carry service credits and worsen the accounts already at renewal risk.",
    impactLabel: "≈ £310k of at-risk committed delivery",
    impactValue: 310000,
    urgency: "this-month",
    confidence: "medium",
    owner: "Tomas Lind, COO",
    recommendation: "Choose between contract hire and schedule re-sequencing before Week 14.",
    evidenceIds: ["ev-people-01", "ev-people-02"],
    riskId: "risk-04",
    decisionId: "dec-03",
    state: "new",
  },
  {
    id: "sig-05",
    domain: "revenue",
    headline: "Pipeline cover slipped to 1.54× against a 2.0× target",
    whatChanged: "Weighted qualified pipeline fell for the fifth consecutive week.",
    whyItMatters:
      "Cover below 1.8× has historically preceded a revenue miss two quarters out in this sample history.",
    impactLabel: "Next-quarter target cover gap of 0.46×",
    impactValue: 0,
    urgency: "monitor",
    confidence: "low",
    owner: "Alina Novak, Client Director",
    recommendation:
      "No decision required this week. Refresh stale close dates before acting on this signal.",
    evidenceIds: ["ev-pipe-01"],
    riskId: "risk-05",
    state: "new",
  },
  {
    id: "sig-06",
    domain: "finance",
    headline: "Resolved: duplicate subcontractor invoicing corrected",
    whatChanged:
      "£64k of duplicate subcontract invoices identified in Week 9 were credited in Week 11.",
    whyItMatters: "Closed. No further executive attention required.",
    impactLabel: "£64k recovered",
    impactValue: 64000,
    urgency: "monitor",
    confidence: "high",
    owner: "Priya Raman, CFO",
    recommendation: "No action. Retained for audit history.",
    evidenceIds: ["ev-cash-01"],
    state: "resolved",
  },
];

export const RISKS: Risk[] = [
  {
    id: "risk-01",
    title: "Cash cover falls below the 6-week board floor",
    domain: "finance",
    summary:
      "Twelve-week cash trend is negative and accelerating, with £860k of committed supplier payments next week and £1.14m of receivables past 60 days.",
    state: "changed",
    materiality: "critical",
    probability: 0.7,
    impactValue: 860000,
    horizon: "Next 7 days",
    owner: "Priya Raman, CFO",
    response: "Stage the supplier payment run and escalate the nine aged receivable accounts.",
    evidenceIds: ["ev-cash-01", "ev-cash-02", "ev-ar-01", "ev-audit-01"],
    decisionId: "dec-01",
  },
  {
    id: "risk-02",
    title: "Fixed-price contract margin erosion",
    domain: "delivery",
    summary:
      "Three fixed-price contracts are consuming labour above the priced assumption, driving a 5.5-point margin decline.",
    state: "changed",
    materiality: "high",
    probability: 0.65,
    impactValue: 1300000,
    horizon: "Next 2 quarters",
    owner: "Tomas Lind, COO",
    response: "Commercial reset with scope re-baselining before the next milestone billing.",
    evidenceIds: ["ev-margin-01", "ev-margin-02"],
    decisionId: "dec-02",
  },
  {
    id: "risk-03",
    title: "Northgate Facilities renewal loss",
    domain: "customers",
    summary: "Service failures on the second-largest account 74 days before renewal.",
    state: "new",
    materiality: "high",
    probability: 0.4,
    impactValue: 2400000,
    horizon: "74 days",
    owner: "Alina Novak, Client Director",
    response: "Executive service review, then a joint remediation plan with named owners.",
    evidenceIds: ["ev-cust-01", "ev-cust-02"],
  },
  {
    id: "risk-04",
    title: "Committed delivery schedule exceeds field capacity",
    domain: "workforce",
    summary:
      "Nine-engineer shortfall against the Week 14–17 committed schedule at 92% utilisation.",
    state: "new",
    materiality: "moderate",
    probability: 0.55,
    impactValue: 310000,
    horizon: "Weeks 14–17",
    owner: "Tomas Lind, COO",
    response: "Approve contract hire or re-sequence two non-penalty schedules.",
    evidenceIds: ["ev-people-01", "ev-people-02"],
    decisionId: "dec-03",
  },
  {
    id: "risk-05",
    title: "Next-quarter pipeline cover shortfall",
    domain: "revenue",
    summary: "Cover at 1.54× against a 2.0× target, with stale close dates reducing confidence.",
    state: "changed",
    materiality: "moderate",
    probability: 0.35,
    impactValue: 0,
    horizon: "Next quarter",
    owner: "Alina Novak, Client Director",
    response: "Refresh close dates on 14 opportunities before committing to a response.",
    evidenceIds: ["ev-pipe-01"],
  },
  {
    id: "risk-06",
    title: "Duplicate subcontract invoicing",
    domain: "finance",
    summary:
      "Duplicate invoices identified and credited. Control added to the weekly payment review.",
    state: "resolved",
    materiality: "low",
    probability: 0.05,
    impactValue: 64000,
    horizon: "Closed Week 11",
    owner: "Priya Raman, CFO",
    response: "Closed. Control in place.",
    evidenceIds: ["ev-cash-01"],
  },
];

export const DECISIONS: Decision[] = [
  {
    id: "dec-01",
    statement: "Stage next week's £860k supplier payment run, or pay in full as scheduled?",
    domain: "finance",
    whyNow: "The payment batch releases in 4 days and cannot be amended after release.",
    context:
      "Cash closed at £3.96m, down £220k week-on-week. Cover is 6.4 weeks against a 6-week board floor. £1.14m of receivables sit past 60 days, two with disputed lines.",
    options: [
      {
        id: "opt-01a",
        label: "Stage the run over two weeks",
        detail:
          "Release £520k now, £340k in Week 14, prioritising suppliers with delivery dependency.",
        tradeoff: "Two suppliers move outside agreed terms; one has a 2% late fee.",
        expectedImpact: "Holds cover above 6 weeks. Est. cost £7k in fees and goodwill.",
        recommended: true,
      },
      {
        id: "opt-01b",
        label: "Pay in full as scheduled",
        detail: "Release the full £860k on the original date.",
        tradeoff: "Cover drops to approximately 5.3 weeks before receivables land.",
        expectedImpact:
          "No supplier friction. Breaches the board cover floor for at least two weeks.",
      },
      {
        id: "opt-01c",
        label: "Pay in full and draw £500k on the facility",
        detail: "Use the committed facility to protect cover.",
        tradeoff: "Interest cost and a covenant conversation at the next review.",
        expectedImpact: "Cover held. Est. cost £11k interest over the quarter.",
      },
    ],
    costOfDelay:
      "After the batch releases, staging is no longer possible and the only lever is the facility draw.",
    confidence: "high",
    owner: "Maya Ellison, CEO",
    deadline: "In 4 days",
    evidenceIds: ["ev-cash-01", "ev-cash-02", "ev-ar-01", "ev-audit-01"],
    riskId: "risk-01",
    status: "awaiting",
  },
  {
    id: "dec-02",
    statement: "Reset commercial terms on the three loss-making fixed-price contracts?",
    domain: "delivery",
    whyNow:
      "The next milestone billing locks scope on 26 days' notice; after that, re-baselining costs a variation claim.",
    context:
      "Northgate, Kestrel Rail and Bexley Water account for 71% of a 5.5-point margin decline. Attribution is based on 88% complete cost coding.",
    options: [
      {
        id: "opt-02a",
        label: "Re-baseline scope on all three",
        detail: "Formal scope re-statement with revised rates from the next milestone.",
        tradeoff: "Northgate is already at renewal risk; opening commercial terms adds pressure.",
        expectedImpact: "Recovers an estimated £0.9m annualised gross profit.",
        recommended: true,
      },
      {
        id: "opt-02b",
        label: "Reset Kestrel and Bexley only",
        detail: "Hold Northgate terms until the renewal is secured.",
        tradeoff: "Leaves roughly a third of the erosion in place for two quarters.",
        expectedImpact:
          "Recovers an estimated £0.55m annualised. Protects the renewal conversation.",
      },
      {
        id: "opt-02c",
        label: "Hold and complete cost coding first",
        detail: "Wait for 100% timesheet approval before opening any commercial conversation.",
        tradeoff: "Misses the milestone window; re-baselining then requires a variation claim.",
        expectedImpact: "Higher confidence, materially lower recovery.",
      },
    ],
    costOfDelay: "Each week of delay leaves approximately £25k of gross profit unrecovered.",
    confidence: "medium",
    owner: "Maya Ellison, CEO",
    deadline: "In 12 days",
    evidenceIds: ["ev-margin-01", "ev-margin-02", "ev-cust-02"],
    riskId: "risk-02",
    status: "awaiting",
  },
  {
    id: "dec-03",
    statement:
      "Cover the Week 14–17 capacity shortfall with contract hire, or re-sequence the schedule?",
    domain: "workforce",
    whyNow: "Contract engineers need 10 working days' notice; Week 14 starts in 11 days.",
    context:
      "Nine-engineer shortfall at 92% utilisation. Two of the affected schedules carry no service credits if moved.",
    options: [
      {
        id: "opt-03a",
        label: "Contract hire for nine engineers",
        detail: "Four-week engagement through the existing framework.",
        tradeoff: "Adds direct cost at a moment when cash cover is already tight.",
        expectedImpact: "Protects £310k of committed delivery. Est. cost £148k.",
      },
      {
        id: "opt-03b",
        label: "Re-sequence the two non-penalty schedules",
        detail: "Move two schedules into Week 18–19 and hold current headcount.",
        tradeoff: "Customer goodwill cost; one is a Northgate site.",
        expectedImpact: "No incremental cash cost. Adds pressure to a renewal-risk account.",
        recommended: true,
      },
      {
        id: "opt-03c",
        label: "Split: hire four, re-sequence one",
        detail: "Partial cover avoiding the Northgate site.",
        tradeoff: "Coordination overhead across two schedules.",
        expectedImpact: "Protects £240k. Est. cost £66k.",
      },
    ],
    costOfDelay:
      "Past the notice window the only remaining option is re-sequencing, including the Northgate site.",
    confidence: "medium",
    owner: "Tomas Lind, COO",
    deadline: "In 11 days",
    evidenceIds: ["ev-people-01", "ev-people-02"],
    riskId: "risk-04",
    status: "awaiting",
  },
  {
    id: "dec-04",
    statement: "Approve the Northgate executive service review plan?",
    domain: "customers",
    whyNow: "Renewal is in 74 days and the client has requested an executive response.",
    context: "Fourteen severity-1 tickets in 21 days on a £2.4m account.",
    options: [
      {
        id: "opt-04a",
        label: "Approve the review plan as drafted",
        detail: "CEO-attended review within 10 days, joint remediation plan with named owners.",
        tradeoff: "Executive time and a visible commitment to remediation milestones.",
        expectedImpact: "Materially improves renewal probability on the sample history.",
        recommended: true,
      },
      {
        id: "opt-04b",
        label: "Delegate to the Client Director",
        detail: "Account-level review without executive attendance.",
        tradeoff: "Lower signal to the client at a renewal-critical moment.",
        expectedImpact: "Lower cost, lower effect.",
      },
    ],
    costOfDelay: "Renewal conversations typically begin 60 days out; the window closes in 14 days.",
    confidence: "high",
    owner: "Maya Ellison, CEO",
    deadline: "In 6 days",
    evidenceIds: ["ev-cust-01", "ev-cust-02"],
    riskId: "risk-03",
    status: "approved",
  },
];

export const ACTIONS: ActionItem[] = [
  {
    id: "act-01",
    outcome: "Collect or agree payment plans on the nine receivable accounts past 60 days",
    owner: "Priya Raman, CFO",
    due: "In 6 days",
    status: "in-progress",
    priority: "high",
    riskId: "risk-01",
    decisionId: "dec-01",
  },
  {
    id: "act-02",
    outcome: "Produce contract-level margin bridge for Northgate, Kestrel Rail and Bexley Water",
    owner: "Tomas Lind, COO",
    due: "In 3 days",
    status: "in-progress",
    priority: "high",
    riskId: "risk-02",
  },
  {
    id: "act-03",
    outcome: "Close out the 12% of unapproved Week 12 timesheets",
    owner: "Dana Okoye, Delivery Ops",
    due: "In 2 days",
    status: "blocked",
    priority: "medium",
    blocker: "Two regional managers are on leave until Week 13.",
    riskId: "risk-02",
  },
  {
    id: "act-04",
    outcome: "Schedule the Northgate executive service review with named remediation owners",
    owner: "Alina Novak, Client Director",
    due: "In 8 days",
    status: "not-started",
    priority: "high",
    riskId: "risk-03",
    decisionId: "dec-04",
  },
  {
    id: "act-05",
    outcome: "Refresh close dates on the 14 stale pipeline opportunities",
    owner: "Alina Novak, Client Director",
    due: "In 5 days",
    status: "not-started",
    priority: "medium",
    riskId: "risk-05",
  },
  {
    id: "act-06",
    outcome: "Add duplicate-invoice control to the weekly payment review",
    owner: "Priya Raman, CFO",
    due: "Completed Week 11",
    status: "done",
    priority: "low",
    riskId: "risk-06",
    completionEvidence: "Control added to the payment review checklist; £64k credited.",
  },
];

export const AUDIT_SEED: AuditEvent[] = [
  {
    id: "aud-seed-04",
    at: "Today, 06:12",
    actor: "Bearing",
    action: "Briefing generated",
    object: "Today briefing",
    detail: "5 signals ranked from 11 candidates. 1 source stale at generation time.",
  },
  {
    id: "aud-seed-03",
    at: "Yesterday, 17:40",
    actor: "Maya Ellison, CEO",
    action: "Decision approved",
    object: "dec-04 · Northgate executive service review",
    detail: "Option: Approve the review plan as drafted.",
  },
  {
    id: "aud-seed-02",
    at: "Week 11, 09:05",
    actor: "Priya Raman, CFO",
    action: "Risk resolved",
    object: "risk-06 · Duplicate subcontract invoicing",
    detail: "£64k credited; control added to weekly payment review.",
  },
  {
    id: "aud-seed-01",
    at: "Week 10, 11:22",
    actor: "Administrator",
    action: "Sample data loaded",
    object: "Harbourline Industrial Services",
    detail: "12 weeks of sample finance, revenue and delivery history loaded in read-only mode.",
  },
];

export const CONNECTIONS: ConnectionSource[] = [
  {
    id: "con-01",
    name: "Sample ledger export",
    category: "Finance",
    status: "connected",
    detail: "Loaded from the sample company dataset. Cash, receivables and payables.",
    permission:
      "Read-only. Bearing reads balances and invoice records. It cannot post entries or move money.",
    lastSyncedAt: "Today, 06:10",
    live: true,
  },
  {
    id: "con-02",
    name: "CSV import",
    category: "Finance",
    status: "not-configured",
    detail: "Upload a finance CSV to replace or extend the sample ledger.",
    permission:
      "Read-only. Files are parsed in your browser in this preview and never leave the device.",
    live: true,
  },
  {
    id: "con-03",
    name: "Sample CRM export",
    category: "Revenue & customers",
    status: "connected",
    detail: "Accounts, opportunities, contract values and renewal dates.",
    permission: "Read-only. Bearing reads account and opportunity records. It cannot edit records.",
    lastSyncedAt: "Today, 04:55",
    live: true,
  },
  {
    id: "con-04",
    name: "Sample service desk export",
    category: "Revenue & customers",
    status: "needs-attention",
    detail:
      "Last synchronisation completed yesterday at 22:15. Records after that time are not included.",
    permission:
      "Read-only. Bearing reads ticket metadata and severity, not ticket message content.",
    lastSyncedAt: "Yesterday, 22:15",
    live: true,
  },
  {
    id: "con-05",
    name: "Sample delivery & workforce records",
    category: "Operations & delivery",
    status: "read-only",
    detail: "Project cost coding, timesheets and the field roster.",
    permission: "Read-only. Bearing reads hours and cost codes. It cannot approve timesheets.",
    lastSyncedAt: "Today, 05:40",
    live: true,
  },
  {
    id: "con-06",
    name: "Finance system connector",
    category: "Finance",
    status: "permission-required",
    detail: "Planned. Not implemented in this preview — no live connection exists.",
    permission: "Would require read-only ledger scope, granted by an administrator.",
    live: false,
  },
  {
    id: "con-07",
    name: "CRM connector",
    category: "Revenue & customers",
    status: "not-configured",
    detail: "Planned. Not implemented in this preview — no live connection exists.",
    permission: "Would require read-only account and opportunity scope.",
    live: false,
  },
  {
    id: "con-08",
    name: "Service management connector",
    category: "Operations & delivery",
    status: "not-configured",
    detail: "Planned. Not implemented in this preview — no live connection exists.",
    permission: "Would require read-only ticket metadata scope.",
    live: false,
  },
];

export const evidenceById = (id: string) => EVIDENCE.find((e) => e.id === id);
export const riskById = (id?: string) => (id ? RISKS.find((r) => r.id === id) : undefined);
export const decisionById = (id?: string) => (id ? DECISIONS.find((d) => d.id === id) : undefined);

export const money = (n: number) =>
  n >= 1_000_000
    ? `£${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m`
    : `£${Math.round(n / 1000)}k`;
