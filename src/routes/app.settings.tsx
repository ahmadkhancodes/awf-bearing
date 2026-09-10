import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Btn, Card, PageHeader, Pill } from "@/components/app/primitives";
import { DEMO_CREDENTIALS, ROLE_LABEL, useWorkspace, type Role } from "@/lib/workspace";
import { ORG } from "@/lib/demo-data";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [{ title: "Settings — Bearing" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: SettingsPage,
});

const ROLES: Role[] = ["executive", "operator", "advisor", "administrator"];

function SettingsPage() {
  const { session, updateSession, audit, history, clearHistory, reset } = useWorkspace();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Settings"
        description="Demo workspace preferences. Nothing here leaves this browser."
        actions={<Pill tone="signal">Demo workspace · Fictional data</Pill>}
      />

      <Card className="p-4">
        <h2 className="text-[14px] font-semibold">Account</h2>
        <dl className="mt-3 grid gap-2 text-[13px] sm:grid-cols-2">
          <Cell term="Name">{session?.name ?? "—"}</Cell>
          <Cell term="Email">{session?.email ?? DEMO_CREDENTIALS.email}</Cell>
          <Cell term="Workspace">{session?.workspace ?? ORG.name}</Cell>
          <Cell term="Role">{session ? ROLE_LABEL[session.role] : "—"}</Cell>
        </dl>
      </Card>

      <Card className="p-4">
        <h2 className="text-[14px] font-semibold">Role</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Role controls whether decisions can be approved. Switch it to demonstrate permissions.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <Btn
              key={r}
              variant={session?.role === r ? "primary" : "default"}
              onClick={() => {
                updateSession({ role: r });
                toast.success(`Role set to ${ROLE_LABEL[r]}`);
              }}
            >
              {ROLE_LABEL[r]}
            </Btn>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-[14px] font-semibold">Demo data</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {audit.length} audit events · {history.length} recent questions stored locally.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn
            onClick={() => {
              clearHistory();
              toast.success("Question history cleared");
            }}
          >
            Clear question history
          </Btn>
          <Btn
            variant="danger"
            onClick={() => {
              reset();
              toast.success("Demo workspace reset");
              void navigate({ to: "/signin", replace: true });
            }}
          >
            Reset demo workspace
          </Btn>
        </div>
      </Card>
    </div>
  );
}

function Cell({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-rule pt-2">
      <dt className="text-muted-foreground">{term}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}
