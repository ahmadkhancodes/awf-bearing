import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Btn, Card, EmptyState, PageHeader, Pill } from "@/components/app/primitives";
import { SOURCES, type SourceHealth } from "@/lib/analytics";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/app/connections")({
  head: () => ({
    meta: [{ title: "Sources — Bearing" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: SourcesPage,
});

const healthTone: Record<SourceHealth, "positive" | "caution" | "critical"> = {
  healthy: "positive",
  degraded: "caution",
  stale: "critical",
};

function SourcesPage() {
  const { log } = useWorkspace();
  const [query, setQuery] = useState("");
  const [uploaded, setUploaded] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const rows = SOURCES.filter((s) =>
    (s.name + s.system + s.category + s.scope).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Sources"
        description="Five simulated data sources feeding the demo workspace. No live third-party connection exists."
        actions={<Pill tone="signal">Demo workspace · Fictional data</Pill>}
      />

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sources"
          aria-label="Search sources"
          className="h-9 w-full max-w-[260px] rounded-md border border-rule bg-card px-3 text-[13px] outline-none focus:border-signal"
        />
        <Btn onClick={() => fileRef.current?.click()}>
          <Upload className="size-3.5" aria-hidden="true" /> Upload CSV
        </Btn>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              const text = String(reader.result ?? "");
              const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
              const cols = lines[0]?.split(",").length ?? 0;
              setUploaded(
                `${file.name} · ${Math.max(lines.length - 1, 0)} rows · ${cols} columns parsed into the demo workspace (not persisted).`,
              );
              log("Uploaded CSV", "Sources", `${file.name}, ${lines.length - 1} rows.`);
              toast.success("CSV parsed into the demo workspace");
            };
            reader.onerror = () => toast.error("That file could not be read.");
            reader.readAsText(file);
            e.target.value = "";
          }}
        />
      </div>

      {uploaded ? (
        <Card className="border-signal/40 bg-signal-soft p-3.5 text-[13px]">{uploaded}</Card>
      ) : null}

      {rows.length === 0 ? (
        <EmptyState title="No source matches" detail="Clear the search term to see all sources." />
      ) : (
        <ul className="grid gap-2 lg:grid-cols-2">
          {rows.map((s) => (
            <Card as="li" key={s.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[14px] font-medium">{s.name}</p>
                  <p className="text-[12.5px] text-muted-foreground">{s.system}</p>
                </div>
                <Pill tone={healthTone[s.health]}>{s.health}</Pill>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[12.5px]">
                <Cell term="Category">{s.category}</Cell>
                <Cell term="Last sync">{s.lastSync}</Cell>
                <Cell term="Records available">{s.records.toLocaleString("en-GB")}</Cell>
                <Cell term="Permission scope">{s.scope}</Cell>
              </dl>
              <p className="mt-3 border-t border-rule pt-2 text-[12px] text-muted-foreground">
                Connected · Demo data — {s.note}
              </p>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
}

function Cell({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-muted-foreground">{term}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}
