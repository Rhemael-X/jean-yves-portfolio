# Jean-Yves — Cybersecurity Portfolio

A production-ready fullstack cybersecurity portfolio built with **Next.js 15**, **Sanity CMS**, **TypeScript**, **TailwindCSS**, and **next-intl** (FR/EN). Deployed on Vercel.

---

## ✨ Features

- **CMS-driven** — all content managed through Sanity Studio
- **Bilingual** — French and English (FR/EN) via next-intl
- **SEO optimized** — `generateMetadata`, sitemap, robots.txt, hreflang
- **Secure** — rate limiting (Upstash Redis), honeypot, Zod validation, security headers
- **Scalable** — server-side pagination, supports 100+ projects
- **Dark/Light mode** — next-themes with CSS variables
- **Animated** — Framer Motion fade-ins, hover effects
- **Accessible** — WCAG 2.1 AA, semantic HTML, ARIA labels

---

## 🗂 Project Structure

```
app/
├── [locale]/        # FR/EN routes (homepage, profile, projects, etc.)
├── api/contact/     # Secure contact form API
├── sitemap.ts       # Auto-generated XML sitemap
└── robots.ts        # robots.txt

components/          # All UI components
lib/                 # Sanity client, GROQ queries, utils, email
sanity/schemas/      # All CMS content schemas
types/               # TypeScript interfaces
messages/            # FR & EN translation files
scripts/             # Seed & data generation scripts
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/jean-yves-portfolio.git
cd jean-yves-portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (default: `production`) |
| `SANITY_API_TOKEN` | Sanity API token with write access |
| `NEXT_PUBLIC_BASE_URL` | Public URL of your site |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis endpoint for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
| `RESEND_API_KEY` | Resend API key for email sending |
| `CONTACT_RECIPIENT_EMAIL` | Email address to receive contact messages |

### 4. Set up Sanity Studio

The schemas are defined in `sanity/schemas/`. To use them, either:

**Option A — Use Sanity.io Studio** (recommended for production):
1. Go to [sanity.io](https://sanity.io) and open your project
2. Copy schemas from `sanity/schemas/*.ts` into your Studio

**Option B — Embedded Studio** (local dev):
```bash
npx sanity@latest init --project nc5oijv0 --dataset production
```

### 5. Seed initial data

```bash
npm run seed
```

This creates: categories, technologies, skills, and a default profile.

### 6. (Optional) Generate 100 demo projects

```bash
npm run generate-projects
```

### 7. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/fr`.

---

## 📝 Using the CMS

1. Log in to [sanity.io](https://www.sanity.io/manage) and navigate to your project
2. Go to **Studio**
3. Create/edit:
   - **Profile** — your personal info, photo, bio, social links
   - **Projects** — add cybersecurity projects with bilingual content
   - **Skills** — skill categories, levels, and highlights
   - **Experience** — work history
   - **Education** — academic background
   - **Certifications** — badges and credentials
   - **Contact Messages** — read messages submitted via the contact form

---

## 🌍 Internationalization

| Route | Locale |
|---|---|
| `/fr/...` | French |
| `/en/...` | English |

- `/` redirects to `/fr` (default locale)
- All content fields in Sanity support `{ fr: string, en: string }` objects
- UI strings are in `messages/fr.json` and `messages/en.json`

---

## 🔒 Security

| Measure | Implementation |
|---|---|
| Rate limiting | Upstash Redis — 5 req/hr per IP |
| Honeypot | `_gotcha` hidden field |
| Input validation | Zod (client + server-side) |
| Security headers | X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy |
| Write token | Server-side only, never exposed to client |

---

## 🧪 Tests

```bash
npm test
```

Tests cover:
- `/api/contact` — validation, honeypot, rate limiting (mocked)
- `Pagination` — page link count, disabled states, aria-current

---

## 📦 Deploy to Vercel

1. Push to GitHub
2. Import repository at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.example`
4. Deploy ✅

Vercel automatically handles:
- `next build` via Next.js build system
- Edge Network CDN
- Vercel Analytics (enable in project settings)

---

## 📄 License

MIT — Jean-Yves Portfolio
