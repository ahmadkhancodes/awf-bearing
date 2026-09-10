import { createFileRoute } from "@tanstack/react-router";
import { MonoLabel, Panel, SectionHeading } from "@/components/ui-kit";
import { EvidenceButton } from "@/components/evidence-drawer";
import { EVIDENCE } from "@/lib/demo-data";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/app/trust")({
  head: () => ({ meta: [{ title: "Trust & Audit — Bearing" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: Trust,
});

const POLICY = [
  "Evidence before assertion. Every operational claim points to a record.",
  "Fact, calculation, inference and recommendation are always labelled separately.",
  "Material information first, in money, time, ownership and risk.",
  "Uncertainty is stated. False precision is avoided.",
  "Stale or contradictory data is surfaced, not smoothed over.",
  "A small number of high-value signals is preferred to a large number of weak alerts.",
  "No consequential action is ever executed without explicit human approval.",
  "When evidence is insufficient, Bearing says so and names what is missing.",
];

function Trust() {
  const { audit } = useWorkspace();

  return (
    <div>
      <SectionHeading
        eyebrow="Trust & Audit"
        title="How Bearing behaves, and what it has done"
        description="The behaviour policy below governs every statement in the product. The audit log records consequential activity in this workspace."
      />

      <section className="mt-10" aria-labelledby="policy">
        <h2 id="policy" className="border-b border-rule pb-3 text-2xl font-semibold">
          AI behaviour policy
        </h2>
        <ul className="mt-5 grid gap-px border border-rule bg-rule sm:grid-cols-2">
          {POLICY.map((p) => (
            <li key={p} className="bg-card p-4 text-[15px]">
              {p}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="audit">
        <h2 id="audit" className="border-b border-rule pb-3 text-2xl font-semibold">
          Audit log
        </h2>
        {audit.length === 0 ? (
          <div className="mt-6 border border-rule bg-muted p-6">
            <MonoLabel>Empty</MonoLabel>
            <p className="mt-2 text-[15px]">No activity recorded in this workspace yet.</p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto border border-rule">
            <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
              <caption className="sr-only">Audit records for this workspace, newest first</caption>
              <thead>
                <tr className="border-b border-rule bg-muted">
                  <th scope="col" className="label-mono px-4 py-2.5 font-normal">When</th>
                  <th scope="col" className="label-mono px-4 py-2.5 font-normal">Actor</th>
                  <th scope="col" className="label-mono px-4 py-2.5 font-normal">Event</th>
                  <th scope="col" className="label-mono px-4 py-2.5 font-normal">Detail</th>
                </tr>
              </thead>
              <tbody>
                {audit.map((e) => (
                  <tr key={e.id} className="border-b border-rule last:border-b-0">
                    <td className="px-4 py-3 align-top whitespace-nowrap">{e.at}</td>
                    <td className="px-4 py-3 align-top">{e.actor}</td>
                    <td className="px-4 py-3 align-top">
                      {e.action}
                      <span className="block text-[14px] text-muted-foreground">{e.object}</span>
                    </td>
                    <td className="px-4 py-3 align-top text-muted-foreground">{e.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-12" aria-labelledby="evidence-index">
        <h2 id="evidence-index" className="border-b border-rule pb-3 text-2xl font-semibold">
          Evidence index
        </h2>
        <p className="mt-4 text-[15px] text-muted-foreground">
          {EVIDENCE.length} records underpin the current briefing, risks and decisions.
        </p>
        <Panel className="mt-5 p-5">
          <MonoLabel>Inspect every record</MonoLabel>
          <div className="mt-3">
            <EvidenceButton ids={EVIDENCE.map((e) => e.id)} label="Open evidence index" relatedTo="All evidence records" />
          </div>
        </Panel>
      </section>
    </div>
  );
}
