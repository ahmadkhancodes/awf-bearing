import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/sources")({
  beforeLoad: () => {
    throw redirect({ to: "/app/connections", replace: true });
  },
});
