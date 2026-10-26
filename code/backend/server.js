const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
const PORT = Number(process.env.PORT || 5000);
const dataFile = path.join(__dirname, "data", "assessments.json");
const mlDirectory = path.resolve(__dirname, "..", "ml");
const predictionScript = path.join(mlDirectory, "src", "predict.py");
const projectPython = path.join(mlDirectory, ".venv", process.platform === "win32" ? "Scripts" : "bin", process.platform === "win32" ? "python.exe" : "python");
const pythonExecutable = process.env.PYTHON_EXECUTABLE || projectPython;

app.use(cors());
app.use(express.json({ limit: "100kb" }));

const numberFields = ["age", "height", "weight", "sprint", "shuttle", "pushups", "situps", "plank", "broadJump", "flexibility", "attendance", "coachRating", "healthFitnessKnowledgeScore", "physicalActivityHours"];
const categoricalFields = ["student", "assessmentDate", "gender", "gradeLevel", "classParticipationLevel", "motivationLevel", "previousSemesterPeGrade"];

function ensureDataFile() {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "[]\n");
}

function readAssessments() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function writeAssessments(assessments) {
  fs.writeFileSync(dataFile, `${JSON.stringify(assessments, null, 2)}\n`);
}

function nextAssessmentId(assessments) {
  const largestId = assessments.reduce((largest, assessment) => {
    const match = /^ASM-(\d+)$/.exec(assessment.id || "");
    return match ? Math.max(largest, Number(match[1])) : largest;
  }, 0);
  return `ASM-${String(largestId + 1).padStart(3, "0")}`;
}

function validationError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function normalizeAssessment(input) {
  if (!input || typeof input !== "object") throw validationError("A JSON assessment body is required");
  const assessment = {};

  for (const field of categoricalFields) {
    const value = String(input[field] ?? "").trim();
    if (!value) throw validationError(`${field} is required`);
    assessment[field] = value;
  }
  for (const field of numberFields) {
    const value = Number(input[field]);
    if (!Number.isFinite(value)) throw validationError(`${field} must be a number`);
    assessment[field] = value;
  }

  const ranges = {
    age: [8, 20], height: [50, 250], weight: [10, 200], sprint: [1, 60], shuttle: [1, 120],
    pushups: [0, 200], situps: [0, 200], plank: [0, 600], broadJump: [0, 500],
    flexibility: [0, 100], attendance: [0, 100], coachRating: [1, 10],
    healthFitnessKnowledgeScore: [0, 100], physicalActivityHours: [0, 80],
  };
  for (const [field, [minimum, maximum]] of Object.entries(ranges)) {
    if (assessment[field] < minimum || assessment[field] > maximum) {
      throw validationError(`${field} must be between ${minimum} and ${maximum}`);
    }
  }

  const heightInMetres = assessment.height / 100;
  assessment.bmi = Number((assessment.weight / (heightInMetres ** 2)).toFixed(1));
  return assessment;
}

function toModelInput(assessment) {
  const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)));
  return {
    age: assessment.age,
    strength_score: clamp(((assessment.pushups / 40) * 100 + (assessment.situps / 40) * 100 + (assessment.plank / 120) * 100) / 3),
    endurance_score: clamp(100 - ((assessment.shuttle - 8) / 12) * 100),
    flexibility_score: assessment.flexibility,
    speed_agility_score: clamp(100 - ((assessment.sprint - 6) / 6) * 100),
    bmi: assessment.bmi,
    health_fitness_knowledge_score: assessment.healthFitnessKnowledgeScore,
    skills_score: clamp((assessment.coachRating / 10) * 100),
    attendance_rate: assessment.attendance,
    hours_physical_activity_per_week: assessment.physicalActivityHours,
    gender: assessment.gender,
    grade_level: assessment.gradeLevel,
    class_participation_level: assessment.classParticipationLevel,
    motivation_level: assessment.motivationLevel,
    previous_semester_pe_grade: assessment.previousSemesterPeGrade,
  };
}

