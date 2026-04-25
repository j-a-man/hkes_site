Design a complete, production-ready website for HKES — Binghamton Hong Kong Exchange Square — a university cultural and social organization at Binghamton University. The site should feel modern, premium, and culturally rich, blending a Hong Kong-inspired identity with clean UI/UX principles. Every page and portal section must be fully designed with realistic placeholder content, not lorem ipsum — use culturally relevant copy.

🎨 DESIGN SYSTEM
Primary Color: Hong Kong Red #DE2910
Secondary: Warm coral gradient #FF6B6B → #FF9A5C (used for accents, cards, blobs)
Background: Crisp white #FFFFFF with soft off-white sections #FFF8F6
Text: Near-black #1A1A1A for headings, #555555 for body
Accent: Gold #D4A843 for subtle cultural touches (borders, icons, highlights)
Typography: Display headings in a bold modern sans-serif (e.g. Clash Display or Plus Jakarta Sans Bold); body in Inter or DM Sans. Mix weight heavily for hierarchy.
Style Language: Glassmorphism cards with backdrop-filter: blur on a red/coral gradient background. Floating organic blob shapes (like the reference image provided). Smooth rounded corners (24px–32px radius on cards). Subtle drop shadows. Micro-animations implied through design notes.

📐 GLOBAL COMPONENTS (design these first as a component library)

Navbar: Fixed top. Left: HKES logo (client-provided). Center: Home, Events, Fundraisers, Gallery, Blog, Contact. Right: "Member Portal" button in HK red with white text. Mobile: hamburger with full-screen slide-out drawer.
Footer: Dark charcoal #1A1A1A background. Columns: About HKES, Quick Links, Follow Us (Instagram, Facebook, LinkedIn icons). Bottom bar: copyright + "Made with ❤️ at Binghamton." Subtle Victoria Harbour skyline silhouette as a faint watermark across the footer background.
Button styles: Primary (HK red fill, white text, 8px radius), Secondary (outlined red), Ghost (text only with underline hover state).
Card component: White with glassmorphism on gradient sections, soft shadow, 24px radius, hover lift effect noted.


🏠 PAGE 1 — HOME (Landing Page)
Hero Section — full viewport height, split layout:

Left half (white background):

Small eyebrow label: "Binghamton University · Est. 2018" in red uppercase tracking
Large headline (3–4 lines): "Where Binghamton Meets Hong Kong" in bold display font. "Hong Kong" rendered in HK red.
Subheadline: "HKES is a cultural and social student organization celebrating Hong Kong heritage, building community, and connecting students across cultures at Binghamton University."
Two CTAs side by side: "Explore Events" (primary red button) + "About Us" (ghost button)
Below CTAs: social proof row — "500+ members · 3 years running · 20+ events annually"
Floating organic coral/red blobs in background (same aesthetic as reference image)


