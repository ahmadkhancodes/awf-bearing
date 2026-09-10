import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SitePage } from "@/components/site-chrome";
import { MonoLabel } from "@/components/ui-kit";

export const Route = createFileRoute("/request-access")({
  head: () => ({
    meta: [
      { title: "Request access — Bearing by AWF Consultants" },
      {
        name: "description",
        content:
          "Request an evaluation of Bearing, the executive operations platform from AWF Consultants, for a mid-market company.",
      },
      { property: "og:title", content: "Request access — Bearing by AWF Consultants" },
      { property: "og:description", content: "Request an evaluation of Bearing for your leadership team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://awf-bearing.lovable.app/request-access" }],
  }),
  component: RequestAccess,
});

const schema = z.object({
  name: z.string().min(2, "Enter your full name."),
  email: z.string().email("Enter a valid work email address."),
  company: z.string().min(2, "Enter your company name."),
  note: z.string().max(600, "Keep this under 600 characters.").optional(),
});

function RequestAccess() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  return (
    <SitePage>
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <MonoLabel>Request access</MonoLabel>
        <h1 className="mt-4 text-4xl font-semibold">Talk to AWF Consultants about Bearing</h1>
        <p className="mt-4 text-[16px] text-muted-foreground">
          Bearing is in controlled release for mid-market companies of roughly 50–1,500 people. Tell
          us where your operational picture breaks down and we will arrange an evaluation.
        </p>

        {done ? (
          <div
            role="status"
            className="mt-8 border border-positive/40 bg-positive/6 p-5"
          >
            <MonoLabel className="text-positive">Request captured</MonoLabel>
            <p className="mt-2 text-[15px]">
              Your details were captured in this preview only — nothing was transmitted, because no
              messaging service is connected yet. In the meantime, the sample workspace is open to
              explore.
            </p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="label-mono mt-4 min-h-11 border border-rule px-3 hover:border-navy hover:bg-muted"
            >
              Submit another
            </button>
          </div>
        ) : (
          <form
            noValidate
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const parsed = schema.safeParse({
                name: String(fd.get("name") ?? ""),
                email: String(fd.get("email") ?? ""),
                company: String(fd.get("company") ?? ""),
                note: String(fd.get("note") ?? ""),
              });
              if (!parsed.success) {
                const next: Record<string, string> = {};
                for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
                setErrors(next);
                return;
              }
              setErrors({});
              setDone(true);
            }}
          >
            <Field name="name" label="Full name" error={errors["name"]} autoComplete="name" />
            <Field name="email" label="Work email" type="email" error={errors["email"]} autoComplete="email" />
            <Field name="company" label="Company" error={errors["company"]} autoComplete="organization" />
            <div>
              <label htmlFor="note" className="label-mono text-foreground">
                What is hard to see today? (optional)
              </label>
              <textarea
                id="note"
                name="note"
                rows={4}
                aria-invalid={Boolean(errors["note"])}
                aria-describedby={errors["note"] ? "note-error" : undefined}
                className="mt-2 w-full border border-rule bg-background px-3 py-2 text-[15px] outline-none focus-visible:border-navy"
              />
              {errors["note"] ? (
                <p id="note-error" className="mt-1 text-[14px] text-critical">
                  {errors["note"]}
                </p>
              ) : null}
            </div>
            <button
              type="submit"
              className="label-mono min-h-11 border border-navy bg-navy px-5 text-white transition-opacity hover:opacity-90"
            >
              Send request
            </button>
            <p className="text-[14px] text-muted-foreground">
              This preview does not transmit your details anywhere; no email service is connected.
            </p>
          </form>
        )}
      </div>
    </SitePage>
  );
}

function Field({
  name,
  label,
  error,
  type = "text",
  autoComplete,
}: {
  name: string;
  label: string;
  error?: string | undefined;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="label-mono text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className="mt-2 min-h-11 w-full border border-rule bg-background px-3 text-[15px] outline-none focus-visible:border-navy"
      />
      {error ? (
        <p id={`${name}-error`} className="mt-1 text-[14px] text-critical">
          {error}
        </p>
      ) : null}
    </div>
  );
}
