import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { ProductLogo } from "@/components/brand";
import { MonoLabel } from "@/components/ui-kit";
import { ORG } from "@/lib/demo-data";
import { ROLE_LABEL, useWorkspace, type Role } from "@/lib/workspace";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your briefing — Bearing by AWF Consultants" },
      {
        name: "description",
        content:
          "A three-minute setup: choose your role, set priorities, load the sample company, and generate your first executive briefing.",
      },
      { property: "og:title", content: "Set up your briefing — Bearing" },
      {
        property: "og:description",
        content: "Generate your first executive briefing in under three minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Onboarding,
});

const ROLES: Role[] = ["executive", "operator", "advisor", "administrator"];
const PRIORITIES = [
  "Cash and liquidity",
  "Margin and profitability",
  "Customer retention",
  "Delivery performance",
  "Capacity and hiring",
  "Pipeline and growth",
];

const STEPS = ["Welcome", "Role", "Priorities", "Data", "Permissions", "Briefing"];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role>("executive");
  const [name, setName] = useState(ORG.executive.name);
  const [picked, setPicked] = useState<string[]>([
    "Cash and liquidity",
    "Margin and profitability",
  ]);
  const [generating, setGenerating] = useState(false);
  const { signIn, log } = useWorkspace();
  const navigate = useNavigate();

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const finish = () => {
    setGenerating(true);
    signIn({ name: name.trim() || ORG.executive.name, role, priorities: picked, onboarded: true });
    window.setTimeout(() => {
      log(
        "Briefing generated",
        "Today briefing",
        `Priorities: ${picked.join(", ") || "none selected"}.`,
      );
      void navigate({ to: "/app/today" });
    }, 900);
  };

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-rule">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <ProductLogo />
          <MonoLabel>
            Step {step + 1} of {STEPS.length}
          </MonoLabel>
        </div>
        <ol className="mx-auto flex max-w-3xl gap-px px-4 pb-4 sm:px-6" aria-label="Setup progress">
          {STEPS.map((s, i) => (
            <li key={s} className="flex-1">
              <span className="sr-only">
                {s} {i < step ? "completed" : i === step ? "current" : "upcoming"}
              </span>
              <span
                aria-hidden="true"
                className={cn("block h-1", i <= step ? "bg-navy" : "bg-rule")}
              />
            </li>
          ))}
        </ol>
      </header>

      <main id="main" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {step === 0 ? (
          <Section
            eyebrow="Welcome"
            title="One reliable view of what changed in your business"
            body="Bearing reads your operational records and produces a daily executive briefing: material changes, ranked risks, the decisions waiting for you, and who owns the next step. Every statement can show its evidence."
          >
            <Primary onClick={next}>Begin setup</Primary>
          </Section>
        ) : null}

        {step === 1 ? (
          <Section
            eyebrow="Your role"
            title="How will you use Bearing?"
            body="Role determines what you can approve. Executives approve decisions; advisors review evidence; administrators manage access."
          >
            <div className="mb-6">
              <label htmlFor="ob-name" className="label-mono text-foreground">
                Your name
              </label>
              <input
                id="ob-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 min-h-11 w-full border border-rule px-3 text-[15px] outline-none focus-visible:border-navy"
              />
            </div>
            <fieldset>
              <legend className="label-mono text-foreground">Executive role</legend>
              <div className="mt-3 grid gap-px border border-rule bg-rule">
                {ROLES.map((r) => (
                  <label
                    key={r}
                    className="flex min-h-11 cursor-pointer items-center gap-3 bg-card px-4 py-3 text-[15px] has-[:checked]:bg-muted"
                  >
                    <input
                      type="radio"
                      name="ob-role"
                      checked={role === r}
                      onChange={() => setRole(r)}
                      className="size-4 accent-[var(--navy)]"
                    />
                    {ROLE_LABEL[r]}
                  </label>
                ))}
              </div>
            </fieldset>
            <Nav onBack={back} onNext={next} />
          </Section>
        ) : null}

        {step === 2 ? (
          <Section
            eyebrow="Priorities"
            title="What should the briefing lead with?"
            body="Bearing ranks signals by money and time, then weights toward what you care about most. You can change this later in Settings."
          >
            <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
              {PRIORITIES.map((p) => {
                const on = picked.includes(p);
                return (
                  <label
                    key={p}
                    className="flex min-h-11 cursor-pointer items-center gap-3 bg-card px-4 py-3 text-[15px] has-[:checked]:bg-muted"
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() =>
                        setPicked((prev) => (on ? prev.filter((x) => x !== p) : [...prev, p]))
                      }
                      className="size-4 accent-[var(--navy)]"
                    />
                    {p}
                  </label>
                );
              })}
            </div>
            {picked.length === 0 ? (
              <p className="mt-3 text-[14px] text-caution">
                Nothing selected. Bearing will rank purely by materiality and urgency.
              </p>
            ) : null}
            <Nav onBack={back} onNext={next} />
          </Section>
        ) : null}

        {step === 3 ? (
          <Section
            eyebrow="Your data"
            title="Start with the sample company"
            body={`${ORG.name} is a fictional ${ORG.employees}-person industrial services business with twelve weeks of finance, revenue, customer, delivery and workforce history. Everything you see is labelled as sample data.`}
          >
            <div className="border border-rule">
              <div className="border-b border-rule bg-muted px-4 py-2.5">
                <MonoLabel>Loaded now</MonoLabel>
              </div>
              <ul className="divide-y divide-rule text-[15px]">
                {[
                  "Sample ledger export — cash, receivables, payables",
                  "Sample CRM export — accounts, opportunities, renewals",
                  "Sample service desk export — ticket severity and volume",
                  "Sample delivery & workforce records — cost coding, roster",
                ].map((s) => (
                  <li key={s} className="flex items-center gap-3 px-4 py-3">
                    <Check className="size-4 text-positive" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-3 text-[14px] text-muted-foreground">
              You can add a CSV import or replace the sample data later from Connections. No live
              third-party integration is connected in this preview.
            </p>
            <Nav onBack={back} onNext={next} />
          </Section>
        ) : null}

        {step === 4 ? (
          <Section
            eyebrow="Permissions"
            title="Bearing reads. It does not act."
            body="Connections are read-only by default. Bearing can read balances, invoices, accounts, tickets, hours and cost codes. It cannot post entries, move money, edit records or approve timesheets."
          >
            <ul className="grid gap-px border border-rule bg-rule text-[15px]">
              {[
                "Recommendations always require a person to approve them.",
                "Approvals, deferrals and assignments are written to an audit record.",
                "Your data is scoped to your organisation and never used to answer another organisation's question.",
              ].map((p) => (
                <li key={p} className="bg-card px-4 py-3">
                  {p}
                </li>
              ))}
            </ul>
            <Nav onBack={back} onNext={next} nextLabel="I understand" />
          </Section>
        ) : null}

        {step === 5 ? (
          <Section
            eyebrow="Ready"
            title="Generate your first briefing"
            body="Bearing will rank the material changes from the last twelve weeks and open on Today."
          >
            <Primary onClick={finish} disabled={generating}>
              {generating ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Generating
                  briefing…
                </span>
              ) : (
                "Generate briefing"
              )}
            </Primary>
            <button
              type="button"
              onClick={back}
              className="label-mono ml-3 min-h-11 border border-rule px-4 hover:border-navy hover:bg-muted"
            >
              Back
            </button>
          </Section>
        ) : null}
      </main>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <MonoLabel>{eyebrow}</MonoLabel>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-[16px] text-muted-foreground">{body}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Primary({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="label-mono min-h-11 border border-navy bg-navy px-5 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function Nav({
  onBack,
  onNext,
  nextLabel = "Continue",
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="mt-8 flex gap-3">
      <button
        type="button"
        onClick={onBack}
        className="label-mono min-h-11 border border-rule px-4 hover:border-navy hover:bg-muted"
      >
        Back
      </button>
      <Primary onClick={onNext}>{nextLabel}</Primary>
    </div>
  );
}
