import json
import os
import sys

import joblib
import pandas as pd

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "fitness_model.pkl")


def load_input():
    raw_input = sys.stdin.read().strip()
    if not raw_input:
        raise ValueError("Prediction input must be supplied as JSON through standard input")
    return json.loads(raw_input)


def predict(model, data):
    row = {
        "Age": float(data["age"]),
        "Strength_Score": float(data["strength_score"]),
        "Endurance_Score": float(data["endurance_score"]),
        "Flexibility_Score": float(data["flexibility_score"]),
        "Speed_Agility_Score": float(data["speed_agility_score"]),
        "BMI": float(data["bmi"]),
        "Health_Fitness_Knowledge_Score": float(data["health_fitness_knowledge_score"]),
        "Skills_Score": float(data["skills_score"]),
        "Attendance_Rate": float(data["attendance_rate"]),
        "Hours_Physical_Activity_Per_Week": float(data["hours_physical_activity_per_week"]),
        "Gender": data["gender"],
        "Grade_Level": data["grade_level"],
        "Class_Participation_Level": data["class_participation_level"],
        "Motivation_Level": data["motivation_level"],
        "Previous_Semester_PE_Grade": data["previous_semester_pe_grade"],
    }
    dataframe = pd.DataFrame([row])
    probabilities = model.predict_proba(dataframe)[0]
    class_probabilities = {
        str(label): round(float(probability), 4)
        for label, probability in zip(model.classes_, probabilities)
    }
    return {
        "predicted_fitness_level": str(model.predict(dataframe)[0]),
        "model_confidence": round(float(max(probabilities)), 4),
        "class_probabilities": class_probabilities,
        "requires_coach_review": True,
    }


if __name__ == "__main__":
    try:
        model = joblib.load(MODEL_PATH)
        print(json.dumps(predict(model, load_input())))
    except (KeyError, TypeError, ValueError, json.JSONDecodeError) as error:
        print(f"Invalid prediction input: {error}", file=sys.stderr)
        sys.exit(2)
    except Exception as error:
        print(f"Prediction failed: {error}", file=sys.stderr)
        sys.exit(1)
