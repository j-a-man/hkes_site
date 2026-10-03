# HKES site

The website and member portal for Hong Kong Exchange Square (HKES) at Binghamton University.

- **Public site** (`/`, `/events`, `/fundraisers`, `/gallery`, `/about`, `/contact`): styled after the club's flyers, with all copy and photos editable from the portal's Site Editor.
- **Giveaway entry** (`/qr/:slug`): the page behind each QR campaign.
- **Member portal** (`/portal`): deadlines, graphic and post requests, reimbursements, members, announcements, QR campaigns, and the Site Editor.

Built with Vite, React 18, React Router 7, Tailwind CSS 4, and Supabase.

## Running it

1. Copy `.env.example` to `.env.local` and fill in your Supabase project URL and publishable key.
2. Install and start the dev server:

```bash
npm install
```

```bash
npm run dev
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Type-check the project with TypeScript |

## Where things live

- `src/app/routes.tsx`: every route and the data each one loads. Portal pages load lazily, so public visitors never download them.
- `src/app/components/site/`: the public design system (posters, placards, stickers, stamps, doodles).
- `src/app/components/portal/`: the portal's building blocks (panels, forms, tables, dialogs).
- `src/app/lib/siteContentManifest.ts`: every field the Site Editor can change, with the default text shown when a field is empty.
- `src/styles/theme.css`: colours, fonts, and the portal's dark mode.
- `supabase/functions/admin-manage-member`: the edge function executives use to add and remove portal accounts.

Access control lives in Supabase row-level security; the portal hides controls by role, but the database is what enforces it.
