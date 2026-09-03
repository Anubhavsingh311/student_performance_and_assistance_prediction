from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import os

app = FastAPI(title="Student Performance Prediction API")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

regression_model = joblib.load(
    os.path.join(BASE_DIR, "random_forest_regressor.pkl")
)

classification_model = joblib.load(
    os.path.join(BASE_DIR, "random_forest_classifier.pkl")
)


@app.get("/")
def home():
    return {
        "message": "Student Performance Prediction API is running",
        "models": [
            "Random Forest Regressor",
            "Random Forest Classifier"
        ]
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


# ---------------- REGRESSION ----------------

@app.post("/predict/regression")
def predict_regression(data: dict):

    input_data = pd.DataFrame([{
        "age": data["age"],
        "gender": data["gender"],
        "study_hours": data["study_hours"],
        "attendance_percentage": data["attendance_percentage"],
        "school_type": data["school_type"],
        "extra_activities": data["extra_activities"],
        "parent_education": data["parent_education"],
        "travel_time": data["travel_time"]
    }])

    prediction = regression_model.predict(input_data)[0]

    return {
        "prediction": round(float(prediction), 2)
    }


# ---------------- CLASSIFICATION ----------------

@app.post("/predict/classification")
def predict_classification(data: dict):

    input_data = pd.DataFrame([{
        "age": data["age"],
        "gender": data["gender"],
        "study_hours": data["study_hours"],
        "attendance_percentage": data["attendance_percentage"],
        "school_type": data["school_type"],
        "extra_activities": data["extra_activities"],
        "parent_education": data["parent_education"],
        "travel_time": data["travel_time"]
    }])

    prediction = classification_model.predict(input_data)[0]

    return {
        "prediction": str(prediction)
    }
