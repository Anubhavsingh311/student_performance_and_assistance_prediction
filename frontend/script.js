const API_BASE_URL = "https://student-performance-and-assistance.onrender.com";

const form = document.getElementById("predictionForm");
const predictBtn = document.getElementById("predictBtn");
const buttonText = document.getElementById("buttonText");
const errorBox = document.getElementById("errorBox");
const emptyState = document.getElementById("emptyState");
const resultState = document.getElementById("resultState");
const marksValue = document.getElementById("marksValue");
const assistanceBox = document.getElementById("assistanceBox");
const assistanceIcon = document.getElementById("assistanceIcon");
const assistanceValue = document.getElementById("assistanceValue");
const interpretationTitle = document.getElementById("interpretationTitle");

function value(id) {
  return document.getElementById(id).value;
}

function buildPayload() {
  return {
    age: Number(value("age")),
    gender: value("gender"),
    study_hours: Number(value("study_hours")),
    attendance_percentage: Number(value("attendance_percentage")),
    school_type: value("school_type"),
    extra_activities: value("extra_activities"),
    parent_education: value("parent_education"),
    travel_time: value("travel_time"),
    internet_access: value("internet_access"),
    study_method: value("study_method")
  };
}

function setLoading(isLoading) {
  predictBtn.disabled = isLoading;
  buttonText.textContent = isLoading ? "Predicting..." : "Predict outcome";
  predictBtn.querySelector("b").textContent = isLoading ? "" : "→";
}

function showError(message) {
  errorBox.hidden = false;
  errorBox.textContent = message;
}

function clearError() {
  errorBox.hidden = true;
  errorBox.textContent = "";
}

function showResult(marks, needsHelp) {
  emptyState.hidden = true;
  resultState.hidden = false;
  marksValue.textContent = Number(marks).toFixed(2);

  assistanceBox.classList.toggle("needs-help", needsHelp);
  assistanceBox.classList.toggle("on-track", !needsHelp);
  assistanceIcon.textContent = needsHelp ? "!" : "✓";
  assistanceValue.textContent = needsHelp ? "May be needed" : "Not currently flagged";
  interpretationTitle.textContent = needsHelp ? "Consider early support." : "Student is on track.";
}

async function postPrediction(endpoint, payload) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let detail = "The prediction API returned an error.";
    try {
      const body = await response.json();
      if (body.detail) detail = Array.isArray(body.detail) ? body.detail[0].msg : body.detail;
    } catch (_) {}
    throw new Error(detail);
  }

  return response.json();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();
  setLoading(true);

  try {
    const payload = buildPayload();

    const [regression, classification] = await Promise.all([
      postPrediction("/predict/regression", payload),
      postPrediction("/predict/classification", payload)
    ]);

    const prediction = String(classification.prediction).trim().toLowerCase();
    const needsHelp = prediction === "1" || prediction === "true" || prediction.includes("need");

    showResult(regression.prediction, needsHelp);
  } catch (error) {
    showError(
      `${error.message} Check that the Render API is awake and reachable.`
    );
  } finally {
    setLoading(false);
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  form.reset();
  clearError();
  emptyState.hidden = false;
  resultState.hidden = true;
  document.getElementById("age").value = 18;
  document.getElementById("study_hours").value = 4;
  document.getElementById("attendance_percentage").value = 85;
});

document.getElementById("againBtn").addEventListener("click", () => {
  resultState.hidden = true;
  emptyState.hidden = false;
  window.scrollTo({ top: document.querySelector(".form-card").offsetTop - 100, behavior: "smooth" });
});
