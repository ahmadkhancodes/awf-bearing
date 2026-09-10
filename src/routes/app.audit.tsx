import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, EmptyState, PageHeader, Pill } from "@/components/app/primitives";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/app/audit")({
  head: () => ({
    meta: [{ title: "Audit — Bearing" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AuditPage,
});

function AuditPage() {
  const { audit } = useWorkspace();
  const [query, setQuery] = useState("");
  const rows = audit.filter((e) =>
    (e.action + e.object + e.detail + e.actor).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Audit"
        description="Every approval, deferral, action change and question is recorded here."
        actions={<Pill tone="signal">Demo workspace · Fictional data</Pill>}
      />

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search audit trail"
        aria-label="Search audit trail"
        className="h-9 w-full max-w-[280px] rounded-md border border-rule bg-card px-3 text-[13px] outline-none focus:border-signal"
      />

      {rows.length === 0 ? (
        <EmptyState title="No matching events" detail="Clear the search term to see all events." />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead>
              <tr className="border-b border-rule text-left text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">When</th>
                <th className="px-4 py-2.5 font-medium">Actor</th>
                <th className="px-4 py-2.5 font-medium">Action</th>
                <th className="px-4 py-2.5 font-medium">Object</th>
                <th className="px-4 py-2.5 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id} className="border-b border-rule last:border-0">
                  <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">{e.at}</td>
                  <td className="whitespace-nowrap px-4 py-2.5">{e.actor}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 font-medium">{e.action}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">{e.object}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{e.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
