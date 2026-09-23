# SHADOW FITNESS — Premium Performance Club & Administrative CMS

A production-ready, dark cinematic fitness brand website and SaaS-grade Administrative CMS for **SHADOW FITNESS**. Built to communicate **DISCIPLINE. POWER. TRANSFORMATION. COMMUNITY.**

---

## 1. Architectural Highlights

- **Framework**: Next.js 15+ (App Router) with React 19 & TypeScript.
- **Styling**: Tailwind CSS configured with a dark luxury athletic palette (Deep Obsidian `#070709`, Carbon `#0d0d12`, Steel `#262630`, and dynamic Electric Volt accent `#d4f933` configurable via CMS).
- **Typography**: Display headlines powered by `Barlow Condensed` / `Syne`, paired with clean modern `Inter` / `Barlow` body typography.
- **Persistence & ORM**: Prisma ORM with SQLite for zero-setup instant local execution, fully compatible with PostgreSQL (Supabase / Neon / Railway) via `.env`.
- **Authentication**: Secure HMAC-SHA256 token sessions with bcrypt password hashing in HTTP-only cookies and protected route middleware.
- **Media Engine**: Local filesystem storage abstraction in `lib/storage.ts` with MIME verification & 10MB limits, ready for Cloudinary/S3 swap.
- **SEO & Social**: Automated sitemap.xml, robots.txt, OpenGraph cards, Twitter cards, and `ExerciseGym` / `LocalBusiness` JSON-LD schema.

---

## 2. Directory Structure

```
shadow-fitness/
├── app/
│   ├── (public pages)
│   │   ├── page.tsx                 # Cinematic Homepage narrative (12 storytelling sections)
│   │   ├── about/page.tsx           # Brand story and coaching standards
│   │   ├── programs/                # Training programs directory & detail pages (/programs/[slug])
│   │   ├── trainers/                # Certified coach roster & bio pages (/trainers/[slug])
│   │   ├── membership/              # Membership tier comparison & FAQs
│   │   ├── gallery/                 # Filterable photo wall & lightbox
│   │   ├── transformations/         # Real member case studies with interactive sliders
│   │   ├── free-trial/              # High-converting trial booking landing page
│   │   ├── contact/                 # Facility directions, phone, WhatsApp & enquiry hub
│   │   ├── sitemap.ts               # Dynamic XML sitemap generator
│   │   ├── robots.ts                # Crawler rules
│   │   ├── loading.tsx              # Brand loading screen
│   │   ├── not-found.tsx            # Custom 404 error state
│   │   └── error.tsx                # Error boundary with recovery action
│   ├── admin/                       # SaaS-Grade Admin Control Center
│   │   ├── login/page.tsx           # Secure admin sign-in
│   │   ├── page.tsx                 # Command Overview cockpit & metrics
│   │   ├── leads/page.tsx           # Client Acquisition & Leads CRM
│   │   ├── trials/page.tsx          # Free trial guest pipeline
│   │   ├── programs/page.tsx        # Program CMS (Create, Edit, Publish, Image)
│   │   ├── memberships/page.tsx     # Tier & Pricing Engine
│   │   ├── trainers/page.tsx        # Coach roster manager
│   │   ├── transformations/page.tsx # Transformation CMS with mandatory consent verification
│   │   ├── gallery/page.tsx         # Visual media upload manager
│   │   ├── facilities/page.tsx      # Gym tour & zone architect
│   │   ├── testimonials/page.tsx    # Verified reviews manager
│   │   ├── offers/page.tsx          # Promotional campaign engine
│   │   ├── homepage/page.tsx        # Live Homepage copy & CTA editor
│   │   └── settings/page.tsx        # Business phone, WhatsApp, Maps & operating hours
│   └── api/                         # REST & Management API
│       ├── auth/                    # Login, logout, session check
│       ├── leads/                   # Public lead submission & Admin CRM
│       ├── trials/                  # Free trial pass booking & Admin pipeline
│       ├── programs/                # Programs CRUD
│       ├── memberships/             # Membership CRUD
│       ├── trainers/                # Trainer CRUD
│       ├── facilities/              # Facilities CRUD
│       ├── transformations/         # Transformations CRUD with consent verification
│       ├── gallery/                 # Photo gallery CRUD
│       ├── testimonials/            # Testimonial CRUD
│       ├── offers/                  # Offers CRUD
│       ├── upload/                  # Media upload endpoint
│       ├── settings/                # Business settings
│       └── homepage/                # Dynamic homepage content
├── components/
│   ├── ui/
│   │   ├── BeforeAfterSlider.tsx    # Interactive drag & touch comparison slider
│   │   ├── FacilityTour.tsx         # Interactive gym zone switcher
│   │   ├── GoalSelector.tsx         # Goal-to-program recommendation filter
│   │   ├── WhatsAppButton.tsx       # Pre-filled contextual WhatsApp router
│   │   ├── MobileConversionBar.tsx  # Sticky bottom conversion bar for mobile
│   │   ├── ImageUploader.tsx        # Media upload input with preview
│   │   ├── Modal.tsx                # Accessible dialog modal
│   │   └── Toast.tsx                # Notification toast provider
│   ├── home/                        # Homepage narrative section components
│   ├── Navbar.tsx                   # Responsive sticky navbar
│   └── Footer.tsx                   # Dark luxury footer
├── lib/
│   ├── prisma.ts                    # Prisma Client singleton
│   ├── auth.ts                      # Session token creation, verify, and cookies
│   ├── storage.ts                   # Upload filesystem abstraction
│   └── utils.ts                     # Helpers, date formatters, WhatsApp link generator
└── prisma/
    ├── schema.prisma                # Full relational database schema
    └── seed.ts                      # Admin creation & starter template seed
```

---

## 3. Getting Started

### Prerequisites
- Node.js 18.x or 20.x+
- npm or pnpm

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Sync database schema
npm run db:push

# 3. Seed admin credentials and initial starter data
npm run db:seed
```

### Environment Configuration (`.env`)
```env
# Database connection (SQLite for local, PostgreSQL for cloud deployment)
DATABASE_URL="file:./dev.db"

# Secret key for signing admin authentication cookies
AUTH_SECRET="shadow_fitness_super_secret_auth_token_98457"

# Public site domain
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public website.

---

## 4. Admin Portal Access

- URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Default Email**: `admin@shadowfitness.com`
- **Default Password**: `shadowfitness123`

The gym owner can immediately log in to:
1. Input their verified **Phone number**, **WhatsApp number**, and **Official street address**.
2. Embed their **Google Maps** listing or paste their directions URL.
3. Adjust batch schedules and operating hours.
4. Set real membership pricing and upload high-resolution facility photography.
5. Review and update lead statuses in the integrated CRM.

---

## 5. Production Deployment

### Deploying on Vercel
1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Configure PostgreSQL (e.g. Neon, Supabase, or Vercel Postgres):
   - Update `DATABASE_URL` in environment variables.
   - In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
4. Deploy with build command: `prisma generate && next build`.
