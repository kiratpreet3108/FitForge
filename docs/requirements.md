# Requirements

## Key Modules

1. **Authentication & Roles** — Role-based login for Student, Coach,
   Admin, Parent. Students cannot edit their own official assessment
   data.
2. **Fitness Assessment** — Coach enters raw test scores; system
   validates, stores history, auto-calculates BMI and improvement %.
3. **ML Recommendation System** — Predicts fitness category, recommends
   a sport and improvement focus, always with a stated reason.
4. **Personalized Guidance** — Weekly training plan, numeric goals,
   attendance tracker, scheduled reassessment.
5. **Performance & Progress Reports** — Charts, comparison against own
   history, downloadable PDF, coach remarks.
6. **Coach Dashboard** — Filter/view assigned students, review/override
   AI recommendations.
7. **Admin Dashboard** — School-wide distribution analytics, follow-up
   tracking.

## Functional Requirements

| ID | Priority | Requirement |
|---|---|---|
| FR-01 | Must | The system shall allow a coach to record a fitness assessment for a student, including all core test scores. |
| FR-02 | Must | The system shall auto-calculate BMI and improvement percentage from the prior assessment. |
| FR-03 | Must | The system shall predict a fitness level and recommended sport using the trained ML model. |
| FR-04 | Must | Every prediction shall include a plain-language reason for the recommendation. |
| FR-05 | Must | No prediction shall be visible to a student or parent until a coach approves or overrides it. |
| FR-06 | Must | The system shall allow a coach to override any AI-generated recommendation. |
| FR-07 | Must | The system shall support Student, Coach, Admin, and Parent roles with distinct access permissions. |
| FR-08 | Must | Students shall not be able to edit their own official assessment data. |
| FR-09 | Should | The system shall generate a downloadable PDF progress report per student. |
| FR-10 | Should | The system shall display comparison charts (speed, stamina, strength, flexibility, attendance) against the student's own prior results. |
| FR-11 | Should | The coach dashboard shall support filtering students by sport, age group, fitness level, or improvement need. |
| FR-12 | Should | The admin dashboard shall show school-wide distribution analytics (fitness level, sport interest, follow-up needs). |
| FR-13 | Could | The system shall recommend exercise videos/articles relevant to a student's improvement focus. |
| FR-14 | Could | Parents shall be able to view a read-only summary of their child's progress. |

## Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Privacy** | Use anonymized/synthetic data for development; store only clearance status, not full medical records; minimum data collection principle. |
| **Security** | Role-based access control; authenticated sessions; students restricted from editing official records. |
| **Explainability** | Every ML output must show the reasoning/features behind the recommendation, not a bare label. |
| **Fairness/Reliability** | The model shall not be presented as determining a student's talent or future; coach approval is mandatory before any output is acted upon. |
| **Usability** | Dashboards and reports must be understandable by coaches and parents without technical background. |
| **Performance** | Assessment entry and prediction retrieval should complete within a few seconds for a responsive coach workflow. |
| **Data Integrity** | Assessment history must be immutable once approved (append new assessments rather than overwrite past ones), to preserve accurate progress tracking. |

## Acceptance Criteria

- A coach can enter a full assessment and see BMI and improvement %
  auto-calculated.
- A test assessment produces a fitness-level prediction, a recommended
  sport, and a stated reason.
- A prediction is not visible to the student/parent view until a coach
  has approved or overridden it.
- A student can view their own progress chart showing at least two
  assessments over time.
- Role-based access prevents a student from editing their own assessment
  record.
- An admin can view school-wide distribution by fitness level.

## Requirements Traceability

| Requirement | Module | Acceptance Evidence |
|---|---|---|
| FR-01, FR-02 | Fitness Assessment | Assessment saved with auto-calculated BMI/improvement % |
| FR-03, FR-04 | ML Recommendation System | Prediction includes level, sport, and stated reason |
| FR-05, FR-06 | Coach Dashboard | Recommendation hidden from student view until approved/overridden |
| FR-07, FR-08 | Authentication & Roles | Role-restricted access verified per user type |
| FR-09, FR-10 | Performance & Progress Reports | PDF export and comparison chart render correctly |
| FR-11 | Coach Dashboard | Filter by sport/age/fitness level returns correct subset |
| FR-12 | Admin Dashboard | Distribution analytics match underlying data |