Right half (gradient background #DE2910 → #FF6B6B → #FF9A5C):

Victoria Harbour skyline silhouette as a glowing, layered SVG illustration — show the iconic HK skyline (IFC, Central Plaza, Bank of China Tower) reflected in the water below. Style it as a white/light silhouette with a soft glow effect against the red gradient. Add a subtle moon or lantern detail in the upper right.
Floating glassmorphism "stat cards" overlaid on the skyline: one showing "Next Event: Lunar New Year Gala — Feb 10", one showing "Members: 500+", one showing "Spring Fundraiser: 78% of goal reached"
Floating soft blob shapes and subtle particle dots for depth




About Strip: Full-width horizontal band. Left: animated counter stats (500 Members, 20+ Events, 3 Years Strong, $10K+ Raised). Right: 2–3 sentence mission paragraph with a "Learn More" link.
Upcoming Events Preview: Section title "What's Coming Up 🎉". Horizontal scroll of 3 event cards. Each card: event photo placeholder, event name, date badge in red, location tag, "Learn More" CTA. Background: soft off-white with coral blob shapes behind.
Gallery Teaser: Masonry-style grid preview of 6 past event photos with a red overlay on hover showing event name. CTA button: "View Full Gallery."
Email Newsletter Signup Section:

Full-width section with a red-to-coral diagonal gradient background
Centered layout: Large headline "Stay in the Loop 📬", subtext "Get event updates, recaps, and HKES news delivered to your inbox."
Email input field (white, rounded, full-width on mobile) + "Subscribe" button (white text, dark red #A01F0E background) side by side
Fine print below: "No spam. Unsubscribe anytime." in light opacity text
Floating lantern or bauhinia flower illustration (HK cultural symbol) to the side for visual interest

Blog Teaser: "Latest from the Blog" — 3 horizontal article cards with category tag (Recap, Announcement, Culture), title, author avatar + name, date, and read time. CTA: "Read All Posts."
Sponsors/Partners Strip: Grayscale logos of university departments, sponsors, partner orgs on a white band.

📅 PAGE 2 — EVENTS

Hero: Full-width banner with HK red gradient, centered headline "Events & Happenings", breadcrumb nav.
Filter Bar: Pill-shaped filter buttons — All, Cultural, Social, Fundraiser, Workshop — with red active state.
Events Grid: 2-column card grid (3 rows shown). Each card: large image area, category badge, event title, date + time + location with icons, short description, "Learn More" button. Upcoming events have a "Upcoming" green badge. Past events are slightly desaturated.
Event Detail Modal/Page (design one sample): Full layout with hero image, event title, date/time/location block, description, photo gallery strip, RSVP form (Name, Email, Dietary restrictions toggle), and a sidebar with "Share Event" + "Add to Calendar" buttons.


💰 PAGE 3 — FUNDRAISERS

Hero: Similar to Events but headline reads "Support HKES" with a subhead about the mission of fundraising.
Active Fundraiser Feature Card: Large card spanning full width — fundraiser name, goal amount, amount raised, animated progress bar in HK red, days remaining badge, description, and "Donate / Support" CTA.
Past Fundraisers Grid: Smaller cards with fundraiser name, year, amount raised, a short recap blurb, and a "Read Recap" link.
Why We Fundraise Section: 3-column icon + text layout explaining where funds go (events, cultural programming, member resources).


🖼️ PAGE 4 — GALLERY (Past Events & Recaps)

Hero: Headline "Memories & Recaps" over a mosaic collage of event photos as background with red overlay.
Filter Tabs: By year (2024, 2023, 2022) and by type (Cultural, Social, Fundraiser).
Masonry Photo Grid: Pinterest-style varying-height photo grid. On hover: red overlay with event name + date + "View Recap" button appears.
Featured Recap Cards: Below the grid, 2–3 long-form recap cards with a cover image, event title, short paragraph recap written by the Historian, photo count badge, and a "Read Full Recap" CTA.


✍️ PAGE 5 — BLOG

Layout: Standard blog layout. Left: article feed (70% width). Right: sticky sidebar (30%) with search bar, category filter, recent posts, and "Subscribe to Newsletter" widget.
Article Card: Category tag (color-coded: red=Recap, gold=Culture, coral=Announcement), title, author with avatar, date, 2-line excerpt, read time, and thumbnail.
Featured Post: Large hero-style card at top spanning full width with big image and overlay text.
Single Article Page (design one sample): Full-width cover image, title + metadata, body text with pull quotes styled in red, inline images, author bio card at bottom, related posts strip.


📬 PAGE 6 — CONTACT

Layout: Two-column. Left: contact form (Name, Email, Subject dropdown — General Inquiry / Event Question / Sponsorship / Join HKES, Message textarea, Submit button). Right: contact info cards — Instagram handle, Email address, "Find us at Binghamton University" with a campus map placeholder.
Bottom Strip: "Interested in joining HKES? Applications open each semester." with a CTA button.


🔐 PAGE 7 — EBOARD MEMBER PORTAL
7A — Login Page:

Centered card on a red-to-coral gradient background with floating blob shapes.
HKES logo at top of card.
Fields: Email, Password. "Forgot password?" link. "Login" button.
Subtle Victoria Harbour silhouette watermark at the bottom of the gradient background.

7B — Portal Dashboard (post-login):

Sidebar navigation (dark charcoal #1A1A1A) with HKES logo, member name + role badge at top, and nav links: Dashboard, My Tasks & Deadlines, Graphic Requests, Post Requests, Reimbursements, Members Directory, Settings. Active state in HK red.
Main area: "Welcome back, [Name] 👋" header. Role badge clearly visible (e.g. "Publicity Chair").
Dashboard widgets: Upcoming Deadlines card (list of 3 nearest deadlines with colored urgency dots — red=overdue, yellow=due soon, green=on track), Pending Requests summary card, Announcements card (president posts updates here), Quick Actions row (buttons for common tasks relevant to role).

7C — Deadlines Tracker (all chairs have access):

Calendar view (month) + list view toggle.
Each deadline entry: task name, assigned chair tag (color-coded per role), due date, status badge (Not Started / In Progress / Complete), notes field.
"Add Deadline" button (President/VP/Secretary only).
Filter by chair role.

7D — Graphic Request Form (Publicity Chair view + all members can submit):

Page title: "Request a Graphic"
Form fields: Requester Name (auto-filled), Event/Post Name, Type of Graphic (dropdown: Social Media Post, Story, Flyer, Banner, Email Header), Platform(s) needed for (multi-select: Instagram, Facebook, Email, Print), Dimensions needed, Event Date & Time, Description of content/vibe, Color preferences, Reference images upload, Due date needed by, Priority level (Normal / Urgent), Additional notes.
Submit button. Below: "Current Queue" table showing pending graphic requests with status.
Publicity Chair's view: Same page but with an additional management panel — list of all submitted requests, ability to update status (Pending / In Progress / Complete / Revision Needed), filter by status, assign to self.

7E — Post Request Form (Outreach Chair view + all members can submit):

Page title: "Request a Post / Outreach"
Form fields: Requester Name (auto-filled), Platform(s) (Instagram, Facebook, GroupMe, Email List, LinkedIn), Type of Post (Event Promo, Fundraiser, Recap, Announcement, Partnership), Post copy/caption (textarea), Graphic attached (yes/no + upload), Requested publish date, Target audience notes, Link to include, Additional notes.
Submit + "Current Post Queue" table with status management for Outreach Chair.

7F — Reimbursement Portal:

Member submission view: Page title "Submit a Reimbursement"
Form: Member Name + Role (auto-filled), Purchase Date, Category (dropdown: Event Supplies, Food & Beverage, Marketing Materials, Transportation, Other), Amount ($), Vendor/Store name, Description of purchase, Receipt upload (drag-and-drop zone), Event this relates to (dropdown of recent events), Payment method to reimburse (Venmo / Zelle / Check — with handle/info field), Additional notes, Submit button.
Below form: "My Reimbursement History" table — date submitted, amount, category, status (Pending / Approved / Paid / Rejected), notes from treasurer.
Treasurer's view (role-gated): Full reimbursement management dashboard. Table of all submissions from all members with columns: Date, Member Name, Role, Category, Amount, Receipt (view link), Status, Action buttons (Approve / Reject / Mark Paid). Filter by status, date range, and member. Summary cards at top: Total Pending (),TotalPaidthissemester(), Total Paid this semester (
),TotalPaidthissemester(), Number of open requests. Export to CSV button.

7G — Members Directory (all portal members):

Grid of member cards: profile photo placeholder, name, role badge (color-coded by chair), email, joined date. Search bar + filter by role.


📱 MOBILE RESPONSIVENESS
Design mobile versions for: Home hero (stacked, skyline above text), Events grid (1 column), Portal dashboard (bottom tab bar instead of sidebar), all forms (full-width fields, larger tap targets).

🔄 DESIGN FLOW & PROTOTYPING
Connect all pages with prototype flows: Navbar links → pages, "Explore Events" → Events page, Event card "Learn More" → Event detail, Gallery photo hover → Recap, Portal login → Dashboard, Sidebar nav → Portal sub-pages, Form submits → Success state screens (design success confirmation screens for all 3 forms and reimbursement).

✅ FINAL NOTES

Use realistic placeholder content throughout — HKES event names, HK cultural references, Binghamton University context.
Every interactive element should have a hover/active state designed.
Design a loading state and empty state for the portal tables.
Include a style guide frame with: color swatches, typography scale, button variants, card variants, form element states, and badge/tag variants.