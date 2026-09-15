import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)


# ============================================================
# 1. LOAD ORIGINAL + AUGMENTED DATA
# ============================================================

original_file = "../data/student_pe_performance.csv"
augmented_file = "../data/student_pe_performance_augmented.csv"

original_df = pd.read_csv(original_file)
augmented_train = pd.read_csv(augmented_file)

print("Original dataset:", original_df.shape)
print("Augmented training dataset:", augmented_train.shape)


# ============================================================
# 2. RECREATE THE SAME TEST SET
# ============================================================

_, test_df = train_test_split(
    original_df,
    test_size=0.20,
    random_state=42,
    stratify=original_df["Performance"]
)

print("\nTest distribution:")
print(test_df["Performance"].value_counts())


# ============================================================
# 3. FEATURES
# ============================================================

drop_columns = [
    "ID",
    "Performance",
    "Overall_PE_Performance_Score",
    "Improvement_Rate",
    "Final_Grade"
]

X_train = augmented_train.drop(columns=drop_columns)
y_train = augmented_train["Performance"]

X_test = test_df.drop(columns=drop_columns)
y_test = test_df["Performance"]


# ============================================================
# 4. COLUMN TYPES
# ============================================================

numeric_features = X_train.select_dtypes(
    include=["number"]
).columns.tolist()

categorical_features = X_train.select_dtypes(
    include=["object", "string", "category"]
).columns.tolist()


# ============================================================
# 5. PREPROCESSING
# ============================================================

numeric_transformer = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ]
)

categorical_transformer = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        (
            "onehot",
            OneHotEncoder(
                handle_unknown="ignore"
            )
        )
    ]
)

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_transformer, numeric_features),
        ("cat", categorical_transformer, categorical_features)
    ]
)


# ============================================================
# 6. RANDOM FOREST
# ============================================================

model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        (
            "classifier",
            RandomForestClassifier(
                n_estimators=300,
                max_depth=8,
                random_state=42,
                class_weight="balanced"
            )
        )
    ]
)


# ============================================================
# 7. TRAIN
# ============================================================

print("\nTraining augmented Random Forest...")

model.fit(X_train, y_train)


# ============================================================
# 8. PREDICT
# ============================================================

y_pred = model.predict(X_test)


# ============================================================
# 9. EVALUATION
# ============================================================

accuracy = accuracy_score(y_test, y_pred)

print("\n================================")
print("AUGMENTED RANDOM FOREST RESULTS")
print("================================")

print(f"\nAccuracy: {accuracy:.2%}")

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_pred,
        zero_division=0
    )
)

print("\nConfusion Matrix:")

print(
    confusion_matrix(
        y_test,
        y_pred
    )
)


# ============================================================
# 10. SAVE MODEL
# ============================================================

model_path = "../models/fitness_model_augmented.pkl"

joblib.dump(
    model,
    model_path
)

print("\nModel saved to:")
print(model_path)

print("\nTraining complete!")