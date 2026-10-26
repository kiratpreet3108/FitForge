"""Train and audit FitForge's fitness-level classifier.

The source data is synthetic and severely imbalanced. This script intentionally
uses only the original labelled rows for its reported holdout metrics; it does
not put generated minority-class rows in the test set.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.calibration import CalibratedClassifierCV
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.tree import DecisionTreeClassifier

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "student_pe_performance.csv"
MODEL_PATH = ROOT / "models" / "fitness_model.pkl"
METADATA_PATH = ROOT / "models" / "fitness_model_metadata.json"
REPORT_PATH = ROOT / "reports" / "fitness_model_evaluation.json"
CONFUSION_PATH = ROOT / "reports" / "fitness_model_confusion_matrix.csv"

TARGET = "Performance"
LEAKAGE_COLUMNS = [
    "ID",
    TARGET,
    "Overall_PE_Performance_Score",
    "Improvement_Rate",
    "Final_Grade",
]
RANDOM_STATE = 42


def expected_calibration_error(probabilities: np.ndarray, correct: np.ndarray, bins: int = 10) -> float:
    """Return top-label expected calibration error without external packages."""
    confidence = probabilities.max(axis=1)
    ece = 0.0
    for lower in np.linspace(0, 0.9, bins):
        upper = lower + 0.1
        mask = (confidence >= lower) & ((confidence < upper) if upper < 1 else (confidence <= upper))
        if mask.any():
            ece += mask.mean() * abs(correct[mask].mean() - confidence[mask].mean())
    return float(ece)


def make_preprocessor(numeric_features: list[str], categorical_features: list[str]) -> ColumnTransformer:
    return ColumnTransformer(
        transformers=[
            (
                "numeric",
                Pipeline([
                    ("imputer", SimpleImputer(strategy="median")),
                    ("scaler", StandardScaler()),
                ]),
                numeric_features,
            ),
            (
                "categorical",
                Pipeline([
                    ("imputer", SimpleImputer(strategy="most_frequent")),
                    ("onehot", OneHotEncoder(handle_unknown="ignore")),
                ]),
                categorical_features,
            ),
        ]
    )


def build_candidates(numeric_features: list[str], categorical_features: list[str]) -> dict[str, Pipeline]:
    classifiers = {
        "logistic_regression": LogisticRegression(max_iter=2000, class_weight="balanced", random_state=RANDOM_STATE),
        "decision_tree": DecisionTreeClassifier(max_depth=4, min_samples_leaf=8, class_weight="balanced", random_state=RANDOM_STATE),
        "random_forest": RandomForestClassifier(
            n_estimators=400,
            max_depth=8,
            min_samples_leaf=3,
            class_weight="balanced_subsample",
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),
    }
    return {
        name: Pipeline([("preprocessor", make_preprocessor(numeric_features, categorical_features)), ("classifier", classifier)])
        for name, classifier in classifiers.items()
    }


def metrics_for(model, features, target, labels: list[str]) -> tuple[dict, np.ndarray, np.ndarray]:
    predictions = model.predict(features)
    probabilities = model.predict_proba(features)
    correct = predictions == target.to_numpy()
    metrics = {
        "accuracy": round(float(accuracy_score(target, predictions)), 4),
        "balanced_accuracy": round(float(balanced_accuracy_score(target, predictions)), 4),
        "macro_f1": round(float(f1_score(target, predictions, labels=labels, average="macro", zero_division=0)), 4),
        "expected_calibration_error": round(expected_calibration_error(probabilities, correct), 4),
        "classification_report": classification_report(target, predictions, labels=labels, output_dict=True, zero_division=0),
    }
    return metrics, predictions, probabilities


def json_ready(value):
    if isinstance(value, dict):
        return {key: json_ready(item) for key, item in value.items()}
    if isinstance(value, list):
        return [json_ready(item) for item in value]
    if isinstance(value, (np.floating, np.integer)):
        return value.item()
    return value


def main() -> None:
    dataset = pd.read_csv(DATA_PATH)
    labels = sorted(dataset[TARGET].unique().tolist())
    feature_data = dataset.drop(columns=LEAKAGE_COLUMNS)
    target = dataset[TARGET]
    numeric_features = feature_data.select_dtypes(include="number").columns.tolist()
    categorical_features = feature_data.select_dtypes(include=["object", "string", "category"]).columns.tolist()

    x_train, x_test, y_train, y_test = train_test_split(
        feature_data,
        target,
        test_size=0.20,
        stratify=target,
        random_state=RANDOM_STATE,
    )

    candidates = build_candidates(numeric_features, categorical_features)
    comparison = {}
    fitted_candidates = {}
    for name, model in candidates.items():
        model.fit(x_train, y_train)
        uncalibrated_metrics, _, _ = metrics_for(model, x_test, y_test, labels)
        calibrated_model = CalibratedClassifierCV(model, method="sigmoid", cv=3)
        calibrated_model.fit(x_train, y_train)
        calibrated_metrics, _, _ = metrics_for(calibrated_model, x_test, y_test, labels)
        comparison[name] = {
            "uncalibrated_holdout_metrics": uncalibrated_metrics,
            "calibrated_holdout_metrics": calibrated_metrics,
        }
        fitted_candidates[name] = calibrated_model

    # Macro-F1 is the selection metric because accuracy alone hides minority-class failure.
    selected_name = max(comparison, key=lambda name: comparison[name]["calibrated_holdout_metrics"]["macro_f1"])
    calibrated_model = fitted_candidates[selected_name]
    selected_metrics, predictions, probabilities = metrics_for(calibrated_model, x_test, y_test, labels)

    audit = {
        "rows": int(len(dataset)),
        "duplicate_rows": int(dataset.duplicated().sum()),
        "missing_values": {column: int(count) for column, count in dataset.isna().sum().items() if count},
        "class_distribution": {label: int(count) for label, count in target.value_counts().items()},
        "class_percentages": {label: round(float(count / len(dataset)), 4) for label, count in target.value_counts().items()},
        "dropped_leakage_or_identifier_columns": LEAKAGE_COLUMNS,
        "feature_columns": {"numeric": numeric_features, "categorical": categorical_features},
        "known_limitations": [
            "The source is a synthetic student PE dataset, not a coach-validated deployment dataset.",
            "Only 12 of 500 rows are High Performer, so that class has only 2-3 holdout examples.",
            "Reported probability is calibrated on the training partition, but it is not a clinical or talent-selection certainty.",
        ],
    }

    matrix = confusion_matrix(y_test, predictions, labels=labels)
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    pd.DataFrame(matrix, index=labels, columns=labels).rename_axis("actual/predicted").to_csv(CONFUSION_PATH)

    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "split": {"method": "stratified_holdout", "test_size": 0.20, "random_state": RANDOM_STATE, "train_rows": int(len(x_train)), "test_rows": int(len(x_test))},
        "dataset_audit": audit,
        "candidate_models": comparison,
        "selected_model": {
            "family": selected_name,
            "calibration": "sigmoid calibration with 3-fold cross-validation on the training partition",
            "holdout_metrics": selected_metrics,
            "confusion_matrix_file": str(CONFUSION_PATH.relative_to(ROOT)),
        },
    }
    joblib.dump(calibrated_model, MODEL_PATH)
    METADATA_PATH.write_text(json.dumps(json_ready(report), indent=2), encoding="utf-8")
    REPORT_PATH.write_text(json.dumps(json_ready(report), indent=2), encoding="utf-8")

    print(json.dumps(json_ready({
        "selected_model": selected_name,
        "holdout_accuracy": selected_metrics["accuracy"],
        "holdout_macro_f1": selected_metrics["macro_f1"],
        "holdout_balanced_accuracy": selected_metrics["balanced_accuracy"],
        "holdout_ece": selected_metrics["expected_calibration_error"],
        "report": str(REPORT_PATH),
    }), indent=2))


if __name__ == "__main__":
    main()
