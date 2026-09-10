import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProductLogo } from "@/components/brand";
import { DEMO_CREDENTIALS, useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — Bearing by AWF Consulting" },
      {
        name: "description",
        content: "Sign in to Bearing, the executive operations platform from AWF Consulting.",
      },
      { property: "og:title", content: "Sign in — Bearing by AWF Consulting" },
      { property: "og:description", content: "Access your Bearing demo workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const { signIn, session, hydrated, log } = useWorkspace();
  const navigate = useNavigate();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (hydrated && session) void navigate({ to: "/app/ask", replace: true });
  }, [hydrated, session, navigate]);

  const field =
    "h-10 w-full rounded-md border border-rule bg-card px-3 text-[14px] outline-none transition-colors placeholder:text-muted-foreground focus:border-signal";

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-[380px]">
          <div className="flex justify-center">
            <ProductLogo />
          </div>
          <p className="mt-4 text-center text-[14px] text-muted-foreground">
            Ask your business a question. Get a decision-ready answer.
          </p>

          <form
            className="mt-6 rounded-lg border border-rule bg-card p-5"
            onSubmit={(e) => {
              e.preventDefault();
              setBusy(true);
              const res = signIn(email, password);
              if (!res.ok) {
                setError(res.error ?? "Sign in failed.");
                setBusy(false);
                return;
              }
              setError(null);
              log("Signed in", "Session", "Demo workspace opened.");
               void Promise.all([
                 router.preloadRoute({ to: "/app/overview" }),
                 router.preloadRoute({ to: "/app/decisions" }),
                 router.preloadRoute({ to: "/app/connections" }),
               ]);
              void navigate({ to: "/app/ask", replace: true });
            }}
          >
            <label className="block text-[12px] font-medium text-muted-foreground" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className={`mt-1 ${field}`}
            />

            <label
              className="mt-4 block text-[12px] font-medium text-muted-foreground"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`mt-1 ${field}`}
            />

            {error ? (
              <p role="alert" className="mt-3 text-[12.5px] text-critical">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md border border-navy bg-navy text-[14px] font-medium text-white transition-colors hover:bg-navy-deep disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail(DEMO_CREDENTIALS.email);
                setPassword(DEMO_CREDENTIALS.password);
                setError(null);
              }}
              className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md border border-rule bg-card text-[13.5px] font-medium hover:bg-muted"
            >
              Use demo credentials
            </button>

            <div className="mt-4 rounded-md border border-rule bg-surface px-3 py-2.5 text-[12px] text-muted-foreground">
              <p className="font-medium text-foreground">Demo workspace · Fictional data</p>
              <p className="mt-1">
                Email: <span className="font-medium text-foreground">{DEMO_CREDENTIALS.email}</span>
              </p>
              <p>
                Password:{" "}
                <span className="font-medium text-foreground">{DEMO_CREDENTIALS.password}</span>
              </p>
            </div>
          </form>
        </div>
      </div>
      <footer className="pb-6 text-center text-[12px] text-muted-foreground">
        Bearing by AWF Consulting · Demo environment with simulated sources
      </footer>
    </div>
  );
}
