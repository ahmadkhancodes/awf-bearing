import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ProductLogo } from "@/components/brand";
import { MonoLabel } from "@/components/ui-kit";

export function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4 sm:px-6">
        <Link to="/" aria-label="Bearing — product overview">
          <ProductLogo />
        </Link>
        <nav aria-label="Product" className="ml-auto flex items-center gap-x-5">
          <Link
            to="/security"
            className="label-mono min-h-11 content-center text-foreground hover:text-signal"
          >
            Security
          </Link>
          <Link
            to="/request-access"
            className="label-mono min-h-11 content-center text-foreground hover:text-signal"
          >
            Request access
          </Link>
          <Link
            to="/signin"
            className="label-mono inline-flex min-h-11 items-center border border-navy bg-navy px-3.5 text-white transition-opacity hover:opacity-90"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto]">
        <div>
          <ProductLogo />
          <p className="mt-3 max-w-md text-[14px] text-muted-foreground">
            Bearing is the first software product from AWF Consultants. Bearing is a working
            commercial name pending formal legal and trademark clearance.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end">
          <Link to="/security" className="label-mono min-h-11 content-center hover:text-signal">
            Privacy & security
          </Link>
          <Link
            to="/request-access"
            className="label-mono min-h-11 content-center hover:text-signal"
          >
            Request access
          </Link>
          <Link to="/signin" className="label-mono min-h-11 content-center hover:text-signal">
            Sign in
          </Link>
        </nav>
      </div>
      <div className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <MonoLabel>© {new Date().getFullYear()} AWF Consultants</MonoLabel>
        </div>
      </div>
    </footer>
  );
}

export function SitePage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#main"
        className="label-mono sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:border focus:border-navy focus:bg-background focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}
