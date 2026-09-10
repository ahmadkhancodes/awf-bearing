import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  MessageSquare,
  PlugZap,
  ScrollText,
  Scale,
  Settings,
  ShieldAlert,
  X,
} from "lucide-react";
import { ProductLogo, SidebarLogo } from "@/components/brand";
import { ORG } from "@/lib/demo-data";
import { ROLE_LABEL, useWorkspace } from "@/lib/workspace";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/app/ask", label: "Ask", icon: MessageSquare },
  { to: "/app/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/app/risks", label: "Risks", icon: ShieldAlert },
  { to: "/app/decisions", label: "Decisions", icon: Scale },
  { to: "/app/actions", label: "Actions", icon: ListChecks },
  { to: "/app/connections", label: "Connections", icon: PlugZap },
  { to: "/app/audit", label: "Audit", icon: ScrollText },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { session, hydrated, signOut, history } = useWorkspace();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !session) void navigate({ to: "/signin", replace: true });
  }, [hydrated, session, navigate]);

  if (!hydrated || !session) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface">
        <p className="text-[13px] text-muted-foreground">Loading workspace…</p>
      </div>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-card">
      <div className="border-b border-rule px-3 py-3">
        <Link to="/app/ask" onClick={() => setOpen(false)} aria-label="Bearing — Ask">
          <SidebarLogo />
        </Link>
        <div className="mt-2.5 rounded-md bg-surface px-2.5 py-2">
          <p className="text-[11px] font-medium text-muted-foreground">Workspace</p>
          <p className="mt-0.5 text-[12.5px] font-medium leading-snug">{ORG.name}</p>
          <p className="mt-1 text-[10.5px] text-muted-foreground">Demo workspace · Fictional data</p>
        </div>
      </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-0.5">
          {NAV.map((n) => (
            <li key={n.to}>
              <Link
                to={n.to}
                onClick={() => setOpen(false)}
                preload="intent"
                className="flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-navy"
                activeProps={{ className: "bg-signal-soft text-navy" }}
              >
                <n.icon className="size-4 shrink-0" aria-hidden="true" />
                {n.label}
              </Link>
            </li>
          ))}
        </ul>

        {history.length ? (
          <div className="mt-4 border-t border-rule pt-3">
            <p className="px-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Recent questions
            </p>
            <ul className="mt-1 space-y-0.5">
              {history.slice(0, 5).map((h) => (
                <li key={h.id}>
                  <Link
                    to="/app/ask"
                    search={{ q: h.question }}
                    onClick={() => setOpen(false)}
                    className="block truncate rounded-md px-2.5 py-1.5 text-[12.5px] text-muted-foreground hover:bg-muted hover:text-foreground"
                    title={h.question}
                  >
                    {h.question}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </nav>

      <div className="border-t border-rule p-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy text-[12px] font-semibold text-white">
            {session.name
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium">{session.name}</span>
            <span className="block truncate text-[11px] text-muted-foreground">
              {ROLE_LABEL[session.role]} · {session.email}
            </span>
          </span>
        </div>
        <div className="mt-2 flex gap-2">
          <Link
            to="/app/settings"
            onClick={() => setOpen(false)}
            className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-rule text-[12.5px] font-medium hover:bg-muted"
          >
            <Settings className="size-3.5" aria-hidden="true" /> Settings
          </Link>
          <button
            type="button"
            onClick={() => {
              signOut();
              void navigate({ to: "/signin", replace: true });
            }}
            className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-rule text-[12.5px] font-medium hover:bg-muted"
          >
            <LogOut className="size-3.5" aria-hidden="true" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-surface">
      <a
        href="#main"
        className="sr-only rounded-md focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:border focus:border-navy focus:bg-card focus:px-3 focus:py-2 focus:text-[13px]"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-rule lg:block">
        {sidebar}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-navy-deep/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[17rem] max-w-[85vw] border-r border-rule shadow-xl">
            {sidebar}
          </div>
        </div>
      ) : null}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-12 items-center gap-3 border-b border-rule bg-card/95 px-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="inline-flex size-9 items-center justify-center rounded-md border border-rule"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
          <Link to="/app/ask" aria-label="Bearing — Ask">
            <ProductLogo subtitle={false} />
          </Link>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-rule px-2 py-1 text-[11px] text-muted-foreground">
            <Activity className="size-3" aria-hidden="true" /> Demo
          </span>
        </header>

        <main id="main" className="mx-auto w-full max-w-[1320px] px-4 py-4 sm:px-6 sm:py-5">
          {children}
        </main>
      </div>
    </div>
  );
}
