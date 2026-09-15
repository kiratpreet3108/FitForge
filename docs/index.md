![Tiet Logo](assets/tiet-logo.svg){ .tiet-logo }

**UCS503P: Software Engineering (Semester Project)**
**Thapar Institute of Engineering and Technology**

# FitForge

**AI-Based Student Sports Talent & Fitness Guidance Portal**

*From raw fitness data to coach-approved sports guidance.*

**Team:** Kiratpreet Kaur (1024030402) · Prisha Goyal (1024030404) — Batch 3C31

---

## What is FitForge?

Schools run fitness tests regularly, but the results usually end up in a
notebook or a spreadsheet and go nowhere. FitForge takes a student's general
fitness assessment and turns it into two things a school can actually use:

1. An explainable, leakage-checked **fitness-level prediction**.
2. **Sport-suitability guidance** — 2–3 recommended sports with a
   plain-language reason.

Every prediction is held back from students and parents until a **coach
explicitly approves or overrides it** — the model assists, it never decides.

## Where to start

| Page | What it covers |
|---|---|
| [Project Overview](project-overview.md) | Problem, goals, personas, why this is a strong SE project |
| [Requirements](requirements.md) | Functional & non-functional requirements, acceptance criteria |
| [System Architecture](architecture.md) | Tech stack, data flow, the Model ↔ Database contract |
| [ML Model Plan](ml-model-plan.md) | Model choice, dataset strategy, real leakage/class-imbalance findings |
| [Database Design](database-design.md) | Schema, SQL, ER relationships |
| [Methodology & Testing](methodology-testing.md) | Sprint plan, testing strategy, syllabus traceability |
| [Scope](scope.md) | Out of scope, future scope, assumptions |

## Reports

Formal project reports (proposal, prototype-stage, and final) live in
`project-proposal/`, `project-report-prototype-stage/`, and
`project-report-final/` at the repository root, each compiled from LaTeX
to PDF. The final presentation is in `reports/`.

## Core design principle: Two-Tier data strategy

- **Tier 1 — General Athleticism (current scope):** a single universal
  fitness battery for every student, used to recommend suitable sports.
- **Tier 2 — Sport-Specific KPIs (future scope):** a small, per-sport
  indicator set for students funnelled into a specific sport squad, added
  incrementally once Tier 1 is stable.

This split exists specifically to avoid a system that is too complex for a
coach to actually use — see [Scope](scope.md) for the full reasoning.
