# Executive Compass

You are the product strategist, brand director, UX lead, senior full-stack engineer, AI systems architect, security reviewer, and QA owner for the first software product from AWF Consultants.
Your mission is to design, build, test, and prepare a production-quality MVP of an AI-driven executive operations platform for mid-market companies.
Do not stop at concepts, wireframes, recommendations, or static screens. Build a coherent, functional product and keep improving it until the definition of done in this prompt is satisfied.

## 1. Non-negotiable independence

This must be an entirely original AWF Consultants product.
Never mention, reference, imply, or include:

- Any previous prototype, product, company, codebase, or source concept
- Language such as “inspired by,” “based on,” “rebranded from,” “migration,” or “version of”
- Placeholder references to another organization
- Third-party logos presented as customers or partners
- Capabilities or integrations that have not actually been implemented

All naming, product language, positioning, UX, visual identity, architecture, and documentation must appear to have been created specifically for AWF Consultants.
Create this as a new, separate project. Do not overwrite or modify the AWF Consultants company website.

## 2. Brand source

Study the live AWF Consultants website before designing:
[https://awf-consultants.lovable.app/](https://awf-consultants.lovable.app/)
Treat it as the authoritative visual source. Extract its design system, including:

- AWF navy, white, black, cool gray, and restrained signal-blue colors
- Large, precise editorial typography
- Monospaced uppercase labels with generous letter spacing
- Strong grid alignment
- Thin rules and technical dividers
- Sharp or minimally rounded corners
- Spacious white-first layouts
- Operational diagrams, nodes, connectors, and directional flows
- Restrained motion
- Minimal shadows
- High information clarity
- Enterprise-grade visual discipline

The product must clearly belong to the AWF brand family while still feeling like a dedicated software platform.
Do not use:

- Gradients
- Glassmorphism
- Neon AI effects
- Excessive card grids
- Decorative stock photography
- Generic chatbot imagery
- Oversized rounded “startup” components
- Dense dashboards full of meaningless charts
- Fake customer logos
- Visual clutter

Use the AWF logo and vector mark where available. Reconstruct it as a clean SVG only if an appropriate source asset is unavailable.

## 3. Product vision

Create an AI-driven executive operations platform that helps CEOs, owners, managing directors, and COOs understand what changed across their business, recognize what requires judgment, make informed decisions, and ensure follow-through.
The north-star experience is:
“Understand what changed. See what matters. Make the decision. Leave with confidence.”
The product should behave like an operational intelligence layer across finance, revenue, customers, delivery, workforce, and execution.
It must translate fragmented operational data into:

1. Material changes
2. Ranked risks
3. Decisions requiring human judgment
4. Recommended actions
5. Assigned follow-through
6. Evidence that can be inspected on demand

The product is not a generic analytics dashboard and not a chat wrapper.
Its value comes from compressing hours of operational review into a focused executive briefing that can be understood in under a minute.
Speak primarily in:

- Money
- Operational impact
- Risk
- Ownership
- Urgency
- Time
- Confidence
- Evidence

Avoid leading with technical language about models, agents, pipelines, embeddings, or system architecture in the user-facing experience.

## 4. Target customer

Primary customer:

- A mid-market company with approximately 50–1,500 employees
- Operational information spread across finance, CRM, service delivery, project, support, and workforce systems
- A CEO, owner, managing director, or COO who lacks a reliable daily view
- Leadership teams currently assembling status through spreadsheets, meetings, messages, and manual reports
- Organizations where delayed decisions create financial or operational consequences

Secondary users:

- Functional executives
- Department owners
- Operations leaders
- Finance leaders
- Trusted advisors
- Workspace administrators

Design for an executive who has limited time and expects the product to immediately answer:

- What changed?
- Why does it matter?
- What needs my decision?
- What happens if I wait?
- Who owns the next step?
- What evidence supports this?

## 5. Product naming

Develop an original, concise product name suitable for premium enterprise software.
Internally generate and assess at least ten possibilities against:

- Distinctiveness
- Executive credibility
- Relevance to operational intelligence
- Ease of pronunciation
- Visual compatibility with AWF
- Ability to support a product family
- Lack of obvious category confusion

Select the strongest name autonomously and use it consistently.
Present it as:
“[Product Name] by AWF Consultants”
Treat the selected name as a working commercial name pending formal legal and trademark clearance. Do not claim trademark or domain availability unless verified.
Do not pause the build for naming approval.

## 6. Product information architecture

The authenticated application should have these primary destinations:

- Today
- Risks
- Decisions
- Actions

Secondary administration destinations:

- Connections
- Trust & Audit
- Settings

Use Today as the default authenticated home.
Provide a persistent global command and question interface in the application header. Do not create a separate generic chat page.
Clicking the product logo must always return the user to Today.
Keep navigation concise and executive-friendly.

## 7. Core product experience

### Today

Create a daily executive briefing with a clear opening such as:
“Good morning, Maya. Here’s what changed.”
The page should immediately show:

- Current data freshness
- Number of items requiring attention
- Decisions waiting for the executive
- Material change since the previous briefing
- Three to five ranked operational signals

Every signal should explain:

- What changed
- Why it matters
- Estimated financial or operational impact
- Urgency
- Confidence
- Responsible owner
- Recommended next decision or action
- Evidence availability

Avoid KPI wallpaper. Every visible metric must support a decision.
Include examples across finance, sales, customers, delivery, and workforce, but keep the daily brief deliberately focused.

### Risks

Create a ranked risk register based on materiality and urgency.
Support:

- New, changed, improving, stable, and resolved states
- Materiality
- Probability or confidence
- Estimated impact
- Time horizon
- Owner
- Related evidence
- Related decision
- Recommended response
- Clear resolution state

Use minimal, purposeful filtering. Do not turn this into a spreadsheet clone.

### Decisions

Create structured decision briefs containing:

- Decision statement
- Why the decision is required now
- Relevant context
- Options
- Trade-offs
- Recommended option
- Expected impact
- Consequence of delay
- Supporting evidence
- Confidence level
- Owner
- Deadline
- Approve, defer, request clarification, and assign follow-through controls

Approving or deferring a decision must visibly update its state and create an audit event.

### Actions

Actions exist to protect follow-through, not to replace project-management software.
Each action should contain:

- Clear outcome
- Owner
- Due date
- Status
- Priority
- Blocker
- Related risk
- Related decision
- Completion evidence

Do not add kanban boards, sprints, complex dependencies, or workflow builders to the MVP.

### Global Ask

Place a command/search field in the main application header.
It should support evidence-aware questions such as:

- “What changed in cash this week?”
- “Which customer issue has the largest revenue exposure?”
- “What decisions are waiting for me?”
- “Why is delivery margin falling?”
- “What happens if we defer the hiring decision?”

Responses must:

- Be concise
- Lead with the answer
- Identify impact
- Link to supporting evidence
- State data freshness
- Express uncertainty
- Refuse to invent an answer when evidence is insufficient
- Never imply an action was taken unless a human approved it

Provide useful suggested questions in the empty state.

## 8. Evidence and trust

Evidence is a first-class product feature.
Any AI-generated signal, risk, explanation, or recommendation must expose an evidence drawer showing:

- Source category
- Underlying record or metric
- Relevant date range
- Last synchronization time
- Calculation or reasoning summary
- Confidence
- Missing data
- Data-quality warnings
- Link back to the related operational object

Clearly distinguish:

- Verified fact
- Calculated value
- AI inference
- Recommendation
- Missing or stale information

The system must never fabricate operational facts.
If evidence is missing or stale, say so plainly and recommend the safest next step.

## 9. Connections

For the MVP, organize integrations around three business data categories:

- Finance
- Revenue and customers
- Operations and delivery

Create a polished connection interface with:

- Connected
- Needs attention
- Synchronizing
- Read-only
- Permission required
- Error
- Not configured

Use plain-language permission descriptions.
Provide a real CSV import path or a clearly functional demo-data loader. Other integrations may be presented as planned or simulated only when visibly labeled. Never suggest a live integration exists when it does not.
Architect connectors so future finance, CRM, service-management, workforce, and project platforms can be added without redesigning the core product.

## 10. Demo organization

Include a seeded fictional mid-market company so the product is valuable immediately.
The demo data should include:

- Twelve weeks of financial and operational history
- Revenue and pipeline movement
- Cash-position changes
- Margin movement
- Customer health
- Delivery performance
- Capacity constraints
- Workforce or hiring pressure
- Several resolved historical signals
- Current risks
- Decisions awaiting review
- Assigned actions
- Evidence records
- Audit activity

All demo information must be clearly labeled as sample data.
Use realistic relationships between data points. Avoid random metrics that contradict one another.

## 11. Onboarding

Create a short guided onboarding flow:

1. Welcome and product promise
2. Select executive role
3. Choose business priorities
4. Load sample company or connect data
5. Explain read-only permissions
6. Generate the first briefing
7. Arrive on Today

The user should experience meaningful value within three minutes.
Do not require a real integration before the product can be explored.

## 12. Roles and permissions

Support an initial role model:

- Executive: reviews risks, makes decisions, and sees organization-wide information
- Operator: investigates signals and owns follow-through
- Advisor: reviews evidence and contributes recommendations
- Administrator: manages users, connections, permissions, and settings

Ensure sensitive operations require authorization.
AI may recommend. Humans approve consequential actions.
All important state changes must create audit records.

## 13. Core data model

Create a clean schema around these entities:

- Organization
- User
- Membership
- Role
- SourceConnection
- DataSnapshot
- Metric
- Signal
- EvidenceRecord
- Risk
- Decision
- DecisionOption
- Action
- Comment
- AIQuery
- AuditEvent
- NotificationPreference

Model relationships explicitly.
Every risk, decision, recommendation, and action should be traceable to evidence and an organization.
Do not expose sensitive data across organizations.

## 14. AI behavior

Define and implement a central AI behavior policy:

- Evidence before assertion
- No invented facts
- Clear separation between fact, inference, and recommendation
- Concise executive language
- Material information first
- State uncertainty
- Surface stale or contradictory data
- Avoid false precision
- Never execute a consequential action without explicit approval
- Preserve an audit trail
- Explain why an item matters
- Prefer a small number of high-value signals over a large number of weak alerts

When insufficient evidence exists, the correct behavior is:
“I don’t have enough current evidence to answer that reliably.”
Then identify what information is missing.

## 15. Technical direction

Build the product using a production-capable TypeScript stack.
Preferred implementation:

- Next.js App Router
- TypeScript
- React Server Components where appropriate
- Tailwind CSS
- Accessible headless components or shadcn/ui used selectively
- Zod validation
- PostgreSQL-compatible schema
- Secure authentication architecture
- Server-side organization scoping
- Component and integration tests
- Browser-level end-to-end testing

If the selected build environment requires a different React stack, preserve the same architectural standards and document the deviation.
Structure the system so seeded local data can later be replaced by real services without rebuilding the UI.
Avoid unnecessary dependencies and premature infrastructure.

## 16. Public and authenticated surfaces

Create only the public surfaces required to explain and enter the product:

- Product landing page
- Sign-in
- Privacy/security summary
- Contact or request-access route

The company website remains the primary AWF corporate presence.
Authenticated application pages should not be indexed by search engines.
For public pages, provide:

- Correct metadata
- Semantic headings
- Canonical URLs
- Open Graph metadata
- Sitemap
- Robots configuration
- Product structured data where appropriate
- Fast server-rendered content

## 17. Design standards

The experience should feel appropriate for a CEO running a serious company.
Use:

- White-first canvases
- AWF navy for authority
- Restrained signal blue for active operational states
- Near-black typography
- Cool-gray secondary surfaces
- Thin borders
- Square or subtly rounded geometry
- Clear typographic hierarchy
- Monospaced operational labels
- Purposeful whitespace
- Calm micro-interactions
- High-density detail only inside evidence views

Typography must remain readable:

- Main body approximately 16px
- Supporting text generally no smaller than 14px
- Comfortable line height
- Strong contrast
- Clear keyboard focus

Do not make the interface look like a cryptocurrency dashboard, developer console, consumer productivity tool, or generic AI startup.

## 18. Required interaction states

Every meaningful feature must include:

- Default state
- Hover state
- Keyboard-focus state
- Loading state
- Empty state
- Success state
- Error state
- Disabled state
- Stale-data state
- Insufficient-evidence state

No dead buttons.
If a feature is intentionally unavailable, label it honestly rather than presenting a non-functional control.

## 19. Accessibility

Meet WCAG 2.2 AA standards.
Verify:

- Full keyboard navigation
- Visible focus
- Semantic landmarks
- Correct heading order
- Form labels and error messaging
- Screen-reader names
- Color contrast
- Reduced-motion support
- 200% browser zoom
- Reflow at 320px
- Touch-target sizing
- Dialog focus management
- No information conveyed by color alone

## 20. Security and governance

Design for enterprise trust from the beginning:

- Organization-level data isolation
- Least-privilege access
- Read-only connectors by default
- Secure session handling
- Server-side authorization
- Input validation
- Protection against common web vulnerabilities
- No secrets in client code
- Audit events for consequential activity
- Data-retention controls
- User access revocation
- Export and deletion considerations
- Clear indication of demo versus real data

Do not claim certifications that have not been earned.
It is acceptable to describe controls as “designed for” future compliance, but never claim the product is SOC 2, ISO 27001, HIPAA, or otherwise certified without evidence.

## 21. Scope control

The MVP must not become:

- A full ERP
- A project-management suite
- A workflow automation builder
- A generic business-intelligence tool
- An autonomous decision-maker
- A chatbot-only interface
- A collection of decorative dashboards
- A marketplace of premature integrations

Prioritize the smallest product that convincingly delivers executive clarity, decisions, evidence, and follow-through.

## 22. Autonomous execution process

Proceed without asking routine clarification questions.
Use reasonable assumptions and record them briefly.
Execute in this order:

1. Inspect the AWF website and derive brand tokens
2. Define product positioning and select the original name
3. Establish the MVP scope
4. Define routes, data model, and key user journeys
5. Create the component and design system
6. Build the seeded demo experience
7. Implement all primary product routes
8. Implement functional interactions
9. Add evidence and audit behavior
10. Add onboarding and responsive states
11. Run automated and browser QA
12. Repair every material issue
13. Repeat QA until the release criteria pass
14. Deliver the preview, documentation, and final QA report

Do not stop after producing a plan. Begin building.

## 23. QA requirements

Test at minimum:

- 320px
- 375px
- 768px
- 1024px
- 1440px
- 1920px

Verify:

- All pages load
- Logo returns to Today
- Navigation works
- Global Ask works with seeded evidence
- Risks can be inspected
- Decisions can be approved and deferred
- Actions update correctly
- Evidence drawers work
- Audit records appear
- Onboarding completes
- Demo mode is obvious
- Empty and error states render
- No horizontal overflow
- No clipped text
- No overlapping controls
- No broken links
- No dead buttons
- No console errors
- No hydration errors
- No obvious layout shift
- Keyboard navigation works
- Focus remains visible
- Reduced motion is honored
- Build, lint, typecheck, and tests pass

Target for public pages:

- Performance: 90 or higher
- Accessibility: 95 or higher
- Best Practices: 95 or higher
- SEO: 95 or higher

Treat these as measurable targets, not claims. Report actual results honestly.
Perform at least three complete QA passes:

- Functional QA
- Responsive and visual QA
- Accessibility, performance, and production-readiness QA

After each pass, fix issues and rerun affected tests.

## 24. Definition of done

The product is done only when:

- It has a distinctive AWF-native identity
- It clearly communicates its value within ten seconds
- Today delivers a useful executive briefing
- Every AI statement can expose evidence
- Risks, decisions, and actions form one traceable operational loop
- The primary interactions work
- Demo mode tells a coherent business story
- The interface works on mobile and desktop
- Accessibility requirements pass
- No material console or build errors remain
- No unrelated company or product is referenced
- No unimplemented capability is presented as live
- The QA report includes tests performed, defects found, fixes made, and known limitations
- The final preview feels credible enough to demonstrate to a mid-market CEO

## 25. Final handoff

When complete, provide:

1. Selected product name and one-sentence positioning
2. Live preview or runnable project
3. Route map
4. Feature summary
5. Architecture summary
6. Data-model summary
7. AI behavior and evidence policy
8. Security assumptions
9. QA report with actual results
10. Known limitations
11. Recommended next production milestone

Keep the final handoff concise and decision-oriented.
Begin now. Inspect the AWF Consultants website first, establish the product identity, and then build the complete MVP. Do not ask me questions unless an external permission, credential, or legally consequential decision makes continued work impossible.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://awf-bearing.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3d6d0188-686d-4afe-8e41-522f6c05c833).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
