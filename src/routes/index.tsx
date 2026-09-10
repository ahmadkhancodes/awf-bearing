import { createFileRoute, Link } from "@tanstack/react-router";
import { SitePage } from "@/components/site-chrome";
import { MonoLabel, Panel, StatePill } from "@/components/ui-kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bearing by AWF Consulting — executive operations intelligence" },
      {
        name: "description",
        content:
          "Bearing compresses the operational review into a one-minute executive briefing: what changed, what it costs, what needs your decision, and who owns the next step.",
      },
      { property: "og:title", content: "Bearing by AWF Consulting" },
      {
        property: "og:description",
        content:
          "An executive operations platform for mid-market companies. Material changes, ranked risks, decision briefs, evidence on demand.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://awf-bearing.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Bearing",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          publisher: { "@type": "Organization", name: "AWF Consulting" },
          description:
            "Executive operations platform that turns fragmented operational data into material changes, ranked risks, decisions and assigned follow-through.",
        }),
      },
    ],
  }),
  component: Landing,
});

const LOOP = [
  {
    k: "01",
    t: "Change",
    d: "Material movement across finance, revenue, customers, delivery and workforce.",
  },
  { k: "02", t: "Risk", d: "Ranked by money at stake and time remaining, not by alert volume." },
  { k: "03", t: "Decision", d: "Options, trade-offs, cost of delay, and a recommended course." },
  { k: "04", t: "Action", d: "One owner, one date, one outcome — traced back to the decision." },
];

function Landing() {
  return (
    <SitePage>
      <section className="border-b border-rule">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <MonoLabel>Executive operations platform</MonoLabel>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] sm:text-6xl">
            Understand what changed. See what matters. Make the decision.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Bearing gives the chief executive of a mid-market company one reliable daily view: the
            material changes across the business, what each one costs, what needs judgement today,
            and who owns the next step — with the evidence attached.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/onboarding"
              className="label-mono inline-flex min-h-11 items-center border border-navy bg-navy px-5 text-white transition-opacity hover:opacity-90"
            >
              Explore with sample data
            </Link>
            <Link
              to="/request-access"
              className="label-mono inline-flex min-h-11 items-center border border-rule px-5 transition-colors hover:border-navy hover:bg-muted"
            >
              Request access
            </Link>
          </div>
          <p className="mt-4 text-[14px] text-muted-foreground">
            No connection required. The preview runs on a clearly labelled sample company.
          </p>
        </div>
      </section>

      <section className="border-b border-rule" aria-labelledby="brief">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 id="brief" className="text-2xl font-semibold sm:text-3xl">
            A briefing an executive can absorb in under a minute
          </h2>
          <Panel className="mt-8">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-rule bg-muted px-5 py-3">
              <MonoLabel>Today · sample briefing</MonoLabel>
              <MonoLabel>Data as at 06:10</MonoLabel>
              <StatePill tone="critical">1 decision due in 4 days</StatePill>
            </div>
            <ul className="divide-y divide-rule">
              {[
                {
                  h: "Cash cover fell to 6.4 weeks after a £220k unplanned outflow",
                  i: "£860k committed next week",
                  u: "Act today",
                  tone: "critical" as const,
                },
                {
                  h: "Delivery margin has fallen 5.5 points across twelve weeks",
                  i: "≈ £1.3m annualised gross profit",
                  u: "This week",
                  tone: "caution" as const,
                },
                {
                  h: "Northgate Facilities is at renewal risk",
                  i: "£2.4m annual contract value",
                  u: "This week",
                  tone: "caution" as const,
                },
              ].map((s) => (
                <li key={s.h} className="flex flex-wrap items-baseline gap-x-4 gap-y-2 px-5 py-4">
                  <StatePill tone={s.tone}>{s.u}</StatePill>
                  <p className="text-[16px] font-medium">{s.h}</p>
                  <p className="label-mono text-muted-foreground ml-auto">{s.i}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </section>

      <section className="border-b border-rule" aria-labelledby="loop">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 id="loop" className="text-2xl font-semibold sm:text-3xl">
            One traceable operational loop
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] text-muted-foreground">
            Nothing floats. Every risk points to a decision, every decision to an owner and an
            action, and every claim back to the record it came from.
          </p>
          <ol className="mt-8 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {LOOP.map((n) => (
              <li key={n.k} className="bg-card p-5">
                <MonoLabel>{n.k}</MonoLabel>
                <h3 className="mt-2 text-xl font-semibold">{n.t}</h3>
                <p className="mt-2 text-[15px] text-muted-foreground">{n.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-rule" aria-labelledby="evidence">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 id="evidence" className="text-2xl font-semibold sm:text-3xl">
              Evidence is a product feature, not a footnote
            </h2>
            <p className="mt-3 text-[15px] text-muted-foreground">
              Every statement in Bearing separates what is verified, what is calculated, what is
              inferred, and what is a recommendation. When the evidence is missing or stale, Bearing
              says so and recommends the safest next step instead of inventing an answer.
            </p>
            <p className="mt-3 text-[15px] text-muted-foreground">
              Bearing recommends. People approve. Consequential changes are recorded in an audit
              trail.
            </p>
          </div>
          <dl className="grid gap-px self-start border border-rule bg-rule">
            {[
              ["Verified fact", "A record exists in a connected source."],
              ["Calculated value", "Derived from records with the method shown."],
              ["AI inference", "A judgement about the records, with confidence stated."],
              ["Recommendation", "A proposed course of action requiring human approval."],
            ].map(([t, d]) => (
              <div key={t} className="bg-card p-4">
                <dt className="label-mono text-foreground">{t}</dt>
                <dd className="mt-1 text-[15px] text-muted-foreground">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-4 py-14 sm:px-6">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">See it on a sample company</h2>
            <p className="mt-2 max-w-xl text-[15px] text-white/75">
              Twelve weeks of finance, revenue, customer, delivery and workforce history — live
              risks, decisions awaiting review, and evidence you can inspect.
            </p>
          </div>
          <Link
            to="/onboarding"
            className="label-mono ml-auto inline-flex min-h-11 items-center border border-white bg-white px-5 text-navy transition-opacity hover:opacity-90"
          >
            Start the briefing
          </Link>
        </div>
      </section>
    </SitePage>
  );
}
