from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import os

app = FastAPI(title="Student Performance Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")

regression_model = joblib.load(
    os.path.join(MODEL_DIR, "random_forest_regressor.pkl.bz2")
)

classification_model = joblib.load(
    os.path.join(MODEL_DIR, "random_forest_classifier.pkl.bz2")
)


def build_input(data: dict) -> pd.DataFrame:
    return pd.DataFrame([{
        "age": data["age"],
        "gender": data["gender"],
        "study_hours": data["study_hours"],
        "attendance_percentage": data["attendance_percentage"],
        "school_type": data["school_type"],
        "extra_activities": data["extra_activities"],
        "parent_education": data["parent_education"],
        "travel_time": data["travel_time"],
        "internet_access": data.get("internet_access", "yes"),
        "study_method": data.get("study_method", "mixed"),
    }])


@app.get("/")
def home():
    return {
        "message": "Student Performance Prediction API is running",
        "models": ["Random Forest Regressor", "Random Forest Classifier"]
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/predict/regression")
def predict_regression(data: dict):
    prediction = regression_model.predict(build_input(data))[0]
    return {"prediction": round(float(prediction), 2)}


@app.post("/predict/classification")
def predict_classification(data: dict):
    prediction = classification_model.predict(build_input(data))[0]
    return {"prediction": str(prediction)}
