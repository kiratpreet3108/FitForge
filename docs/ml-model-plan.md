# ML Model Plan

**Owner:** Kiratpreet Kaur

## Approach

Start with simple, explainable models — chosen specifically so results
can be defended in a project viva:

| Model | Purpose |
|---|---|
| Decision Tree | Easy to explain and visualize; primary baseline |
| Random Forest | Higher accuracy, feature importance ranking |
| KNN | Recommends sports by comparing similar fitness profiles |

## Input Features

`age_group, height, weight, BMI, sprint_time, shuttle_run, pushups,
situps, plank_time, broad_jump, flexibility, attendance, sport_interest,
coach_rating`

## Output Labels

`fitness_level` (Beginner / Developing / Good / Excellent),
`recommended_sport`, `improvement_focus`

## Model Flow

```
Fitness-test data + preference + coach assessment
                    |
              Data cleaning
                    |
       ML model prediction/recommendation
                    |
 Coach reviews/approves recommendation
                    |
Training plan and periodic reassessment
                    |
        Progress report and new data
```

**Governing rule:** the model is a coach-support tool. No prediction
reaches a student or parent without coach approval or override.

## Real Findings From Baseline Testing

An actual baseline test was run on a public student PE dataset (500 rows,
Kaggle). Three concrete lessons came out of it and now shape the model
design:

### 1. Data leakage inflates accuracy artificially

An initial run included a column called `Overall_PE_Performance_Score`
as an input feature. Result: **98% accuracy** — suspiciously high.
Feature importance analysis showed the model relying almost entirely on
that one derived column (and `Attendance_Rate`), while genuine fitness
scores (Strength, Endurance, Flexibility, Speed) had **zero importance**.
This happened because the "overall score" column was itself derived from
the same data used to create the target label.

**Lesson applied:** never include a summary/derived score as a model
input. Only raw, independently-collected test values feed the model.

### 2. After removing leaky columns, accuracy dropped to a more honest 81–86%

Retraining with only genuine input features (Strength, Endurance,
Flexibility, Speed_Agility, BMI, Attendance, Motivation, Hours of
activity) gave:

- Decision Tree: 86% accuracy
- Random Forest: 81% accuracy
- Final model (SMOTE-assisted Random Forest): **83% accuracy, macro-F1 ≈ 0.56**

This is a believable, defensible number for a student prototype.

### 3. Attendance and motivation emerged as the strongest genuine predictors

Class-wise average attendance showed a clean, monotonic pattern:

| Performance Class | Avg. Attendance |
|---|---|
| High Performer | 94.2% |
| Average Performer | 89.8% |
| Low Performer | 84.7% |

This was **stronger and cleaner** than any raw physical-fitness score at
separating the classes — a legitimate, report-ready insight: *"Attendance
and engagement emerged as strong predictors of PE performance — even more
than raw physical fitness scores — suggesting consistency matters as much
as raw ability."*

### 4. Class imbalance is a known, unresolved limitation

The `High Performer` category had only 12 out of 500 records. Both
models failed to predict this class at all (0% recall), even after
applying `class_weight='balanced'`. Balancing improved minority-class
attempts slightly (Decision Tree) but reduced overall accuracy (71% vs.
86%) — a real precision/recall trade-off.

**Recommended handling for the report:** document this honestly as a
known limitation, and consider one of:

- Oversampling (SMOTE) for the minority class — already applied in the
  final model.
- Collapsing to two categories ("Needs Improvement" vs. "Meeting/
  Exceeding Expectations") to avoid an unreliable third class.
- Explicitly noting that more data is needed for reliable High Performer
  detection — a legitimate "Future Scope" item.

## What This Means Going Forward

- Whichever final dataset is used, **repeat this same leakage check**
  before trusting any accuracy number.
- Report both the "before" and "after" leakage-correction numbers where
  space allows — it demonstrates methodological rigor to an examiner.
- Treat the model as a decision-support signal, not a verdict — this is
  already baked into the requirement that coaches must approve/override
  every output (see [Requirements](requirements.md), FR-05/FR-06).

## Current Status

Sport-suitability recommendation logic is specified but not yet
implemented — the current system predicts a fitness category only. This
is the next planned increment (see [Scope](scope.md)).
