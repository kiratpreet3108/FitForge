# Phase 3: Fitness Model Validation

## Run the validation

From `code/ml`, create the pinned environment and run:

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python src\train_fitness_model.py
```

This rebuilds the deployable model at `models/fitness_model.pkl` and writes:

- `models/fitness_model_metadata.json`
- `reports/fitness_model_evaluation.json`
- `reports/fitness_model_confusion_matrix.csv`

## What was checked

- The source file has 500 rows, no missing values, and no duplicate rows.
- `ID`, the target, and label-derived summary fields are excluded before training.
- The train/test split is 80/20, stratified, and deterministic (`random_state=42`).
- Imputation, scaling, and categorical encoding are inside each model pipeline.
- Logistic Regression, Decision Tree, and Random Forest are compared on the same
  holdout data, before and after sigmoid calibration.
- Selection is by macro-F1, not just accuracy; the report includes precision,
  recall, F1, class support, confusion matrix, and expected calibration error.

## Current result and decision boundary

The selected calibrated Decision Tree reaches 84.0% accuracy, 0.565 macro-F1,
and 0.074 expected calibration error on the 100-row holdout. It detects Average
and Low Performer labels reasonably well, but detects none of the two High
Performer holdout examples. This is expected from a data set with only 12 High
Performer rows, and it is a deployment limitation rather than a success metric.

Use the output only as an assessment-support signal. A coach must review every
result; it must not be used to select, reject, or label a student's talent.
