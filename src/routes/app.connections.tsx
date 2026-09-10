import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { MonoLabel, Panel, SectionHeading, StatePill } from "@/components/ui-kit";
import { CONNECTIONS, type ConnectionSource } from "@/lib/demo-data";
import { ROLE_RIGHTS, useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/app/connections")({
  head: () => ({
    meta: [{ title: "Connections — Bearing" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: Connections,
});

const tone = (s: ConnectionSource["status"]) =>
  s === "connected" || s === "read-only"
    ? "positive"
    : s === "needs-attention" || s === "permission-required"
      ? "caution"
      : s === "error"
        ? "critical"
        : s === "synchronizing"
          ? "signal"
          : "neutral";

const label: Record<ConnectionSource["status"], string> = {
  connected: "Connected",
  "needs-attention": "Needs attention",
  synchronizing: "Synchronising",
  "read-only": "Connected · read-only",
  "permission-required": "Permission required",
  error: "Error",
  "not-configured": "Not configured",
};

const CATEGORIES = ["Finance", "Revenue & customers", "Operations & delivery"] as const;

function Connections() {
  const { session, log } = useWorkspace();
  const admin = session ? ROLE_RIGHTS[session.role].admin : false;
  const [importedRows, setImportedRows] = useState<number | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (file: File) => {
    setImportError(null);
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setImportError("That file is not a CSV. Export your ledger as CSV and try again.");
      return;
    }
    const text = await file.text();
    const rows = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (rows.length < 2) {
      setImportError("The file has a header but no data rows. Nothing was imported.");
      return;
    }
    setImportedRows(rows.length - 1);
    log(
      "CSV imported",
      "Finance · CSV import",
      `${rows.length - 1} rows parsed in-browser from ${file.name}.`,
    );
    toast.success(`${rows.length - 1} rows parsed`, {
      description: "Parsed locally; nothing was uploaded.",
    });
  };

  return (
    <div>
      <SectionHeading
        eyebrow="Connections"
        title="Where the evidence comes from"
        description="Bearing organises sources into three business categories. Every connection is read-only: Bearing reads records and never writes back."
      />

      <div className="mt-8 space-y-10">
        {CATEGORIES.map((cat) => (
          <section key={cat} aria-labelledby={cat.replace(/\W/g, "")}>
            <h2
              id={cat.replace(/\W/g, "")}
              className="border-b border-rule pb-3 text-2xl font-semibold"
            >
              {cat}
            </h2>
            <ul className="mt-5 grid gap-px border border-rule bg-rule md:grid-cols-2">
              {CONNECTIONS.filter((c) => c.category === cat).map((c) => (
                <li key={c.id} className="bg-card p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatePill tone={tone(c.status)}>{label[c.status]}</StatePill>
                    {!c.live ? <StatePill>Planned — not implemented</StatePill> : null}
                  </div>
                  <h3 className="mt-3 text-[17px] font-medium">{c.name}</h3>
                  <p className="mt-1 text-[15px] text-muted-foreground">{c.detail}</p>
                  <p className="mt-3 text-[14px]">
                    <span className="label-mono text-muted-foreground mr-2">Permission</span>
                    {c.permission}
                  </p>
                  {c.lastSyncedAt ? (
                    <MonoLabel className="mt-3 block">Last synchronised {c.lastSyncedAt}</MonoLabel>
                  ) : null}

                  {c.id === "con-02" ? (
                    <div className="mt-4 border-t border-rule pt-4">
                      <label htmlFor="csv" className="label-mono text-foreground">
                        Upload a finance CSV
                      </label>
                      <input
                        id="csv"
                        ref={fileRef}
                        type="file"
                        accept=".csv,text/csv"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void onFile(f);
                        }}
                        className="mt-2 block min-h-11 w-full border border-rule px-3 py-2 text-[14px] file:mr-3 file:border file:border-rule file:bg-muted file:px-3 file:py-1.5 file:text-[13px]"
                      />
                      {importedRows !== null ? (
                        <p role="status" className="mt-2 text-[14px] text-positive">
                          {importedRows} rows parsed in your browser. Nothing was uploaded.
                        </p>
                      ) : null}
                      {importError ? (
                        <p role="alert" className="mt-2 text-[14px] text-critical">
                          {importError}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {!c.live ? (
                    <p className="label-mono mt-4 border-t border-rule pt-4 text-muted-foreground">
                      No control shown — this connector does not exist yet
                    </p>
                  ) : c.status === "needs-attention" ? (
                    <button
                      type="button"
                      disabled={!admin}
                      onClick={() => {
                        log(
                          "Re-sync requested",
                          c.name,
                          "Administrator requested a re-synchronisation.",
                        );
                        toast.success("Re-sync requested", {
                          description: "Recorded in Trust & Audit.",
                        });
                      }}
                      className="label-mono mt-4 min-h-11 border border-navy bg-navy px-3 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Request re-sync
                    </button>
                  ) : null}
                  {!admin && c.live && c.status === "needs-attention" ? (
                    <p className="mt-2 text-[14px] text-muted-foreground">
                      Only an administrator can request a re-synchronisation.
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Panel className="mt-10 p-5">
        <MonoLabel>Connector architecture</MonoLabel>
        <p className="mt-2 max-w-3xl text-[15px] text-muted-foreground">
          Sources feed a common snapshot and metric layer, so a future finance, CRM, service
          management, workforce or project platform can be added without changing the briefing,
          risk, decision or evidence experience.
        </p>
      </Panel>
    </div>
  );
}
