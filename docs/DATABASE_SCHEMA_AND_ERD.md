# TWIN: Database Schema & Entity Relationship Diagram (ERD)

## 1. Architectural Overview

The TWIN database is architected on **PostgreSQL (via Supabase)** using a strict Third Normal Form (3NF) relational design. It strictly enforces:
- **Phone Privacy Isolation**: Phone numbers and sensitive authentication credentials are never stored in public application tables.
- **Relational Integrity**: Foreign keys with `ON DELETE CASCADE` ensure orphaned records never exist.
- **Explainable Matching**: Match pairs and their contributing dimension reasons are stored with versioned algorithm metadata (`algorithm_version: 'v1.0'`).

---

## 2. Entity Relationship Diagram (Mermaid ERD)

```mermaid
erDiagram
    AUTH_USERS ||--|| PROFILES : "authenticates (id)"
    AUTH_USERS ||--|| PRIVATE_USER_DATA : "isolates phone"
    CITIES ||--o{ PROFILES : "resides in (city_id)"
    PROFILES ||--|| PRIVACY_SETTINGS : "controls visibility"
    PROFILES ||--o{ BLOCKED_USERS : "blocks"
    PROFILES ||--o{ SPORTS_PREFERENCES : "plays (multi-select)"
    PROFILES ||--|| COFFEE_PREFERENCES : "drinks"
    PROFILES ||--|| FOOD_PREFERENCES : "craves"
    PROFILES ||--|| LIFESTYLE_PREFERENCES : "lives"
    PROFILES ||--|| VEHICLE_PREFERENCES : "drives"
    PROFILES ||--o{ MATCHES : "user_a"
    PROFILES ||--o{ MATCHES : "user_b"
    MATCHES ||--o{ MATCH_REASONS : "justified by"

    PROFILES {
        uuid id PK
        text username UK
        text gender
        text age_range
        text city_id FK
        jsonb avatar
        text bio
        boolean is_completed
        timestamptz created_at
        timestamptz updated_at
    }

    PRIVATE_USER_DATA {
        uuid id PK
        text phone_number_masked
        timestamptz phone_verified_at
        timestamptz created_at
    }

    PRIVACY_SETTINGS {
        uuid user_id PK,FK
        boolean show_city_publicly
        boolean show_gender_publicly
        boolean show_age_range_publicly
        boolean allow_discoverability
        timestamptz updated_at
    }

    SPORTS_PREFERENCES {
        uuid user_id PK,FK
        text sport_id PK
        text skill_or_frequency
        timestamptz updated_at
    }

    COFFEE_PREFERENCES {
        uuid user_id PK,FK
        text coffee_style
        text roast_notes
        timestamptz updated_at
    }

    FOOD_PREFERENCES {
        uuid user_id PK,FK
        text comfort_food
        text favorite_drink
        timestamptz updated_at
    }

    LIFESTYLE_PREFERENCES {
        uuid user_id PK,FK
        text dominant_vibe
        text weekend_leisure
        text ideal_place
        text daily_rhythm
        timestamptz updated_at
    }

    VEHICLE_PREFERENCES {
        uuid user_id PK,FK
        text driving_philosophy
        text current_category
        timestamptz updated_at
    }

    MATCHES {
        uuid id PK
        uuid user_id FK
        uuid matched_user_id FK
        numeric similarity_score
        numeric coverage_score
        text algorithm_version
        timestamptz calculated_at
    }

    MATCH_REASONS {
        uuid id PK
        uuid match_id FK
        text category
        text reason_key
        text explanation_en
        text explanation_ar
        numeric contribution_weight
        timestamptz created_at
    }
```

---

## 3. Data Dictionary & Table Specifications

### 1. `cities`
- **Purpose**: Normalized geographic hub directory. Prevents spelling discrepancies and supports bilingual labels.
- **Columns**:
  - `id` (`TEXT PRIMARY KEY`): Unique lowercase slug (`riyadh`, `jeddah`, `dubai`, etc.).
  - `name_en` (`TEXT NOT NULL`): English display name.
  - `name_ar` (`TEXT NOT NULL`): Arabic display name.
  - `country_code` (`TEXT NOT NULL`): ISO 3166-1 alpha-2 code (`SA`, `AE`, `QA`, etc.).

### 2. `profiles`
- **Purpose**: Core public-facing identity. Linked 1:1 with `auth.users`.
- **Columns**:
  - `id` (`UUID PRIMARY KEY REFERENCES auth.users(id)`).
  - `username` (`TEXT UNIQUE NOT NULL`): Validated by regex `^[a-z0-9_]{3,20}$`.
  - `gender` (`TEXT CHECK (gender IN ('male', 'female', 'prefer_not_to_say'))`).
  - `age_range` (`TEXT CHECK (age_range IN ('18-23', '24-29', '30-35', '36-42', '43+'))`).
  - `city_id` (`TEXT REFERENCES cities(id)`).
  - `avatar` (`JSONB NOT NULL`): Structured vector parameters (skin tone, hair, clothing, accessory, mood).
  - `bio` (`TEXT`): Short introductory statement.
  - `is_completed` (`BOOLEAN DEFAULT false`): Indicates full onboarding readiness.

### 3. `private_user_data`
- **Purpose**: Sensitive user telemetry strictly quarantined from the public API.
- **Columns**:
  - `id` (`UUID PRIMARY KEY REFERENCES auth.users(id)`).
  - `phone_number_masked` (`TEXT`): Masked phone reference (e.g. `+966 ••• ••172`).
  - `phone_verified_at` (`TIMESTAMPTZ`): Timestamp of successful SMS OTP verification.

### 4. `privacy_settings`
- **Purpose**: Granular visibility switches respected by all query views and RPC functions.
- **Columns**:
  - `user_id` (`UUID PRIMARY KEY REFERENCES profiles(id)`).
  - `show_city_publicly` (`BOOLEAN DEFAULT true`).
  - `show_gender_publicly` (`BOOLEAN DEFAULT false`).
  - `show_age_range_publicly` (`BOOLEAN DEFAULT true`).
  - `allow_discoverability` (`BOOLEAN DEFAULT true`).

### 5. `sports_preferences` (Multi-Select)
- **Purpose**: Stores multiple active athletic and gaming pursuits for Jaccard overlap calculation.
- **Composite Primary Key**: `(user_id, sport_id)`.
- **Allowed values**: `sport_football`, `sport_padel`, `sport_gaming`, `sport_basketball`, `sport_gym`, `sport_running`, `sport_swimming`, `sport_other`, `sport_none`.

### 6. `matches` & `match_reasons`
- **Purpose**: Persisted pairwise similarity records for fast retrieval without recalculating on every render.
- **Constraints**:
  - `CHECK (user_id <> matched_user_id)`: Prevents self-matching.
  - `UNIQUE (user_id, matched_user_id)`: Prevents duplicate pairs.
  - `algorithm_version TEXT NOT NULL`: Guarantees reproducible scoring provenance.
