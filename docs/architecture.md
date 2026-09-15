# System Architecture

## Layered Architecture

| Layer | Responsibility |
|---|---|
| Frontend | React/Next.js — separate views for Student, Coach, Admin, Parent |
| Backend API | Node.js/Express — auth, validation, orchestration |
| ML Service | Python, Pandas, scikit-learn — model training/inference |
| Database | PostgreSQL (relational — see [Database Design](database-design.md)) |
| Reporting | Chart.js/Recharts for visualizations; PDF export |
| Authentication | JWT / role-based access |

## Data Flow (High Level)

```
Coach enters assessment (Frontend)
        |
   Backend API validates + stores in Assessments table
        |
   ML Service reads Assessment record
        |
   ML Service returns prediction (fitness_level, sport, focus, reason)
        |
   Backend API writes prediction into Recommendations table (coach_approved = false)
        |
   Coach reviews on Coach Dashboard -> approves or overrides
        |
   Student/Parent view unlocks once coach_approved = true
```

## The Model ↔ Database Contract

This is the single most important agreement between the two halves of
the team (ML owner and Database owner). If both sides build to this
exact contract, the two parts can be developed **independently** and
plugged together at the end without rework.

**Input to the model** (read from the `Assessments` table):
```
age_group, height_cm, weight_kg, bmi, sprint_time_sec, shuttle_run_sec,
pushups_count, situps_count, plank_time_sec, broad_jump_cm,
flexibility_score, attendance_rate, coach_rating
```

**Output from the model** (written into the `Recommendations` table):
```
predicted_fitness_level, recommended_sport, improvement_focus, model_confidence
```

## Why PostgreSQL (Relational, Not NoSQL)

The data is inherently relational: one student has many assessments, one
assessment has one (or a small versioned set of) recommendations, and
coaches/admins need role-based joins across these. A relational schema
makes progress-tracking queries ("show this student's history," "show
all Low Performers needing follow-up") straightforward with standard
SQL, rather than needing manual document restructuring in a NoSQL store.

## Security & Access Control Notes

- All roles (Student, Coach, Admin, Parent) authenticate via JWT.
- Students have **read-only** access to their own records only.
- Coaches have **read/write** access to their assigned students'
  assessments and recommendation approvals.
- No recommendation is exposed outside the Coach role until
  `coach_approved = true` (enforced at the API layer, not just the UI,
  to prevent bypass).

## Current Implementation Status

The frontend, ML service, and coach-approval workflow are implemented
and working end-to-end. Assessments are currently persisted in a flat,
interim structure rather than the full relational schema above —
migrating to PostgreSQL is the next planned increment (see
[Scope](scope.md)).
