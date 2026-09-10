import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { ProductLogo } from "@/components/brand";
import { GlobalAsk } from "@/components/global-ask";
import { MonoLabel } from "@/components/ui-kit";
import { FRESHNESS, ORG } from "@/lib/demo-data";
import { ROLE_LABEL, useWorkspace } from "@/lib/workspace";
import { cn } from "@/lib/utils";

const PRIMARY = [
  { to: "/app/today", label: "Today" },
  { to: "/app/risks", label: "Risks" },
  { to: "/app/decisions", label: "Decisions" },
  { to: "/app/actions", label: "Actions" },
] as const;

const SECONDARY = [
  { to: "/app/connections", label: "Connections" },
  { to: "/app/trust", label: "Trust & Audit" },
  { to: "/app/settings", label: "Settings" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { session, hydrated, signOut } = useWorkspace();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  // Someone who signs out is returned to the public site, not pushed back
  // through onboarding they have already completed.
  const hadSession = useRef(false);
  if (session) hadSession.current = true;
  const exitTo = hadSession.current ? "/" : "/onboarding";

  useEffect(() => {
    if (hydrated && !session) void navigate({ to: exitTo, replace: true });
  }, [hydrated, session, navigate, exitTo]);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="label-mono text-muted-foreground">Loading workspace…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4 text-center">
        <p className="text-[15px] text-muted-foreground">
          {hadSession.current ? "Signing out…" : "Redirecting to onboarding…"}{" "}
          <Link to={exitTo} className="text-signal underline">
            Continue
          </Link>
        </p>
      </div>
    );
  }


  const linkClass =
    "label-mono inline-flex min-h-11 items-center border-b-2 border-transparent px-1 text-foreground transition-colors hover:text-signal";

  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#main"
        className="label-mono sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:border focus:border-navy focus:bg-background focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <div className="border-b border-rule bg-navy text-white">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-1 px-4 py-1.5 sm:px-6">
          <span className="label-mono text-white/80">Sample data</span>
          <span className="label-mono text-white/60 truncate">
            {ORG.name} · {ORG.fiscalNote}
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-rule bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2.5 sm:px-6">
          <Link to="/app/today" className="shrink-0" aria-label="Bearing home — Today">
            <ProductLogo />
          </Link>
          <div className="mx-auto hidden w-full max-w-md md:block">
            <GlobalAsk />
          </div>
          <div className="ml-auto hidden items-center gap-3 md:flex">
            <span className="label-mono text-muted-foreground text-right">
              {session.name} · {ROLE_LABEL[session.role]}
            </span>
            <button
              type="button"
              onClick={() => {
                signOut();
                void navigate({ to: "/" });
              }}
              className="label-mono min-h-11 border border-rule px-3 transition-colors hover:border-navy hover:bg-muted"
            >
              Sign out
            </button>
          </div>
          <button
            type="button"
            className="ml-auto inline-flex size-11 items-center justify-center border border-rule md:hidden"
            aria-expanded={menu}
            aria-controls="mobile-nav"
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">{menu ? "Close menu" : "Open menu"}</span>
          </button>
        </div>

        <nav aria-label="Primary" className="mx-auto hidden max-w-[1400px] px-4 sm:px-6 md:block">
          <ul className="flex flex-wrap items-center gap-x-6">
            {PRIMARY.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className={linkClass}
                  activeProps={{ className: cn(linkClass, "border-signal text-signal") }}
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li aria-hidden="true" className="h-4 w-px bg-rule" />
            {SECONDARY.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className={cn(linkClass, "text-muted-foreground")}
                  activeProps={{ className: cn(linkClass, "border-signal text-signal") }}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {menu ? (
          <div id="mobile-nav" className="border-t border-rule px-4 py-3 md:hidden">
            <GlobalAsk />
            <nav aria-label="Primary mobile" className="mt-3">
              <ul className="grid">
                {[...PRIMARY, ...SECONDARY].map((n) => (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      onClick={() => setMenu(false)}
                      className="flex min-h-11 items-center border-b border-rule text-[15px]"
                      activeProps={{ className: "text-signal" }}
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="label-mono text-muted-foreground mt-3">
              {session.name} · {ROLE_LABEL[session.role]}
            </p>
            <button
              type="button"
              onClick={() => {
                signOut();
                void navigate({ to: "/" });
              }}
              className="label-mono mt-2 min-h-11 w-full border border-rule px-3"
            >
              Sign out
            </button>
          </div>
        ) : null}
      </header>

      <main id="main" className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-[1400px] flex-wrap gap-x-6 gap-y-1 px-4 py-5 sm:px-6">
          <MonoLabel>Bearing by AWF Consultants</MonoLabel>
          <MonoLabel>Data as at {FRESHNESS.lastSyncedAt}</MonoLabel>
          <MonoLabel>Read-only sources</MonoLabel>
        </div>
      </footer>
    </div>
  );
}
