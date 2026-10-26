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

### 2. Phase 3 retraining uses a reproducible, leakage-controlled evaluation

The Phase 3 training script uses the original 500 labelled rows only,
drops the identifier and label-derived fields (`ID`, `Performance`,
`Overall_PE_Performance_Score`, `Improvement_Rate`, and `Final_Grade`),
and creates one fixed 80/20 stratified split (`random_state=42`). Numeric
columns are median-imputed and scaled; categorical columns are
most-frequent-imputed and one-hot encoded inside each pipeline.

Logistic Regression, a shallow Decision Tree, and Random Forest were
evaluated both before and after sigmoid probability calibration. The
calibrated Decision Tree was selected by **macro-F1**, rather than overall
accuracy, because accuracy disguises minority-class failure:

| Metric on the untouched 100-row holdout | Selected calibrated Decision Tree |
|---|---:|
| Accuracy | 84.0% |
| Balanced accuracy | 57.1% |
| Macro-F1 | 0.565 |
| Expected calibration error | 0.074 |

The repeatable script, JSON evaluation report, and confusion matrix live
in `code/ml/src/train_fitness_model.py` and `code/ml/reports/`.

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

The `High Performer` category has only 12 out of 500 records (2.4%),
which produces only two High Performer cases in the fixed holdout set.
The selected model has **0% recall for that class** on this test. That
means 84% accuracy must not be described as talent-identification
accuracy. The application returns calibrated probabilities and marks each
prediction for coach review, but it must not claim that it can reliably
identify high-potential athletes yet.

**Recommended handling for the report:** document this honestly as a
known limitation, and consider one of:

- Collapsing to two categories ("Needs Improvement" vs. "Meeting/
  Exceeding Expectations") to avoid an unreliable third class.
- Collecting more independently assessed High Performer records before
  enabling athlete-selection decisions.

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
