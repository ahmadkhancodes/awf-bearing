import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { MonoLabel, Panel, SectionHeading } from "@/components/ui-kit";
import { ORG } from "@/lib/demo-data";
import { ROLE_LABEL, ROLE_RIGHTS, useWorkspace, type Role } from "@/lib/workspace";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [{ title: "Settings — Bearing" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: Settings,
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

function Settings() {
  const { session, updateSession, reset, log } = useWorkspace();
  const navigate = useNavigate();
  if (!session) return null;
  const rights = ROLE_RIGHTS[session.role];

  return (
    <div>
      <SectionHeading
        eyebrow="Settings"
        title="Workspace, role and briefing preferences"
        description={`${ORG.name} · sample workspace. Changes here apply to this browser only in the preview.`}
      />

      <section className="mt-10" aria-labelledby="profile">
        <h2 id="profile" className="border-b border-rule pb-3 text-2xl font-semibold">
          You
        </h2>
        <div className="mt-5 max-w-md">
          <label htmlFor="name" className="label-mono text-foreground">
            Display name
          </label>
          <input
            id="name"
            value={session.name}
            onChange={(e) => updateSession({ name: e.target.value })}
            className="mt-2 min-h-11 w-full border border-rule px-3 text-[15px] outline-none focus-visible:border-navy"
          />
        </div>
        <fieldset className="mt-6 max-w-md">
          <legend className="label-mono text-foreground">Role</legend>
          <div className="mt-3 grid gap-px border border-rule bg-rule">
            {ROLES.map((r) => (
              <label
                key={r}
                className="flex min-h-11 cursor-pointer items-center gap-3 bg-card px-4 py-3 text-[15px] has-[:checked]:bg-muted"
              >
                <input
                  type="radio"
                  name="role"
                  checked={session.role === r}
                  onChange={() => {
                    updateSession({ role: r });
                    log("Role changed", "Session", `Role set to ${ROLE_LABEL[r]}.`);
                  }}
                  className="size-4 accent-[var(--navy)]"
                />
                {ROLE_LABEL[r]}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="mt-3 text-[14px] text-muted-foreground">
          Current rights: {rights.approve ? "approve decisions, " : ""}
          {rights.assign ? "update actions, " : ""}
          {rights.admin ? "manage connections and users, " : ""}read evidence.
        </p>
      </section>

      <section className="mt-12" aria-labelledby="briefing">
        <h2 id="briefing" className="border-b border-rule pb-3 text-2xl font-semibold">
          Briefing priorities
        </h2>
        <div className="mt-5 grid max-w-2xl gap-px border border-rule bg-rule sm:grid-cols-2">
          {PRIORITIES.map((p) => {
            const on = session.priorities.includes(p);
            return (
              <label
                key={p}
                className="flex min-h-11 cursor-pointer items-center gap-3 bg-card px-4 py-3 text-[15px] has-[:checked]:bg-muted"
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() =>
                    updateSession({
                      priorities: on
                        ? session.priorities.filter((x) => x !== p)
                        : [...session.priorities, p],
                    })
                  }
                  className="size-4 accent-[var(--navy)]"
                />
                {p}
              </label>
            );
          })}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="data">
        <h2 id="data" className="border-b border-rule pb-3 text-2xl font-semibold">
          Data and retention
        </h2>
        <Panel className="mt-5 p-5">
          <MonoLabel>Preview behaviour</MonoLabel>
          <p className="mt-2 max-w-3xl text-[15px] text-muted-foreground">
            This workspace holds sample data only. Decisions, actions and audit records you create
            are stored in this browser and are not transmitted. Retention windows, export and
            deletion requests are handled by an administrator on a real deployment.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const blob = new Blob(
                  [
                    JSON.stringify(
                      { organisation: ORG.name, exportedAt: new Date().toISOString(), session },
                      null,
                      2,
                    ),
                  ],
                  { type: "application/json" },
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "bearing-workspace-export.json";
                a.click();
                URL.revokeObjectURL(url);
                log("Workspace exported", "Settings", "Workspace profile exported as JSON.");
              }}
              className="label-mono min-h-11 border border-rule px-4 hover:border-navy hover:bg-muted"
            >
              Export workspace profile
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                toast.success("Workspace reset", { description: "Sample data restored." });
                void navigate({ to: "/onboarding" });
              }}
              className="label-mono min-h-11 border border-critical px-4 text-critical hover:bg-critical/6"
            >
              Reset workspace to sample state
            </button>
          </div>
        </Panel>
      </section>
    </div>
  );
}
