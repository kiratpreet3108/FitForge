import sys
import json
import joblib
import pandas as pd

import os

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "fitness_model.pkl"
)

model = joblib.load(MODEL_PATH)


def predict(data):
    row = {
        "Age": float(data["age"]),
        "Strength_Score": float(data["strength_score"]),
        "Endurance_Score": float(data["endurance_score"]),
        "Flexibility_Score": float(data["flexibility_score"]),
        "Speed_Agility_Score": float(data["speed_agility_score"]),
        "BMI": float(data["bmi"]),
        "Health_Fitness_Knowledge_Score": float(
            data["health_fitness_knowledge_score"]
        ),
        "Skills_Score": float(data["skills_score"]),
        "Attendance_Rate": float(data["attendance_rate"]),
        "Hours_Physical_Activity_Per_Week": float(
            data["hours_physical_activity_per_week"]
        ),
        "Gender": data["gender"],
        "Grade_Level": data["grade_level"],
        "Class_Participation_Level": data["class_participation_level"],
        "Motivation_Level": data["motivation_level"],
        "Previous_Semester_PE_Grade": data["previous_semester_pe_grade"],
    }

    df = pd.DataFrame([row])

    prediction = model.predict(df)[0]

    probabilities = model.predict_proba(df)[0]
    confidence = max(probabilities)

    return {
        "predicted_fitness_level": prediction,
        "model_confidence": round(float(confidence), 4)
    }


if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])

    result = predict(input_data)

    print(json.dumps(result))