import { useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { MonoLabel, StatePill } from "@/components/ui-kit";
import { EvidenceButton } from "@/components/evidence-drawer";
import { ask, SUGGESTED_QUESTIONS, type AskAnswer } from "@/lib/ask";
import { useWorkspace } from "@/lib/workspace";

export function GlobalAsk() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<AskAnswer | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { decisions, log } = useWorkspace();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const run = (question: string) => {
    if (!question.trim()) return;
    setQ(question);
    setLoading(true);
    setAnswer(null);
    window.setTimeout(() => {
      const a = ask(question, decisions);
      setAnswer(a);
      setLoading(false);
      log("Question asked", "Global Ask", `"${question.trim()}" — ${a.insufficient ? "answered as insufficient evidence" : "answered with evidence"}.`);
    }, 420);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 w-full min-w-0 items-center gap-2 border border-rule bg-background px-3 text-left text-[14px] text-muted-foreground transition-colors hover:border-navy hover:bg-muted"
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="truncate">Ask about what changed…</span>
        <kbd className="label-mono ml-auto hidden shrink-0 border border-rule px-1.5 py-0.5 lg:inline">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85dvh] w-[calc(100vw-2rem)] max-w-2xl overflow-y-auto rounded-none border-rule p-0 sm:w-full">
          <DialogTitle className="sr-only">Ask Bearing</DialogTitle>
          <DialogDescription className="sr-only">
            Ask an evidence-backed question about the sample company.
          </DialogDescription>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(q);
            }}
            className="flex items-center gap-3 border-b border-rule px-4 py-3"
          >
            <Search className="size-4 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="global-ask" className="sr-only">
              Ask a question
            </label>
            <input
              id="global-ask"
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="What changed in cash this week?"
              autoComplete="off"
              className="min-h-11 w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!q.trim() || loading}
              className="label-mono min-h-11 shrink-0 border border-navy bg-navy px-3 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Ask
            </button>
          </form>

          <div className="p-4 sm:p-5">
            {loading ? (
              <p className="flex items-center gap-2 text-[15px] text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Checking the evidence…
              </p>
            ) : answer ? (
              <div>
                {answer.insufficient ? <StatePill tone="caution">Insufficient evidence</StatePill> : null}
                <p className="mt-2 text-[17px] leading-relaxed text-foreground">{answer.answer}</p>
                {answer.impact ? (
                  <p className="mt-3 border-l-2 border-signal pl-3 text-[15px]">{answer.impact}</p>
                ) : null}
                {answer.detail?.length ? (
                  <ul className="mt-4 space-y-1.5 text-[14px] text-muted-foreground">
                    {answer.detail.map((d) => (
                      <li key={d} className="border-t border-rule pt-1.5">
                        {d}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {answer.missing?.length ? (
                  <ul className="mt-4 space-y-1.5 text-[14px] text-muted-foreground">
                    {answer.missing.map((d) => (
                      <li key={d} className="border-t border-rule pt-1.5">
                        {d}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {answer.uncertainty ? (
                  <p className="mt-4 text-[14px] text-caution">Uncertainty: {answer.uncertainty}</p>
                ) : null}
                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-rule pt-4">
                  <MonoLabel>Data as at {answer.freshness}</MonoLabel>
                  <MonoLabel>Confidence {answer.confidence}</MonoLabel>
                  <EvidenceButton ids={answer.evidenceIds} relatedTo="Answer evidence" />
                </div>
                <p className="mt-3 text-[13px] text-muted-foreground">
                  Bearing answers from evidence and never takes an action on your behalf.
                </p>
              </div>
            ) : (
              <div>
                <MonoLabel>Try asking</MonoLabel>
                <ul className="mt-3 space-y-2">
                  {SUGGESTED_QUESTIONS.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => run(s)}
                        className="min-h-11 w-full border border-rule px-3 py-2 text-left text-[15px] transition-colors hover:border-navy hover:bg-muted"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
