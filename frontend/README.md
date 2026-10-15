# B.H.U.M.I Frontend

React 19 + Vite 6 + Tailwind CSS v3 + [shadcn/ui](https://ui.shadcn.com) (JavaScript, "new-york" style).

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

Copy `.env.example` to `.env`. `VITE_USE_MOCK=true` runs against the in-memory mock store.

## UI stack

| Concern | Where |
| --- | --- |
| Design tokens (light + dark) | `src/index.css` (`:root` / `.dark` CSS variables), `tailwind.config.js` |
| shadcn/ui primitives | `src/components/ui/*` — add more with `npx shadcn@latest add <name>` |
| Shared app components | `src/components/common/*` (PageHeader, Section, StatCard, EmptyState, Reveal, AnimatedNumber, BrandLogo, ThemeToggle) |
| Portal layout | `src/components/layout/AppShell.jsx` (sidebar + Ctrl/⌘ K command palette), `src/components/Sidebar.jsx` |
| Navigation config | `src/config/navigation.js` |
| Toasts | `import { toast } from 'sonner'` (`<Toaster/>` is mounted in `main.jsx`) |
| Theme | `next-themes` with `attribute="class"`; toggle via `ThemeToggle` |

### Conventions

- Use semantic colour classes (`bg-background`, `bg-card`, `text-muted-foreground`, `bg-primary text-primary-foreground`, status: `success` / `warning` / `info` / `destructive`). Do not hard-code hex colours so dark mode keeps working.
- Wrap portal pages in `<AppShell portal="citizen|authority|government">` and start them with `<PageHeader />`.
- Confirmations use `AlertDialog`; feedback uses `toast`; never `window.alert` / `window.confirm`.
- Path alias `@/` points to `src/`.
