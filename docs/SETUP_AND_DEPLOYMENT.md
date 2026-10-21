# TWIN: Setup & Deployment Instructions

## 1. Prerequisites

- Node.js >= 20.x
- Supabase Project (Cloud or Local CLI)
- Twilio / MessageBird / Vonage SMS Provider account (for live phone OTP)

---

## 2. Environment Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Populate the required variables:
   ```env
   VITE_SUPABASE_URL="https://<your-project-ref>.supabase.co"
   VITE_SUPABASE_ANON_KEY="<your-public-anon-key>"
   ```

---

## 3. Applying Database Migrations

Apply the migration files in sequential order to your Supabase project:

### Option A: Using Supabase CLI
```bash
# Link project
supabase link --project-ref <your-project-ref>

# Push migrations
supabase db push
```

### Option B: Using Supabase Dashboard SQL Editor
1. Open your Supabase Dashboard -> **SQL Editor**.
2. Run `supabase/migrations/20261020000000_initial_twin_schema.sql`.
3. Run `supabase/migrations/20261020000001_matching_engine_rpc.sql`.

---

## 4. Building and Running the Application

```bash
# Install dependencies
npm install

# Run automated test suite
npx tsx tests/run-all-tests.ts

# Start development server
npm run dev

# Build for production
npm run build
```
