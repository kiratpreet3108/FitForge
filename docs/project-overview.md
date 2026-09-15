# Project Overview

## What FitForge Is

A web-based decision-support platform that digitizes school fitness
assessments, tracks student athletic performance over time, and uses an
explainable ML model to recommend suitable sports and training focus areas
— with mandatory coach review before any recommendation reaches a student
or parent.

**One-line positioning:**
*"FitForge takes raw, unorganized fitness data and forges it into clear,
coach-approved sports guidance."*

## The Problem

Schools conduct sports activities, but student fitness and performance
data is rarely recorded systematically or analyzed over time. As a result:

- Students with real sports potential can go unnoticed.
- Interested students don't receive personalized, data-backed guidance on
  which sport suits them or what to improve.
- Progress isn't tracked consistently, so improvement (or decline) goes
  unmeasured.
- Coaches lack a structured way to compare students across age groups,
  fitness levels, or improvement needs.

## Goals

- Digitize fitness-test and sports-performance records per student.
- Track individual improvement over successive assessments (every 4–8
  weeks).
- Predict a fitness category using an explainable ML model.
- Recommend a suitable sport and improvement focus, always with a stated
  reason.
- Require coach review/approval before any recommendation is acted on.
- Generate clear, exportable reports for students, parents, coaches, and
  admins.

## Non-Goals

- FitForge does **not** determine a student's future or talent on its
  own — the model is coach-support only.
- FitForge does **not** replace certified PE curriculum, professional
  talent scouting, or medical evaluation.
- FitForge does **not** collect or process real medical records — only a
  simple clearance/restriction status.
- FitForge does **not** claim scientific certainty in its recommendations;
  outputs are guidance, not verdicts.

## Who Uses It

| Persona | Role | Access |
|---|---|---|
| **Student** | Views own fitness report, recommended sport, training plan, progress | Read-only, own data |
| **Coach/PE Teacher** | Enters assessments, evaluates skills, reviews/approves or overrides AI recommendations | Read/write, assigned students |
| **School Admin** | Manages students, coaches, sports catalog, and system-wide reports | Full access, admin scope |
| **Parent** | Optionally views their child's progress and recommendations | Read-only, own child's data |

## Why This Is a Strong Software Engineering Project

It combines full-stack development, relational database design, applied
machine learning, role-based security, data visualization, and reporting
— all wrapped around a real, socially useful problem. It also forces
genuine engineering discipline: coach-approval gating, explainability
requirements, and honest handling of dataset limitations (see
[ML Model Plan](ml-model-plan.md)) rather than presenting AI as an
infallible black box.
