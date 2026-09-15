import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

# ============================================================
# CONFIGURATION
# ============================================================

INPUT_FILE = "../data/student_pe_performance.csv"
OUTPUT_FILE = "../data/student_pe_performance_augmented.csv"

RANDOM_STATE = 42
TARGET_HIGH_PERFORMERS = 100

np.random.seed(RANDOM_STATE)


# ============================================================
# 1. LOAD ORIGINAL DATA
# ============================================================

print("Loading dataset...")

df = pd.read_csv(INPUT_FILE)

print(f"Original dataset: {df.shape}")
print("\nOriginal class distribution:")
print(df["Performance"].value_counts())


# ============================================================
# 2. SPLIT ORIGINAL DATA
# ============================================================

train_df, test_df = train_test_split(
    df,
    test_size=0.20,
    random_state=RANDOM_STATE,
    stratify=df["Performance"]
)

print("\nTraining distribution:")
print(train_df["Performance"].value_counts())

print("\nTesting distribution:")
print(test_df["Performance"].value_counts())


# ============================================================
# 3. GET HIGH PERFORMERS FROM TRAINING DATA ONLY
# ============================================================

high_train = train_df[
    train_df["Performance"] == "High Performer"
].copy()

print(
    f"\nOriginal High Performers available for augmentation: "
    f"{len(high_train)}"
)


# ============================================================
# 4. FEATURES WE ARE ALLOWED TO AUGMENT
# ============================================================

numeric_features = [
    "Age",
    "Strength_Score",
    "Endurance_Score",
    "Flexibility_Score",
    "Speed_Agility_Score",
    "BMI",
    "Health_Fitness_Knowledge_Score",
    "Skills_Score",
    "Attendance_Rate",
    "Hours_Physical_Activity_Per_Week"
]

categorical_features = [
    "Gender",
    "Grade_Level",
    "Class_Participation_Level",
    "Motivation_Level",
    "Previous_Semester_PE_Grade"
]


# ============================================================
# 5. REALISTIC RANGES FROM THE ORIGINAL DATA
# ============================================================

feature_ranges = {}

for column in numeric_features:
    feature_ranges[column] = (
        df[column].min(),
        df[column].max()
    )


# ============================================================
# 6. GENERATE SYNTHETIC HIGH PERFORMERS
# ============================================================

synthetic_rows = []

needed = TARGET_HIGH_PERFORMERS - len(high_train)

print(
    f"\nGenerating {needed} additional High Performer "
    f"training samples..."
)

for i in range(needed):

    # Randomly select a genuine High Performer
    source = high_train.sample(
        n=1,
        random_state=RANDOM_STATE + i
    ).iloc[0]

    new_row = source.copy()

    # --------------------------------------------------------
    # Add small controlled variation to numerical features
    # --------------------------------------------------------

    for column in numeric_features:

        original_value = float(source[column])

        # Small variation around original value
        noise = np.random.normal(
            loc=0,
            scale=0.04
        )

        new_value = original_value * (1 + noise)

        # Keep value within original dataset range
        min_value, max_value = feature_ranges[column]

        new_value = np.clip(
            new_value,
            min_value,
            max_value
        )

        # Age should remain an integer
        if column == "Age":
            new_value = round(new_value)
            new_value = int(
                np.clip(new_value, 14, 18)
            )

        new_row[column] = new_value

    # --------------------------------------------------------
    # Preserve categorical characteristics
    # --------------------------------------------------------

    # High Performers in the real dataset all have
    # High motivation, so preserve that observed pattern.
    new_row["Motivation_Level"] = "High"

    # High Performers have high participation in most cases.
    # Preserve the source record's participation level.
    new_row["Class_Participation_Level"] = source[
        "Class_Participation_Level"
    ]

    # --------------------------------------------------------
    # New synthetic ID
    # --------------------------------------------------------

    new_row["ID"] = f"SYN-HIGH-{i + 1:03d}"

    # --------------------------------------------------------
    # Keep target label
    # --------------------------------------------------------

    new_row["Performance"] = "High Performer"

    synthetic_rows.append(new_row)


# ============================================================
# 7. CREATE SYNTHETIC DATAFRAME
# ============================================================

synthetic_df = pd.DataFrame(synthetic_rows)

print(
    f"\nSynthetic High Performers created: "
    f"{len(synthetic_df)}"
)


# ============================================================
# 8. CREATE AUGMENTED TRAINING DATA
# ============================================================

augmented_train = pd.concat(
    [train_df, synthetic_df],
    ignore_index=True
)

print(
    f"\nAugmented training dataset: "
    f"{augmented_train.shape}"
)

print("\nAugmented training distribution:")
print(
    augmented_train["Performance"].value_counts()
)


# ============================================================
# 9. SAVE AUGMENTED DATASET
# ============================================================

augmented_train.to_csv(
    OUTPUT_FILE,
    index=False
)

print("\nSaved augmented dataset:")
print(OUTPUT_FILE)


# ============================================================
# 10. VERIFY TEST DATA WAS NOT MODIFIED
# ============================================================

print("\nOriginal test set remains untouched.")
print(
    f"Test samples: {len(test_df)}"
)

print("\nTest distribution:")
print(
    test_df["Performance"].value_counts()
)

print("\nAugmentation complete!")