import {
  siJira,
  siMailchimp,
  siSap,
  siZendesk,
  type SimpleIcon,
} from "simple-icons";
import { cn } from "@/lib/utils";

const icons: Record<string, SimpleIcon> = {
  sap: siSap,
  mailchimp: siMailchimp,
  zendesk: siZendesk,
  jira: siJira,
};

export function IntegrationLogo({ brand, className }: { brand: string; className?: string }) {
  const icon = icons[brand];
  if (brand === "salesforce") {
    return (
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-md bg-muted", className)} role="img" aria-label="Salesforce logo">
        <svg viewBox="0 0 38 27" className="h-5 w-7" aria-hidden="true">
          <path d="M15 3.4a8 8 0 0 1 11.9 3.4 6.5 6.5 0 0 1 8.8 6.1 6.5 6.5 0 0 1-6.5 6.5H9.1a7.1 7.1 0 1 1 1.8-14A8.1 8.1 0 0 1 15 3.4Z" fill="#0D9DDA"/>
          <text x="19" y="15.5" textAnchor="middle" fill="white" fontSize="5.2" fontFamily="Arial" fontWeight="700">salesforce</text>
        </svg>
      </span>
    );
  }
  if (brand === "workday") {
    return (
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-md bg-muted", className)} role="img" aria-label="Workday logo">
        <svg viewBox="0 0 36 28" className="h-6 w-7" aria-hidden="true">
          <path d="M7 14a11 11 0 0 1 22 0" fill="none" stroke="#F5A623" strokeWidth="3" strokeLinecap="round"/>
          <text x="18" y="23" textAnchor="middle" fill="#143D62" fontSize="7" fontFamily="Arial" fontWeight="700">workday</text>
        </svg>
      </span>
    );
  }
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
