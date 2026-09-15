const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Assessment data file
const dataFile = path.join(__dirname, "data", "assessments.json");

// ==============================
// TEST API
// ==============================

app.get("/", (req, res) => {
  res.json({
    message: "Sports Talent Portal API is running",
    status: "success",
  });
});

// ==============================
// GET ALL ASSESSMENTS
// ==============================

app.get("/api/assessments", (req, res) => {
  try {
    const data = fs.readFileSync(dataFile, "utf8");
    const assessments = JSON.parse(data);

    res.json(assessments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to read assessments",
    });
  }
});

// ==============================
// SAVE ASSESSMENT
// ==============================

app.post("/api/assessments", (req, res) => {
  try {
    const assessment = req.body;

    // Basic validation
    if (!assessment.student) {
      return res.status(400).json({
        message: "Student is required",
      });
    }

    // Read existing assessments
    const data = fs.readFileSync(dataFile, "utf8");

    const assessments = JSON.parse(data);

    // Create new assessment
    const newAssessment = {
      id: `ASM-${String(assessments.length + 1).padStart(3, "0")}`,

      ...assessment,

      createdAt: new Date().toISOString(),
    };

    // Add assessment
    assessments.push(newAssessment);

    // Save
    fs.writeFileSync(dataFile, JSON.stringify(assessments, null, 2));

    res.status(201).json({
      message: "Assessment saved successfully",
      assessment: newAssessment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to save assessment",
    });
  }
});

// ==============================
// GET SINGLE ASSESSMENT
// ==============================

app.get("/api/assessments/:id", (req, res) => {
  try {
    const data = fs.readFileSync(dataFile, "utf8");

    const assessments = JSON.parse(data);

    const assessment = assessments.find((item) => item.id === req.params.id);

    if (!assessment) {
      return res.status(404).json({
        message: "Assessment not found",
      });
    }

    res.json(assessment);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to find assessment",
    });
  }
});

// ==============================
// START SERVER
// ==============================

app.post("/api/predict", (req, res) => {
  try {
    const assessment = req.body;

    const pythonPath = "python";

    const scriptPath = path.join(__dirname, "..", "ml", "src", "predict.py");

    const inputData = JSON.stringify({
      age: assessment.age,
      strength_score: assessment.strength_score,
      endurance_score: assessment.endurance_score,
      flexibility_score: assessment.flexibility_score,
      speed_agility_score: assessment.speed_agility_score,
      bmi: assessment.bmi,
      health_fitness_knowledge_score: assessment.health_fitness_knowledge_score,
      skills_score: assessment.skills_score,
      attendance_rate: assessment.attendance_rate,
      hours_physical_activity_per_week:
        assessment.hours_physical_activity_per_week,
      gender: assessment.gender,
      grade_level: assessment.grade_level,
      class_participation_level: assessment.class_participation_level,
      motivation_level: assessment.motivation_level,
      previous_semester_pe_grade: assessment.previous_semester_pe_grade,
    });

    execFile(pythonPath, [scriptPath, inputData], (error, stdout, stderr) => {
      if (error) {
        console.error("ML ERROR:", error);
        console.error(stderr);

        return res.status(500).json({
          message: "ML prediction failed",
        });
      }

      try {
        const prediction = JSON.parse(stdout);

        /*
         * Save prediction to the assessment
         * so it can be used for progress tracking.
         */

        if (assessment.assessment_id) {
          const data = fs.readFileSync(dataFile, "utf8");

          const assessments = JSON.parse(data);

          const index = assessments.findIndex(
            (item) => item.id === assessment.assessment_id,
          );

          if (index !== -1) {
            assessments[index] = {
              ...assessments[index],
              prediction,
            };

            fs.writeFileSync(dataFile, JSON.stringify(assessments, null, 2));
          }
        }

        res.json({
          message: "Prediction successful",
          prediction,
        });
      } catch (parseError) {
        console.error("ML OUTPUT ERROR:", stdout);

        res.status(500).json({
          message: "Invalid ML response",
        });
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Prediction failed",
    });
  }
});

// Coach approval / override endpoint
app.post("/api/assessments/:id/review", (req, res) => {
  try {
    const { id } = req.params;
    const { decision } = req.body;

    if (!["approved", "override"].includes(decision)) {
      return res.status(400).json({
        message: "Decision must be approved or override",
      });
    }

    const data = fs.readFileSync(dataFile, "utf8");
    const assessments = JSON.parse(data);

    const index = assessments.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({
        message: "Assessment not found",
      });
    }

    assessments[index] = {
      ...assessments[index],

      coachApproved: decision === "approved",

      coachDecision: decision,

      reviewedAt: new Date().toISOString(),
    };

    fs.writeFileSync(dataFile, JSON.stringify(assessments, null, 2));

    res.json({
      message:
        decision === "approved"
          ? "Recommendation approved successfully"
          : "Recommendation marked for override",
      assessment: assessments[index],
    });
  } catch (error) {
    console.error("REVIEW ERROR:", error);

    res.status(500).json({
      message: "Unable to save coach decision",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Sports Talent Portal API running on http://localhost:${PORT}`);
});
