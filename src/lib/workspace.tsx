import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ACTIONS,
  AUDIT_SEED,
  DECISIONS,
  type ActionItem,
  type AuditEvent,
  type Decision,
} from "./demo-data";

export type Role = "executive" | "operator" | "advisor" | "administrator";

export interface Session {
  name: string;
  role: Role;
  priorities: string[];
  onboarded: boolean;
}

interface WorkspaceState {
  session: Session | null;
  hydrated: boolean;
  decisions: Decision[];
  actions: ActionItem[];
  audit: AuditEvent[];
  signIn: (s: Session) => void;
  signOut: () => void;
  updateSession: (patch: Partial<Session>) => void;
  setDecisionStatus: (id: string, status: Decision["status"], optionLabel?: string) => void;
  setActionStatus: (id: string, status: ActionItem["status"]) => void;
  log: (action: string, object: string, detail: string) => void;
  reset: () => void;
}

const KEY = "bearing.workspace.v1";

const WorkspaceContext = createContext<WorkspaceState | null>(null);

export const ROLE_LABEL: Record<Role, string> = {
  executive: "Executive",
  operator: "Operator",
  advisor: "Advisor",
  administrator: "Administrator",
};

export const ROLE_RIGHTS: Record<Role, { approve: boolean; assign: boolean; admin: boolean }> = {
  executive: { approve: true, assign: true, admin: false },
  operator: { approve: false, assign: true, admin: false },
  advisor: { approve: false, assign: false, admin: false },
  administrator: { approve: false, assign: true, admin: true },
};

function now() {
  const d = new Date();
  return `Today, ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [decisions, setDecisions] = useState<Decision[]>(DECISIONS);
  const [actions, setActions] = useState<ActionItem[]>(ACTIONS);
  const [audit, setAudit] = useState<AuditEvent[]>(AUDIT_SEED);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          session?: Session | null;
          decisionStatus?: Record<string, Decision["status"]>;
          actionStatus?: Record<string, ActionItem["status"]>;
          audit?: AuditEvent[];
        };
        if (parsed.session) setSession(parsed.session);
        if (parsed.decisionStatus)
          setDecisions(
            DECISIONS.map((d) => ({ ...d, status: parsed.decisionStatus?.[d.id] ?? d.status })),
          );
        if (parsed.actionStatus)
          setActions(
            ACTIONS.map((a) => ({ ...a, status: parsed.actionStatus?.[a.id] ?? a.status })),
          );
        if (parsed.audit?.length) setAudit(parsed.audit);
      }
    } catch {
      /* ignore corrupted local state */
    }
    setHydrated(true);
  }, []);

  // Refs mirror the latest state so that two writes inside the same render
  // (for example signIn() immediately followed by log()) cannot overwrite
  // each other with a stale closure value.
  const sessionRef = useRef(session);
  const decisionsRef = useRef(decisions);
  const actionsRef = useRef(actions);
  const auditRef = useRef(audit);
  sessionRef.current = session;
  decisionsRef.current = decisions;
  actionsRef.current = actions;
  auditRef.current = audit;

  const persist = useCallback(
    (next: {
      session?: Session | null;
      decisions?: Decision[];
      actions?: ActionItem[];
      audit?: AuditEvent[];
    }) => {
      if (next.session !== undefined) sessionRef.current = next.session;
      if (next.decisions) decisionsRef.current = next.decisions;
      if (next.actions) actionsRef.current = next.actions;
      if (next.audit) auditRef.current = next.audit;
      try {
        window.localStorage.setItem(
          KEY,
          JSON.stringify({
            session: sessionRef.current,
            decisionStatus: Object.fromEntries(decisionsRef.current.map((d) => [d.id, d.status])),
            actionStatus: Object.fromEntries(actionsRef.current.map((a) => [a.id, a.status])),
            audit: auditRef.current,
          }),
        );
      } catch {
        /* storage unavailable */
      }
    },
    [],
  );

  const log = useCallback(
    (action: string, object: string, detail: string) => {
      setAudit((prev) => {
        const actor = sessionRef.current;
        const next = [
          {
            id: `aud-${Date.now()}-${Math.round(Math.random() * 1000)}`,
            at: now(),
            actor: actor ? `${actor.name}, ${ROLE_LABEL[actor.role]}` : "Unknown user",
            action,
            object,
            detail,
          },
          ...prev,
        ];
        persist({ audit: next });
        return next;
      });
    },
    [persist],
  );

  const value = useMemo<WorkspaceState>(
    () => ({
      session,
      hydrated,
      decisions,
      actions,
      audit,
      log,
      signIn: (s) => {
        setSession(s);
        persist({ session: s });
      },
      signOut: () => {
        setSession(null);
        persist({ session: null });
      },
      updateSession: (patch) => {
        setSession((prev) => {
          const next = prev ? { ...prev, ...patch } : null;
          persist({ session: next });
          return next;
        });
      },
      setDecisionStatus: (id, status, optionLabel) => {
        setDecisions((prev) => {
          const next = prev.map((d) => (d.id === id ? { ...d, status } : d));
          persist({ decisions: next });
          return next;
        });
        const d = decisions.find((x) => x.id === id);
        log(
          status === "approved"
            ? "Decision approved"
            : status === "deferred"
              ? "Decision deferred"
              : "Clarification requested",
          `${id} · ${d?.statement ?? ""}`,
          optionLabel ? `Option: ${optionLabel}` : "No option selected.",
        );
      },
      setActionStatus: (id, status) => {
        setActions((prev) => {
          const next = prev.map((a) => (a.id === id ? { ...a, status } : a));
          persist({ actions: next });
          return next;
        });
        const a = actions.find((x) => x.id === id);
        log("Action updated", `${id} · ${a?.outcome ?? ""}`, `Status set to ${status}.`);
      },
      reset: () => {
        setDecisions(DECISIONS);
        setActions(ACTIONS);
        setAudit(AUDIT_SEED);
        setSession(null);
        try {
          window.localStorage.removeItem(KEY);
        } catch {
          /* noop */
        }
      },
    }),
    [session, hydrated, decisions, actions, audit, persist, log],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
}
