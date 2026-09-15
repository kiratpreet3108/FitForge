# Scope

## Explicitly Out of Scope

- Real medical diagnosis or detailed medical record storage.
- Fully automated decisions that bypass coach review.
- Professional talent-scouting guarantees or claims of predicting future
  athletic success.
- Live web-scraped exercise content (use a curated local catalogue
  instead).
- Collection of real students' personally identifying information
  (names, Aadhaar, phone numbers) for ML training.
- Integration with official Khelo India private student records.

## Not Yet Delivered, and Why

Reported plainly rather than implied as complete:

- **Sport-suitability recommendation logic** (mapping a fitness profile
  to specific suggested sports) is specified but not yet implemented;
  the current system predicts a fitness category only.
- **Relational database migration:** assessments are currently persisted
  in a flat structure rather than the normalised PostgreSQL schema
  described in [Database Design](database-design.md); this is the next
  planned increment.

## Future Scope

- **Tier 2 rollout:** sport-specific KPI tracking for squad-selected
  students, added one sport at a time, each with its own 5–7 KPIs and a
  progression/forecasting model.
- Expand from a synthetic/public dataset to real, consented school data
  for validation.
- Address class-imbalance properly (oversampling, or collapsing fitness-
  level categories) once more data is available.
- Multi-school deployment with school-level comparative analytics.
- Mobile app version for coaches to enter assessments pitch-side.
- Injury-risk flagging based on load/attendance patterns (with clear
  non-medical disclaimers).

## Assumptions & Constraints

- Student prototype only; not a production deployment.
- Dataset used for training is a public/synthetic dataset with known,
  documented limitations (leakage risk, class imbalance — see
  [ML Model Plan](ml-model-plan.md)).
- Two-person team: ML model and database development proceed in parallel
  against a fixed interface contract ([System Architecture](architecture.md)).
- Real-world use would require school administrative approval, parental
  consent processes, and data-protection review beyond course scope.
