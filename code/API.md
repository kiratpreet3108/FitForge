# FitForge assessment API contract

The frontend submits one assessment object to `POST /api/assessments`. The
backend validates and stores the raw assessment, calculates BMI, and assigns an
`ASM-###` identifier. It is the single source of truth for model input.

Required fields are `student`, `assessmentDate`, `age`, `height`, `weight`,
`sprint`, `shuttle`, `pushups`, `situps`, `plank`, `broadJump`, `flexibility`,
`attendance`, `coachRating`, `gender`, `gradeLevel`, `classParticipationLevel`,
`motivationLevel`, `previousSemesterPeGrade`, `healthFitnessKnowledgeScore`, and
`physicalActivityHours`.

Use `POST /api/assessments/:id/predict` after saving an assessment. The backend
derives the fitness-model feature values and pipes JSON to `predict.py` through
standard input. The response is:

```json
{
  "message": "Prediction successful",
  "assessment": { "id": "ASM-014", "prediction": { "predicted_fitness_level": "Average Performer", "model_confidence": 0.4952 } }
}
```

`GET /api/assessments` returns `{ "assessments": [...] }`; `GET
/api/assessments/:id` returns `{ "assessment": {...} }`. Errors return a JSON
object with a `message` field.
