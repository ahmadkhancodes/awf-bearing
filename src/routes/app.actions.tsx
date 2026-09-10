import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Btn, Card, EmptyState, PageHeader, Pill } from "@/components/app/primitives";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FRESHNESS, decisionById, riskById, type ActionItem } from "@/lib/demo-data";
import { useWorkspace } from "@/lib/workspace";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/actions")({
  head: () => ({
    meta: [{ title: "Actions — Bearing" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: ActionsPage,
});

const STATUSES: ActionItem["status"][] = ["not-started", "in-progress", "blocked", "done"];

const statusLabel: Record<ActionItem["status"], string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  blocked: "Blocked",
  done: "Done",
};

const statusTone = {
  "not-started": "neutral",
  "in-progress": "signal",
  blocked: "critical",
  done: "positive",
} as const;

const priorityTone = { high: "critical", medium: "caution", low: "neutral" } as const;

const FILTERS = ["All", "Open", "Blocked", "Done"] as const;

function ActionsPage() {
  const { actions, setActionStatus } = useWorkspace();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Open");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = actions
    .filter((a) =>
      filter === "Open"
        ? a.status !== "done"
        : filter === "Blocked"
          ? a.status === "blocked"
          : filter === "Done"
            ? a.status === "done"
            : true,
    )
    .filter((a) => (a.outcome + a.owner).toLowerCase().includes(query.toLowerCase()));

  const selected = actions.find((a) => a.id === openId) ?? null;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Actions"
        description={`Owned commitments · data as at ${FRESHNESS.lastSyncedAt}`}
        actions={<Pill tone="signal">Demo workspace · Fictional data</Pill>}
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-md border border-rule bg-card p-0.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "h-8 rounded px-2.5 text-[12.5px] font-medium transition-colors",
                filter === f ? "bg-signal-soft text-navy" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search actions"
          aria-label="Search actions"
          className="h-9 w-full max-w-[240px] rounded-md border border-rule bg-card px-3 text-[13px] outline-none focus:border-signal"
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No actions here" detail="Change the filter or clear the search term." />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-[13px]">
            <thead>
              <tr className="border-b border-rule text-left text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Outcome</th>
                <th className="px-4 py-2.5 font-medium">Owner</th>
                <th className="px-4 py-2.5 font-medium">Due</th>
                <th className="px-4 py-2.5 font-medium">Priority</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr
                  key={a.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenId(a.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpenId(a.id);
                    }
                  }}
                  className="cursor-pointer border-b border-rule last:border-0 hover:bg-muted"
                >
                  <td className="px-4 py-3 font-medium">{a.outcome}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.owner}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.due}</td>
                  <td className="px-4 py-3">
                    <Pill tone={priorityTone[a.priority]}>{a.priority}</Pill>
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone={statusTone[a.status]}>{statusLabel[a.status]}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
          {selected ? (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="text-[16px]">{selected.outcome}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-8">
                <div className="flex flex-wrap gap-2">
                  <Pill tone={statusTone[selected.status]}>{statusLabel[selected.status]}</Pill>
                  <Pill tone={priorityTone[selected.priority]}>{selected.priority} priority</Pill>
                  <Pill>{selected.due}</Pill>
                </div>
                <dl className="grid gap-2 text-[13px]">
                  <Row term="Owner">{selected.owner}</Row>
                  {selected.blocker ? <Row term="Blocker">{selected.blocker}</Row> : null}
                  {selected.completionEvidence ? (
                    <Row term="Completion evidence">{selected.completionEvidence}</Row>
                  ) : null}
                  {selected.riskId ? (
                    <Row term="Linked risk">{riskById(selected.riskId)?.title ?? "—"}</Row>
                  ) : null}
                  {selected.decisionId ? (
                    <Row term="Linked decision">
                      {decisionById(selected.decisionId)?.statement ?? "—"}
                    </Row>
                  ) : null}
                </dl>

                <div>
                  <p className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
                    Update status
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <Btn
                        key={s}
                        variant={selected.status === s ? "primary" : "default"}
                        onClick={() => {
                          setActionStatus(selected.id, s);
                          toast.success(
                            `Status set to ${statusLabel[s]} · written to the audit trail`,
                          );
                        }}
                      >
                        {statusLabel[s]}
                      </Btn>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2 border-t border-rule pt-2">
      <dt className="text-muted-foreground">{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}
