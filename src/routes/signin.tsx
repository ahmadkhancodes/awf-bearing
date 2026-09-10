import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SitePage } from "@/components/site-chrome";
import { MonoLabel } from "@/components/ui-kit";
import { ROLE_LABEL, useWorkspace, type Role } from "@/lib/workspace";
import { ORG } from "@/lib/demo-data";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — Bearing by AWF Consultants" },
      {
        name: "description",
        content: "Sign in to Bearing, the executive operations platform from AWF Consultants.",
      },
      { property: "og:title", content: "Sign in — Bearing by AWF Consultants" },
      { property: "og:description", content: "Access your Bearing workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://awf-bearing.lovable.app/signin" }],
  }),
  component: SignIn,
});

const ROLES: Role[] = ["executive", "operator", "advisor", "administrator"];

function SignIn() {
  const { signIn, session, log } = useWorkspace();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("executive");
  const [busy, setBusy] = useState(false);

  return (
    <SitePage>
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <MonoLabel>Sign in</MonoLabel>
        <h1 className="mt-4 text-3xl font-semibold">Enter the sample workspace</h1>
        <p className="mt-3 text-[15px] text-muted-foreground">
          This preview has no password authentication connected. Choose a role to enter the sample
          workspace for {ORG.name}. Role controls what you are permitted to do.
        </p>

        <fieldset className="mt-8">
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
                  value={r}
                  checked={role === r}
                  onChange={() => setRole(r)}
                  className="size-4 accent-[var(--navy)]"
                />
                <span>{ROLE_LABEL[r]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            const s = {
              name: role === "executive" ? ORG.executive.name : `${ROLE_LABEL[role]} user`,
              role,
              priorities: session?.priorities ?? ["Cash", "Margin", "Customers"],
              onboarded: true,
            };
            signIn(s);
            log("Signed in", "Session", `Role: ${ROLE_LABEL[role]}.`);
            void navigate({ to: "/app/today" });
          }}
          className="label-mono mt-6 min-h-11 w-full border border-navy bg-navy px-5 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Opening workspace…" : "Continue"}
        </button>

        <p className="mt-4 text-[14px] text-muted-foreground">
          New here?{" "}
          <Link to="/onboarding" className="text-signal underline">
            Run the guided setup instead
          </Link>
          .
        </p>
      </div>
    </SitePage>
  );
}
