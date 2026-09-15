# Methodology, Testing & Syllabus Traceability

## Sprint Plan (Agile/Scrum)

- **Sprint 1:** Requirements, personas, schema design, use cases.
- **Sprint 2:** Authentication, role-based access, database setup (all 5
  tables).
- **Sprint 3:** Fitness Assessment module (entry, validation,
  BMI/improvement calculation).
- **Sprint 4:** ML baseline model (Decision Tree/Random Forest), trained
  and evaluated on chosen dataset.
- **Sprint 5:** Coach Dashboard — review, approve, override
  recommendations.
- **Sprint 6:** Performance & Progress Reports (charts, PDF export).
- **Sprint 7:** Admin Dashboard and school-wide analytics.
- **Sprint 8:** Integration, usability testing, final demonstration.

Backlog is built directly from the Must/Should/Could priority tags in
[Requirements](requirements.md).

## Testing Strategy

- **Unit testing:** BMI/improvement calculations, validation rules, RBAC
  checks.
- **Model evaluation:** accuracy, precision/recall per class, confusion
  matrix; explicit check for data leakage and class imbalance before
  reporting results (see [ML Model Plan](ml-model-plan.md) for why this
  matters).
- **Integration testing:** assessment entry -> model prediction -> coach
  approval -> student/parent visibility flow.
- **Usability testing:** whether coaches and parents can interpret
  reports and recommendations without guidance.
- **Security testing:** role-based access boundaries (e.g., a student
  cannot access another student's data).

## Software Engineering Artefact Traceability

Maps this project directly to the course syllabus units.

| SE Area (Syllabus) | Evidence in This Project |
|---|---|
| Requirements Engineering | Problem statement, personas, FR-01 to FR-14 with priorities, NFRs ([Project Overview](project-overview.md), [Requirements](requirements.md)) |
| Data Modeling (E-R Diagram) | Full schema and relationships ([Database Design](database-design.md)) |
| System Design (architecture, MVC-style layering) | Layered architecture, Model-Database contract ([System Architecture](architecture.md)) |
| UML Modelling | Use-case diagram (per persona), sequence diagram (assessment -> prediction -> approval flow) |
| Agile Software Development | 8-sprint plan, Must/Should/Could backlog (this page) |
| Software Verification & Validation | Testing strategy above, model evaluation methodology ([ML Model Plan](ml-model-plan.md)) |
| Project Management | Two-person split with a defined interface contract ([System Architecture](architecture.md)) |
