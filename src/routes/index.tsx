import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bearing by AWF Consulting — Executive operations intelligence" },
      {
        name: "description",
        content:
          "Bearing is the executive operations platform from AWF Consulting: ask a question, get a decision-ready answer with charts and evidence.",
      },
      { property: "og:title", content: "Bearing by AWF Consulting" },
      {
        property: "og:description",
        content: "Ask a question, get a decision-ready answer with charts and evidence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RootRedirect,
});

function RootRedirect() {
  const { session, hydrated } = useWorkspace();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;
    void navigate({ to: session ? "/app/ask" : "/signin", replace: true });
  }, [hydrated, session, navigate]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface">
      <p className="text-[13px] text-muted-foreground">Loading Bearing…</p>
    </div>
  );
}
