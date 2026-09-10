import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ConfidenceMeter, MonoLabel, Panel, SectionHeading, StatePill } from "@/components/ui-kit";
import { EvidenceButton } from "@/components/evidence-drawer";
import type { Decision } from "@/lib/demo-data";
import { ROLE_RIGHTS, useWorkspace } from "@/lib/workspace";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/decisions")({
  head: () => ({
    meta: [{ title: "Decisions — Bearing" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: Decisions,
});

const statusTone = (s: Decision["status"]) =>
  s === "awaiting"
    ? "caution"
    : s === "approved"
      ? "positive"
      : s === "deferred"
        ? "neutral"
        : "signal";

const statusLabel: Record<Decision["status"], string> = {
  awaiting: "Awaiting decision",
  approved: "Approved",
  deferred: "Deferred",
  clarification: "Clarification requested",
};

function Decisions() {
  const { decisions, session, setDecisionStatus } = useWorkspace();
  const rights = session
    ? ROLE_RIGHTS[session.role]
    : { approve: false, assign: false, admin: false };

  return (
    <div>
      <SectionHeading
        eyebrow="Decisions"
        title="What needs your judgement"
        description="Each brief states why the decision is required now, the options and their trade-offs, the recommended course, and what it costs to wait. Bearing recommends; you decide."
      />

      {!rights.approve ? (
        <p className="mt-6 border border-rule bg-muted px-4 py-3 text-[15px]">
          Your role can review evidence and contribute, but cannot approve or defer decisions. The
          approval controls below are disabled for that reason.
        </p>
      ) : null}

      <ul className="mt-8 space-y-6">
        {decisions.map((d) => (
          <DecisionCard
            key={d.id}
            decision={d}
            canApprove={rights.approve}
            onSet={setDecisionStatus}
          />
        ))}
      </ul>
    </div>
  );
}

function DecisionCard({
  decision: d,
  canApprove,
  onSet,
}: {
  decision: Decision;
  canApprove: boolean;
  onSet: (id: string, status: Decision["status"], optionLabel?: string) => void;
}) {
  const [selected, setSelected] = useState(
    d.options.find((o) => o.recommended)?.id ?? d.options[0]?.id ?? "",
  );
  const option = d.options.find((o) => o.id === selected);
  const settled = d.status !== "awaiting";

  const act = (status: Decision["status"], message: string) => {
    onSet(d.id, status, option?.label);
    toast.success(message, { description: "Recorded in Trust & Audit." });
  };

  return (
    <Panel as="li">
      <div
        id={d.id}
        className="scroll-mt-32 flex flex-wrap items-center gap-2 border-b border-rule bg-muted px-4 py-2.5 sm:px-5"
      >
        <StatePill tone={statusTone(d.status)}>{statusLabel[d.status]}</StatePill>
        <MonoLabel>{d.domain}</MonoLabel>
        <span className="label-mono text-foreground ml-auto">Due {d.deadline.toLowerCase()}</span>
      </div>

      <div className="px-4 py-5 sm:px-5">
        <h2 className="text-xl font-semibold sm:text-2xl">{d.statement}</h2>

        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="label-mono text-muted-foreground">Why now</dt>
            <dd className="mt-1 text-[15px]">{d.whyNow}</dd>
          </div>
          <div>
            <dt className="label-mono text-muted-foreground">Context</dt>
            <dd className="mt-1 text-[15px]">{d.context}</dd>
          </div>
        </dl>

        <fieldset className="mt-6">
          <legend className="label-mono text-foreground">Options</legend>
          <div className="mt-3 grid gap-px border border-rule bg-rule">
            {d.options.map((o) => (
              <label
                key={o.id}
                className={cn(
                  "cursor-pointer bg-card p-4 transition-colors hover:bg-muted has-[:checked]:bg-muted",
                  settled && "cursor-default",
                )}
              >
                <span className="flex items-start gap-3">
                  <input
                    type="radio"
                    name={`opt-${d.id}`}
                    checked={selected === o.id}
                    disabled={settled}
                    onChange={() => setSelected(o.id)}
                    className="mt-1 size-4 accent-[var(--navy)]"
                  />
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-[16px] font-medium">{o.label}</span>
                      {o.recommended ? <StatePill tone="signal">Recommended</StatePill> : null}
                    </span>
                    <span className="mt-1 block text-[15px] text-muted-foreground">{o.detail}</span>
                    <span className="mt-2 block text-[14px]">
                      <span className="label-mono text-muted-foreground mr-2">Trade-off</span>
                      {o.tradeoff}
                    </span>
                    <span className="mt-1 block text-[14px]">
                      <span className="label-mono text-muted-foreground mr-2">Expected impact</span>
                      {o.expectedImpact}
                    </span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <p className="mt-5 border-l-2 border-critical pl-3 text-[15px]">
          <span className="label-mono text-muted-foreground mr-2">Cost of delay</span>
          {d.costOfDelay}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-rule pt-4">
          <MonoLabel>Owner · {d.owner}</MonoLabel>
          <ConfidenceMeter level={d.confidence} />
          <div className="ml-auto flex flex-wrap gap-2">
            <EvidenceButton ids={d.evidenceIds} relatedTo={d.statement} />
            {d.riskId ? (
              <Link
                to="/app/risks"
                hash={d.riskId}
                className="label-mono inline-flex min-h-11 items-center border border-rule px-3 hover:border-navy hover:bg-muted"
              >
                Related risk
              </Link>
            ) : null}
          </div>
        </div>

        {settled ? (
          <div className="mt-5 border border-rule bg-muted p-4">
            <MonoLabel>Current state</MonoLabel>
            <p className="mt-1 text-[15px]">
              {statusLabel[d.status]}. An audit record was created.{" "}
              {canApprove ? (
                <button
                  type="button"
                  onClick={() => act("awaiting", "Decision reopened")}
                  className="text-signal underline"
                >
                  Reopen
                </button>
              ) : null}
            </p>
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap gap-2 border-t border-rule pt-4">
            <button
              type="button"
              disabled={!canApprove}
              onClick={() => act("approved", "Decision approved")}
              className="label-mono min-h-11 border border-navy bg-navy px-4 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Approve selected option
            </button>
            <button
              type="button"
              disabled={!canApprove}
              onClick={() => act("deferred", "Decision deferred")}
              className="label-mono min-h-11 border border-rule px-4 transition-colors hover:border-navy hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              Defer
            </button>
            <button
              type="button"
              disabled={!canApprove}
              onClick={() => act("clarification", "Clarification requested")}
              className="label-mono min-h-11 border border-rule px-4 transition-colors hover:border-navy hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              Request clarification
            </button>
            <Link
              to="/app/actions"
              className="label-mono inline-flex min-h-11 items-center border border-rule px-4 hover:border-navy hover:bg-muted"
            >
              Assign follow-through
            </Link>
          </div>
        )}
      </div>
    </Panel>
  );
}
