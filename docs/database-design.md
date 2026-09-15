# Database Design

**Owner:** Prisha Goyal

## Why This Structure

Each student is assessed **multiple times** (every 4–8 weeks). So the
database cannot store "one row per student" — it must store **one row
per assessment**, linked back to the student. This is what enables
progress charts and improvement percentages later.

## Tables

### `Students`
One row per student. Static/rarely-changing info only.

| Column | Type | Notes |
|---|---|---|
| student_id | INT/UUID, PK | |
| anonymous_code | VARCHAR | Used instead of real name for privacy (e.g. "STU-0001") |
| age_group | VARCHAR | e.g. "9th", "10th" |
| gender | VARCHAR | Optional |
| sport_interest | VARCHAR | Student's stated preference |
| medical_clearance_status | VARCHAR | e.g. "Cleared", "Restricted" — not a full medical record |
| created_at | TIMESTAMP | |

### `Assessments`
One row per fitness-test event — the core table.

| Column | Type | Notes |
|---|---|---|
| assessment_id | INT/UUID, PK | |
| student_id | FK -> Students | |
| assessment_date | DATE | |
| height_cm, weight_kg, bmi | FLOAT | BMI can be calculated |
| sprint_time_sec, shuttle_run_sec | FLOAT | |
| pushups_count, situps_count | INT | |
| plank_time_sec, broad_jump_cm | FLOAT | |
| flexibility_score | FLOAT | |
| attendance_rate | FLOAT | % attendance leading up to this assessment |
| coach_rating | INT | 1–10 subjective rating |
| created_by_coach_id | FK -> Coaches | |

### `Coaches`
| Column | Type |
|---|---|
| coach_id | INT/UUID, PK |
| name | VARCHAR |
| assigned_sports | VARCHAR |

### `Recommendations`
One row per ML prediction — where the model's output is stored.

| Column | Type | Notes |
|---|---|---|
| recommendation_id | INT/UUID, PK | |
| assessment_id | FK -> Assessments | |
| predicted_fitness_level | VARCHAR | Beginner / Developing / Good / Excellent |
| recommended_sport | VARCHAR | |
| improvement_focus | VARCHAR | |
| model_confidence | FLOAT | Optional |
| coach_approved | BOOLEAN | Mandatory gate before student/parent visibility |
| coach_override_value | VARCHAR | If coach manually changes the recommendation |
| created_at | TIMESTAMP | |

### `Admins` (optional, for early RBAC)
| Column | Type |
|---|---|
| admin_id | INT/UUID, PK |
| name | VARCHAR |
| role | VARCHAR — "admin" / "coach" / "student" / "parent" |

## Relationships (ER Diagram — Text Form)

```
Students (1) ----< (many) Assessments
Coaches  (1) ----< (many) Assessments        [via created_by_coach_id]
Assessments (1) ---< (many) Recommendations  [usually 1, but allow many for versioning]
```

## SQL (PostgreSQL, ready to run)

```sql
CREATE TABLE Coaches (
    coach_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    assigned_sports VARCHAR(200)
);

CREATE TABLE Students (
    student_id SERIAL PRIMARY KEY,
    anonymous_code VARCHAR(20) UNIQUE NOT NULL,
    age_group VARCHAR(10),
    gender VARCHAR(20),
    sport_interest VARCHAR(50),
    medical_clearance_status VARCHAR(20) DEFAULT 'Cleared',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Assessments (
    assessment_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES Students(student_id),
    assessment_date DATE NOT NULL,
    height_cm FLOAT,
    weight_kg FLOAT,
    bmi FLOAT,
    sprint_time_sec FLOAT,
    shuttle_run_sec FLOAT,
    pushups_count INT,
    situps_count INT,
    plank_time_sec FLOAT,
    broad_jump_cm FLOAT,
    flexibility_score FLOAT,
    attendance_rate FLOAT,
    coach_rating INT CHECK (coach_rating BETWEEN 1 AND 10),
    created_by_coach_id INT REFERENCES Coaches(coach_id)
);

CREATE TABLE Recommendations (
    recommendation_id SERIAL PRIMARY KEY,
    assessment_id INT REFERENCES Assessments(assessment_id),
    predicted_fitness_level VARCHAR(20),
    recommended_sport VARCHAR(50),
    improvement_focus VARCHAR(50),
    model_confidence FLOAT,
    coach_approved BOOLEAN DEFAULT FALSE,
    coach_override_value VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Admins (
    admin_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    role VARCHAR(20) CHECK (role IN ('admin','coach','student','parent'))
);
```

## Database Owner's Task List

1. Set up PostgreSQL and run the SQL above.
2. Build a small API layer (Node.js/Express or Python/FastAPI) with:
   - `add_student()`
   - `add_assessment(student_id, ...)`
   - `get_assessment_history(student_id)` — for progress charts
   - `save_recommendation(assessment_id, prediction_data)` — the ML model calls this
   - `approve_recommendation(recommendation_id, coach_id)`
3. Seed the database with ~50–100 synthetic students, each with 2–3
   assessments, for realistic testing.
4. Sync the exact input/output column format with the ML owner (see
   [System Architecture](architecture.md)).
5. Document the final ER diagram and schema for the report (satisfies
   "Data Modeling through E-R Diagram" in the syllabus).

## Current Status

Assessments are currently persisted in a flat, interim structure rather
than this full relational schema. Migrating to the schema above is the
next planned increment — see [Scope](scope.md).
