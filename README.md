# Marketplace (Buyer/Seller) Web App

A web marketplace where users can browse products, view product details, add items to a cart, and checkout.  
Users can authenticate, manage their profile, and (when assigned the **seller** role) access a **Seller Dashboard** to create and manage product listings. Admin users can access an **Admin Dashboard**.

## Live Demo

- https://e-commerce-vert-seven-15.vercel.app/

## What this project does

### Buyer features

- Browse the **Shop** catalog
- View **Product** detail pages
- Add/remove products in the **Cart**
- Proceed through **Checkout**
- Register / log in and manage **Profile**

### Seller features

- Access **/dashboard** (Seller Dashboard)
- Create, edit, and delete product listings
- Upload product images (stored in Supabase Storage)
- View seller stats (total listings, active listings, total value)

### Admin features

- Access **/admin** (Admin Dashboard)

## Tech stack / tools used

### Frontend

- **React** + **TypeScript**
- **Vite** (dev server + build)
- **React Router** (routing)
- **Tailwind CSS** (styling)
- **shadcn/ui** (UI components)
- **TanStack Query** (`@tanstack/react-query`) (server-state caching)
- **Zod** (form validation)
- **Sonner** (toast notifications)
- **Lucide React** (icons)

### Backend (BaaS)

- **Supabase**
  - Authentication
  - Postgres database (tables like `products`, `profiles`, etc.)
  - Storage bucket (e.g. `product-images`)
  - Row Level Security (RLS) policies

### Tooling

- **ESLint** (linting)
- **Bun** (recommended package manager; lockfile: `bun.lock`)
  - You can use npm/pnpm, but Bun is what this repo is set up for.

## Repository structure (high level)

- [src/App.tsx](src/App.tsx): routes and providers
- [src/pages](src/pages): top-level pages (Shop, Product, Cart, Checkout, Profile, dashboards)
- [src/components](src/components): shared UI and layout components
- [src/context](src/context): app state (Auth, Cart)
- [src/hooks](src/hooks): reusable hooks (e.g., roles)
- [src/integrations/supabase](src/integrations/supabase): Supabase client setup
- [supabase/migrations](supabase/migrations): database migrations and RLS policies

## Required tools / applications

Install the following to run the project locally:

1. **Bun** (recommended)
   - https://bun.sh/
2. **Node.js** (if you prefer npm)
   - https://nodejs.org/
3. A **Supabase** project (local or hosted)
   - Hosted: https://supabase.com/
   - Optional local dev: Supabase CLI https://supabase.com/docs/guides/cli
4. **Git** (to clone the repo)
   - https://git-scm.com/
5. (Optional) **VS Code**
   - https://code.visualstudio.com/

## Environment variables

This project uses a root [.env](.env) file.

You must configure Supabase environment variables (names may vary depending on the existing integration code):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

If your workspace already has other required variables, keep them as-is.

## Install & run (development)

Using Bun:

````sh
bun install
bun run dev

# Install & Run (Development)

Using npm:

```bash
npm install
npm run dev
````

Then open the URL shown in the terminal (typically: http://localhost:5173)

---

# Build & Preview (Production)

```bash
npm run build
npm run preview
```

---

# How to Use the System (Manual)

## 1) Access the App

- Open the app in your browser
- Use the header navigation to go to **Shop**, **Cart**, **Profile**, etc.

## 2) Create an Account / Log In

- Go to `/register` to create an account
- Go to `/login` to sign in
- After login, open `/profile` to view account details

## 3) Buyer Workflow

- Open **Shop** (`/shop`)
- Click a product to open the detail page (`/product/:id`)
- Add the product to the cart
- Open **Cart** (`/cart`)
- Proceed to **Checkout** (`/checkout`)

## 4) Seller Workflow

A user must have the `seller` role in the database to access seller features.

- Log in as a seller user
- Click **Seller Dashboard / Start Selling** (from the header or profile menu)
- You will be redirected to `/dashboard`

**In the Seller Dashboard:**

- Click **Add Listing**
- Fill in product details (title, brand, category, price, condition, etc.)
- (Optional) Upload a product image
- Click **Create Listing**

**Verify:**

- The new listing appears in **My Listings**
- The listing appears in **Shop** (`/shop`) if it meets visibility conditions (commonly `is_active = true`)

## 5) Admin Workflow

A user must have the `admin` role to access admin features.

- Navigate to `/admin` to open the **Admin Dashboard**

---

# Troubleshooting

## Login Works but `/dashboard` Redirects to Home

- Typically caused by role loading or RLS issues
- Check the logged-in user has a role assigned (e.g., `profiles.role = seller`)
- Check Supabase RLS policies allow reading roles and product inserts/selects
- Check browser console/network panel for Supabase errors

## “Failed to Create Product”

- Usually indicates a Supabase RLS policy blocking inserts
- Confirm insert policy allows `auth.uid()` to insert rows
- Ensure `seller_id = auth.uid()` is permitted by RLS

---

# Scripts

See the **scripts** section in `package.json` for available commands.

---

# License

MIT License

Copyright (c) 2026 Shokhjahon Akhmedov
