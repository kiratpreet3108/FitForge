import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline


# =========================
# 1. Load Dataset
# =========================

data_path = "../data/student_pe_performance.csv"

df = pd.read_csv(data_path)

print("Dataset shape:", df.shape)
print("\nPerformance distribution:")
print(df["Performance"].value_counts())


# =========================
# 2. Features and Target
# =========================

X = df.drop(
    columns=[
        "ID",
        "Performance",
        "Overall_PE_Performance_Score",
        "Improvement_Rate",
        "Final_Grade"
    ]
)

y = df["Performance"]


# =========================
# 3. Identify Columns
# =========================

numeric_features = X.select_dtypes(
    include=["number"]
).columns.tolist()

categorical_features = X.select_dtypes(
    include=["object", "string", "category"]
).columns.tolist()

print("\nNumeric features:")
print(numeric_features)

print("\nCategorical features:")
print(categorical_features)


# =========================
# 4. Preprocessing
# =========================

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
                handle_unknown="ignore",
                sparse_output=False
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


# =========================
# 5. SMOTE + Random Forest
# =========================

model = ImbPipeline(
    steps=[
        ("preprocessor", preprocessor),

        # Only training data is oversampled
        (
            "smote",
            SMOTE(
                random_state=42,
                k_neighbors=3
            )
        ),

        (
            "classifier",
            RandomForestClassifier(
                n_estimators=200,
                max_depth=8,
                random_state=42,
                class_weight="balanced"
            )
        )
    ]
)


# =========================
# 6. Train/Test Split
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# =========================
# 7. Train
# =========================

print("\nTraining SMOTE + Random Forest...")

model.fit(X_train, y_train)


# =========================
# 8. Prediction
# =========================

y_pred = model.predict(X_test)


# =========================
# 9. Evaluation
# =========================

accuracy = accuracy_score(y_test, y_pred)

print("\n==============================")
print("SMOTE MODEL RESULTS")
print("==============================")

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
print(confusion_matrix(y_test, y_pred))


# =========================
# 10. Save Model
# =========================

model_path = "../models/fitness_model_smote.pkl"

joblib.dump(model, model_path)

print("\nModel saved to:")
print(model_path)