function buildWhiteBoxExplanation(assessment, modelInput, prediction) {
  const metric = (name, value, unit, score, formula, meaning) => ({
    name,
    value,
    unit,
    derivedScore: score,
    formula,
    meaning,
  });

  return {
    type: "transparent_prototype_explanation",
    modelInputs: [
      metric(
        "Strength and core",
        `${assessment.pushups} push-ups, ${assessment.situps} sit-ups, ${assessment.plank}s plank`,
        "",
        modelInput.strength_score,
        "Average of push-ups / 40, sit-ups / 40, and plank seconds / 120; each component is capped at 100.",
        modelInput.strength_score >= 65 ? "This is a relative strength in this assessment." : "This is an area to develop with safe, coach-led strength work.",
      ),
      metric(
        "Endurance",
        assessment.shuttle,
        "seconds (shuttle run)",
        modelInput.endurance_score,
        "100 − ((shuttle seconds − 8) / 12 × 100), capped between 0 and 100. A lower time produces a higher score.",
        modelInput.endurance_score >= 65 ? "This supports sustained activity." : "This suggests endurance should be reviewed and developed.",
      ),
      metric(
        "Speed and agility",
        assessment.sprint,
        "seconds (sprint)",
        modelInput.speed_agility_score,
        "100 − ((sprint seconds − 6) / 6 × 100), capped between 0 and 100. A lower time produces a higher score.",
        modelInput.speed_agility_score >= 65 ? "This supports quick movement activities." : "This is a possible training focus for acceleration and technique.",
      ),
      metric(
        "Flexibility",
        assessment.flexibility,
        "cm",
        modelInput.flexibility_score,
        "The recorded flexibility value is passed directly to the model on its 0–100 input scale.",
        modelInput.flexibility_score >= 60 ? "This is a relative mobility strength in the current assessment." : "Coach review can identify suitable mobility work.",
      ),
      metric(
        "Skills rating",
        assessment.coachRating,
        "/10 coach rating",
        modelInput.skills_score,
        "Coach rating × 10.",
        "This is a coach-entered observation, not an automated test result.",
      ),
    ],
    contextualInputs: [
      `Attendance: ${assessment.attendance}%`,
      `Physical activity: ${assessment.physicalActivityHours} hours/week`,
      `Health and fitness knowledge: ${assessment.healthFitnessKnowledgeScore}/100`,
      `BMI: ${assessment.bmi}`,
      `Participation: ${assessment.classParticipationLevel}; motivation: ${assessment.motivationLevel}`,
    ],
    resultExplanation: `The classifier compared these recorded inputs with its training patterns and selected ${prediction.predicted_fitness_level}. The confidence is the calibrated probability of its most likely class, not a measure of talent or future potential.`,
    limitations: [
      "Prototype benchmark formulas are transparent score conversions, not medical or age-specific norms.",
      "The sport cards use fixed, visible prototype rules; they are not outputs of a trained sport recommendation model.",
      "Coach review is required before this guidance is shared or acted upon.",
    ],
  };
}

function buildTrainingPlan(assessment, modelInput) {
  const focusOptions = [
    {
      key: "strength",
      name: "Strength and core",
      score: modelInput.strength_score,
      current: `${assessment.pushups} push-ups, ${assessment.situps} sit-ups, ${assessment.plank}s plank`,
      goal: "Build controlled trunk and upper-body endurance.",
      sessions: ["2 sets of 6–10 incline or standard push-ups", "2 sets of 20–30 second planks", "2 sets of 8–12 bodyweight squats"],
      safety: "Use controlled form; stop for pain and let the coach adjust the variation.",
    },
    {
      key: "endurance",
      name: "Endurance",
      score: modelInput.endurance_score,
      current: `${assessment.shuttle}s shuttle-run result`,
      goal: "Improve comfortable sustained movement and recovery.",
      sessions: ["5-minute easy warm-up", "6 rounds: 1 minute easy jog + 1 minute walk", "3-minute cool-down walk"],
      safety: "Keep the effort conversational; pause for dizziness, pain, or unusual breathlessness.",
    },
    {
      key: "speed",
      name: "Speed and agility",
      score: modelInput.speed_agility_score,
      current: `${assessment.sprint}s sprint result`,
      goal: "Develop acceleration, deceleration, and movement technique.",
      sessions: ["5-minute dynamic warm-up", "4 × 10 m controlled acceleration drills", "3 × 20 second change-of-direction drills with full walking recovery"],
      safety: "Prioritize landing and turning technique; do not train at maximal speed when fatigued.",
    },
    {
      key: "flexibility",
      name: "Mobility and flexibility",
      score: modelInput.flexibility_score,
      current: `${assessment.flexibility} cm flexibility result`,
      goal: "Improve comfortable range of motion for movement quality.",
      sessions: ["5-minute dynamic mobility warm-up", "2 × 20 second hamstring stretch per side", "2 × 20 second hip-flexor stretch per side"],
      safety: "Stretch gently without bouncing; never force a range of motion.",
    },
  ];

  const focusAreas = focusOptions.sort((a, b) => a.score - b.score).slice(0, 3);
  return {
    planVersion: "prototype-v1",
    frequency: "3 coach-supervised sessions per week, with at least one rest day between similar sessions.",
    duration: "4 weeks, then reassess with the same fitness battery.",
    focusAreas,
    weeklySchedule: [
      { day: "Session A", activity: `${focusAreas[0].name} + easy mobility`, duration: "20–25 minutes" },
      { day: "Session B", activity: `${focusAreas[1].name} + ${focusAreas[2].name}`, duration: "20–25 minutes" },
      { day: "Session C", activity: "Repeat Session A at comfortable effort and record completion", duration: "20–25 minutes" },
    ],
    coachFeedback: "",
    status: "draft",
    disclaimer: "This is a general school-fitness plan, not medical advice. A coach must adapt it for injury, disability, health concerns, equipment, and the student’s response.",
  };
}

