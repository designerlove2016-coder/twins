# TWIN: Known Limitations & Production Risk Analysis

## 1. Algorithmic Complexity at Scale

### Current Behavior
The `get_top_twin_matches` function computes similarity on-demand across all discoverable completed profiles using a lateral join.
- **Complexity**: $O(N)$ where $N$ is the number of active users in the same region.
- **Applicability**: Highly performant for up to $\approx 50,000$ active profiles with sub-second response times, leveraging PostgreSQL's indexes on `city_id` and `is_completed`.

### Production Scaling Roadmap ($N > 100,000$)
1. **Asynchronous Precomputation via `pg_cron`**: Trigger match calculations in background worker jobs whenever user answers update, populating the `matches` table cache.
2. **Cluster Sharding by Region**: Partition matching by `city_id` to limit the candidate evaluation set.
3. **Locality-Sensitive Hashing (LSH) / Vector Embeddings**: For massive scale ($N > 1,000,000$), project discrete categorical preferences into binary Hamming vectors (`pgvector`) for sub-10ms nearest-neighbor retrieval.

---

## 2. SMS Gateway Abuse & Toll Fraud Prevention

- **Risk**: Automated bots attempting SMS pumping attacks against open phone input forms, resulting in inflated carrier charges.
- **Mitigation Strategy**:
  1. Enforce Cloudflare Turnstile / reCAPTCHA v3 on the phone submission form before invoking `supabase.auth.signInWithOtp`.
  2. Implement strict rate limiting (max 3 SMS attempts per IP per 10 minutes) at the Edge/API layer.
  3. Restrict destination country calling codes exclusively to intended launch markets (e.g. `+966`, `+971`, `+974`, `+965`, `+973`, `+968`, `+20`).

---

## 3. Real-Time Cache Invalidation

- When a user updates their answers, existing cached match records in `matches` must be invalidated or recalculated.
- In Phase 2, the app invalidates its local calculation cache and re-queries `get_top_twin_matches` immediately upon onboarding updates.

---

## 4. Hardware & Motion Accessibility

- The signature high-five reveal animation respects standard `prefers-reduced-motion` operating system directives, automatically replacing motion transforms with gentle opacity transitions.
