import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/trust")({
  beforeLoad: () => {
    throw redirect({ to: "/app/audit" });
  },
});
