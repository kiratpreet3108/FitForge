# FitForge

**AI-Based Student Sports Talent & Fitness Guidance Portal**

*From raw fitness data to coach-approved sports guidance.*

[![Docs](https://img.shields.io/badge/docs-mkdocs--material-blue)](https://tiet-ucs503.github.io/fitforge)
[![Course](https://img.shields.io/badge/course-UCS503P-orange)]()

---

## What is FitForge?

Schools run fitness tests regularly, but the results usually end up in a
notebook or a spreadsheet and go nowhere — no one compares a student's
numbers over time, and no one flags students who might genuinely be good
at a sport.

FitForge is a web platform that takes a student's general fitness
assessment (strength, endurance, flexibility, speed-agility, BMI,
attendance, motivation) and turns it into:

1. A leakage-checked **fitness-level prediction** with calibrated
   class probabilities (Decision Tree / Random Forest compared on the
   same holdout set).
2. **Sport-suitability guidance** — 2–3 recommended sports with a
   plain-language reason.

Every prediction is held back from students and parents until a
**coach explicitly approves or overrides it** — the model assists, it
never decides.

## Team

| Name | Roll No. | Batch |
|---|---|---|
| Kiratpreet Kaur | 1024030402 | 3C31 |
| Prisha Goyal | 1024030404 | 3C31 |

## Repository Structure

| Folder | Contents |
|---|---|
| `project-proposal/` | Initial proposal — problem, planned approach, evaluation targets |
| `project-report-prototype-stage/` | Mid-semester prototype report — what was built and learned so far |
| `project-report-final/` | Final report — delivered results, measured against the proposal |
| `reports/` | Final presentation (PPTX) |
| `code/` | Source code — React/Vite frontend, Node.js/Express backend, Python/scikit-learn ML service |
| `docs/` | Full project documentation (see below) |

All three reports are written in LaTeX using the official course
template style and compiled to PDF alongside the `.tex` source.

## Documentation

The `docs/` folder is a full mkdocs site covering the project topic by
topic — problem statement, requirements, architecture, ML methodology,
database design, and scope. Locally:

```shell
make docs
```

Any push to `main` triggers CI/CD (`.github/workflows/mkdocs.yml`) to
build and publish the docs site automatically.

Quick links (readable directly on GitHub too):

- [Project Overview](docs/project-overview.md)
- [Requirements](docs/requirements.md)
- [System Architecture](docs/architecture.md)
- [ML Model Plan](docs/ml-model-plan.md)
- [Database Design](docs/database-design.md)
- [Methodology & Testing](docs/methodology-testing.md)
- [Scope](docs/scope.md)

## Core Design Principle: Two-Tier Data Strategy

- **Tier 1 — General Athleticism (current scope):** a single universal
  fitness battery for every student, used to recommend suitable sports.
- **Tier 2 — Sport-Specific KPIs (future scope):** a small, per-sport
  indicator set for students funnelled into a specific sport squad,
  added incrementally once Tier 1 is stable.

This split exists specifically to avoid a system that's too complex for
a coach to actually use — see [Scope](docs/scope.md) for the full
reasoning.

## What's Actually Built (Not Just Planned)

- A leakage-controlled, calibrated classifier: **84% accuracy, 0.565
  macro-F1, and 0.074 expected calibration error** on a fixed stratified
  held-out test set. The High Performer class is too small to claim
  reliable detection, so every result remains coach-review only.
- A documented leakage story: an early model hit a suspicious 98%
  accuracy by leaking the answer through a derived column; catching and
  fixing that is part of the project's evaluation narrative (see
  [ML Model Plan](docs/ml-model-plan.md)).
- A white-box explanation panel: coaches can inspect the raw test values,
  derived input-score formulas, class probabilities, and limits behind every
  newly generated fitness result.
- A coach-editable, four-week fitness-plan draft based on the student's
  lowest transparent fitness scores, with assessment-to-assessment progress
  comparison.
- Coach assessment entry, coach approval/override workflow, and
  student/parent guidance views, working end-to-end.

## What's Next

- Sport-suitability recommendation logic (currently the classifier
  predicts fitness level only).
- Migration from the current flat-file store to the designed relational
  (PostgreSQL) schema.
- Tier 2: sport-specific KPI tracking and progression forecasting, one
  sport at a time.

## License

See [`LICENSE`](LICENSE).
