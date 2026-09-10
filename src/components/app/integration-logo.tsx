import {
  siJira,
  siMailchimp,
  siSalesforce,
  siSap,
  siWorkday,
  siZendesk,
  type SimpleIcon,
} from "simple-icons";
import { cn } from "@/lib/utils";

const icons: Record<string, SimpleIcon> = {
  sap: siSap,
  salesforce: siSalesforce,
  mailchimp: siMailchimp,
  zendesk: siZendesk,
  workday: siWorkday,
  jira: siJira,
};

export function IntegrationLogo({ brand, className }: { brand: string; className?: string }) {
  const icon = icons[brand];
  if (!icon) return null;
  return (
    <span
      className={cn("flex size-9 shrink-0 items-center justify-center rounded-md bg-muted", className)}
      aria-label={`${icon.title} logo`}
      role="img"
    >
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
        <path d={icon.path} fill={`#${icon.hex}`} />
      </svg>
    </span>
  );
}