function runPrediction(modelInput) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(pythonExecutable)) return reject(new Error(`Python executable not found: ${pythonExecutable}`));
    if (!fs.existsSync(predictionScript)) return reject(new Error(`Prediction script not found: ${predictionScript}`));
    const child = spawn(pythonExecutable, [predictionScript], { cwd: mlDirectory, stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) return reject(new Error(`Prediction process failed (exit ${code}): ${stderr.trim()}`));
      try { resolve(JSON.parse(stdout)); } catch { reject(new Error(`Prediction returned invalid JSON: ${stdout}`)); }
    });
    child.stdin.end(JSON.stringify(modelInput));
  });
}

app.get("/", (_req, res) => res.json({ message: "Sports Talent Portal API is running", status: "success" }));
app.get("/api/health", (_req, res) => res.json({ status: "success", pythonConfigured: fs.existsSync(pythonExecutable), modelConfigured: fs.existsSync(predictionScript) }));

app.get("/api/assessments", (_req, res) => {
  try { res.json({ assessments: readAssessments() }); }
  catch { res.status(500).json({ message: "Unable to read assessments" }); }
});

app.post("/api/assessments", (req, res) => {
  try {
    const assessments = readAssessments();
    const assessment = { id: nextAssessmentId(assessments), ...normalizeAssessment(req.body), createdAt: new Date().toISOString() };
    assessments.push(assessment);
    writeAssessments(assessments);
    res.status(201).json({ message: "Assessment saved successfully", assessment });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.status ? error.message : "Unable to save assessment" });
  }
});

app.get("/api/assessments/:id", (req, res) => {
  try {
    const assessment = readAssessments().find((item) => item.id === req.params.id);
    if (!assessment) return res.status(404).json({ message: "Assessment not found" });
    return res.json({ assessment });
  } catch { return res.status(500).json({ message: "Unable to find assessment" }); }
});

app.post("/api/assessments/:id/predict", async (req, res) => {
  try {
    const assessments = readAssessments();
    const index = assessments.findIndex((item) => item.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Assessment not found" });
    const modelInput = toModelInput(assessments[index]);
    const prediction = await runPrediction(modelInput);
    const explanation = buildWhiteBoxExplanation(assessments[index], modelInput, prediction);
    const trainingPlan = buildTrainingPlan(assessments[index], modelInput);
    assessments[index] = { ...assessments[index], prediction, explanation, trainingPlan, modelVersion: "fitness_model.pkl", predictedAt: new Date().toISOString() };
    writeAssessments(assessments);
    return res.json({ message: "Prediction successful", assessment: assessments[index] });
  } catch (error) {
    console.error("PREDICTION ERROR:", error.message);
    return res.status(500).json({ message: "ML prediction failed" });
  }
});

app.post("/api/assessments/:id/review", (req, res) => {
  try {
    const { decision } = req.body;
    if (!["approved", "override"].includes(decision)) return res.status(400).json({ message: "Decision must be approved or override" });
    const assessments = readAssessments();
    const index = assessments.findIndex((item) => item.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Assessment not found" });
    assessments[index] = { ...assessments[index], coachApproved: decision === "approved", coachDecision: decision, reviewedAt: new Date().toISOString() };
    writeAssessments(assessments);
    return res.json({ message: "Coach decision saved", assessment: assessments[index] });
  } catch { return res.status(500).json({ message: "Unable to save coach decision" }); }
});

app.post("/api/assessments/:id/training-plan/review", (req, res) => {
  try {
    const coachFeedback = String(req.body?.coachFeedback ?? "").trim();
    if (coachFeedback.length > 1000) return res.status(400).json({ message: "Coach feedback must be 1000 characters or fewer" });
    const assessments = readAssessments();
    const index = assessments.findIndex((item) => item.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Assessment not found" });
    if (!assessments[index].trainingPlan) return res.status(409).json({ message: "Generate a prediction before reviewing the training plan" });
    assessments[index].trainingPlan = {
      ...assessments[index].trainingPlan,
      coachFeedback,
      status: "coach-reviewed",
      reviewedAt: new Date().toISOString(),
    };
    writeAssessments(assessments);
    return res.json({ message: "Training plan feedback saved", assessment: assessments[index] });
  } catch { return res.status(500).json({ message: "Unable to save training plan feedback" }); }
});

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && "body" in error) return res.status(400).json({ message: "Request body must be valid JSON" });
  return res.status(500).json({ message: "Unexpected server error" });
});

app.listen(PORT, () => console.log(`Sports Talent Portal API running on http://localhost:${PORT}`));
