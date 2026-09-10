/**
 * Chart-ready datasets and simulated source records for the Bearing demo
 * workspace. All figures are fictional demo data for Harbourline Industrial
 * Services and are consistent with src/lib/demo-data.ts.
 */

import { METRICS, WEEKS } from "./demo-data";

export const CHART_COLORS = {
  navy: "var(--navy)",
  signal: "var(--signal)",
  critical: "var(--critical)",
  caution: "var(--caution)",
  positive: "var(--positive)",
  muted: "var(--muted-foreground)",
};

const shortWeek = (w: string) => w.replace("Week ", "W");

export const CASH_SERIES = WEEKS.map((w, i) => ({
  week: shortWeek(w),
  cash: METRICS.cash[i] ?? 0,
  revenue: METRICS.revenue[i] ?? 0,
}));

export const MARGIN_SERIES = WEEKS.map((w, i) => ({
  week: shortWeek(w),
  margin: METRICS.deliveryMargin[i] ?? 0,
  target: 31,
}));

export const UTILISATION_SERIES = WEEKS.map((w, i) => ({
  week: shortWeek(w),
  utilisation: METRICS.billableUtil[i] ?? 0,
  cover: METRICS.pipelineCover[i] ?? 0,
}));

/** Revenue exposure by customer account (annual contract value, £m). */
export const CUSTOMER_EXPOSURE = [
  { customer: "Meridian Rail", acv: 3.1, risk: 12, tickets: 2 },
  { customer: "Northgate Facilities", acv: 2.4, risk: 68, tickets: 14 },
  { customer: "Kestrel Rail", acv: 1.9, risk: 44, tickets: 6 },
  { customer: "Bexley Water", acv: 1.5, risk: 39, tickets: 5 },
  { customer: "Calder Energy", acv: 1.1, risk: 18, tickets: 1 },
  { customer: "Portway Logistics", acv: 0.8, risk: 9, tickets: 0 },
];

/** Gross-margin contribution by contract (points of the 5.5pt decline). */
export const MARGIN_BRIDGE = [
  { contract: "Northgate", points: -1.9, cause: "Unpriced scope growth" },
  { contract: "Kestrel Rail", points: -1.3, cause: "Subcontract rate uplift" },
  { contract: "Bexley Water", points: -0.7, cause: "Rework on two sites" },
  { contract: "Other fixed price", points: -0.9, cause: "Labour mix" },
  { contract: "Time & materials", points: -0.7, cause: "Travel recovery" },
];

/** Delivery performance by region, last four weeks. */
export const DELIVERY_BY_REGION = [
  { region: "North", onTime: 42, late: 11, atRisk: 6 },
  { region: "Midlands", onTime: 51, late: 6, atRisk: 3 },
  { region: "South East", onTime: 38, late: 17, atRisk: 9 },
  { region: "South West", onTime: 29, late: 5, atRisk: 2 },
  { region: "Scotland", onTime: 24, late: 9, atRisk: 4 },
];

/** Week-on-week late job trend (delays increasing). */
export const DELAY_TREND = [
  { week: "W9", late: 22, atRisk: 12 },
  { week: "W10", late: 27, atRisk: 15 },
  { week: "W11", late: 36, atRisk: 19 },
  { week: "W12", late: 48, atRisk: 24 },
];

/** Metric movement since yesterday. */
export const DAILY_CHANGES = [
  { metric: "Cash", change: -4.6, unit: "%" },
  { metric: "Order intake", change: 2.4, unit: "%" },
  { metric: "Gross margin", change: -2.6, unit: "%" },
  { metric: "Late jobs", change: 9.1, unit: "%" },
  { metric: "Open sev-1", change: 7.7, unit: "%" },
];

export type SourceHealth = "healthy" | "degraded" | "stale";

export interface DemoSource {
  id: string;
  name: string;
  system: string;
  category: "Finance" | "Revenue & customers" | "Service delivery" | "Support" | "Workforce";
  lastSync: string;
  records: number;
  scope: string;
  health: SourceHealth;
  note: string;
}

export const SOURCES: DemoSource[] = [
  {
    id: "src-finance",
    name: "Finance system",
    system: "Ledger, receivables and payables",
    category: "Finance",
    lastSync: "Today, 06:10",
    records: 48210,
    scope: "Read-only · balances, invoices, payment runs",
    health: "healthy",
    note: "Simulated connection · demo data",
  },
  {
    id: "src-crm",
    name: "CRM",
    system: "Accounts, opportunities and renewals",
    category: "Revenue & customers",
    lastSync: "Today, 04:55",
    records: 6412,
    scope: "Read-only · accounts, opportunities, contract values",
    health: "degraded",
    note: "Simulated connection · 14 opportunities have stale close dates",
  },
  {
    id: "src-delivery",
    name: "Service delivery",
    system: "Projects, cost coding and timesheets",
    category: "Service delivery",
    lastSync: "Today, 05:40",
    records: 91744,
    scope: "Read-only · job records, hours, cost codes",
    health: "healthy",
    note: "Simulated connection · demo data",
  },
  {
    id: "src-support",
    name: "Support desk",
    system: "Tickets and severity records",
    category: "Support",
    lastSync: "Yesterday, 22:15",
    records: 12980,
    scope: "Read-only · ticket metadata and severity, not message content",
    health: "stale",
    note: "Simulated connection · last sync more than 8 hours ago",
  },
  {
    id: "src-workforce",
    name: "Workforce planning",
    system: "Roster, availability and leave",
    category: "Workforce",
    lastSync: "Today, 05:40",
    records: 3120,
    scope: "Read-only · scheduled and available hours",
    health: "healthy",
    note: "Simulated connection · demo data",
  },
];
