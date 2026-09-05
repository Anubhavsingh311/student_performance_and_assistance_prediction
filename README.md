# Student Performance & Assistance Prediction

A machine learning project that predicts a student's total marks (regression) and flags whether academic assistance may be needed (classification), using a Random Forest ensemble trained on student demographic and behavioral data.

**Live demo:** [anubhavsingh311.github.io/student_performance_and_assistance_prediction](https://anubhavsingh311.github.io/student_performance_and_assistance_prediction/)  
**Backend Hosted At:** [student-performance-and-assistance.onrender.com](https://student-performance-and-assistance.onrender.com) 

---

## How it works

Each prediction run fires two simultaneous requests to the backend:

- **Regression** — returns an estimated total marks score out of 300 (sum of math, science, and English scores)
- **Classification** — returns whether the student may need academic assistance (`1` = needs help, `0` = on track)

Both models are Random Forest pipelines (scikit-learn) with a `ColumnTransformer` preprocessor that one-hot encodes categorical features and passes numerical features through. Models are serialized as bzip2-compressed pickle files and loaded at server startup.

---

## Model performance

| Model | Metric | Score |
|---|---|---|
| Random Forest Regressor | R² | 0.9152 |
| Random Forest Classifier | Accuracy | 95.92% |
| Random Forest Classifier | F1 Score | 0.9226 |

Both outperformed their baselines (Linear Regression and Logistic Regression respectively) on an 80/20 stratified train-test split.

---

## Input features

| Feature | Type | Values |
|---|---|---|
| `age` | Numeric | 10–30 |
| `study_hours` | Numeric | 0–24 (daily average) |
| `attendance_percentage` | Numeric | 0–100 |
| `gender` | Categorical | female / male / other |
| `school_type` | Categorical | private / public |
| `parent_education` | Categorical | no formal / high school / diploma / graduate / post graduate / phd |
| `travel_time` | Categorical | <15 min / 15-30 min / 30-60 min / >60 min |
| `internet_access` | Categorical | yes / no |
| `extra_activities` | Categorical | yes / no |
| `study_method` | Categorical | mixed / textbook / notes / online videos / group study / coaching |

---

## Dataset

[Student Performance Dataset](https://www.kaggle.com/datasets/kundanbedmutha/student-performance-dataset) by Kundan Bedmutha on Kaggle.

The `total_marks` regression target is engineered as `math_score + science_score + english_score`. The `needs_help` classification target is a binary flag present in the dataset.

---

## Tech stack

| Layer | Stack |
|---|---|
| ML | scikit-learn, pandas, joblib |
| Backend | FastAPI, Uvicorn |
| Frontend | Vanilla HTML / CSS / JS |
| Hosting (API) | Render |
| Hosting (UI) | GitHub Pages |
