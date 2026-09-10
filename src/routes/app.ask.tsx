import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Plus, Sparkle } from "lucide-react";
import { AnswerChart } from "@/components/app/answer-chart";
import { EvidenceAccordion } from "@/components/app/evidence";
import { Btn, Card, KpiCard, Pill } from "@/components/app/primitives";
import { ask, SUGGESTED_QUESTIONS, type AskAnswer } from "@/lib/ask";
import { useWorkspace } from "@/lib/workspace";
import { ORG } from "@/lib/demo-data";

interface AskSearch {
  q?: string;
}

export const Route = createFileRoute("/app/ask")({
  validateSearch: (search: Record<string, unknown>): AskSearch =>
    typeof search["q"] === "string" && search["q"] ? { q: search["q"] } : {},
  head: () => ({
    meta: [{ title: "Ask — Bearing" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AskPage,
});

interface Turn {
  id: string;
  question: string;
  answer: AskAnswer;
}

function AskPage() {
  const { decisions, recordQuestion } = useWorkspace();
  const navigate = useNavigate();
  const { q } = Route.useSearch();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const handled = useRef<string | null>(null);

  const submit = (question: string) => {
    const text = question.trim();
    if (!text) return;
    setTurns((prev) => [
      ...prev,
      { id: `t-${Date.now()}-${prev.length}`, question: text, answer: ask(text, decisions) },
    ]);
    setInput("");
    recordQuestion(text);
  };

  useEffect(() => {
    if (q && handled.current !== q) {
      handled.current = q;
      submit(q);
      void navigate({ to: "/app/ask", replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  useEffect(() => {
    if (turns.length) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns.length]);

  const composer = (big: boolean) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(input);
      }}
      className="relative"
    >
      <label htmlFor="ask-input" className="sr-only">
        Ask a question about {ORG.name}
      </label>
      <textarea
        id="ask-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit(input);
          }
        }}
        rows={big ? 3 : 2}
        placeholder="Ask about cash, margin, customers, delivery, risks or decisions…"
        className="w-full resize-none rounded-lg border border-rule bg-card py-3 pl-3.5 pr-14 text-[14px] outline-none transition-colors placeholder:text-muted-foreground focus:border-signal"
      />
      <button
        type="submit"
        aria-label="Send question"
        disabled={!input.trim()}
        className="absolute bottom-3 right-3 inline-flex size-8 items-center justify-center rounded-md border border-navy bg-navy text-white transition-opacity disabled:opacity-40"
      >
        <ArrowUp className="size-4" aria-hidden="true" />
      </button>
    </form>
  );

  if (turns.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70dvh] max-w-2xl flex-col justify-center py-6">
        <div className="text-center">
          <Pill tone="signal">
            <Sparkle className="size-3" aria-hidden="true" /> Demo workspace · Fictional data
          </Pill>
          <h1 className="mt-4 text-[24px] font-semibold tracking-tight sm:text-[28px]">
            What do you want to understand about the business?
          </h1>
          <p className="mt-2 text-[13.5px] text-muted-foreground">
            {ORG.name} · 12 weeks of simulated finance, revenue, delivery and workforce records.
          </p>
        </div>

        <div className="mt-6">{composer(true)}</div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {SUGGESTED_QUESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => submit(s)}
              className="rounded-lg border border-rule bg-card px-3.5 py-3 text-left text-[13.5px] font-medium transition-colors hover:border-signal hover:bg-signal-soft"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-6rem)] flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-rule pb-3">
        <div>
          <h1 className="text-[17px] font-semibold tracking-tight">Ask</h1>
          <p className="text-[12.5px] text-muted-foreground">{ORG.name} · demo dataset</p>
        </div>
        <Btn onClick={() => setTurns([])}>
          <Plus className="size-3.5" aria-hidden="true" /> New chat
        </Btn>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 space-y-8 py-6">
        {turns.map((t) => (
          <AnswerBlock key={t.id} turn={t} />
        ))}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 -mx-4 border-t border-rule bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="mx-auto max-w-3xl">{composer(false)}</div>
      </div>
    </div>
  );
}

function AnswerBlock({ turn }: { turn: Turn }) {
  const a = turn.answer;
  return (
    <article className="space-y-3">
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-lg bg-navy px-3.5 py-2 text-[14px] text-white">
          {turn.question}
        </p>
      </div>

      {a.insufficient ? (
        <Card className="p-4">
          <Pill tone="caution">Insufficient evidence</Pill>
          <p className="mt-2 text-[15px] font-medium">{a.headline}</p>
          <ul className="mt-2 space-y-1 text-[13px] text-muted-foreground">
            {a.missing?.map((m) => (
              <li key={m}>· {m}</li>
            ))}
          </ul>
          <div className="mt-3">
            <Link
              to="/app/sources"
              className="text-[13px] font-medium text-signal underline underline-offset-2"
            >
              Review connected sources
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          <p className="text-[16px] leading-relaxed">{a.headline}</p>

          {a.kpis.length ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {a.kpis.map((k) => (
                <KpiCard key={k.label} kpi={k} />
              ))}
            </div>
          ) : null}

          {a.chart ? <AnswerChart spec={a.chart} /> : null}

          {a.table ? (
            <Card className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-rule text-left text-muted-foreground">
                    {a.table.columns.map((c) => (
                      <th key={c} className="px-3.5 py-2 font-medium">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {a.table.rows.map((r, i) => (
                    <tr key={i} className="border-b border-rule last:border-0">
                      {r.map((cell, j) => (
                        <td key={j} className="px-3.5 py-2 align-top">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ) : null}

          {a.findings.length ? (
            <ul className="space-y-1.5">
              {a.findings.map((f) => (
                <li key={f} className="flex gap-2 text-[14px]">
                  <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-signal" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {a.nextAction ? (
            <Card className="border-signal/40 bg-signal-soft p-3.5">
              <p className="text-[12px] font-medium uppercase tracking-wide text-navy">
                Recommended next action
              </p>
              <p className="mt-1 text-[14px] font-medium">{a.nextAction.label}</p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">{a.nextAction.detail}</p>
              {a.nextAction.to ? (
                <Link
                  to={a.nextAction.to}
                  className="mt-2 inline-flex h-8 items-center rounded-md border border-navy bg-navy px-3 text-[12.5px] font-medium text-white"
                >
                  Open
                </Link>
              ) : null}
            </Card>
          ) : null}

          <EvidenceAccordion
            ids={a.evidenceIds}
            confidence={a.confidence}
            freshness={a.freshness}
          />
        </div>
      )}
    </article>
  );
}
