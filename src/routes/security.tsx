import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/site-chrome";
import { MonoLabel } from "@/components/ui-kit";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Privacy & security — Bearing by AWF Consultants" },
      {
        name: "description",
        content:
          "How Bearing handles access, permissions, data isolation, audit records and demo data. Designed for enterprise trust; no compliance certifications claimed.",
      },
      { property: "og:title", content: "Privacy & security — Bearing by AWF Consultants" },
      {
        property: "og:description",
        content: "Read-only connectors, organisation isolation, human approval, audit records.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://awf-bearing.lovable.app/security" }],
  }),
  component: Security,
});

const SECTIONS = [
  {
    t: "Access and permissions",
    b: [
      "Roles are explicit: Executive, Operator, Advisor and Administrator. Rights differ, and the interface hides or disables what a role may not do rather than failing after the fact.",
      "Approving or deferring a decision requires the Executive role. Advisors can read evidence and contribute, but cannot approve.",
      "Administrators manage users, connections and settings. Access can be revoked, which removes the ability to read organisation data immediately.",
    ],
  },
  {
    t: "Data handling",
    b: [
      "Connectors are read-only by default. Bearing reads records; it does not post entries, move money, edit CRM records or approve timesheets.",
      "Data is scoped to a single organisation. Records from one organisation are never used to answer a question in another.",
      "Retention is configurable per organisation, and export and deletion requests are handled by an administrator.",
    ],
  },
  {
    t: "AI behaviour",
    b: [
      "Bearing states evidence before assertion, separates fact from inference, and refuses to answer when the evidence is insufficient.",
      "Bearing never executes a consequential action. It recommends; a person approves.",
      "Every approval, deferral, assignment and question is written to an audit record.",
    ],
  },
  {
    t: "This preview",
    b: [
      "This preview runs entirely on a clearly labelled sample company. No real company data is present, and no live third-party integration is connected.",
      "Workspace state in the preview (decisions, actions, audit records) is stored in your browser only.",
      "Integrations shown as planned are labelled as planned. Nothing unimplemented is presented as live.",
    ],
  },
  {
    t: "Compliance position",
    b: [
      "Bearing is designed against SOC 2 and ISO 27001 control expectations. Bearing holds no certification today, and AWF Consultants makes no certification claim.",
      "Security assumptions and control design are available on request during an evaluation.",
    ],
  },
];

function Security() {
  return (
    <SitePage>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <MonoLabel>Privacy & security</MonoLabel>
        <h1 className="mt-4 text-4xl font-semibold">How Bearing treats your operational data</h1>
        <p className="mt-4 text-[16px] text-muted-foreground">
          Bearing reads operational records to explain what changed. It is built to be defensible to
          a finance director and a security reviewer before it is impressive to anyone else.
        </p>
        {SECTIONS.map((s) => (
          <section key={s.t} className="mt-10 border-t border-rule pt-6">
            <h2 className="text-2xl font-semibold">{s.t}</h2>
            <ul className="mt-4 space-y-3">
              {s.b.map((p) => (
                <li key={p} className="text-[15px] text-muted-foreground">
                  {p}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </SitePage>
  );
}
