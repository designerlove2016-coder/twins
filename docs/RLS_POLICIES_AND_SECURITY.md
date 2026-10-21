# TWIN: Row-Level Security (RLS) & Privacy Architecture

## 1. Zero-Trust Security Invariants

1. **Phone Number & OTP Quarantine**: Mobile phone numbers and OTP verification codes are NEVER stored in public tables or returned in any public query payload.
2. **Client Mutation Ban on Matches**: Clients cannot `INSERT`, `UPDATE`, or `DELETE` records in the `matches` or `match_reasons` tables. All score calculations occur server-side inside Security Definer PostgreSQL functions.
3. **Mutual Blocking Protection**: If User A blocks User B, neither user can view the other's profile, calculate matches, or appear in discovery results.
4. **No UI-Only Security**: Hiding elements in React is treated strictly as UX, never as an access control boundary. Database RLS guarantees non-discoverable profiles cannot be fetched even via raw PostgREST requests.

---

## 2. Row Level Security Policies Catalog

### `profiles`
- **SELECT**:
  ```sql
  CREATE POLICY "Public profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (
      id = auth.uid()
      OR (
        is_completed = true
        AND EXISTS (
          SELECT 1 FROM public.privacy_settings ps
          WHERE ps.user_id = profiles.id AND ps.allow_discoverability = true
        )
        AND NOT EXISTS (
          SELECT 1 FROM public.blocked_users bu
          WHERE (bu.user_id = auth.uid() AND bu.blocked_user_id = profiles.id)
             OR (bu.user_id = profiles.id AND bu.blocked_user_id = auth.uid())
        )
      )
    );
  ```
- **INSERT**: `WITH CHECK (auth.uid() = id)`
- **UPDATE**: `USING (auth.uid() = id) WITH CHECK (auth.uid() = id)`

### `private_user_data`
- **ALL Actions**: Locked strictly to `auth.uid() = id`.
- Prevents cross-user enumeration or accidental data leakage through joins.

### `matches`
- **SELECT**: `USING (auth.uid() = user_id OR auth.uid() = matched_user_id)`
- **INSERT / UPDATE**: `WITH CHECK (false)` — completely blocked from direct client execution. Managed exclusively by the server-side RPC `calculate_or_get_twin_matches`.

### `blocked_users`
- **ALL Actions**: Controlled strictly by `auth.uid() = user_id`.

---

## 3. Account Deletion & Data Retention

- **Cascade Purge**: When an authenticated user triggers account deletion (`auth.users`), PostgreSQL's `ON DELETE CASCADE` triggers an immediate atomic purge of:
  - `profiles`
  - `private_user_data`
  - `privacy_settings`
  - `sports_preferences`, `coffee_preferences`, `food_preferences`, `lifestyle_preferences`, `vehicle_preferences`
  - All pairwise records in `matches` and `match_reasons`
- Zero lingering residual logs or shadow profiles remain in the database.
