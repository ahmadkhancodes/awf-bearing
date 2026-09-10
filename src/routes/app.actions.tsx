import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { MonoLabel, Panel, SectionHeading, StatePill } from "@/components/ui-kit";
import { EvidenceButton } from "@/components/evidence-drawer";
import { riskById, type ActionItem } from "@/lib/demo-data";
import { ROLE_RIGHTS, useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/app/actions")({
  head: () => ({
    meta: [{ title: "Actions — Bearing" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: Actions,
});

const statusLabel: Record<ActionItem["status"], string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  blocked: "Blocked",
  done: "Complete",
};

const statusTone = (s: ActionItem["status"]) =>
  s === "blocked"
    ? "critical"
    : s === "done"
      ? "positive"
      : s === "in-progress"
        ? "signal"
        : "neutral";

const NEXT: Record<ActionItem["status"], ActionItem["status"]> = {
  "not-started": "in-progress",
  "in-progress": "done",
  blocked: "in-progress",
  done: "in-progress",
};

function Actions() {
  const { actions, session, setActionStatus } = useWorkspace();
  const rights = session
    ? ROLE_RIGHTS[session.role]
    : { approve: false, assign: false, admin: false };
  const open = actions.filter((a) => a.status !== "done");
  const done = actions.filter((a) => a.status === "done");

  return (
    <div>
      <SectionHeading
        eyebrow="Actions"
        title="Follow-through, traced back to the decision"
        description="One outcome, one owner, one date. Actions exist to protect follow-through — not to replace your project tooling."
      />

      {!rights.assign ? (
        <p className="mt-6 border border-rule bg-muted px-4 py-3 text-[15px]">
          Your role can read actions but cannot change their status.
        </p>
      ) : null}

      <section className="mt-8" aria-labelledby="open-actions">
        <h2 id="open-actions" className="border-b border-rule pb-3 text-2xl font-semibold">
          Open · {open.length}
        </h2>
        {open.length === 0 ? (
          <div className="mt-6 border border-rule bg-muted p-6">
            <MonoLabel>Nothing open</MonoLabel>
            <p className="mt-2 text-[15px]">
              Every action has been completed. New actions appear when a decision is approved.
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {open.map((a) => (
              <ActionRow key={a.id} action={a} canEdit={rights.assign} onSet={setActionStatus} />
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12" aria-labelledby="done-actions">
        <h2 id="done-actions" className="border-b border-rule pb-3 text-2xl font-semibold">
          Complete · {done.length}
        </h2>
        <ul className="mt-6 space-y-4">
          {done.map((a) => (
            <ActionRow key={a.id} action={a} canEdit={rights.assign} onSet={setActionStatus} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function ActionRow({
  action: a,
  canEdit,
  onSet,
}: {
  action: ActionItem;
  canEdit: boolean;
  onSet: (id: string, s: ActionItem["status"]) => void;
}) {
  const risk = riskById(a.riskId);
  return (
    <Panel as="li">
      <div className="flex flex-wrap items-center gap-2 border-b border-rule bg-muted px-4 py-2.5">
        <StatePill tone={statusTone(a.status)}>{statusLabel[a.status]}</StatePill>
        <MonoLabel>Priority {a.priority}</MonoLabel>
        <span className="label-mono text-foreground ml-auto">{a.due}</span>
      </div>
      <div className="px-4 py-4">
        <h3 className="text-[17px] font-medium">{a.outcome}</h3>
        <p className="label-mono text-muted-foreground mt-2">Owner · {a.owner}</p>
        {a.blocker ? (
          <p className="mt-3 border-l-2 border-critical pl-3 text-[15px]">
            <span className="label-mono text-muted-foreground mr-2">Blocker</span>
            {a.blocker}
          </p>
        ) : null}
        {a.completionEvidence ? (
          <p className="mt-3 border-l-2 border-positive pl-3 text-[15px]">
            <span className="label-mono text-muted-foreground mr-2">Completion evidence</span>
            {a.completionEvidence}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-rule pt-4">
          {risk ? (
            <Link
              to="/app/risks"
              hash={risk.id}
              className="label-mono inline-flex min-h-11 items-center border border-rule px-3 hover:border-navy hover:bg-muted"
            >
              Related risk
            </Link>
          ) : null}
          {a.decisionId ? (
            <Link
              to="/app/decisions"
              hash={a.decisionId}
              className="label-mono inline-flex min-h-11 items-center border border-rule px-3 hover:border-navy hover:bg-muted"
            >
              Related decision
            </Link>
          ) : null}
          <EvidenceButton ids={risk?.evidenceIds ?? []} relatedTo={a.outcome} />
          <button
            type="button"
            disabled={!canEdit}
            onClick={() => {
              const next = NEXT[a.status];
              onSet(a.id, next);
              toast.success(`Action set to ${statusLabel[next].toLowerCase()}`, {
                description: "Recorded in Trust & Audit.",
              });
            }}
            className="label-mono ml-auto min-h-11 border border-navy bg-navy px-3 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {a.status === "done"
              ? "Reopen"
              : a.status === "blocked"
                ? "Unblock"
                : a.status === "in-progress"
                  ? "Mark complete"
                  : "Start"}
          </button>
        </div>
      </div>
    </Panel>
  );
}
