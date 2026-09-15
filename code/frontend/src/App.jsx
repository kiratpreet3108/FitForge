import { useEffect, useState } from "react";
import jsPDF from "jspdf";

import "./App.css";

/* =========================================================
   COACH DASHBOARD
========================================================= */

function CoachDashboard({ onLogout, onNewAssessment }) {
  const students = [
    {
      id: "STU-001",
      name: "Arjun Sharma",
      level: "Good",
      sport: "Football",
    },
    {
      id: "STU-002",
      name: "Aman Singh",
      level: "Developing",
      sport: "Basketball",
    },
    {
      id: "STU-003",
      name: "Simran Kaur",
      level: "Excellent",
      sport: "Athletics",
    },
    {
      id: "STU-004",
      name: "Rahul Verma",
      level: "Good",
      sport: "Cricket",
    },
  ];

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo">
          🏆
          <div>
            <strong>Sports Talent</strong>
            <span>Portal</span>
          </div>
        </div>

        <nav>
          <button className="nav-item active">📊 Dashboard</button>
          <button className="nav-item">👨‍🎓 Students</button>
          <button className="nav-item">📝 Assessments</button>
          <button className="nav-item">🤖 Recommendations</button>
          <button className="nav-item">📈 Reports</button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item">⚙️ Settings</button>

          <button className="logout-button" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1>Coach Dashboard</h1>
            <p>Monitor student fitness and AI recommendations.</p>
          </div>

          <div className="coach-profile">
            <div className="notification">🔔</div>

            <div className="avatar">RC</div>

            <div>
              <strong>Rahul Coach</strong>
              <span>PE Coach</span>
            </div>
          </div>
        </header>

        <section className="welcome-card">
          <div>
            <h2>Good Morning, Coach! 👋</h2>

            <p>
              Review your students&apos; fitness assessments and AI-assisted
              recommendations.
            </p>
          </div>

          <button className="primary-button" onClick={onNewAssessment}>
            + New Assessment
          </button>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">👨‍🎓</div>

            <div>
              <span>Total Students</span>
              <strong>48</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">📝</div>

            <div>
              <span>Assessments</span>
              <strong>124</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">🤖</div>

            <div>
              <span>Pending Review</span>
              <strong>7</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">📈</div>

            <div>
              <span>Avg. Fitness</span>
              <strong>Good</strong>
            </div>
          </div>
        </section>

        <section className="students-section">
          <div className="section-header">
            <div>
              <h2>Recent Students</h2>
              <p>Latest student fitness information</p>
            </div>

            <button className="view-all">View All →</button>
          </div>

          <div className="student-table">
            <div className="table-header">
              <span>Student</span>
              <span>Fitness Level</span>
              <span>Recommended Sport</span>
              <span>Action</span>
            </div>

            {students.map((student) => (
              <div className="student-row" key={student.id}>
                <div className="student-info">
                  <div className="student-avatar">{student.name.charAt(0)}</div>

                  <div>
                    <strong>{student.name}</strong>
                    <span>{student.id}</span>
                  </div>
                </div>

                <div>
                  <span
                    className={`fitness-badge ${student.level
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {student.level}
                  </span>
                </div>

                <div className="sport-name">{student.sport}</div>

                <button className="view-button">View</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   LOGIN
========================================================= */

function Login({ onLogin }) {
  const [role, setRole] = useState("Student");

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin(role);
  };

  return (
    <div className="app">
      <div className="login-container">
        <div className="brand-section">
          <div className="brand-icon">🏆</div>

          <h1>Sports Talent</h1>
          <h1 className="highlight">Portal</h1>

          <p>AI-Based Student Sports Talent & Fitness Guidance</p>

          <div className="feature-list">
            <div>✓ Fitness Assessment</div>
            <div>✓ AI-Based Recommendations</div>
            <div>✓ Coach Guidance</div>
            <div>✓ Progress Tracking</div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your dashboard</p>
          </div>

          <label className="label">Login as</label>

          <div className="role-grid">
            {["Student", "Coach", "Parent", "Admin"].map((item) => (
              <button
                key={item}
                type="button"
                className={`role-button ${role === item ? "active" : ""}`}
                onClick={() => setRole(item)}
              >
                <span className="role-icon">
                  {item === "Student" && "🎓"}
                  {item === "Coach" && "🏃"}
                  {item === "Parent" && "👨‍👩‍👧"}
                  {item === "Admin" && "⚙️"}
                </span>

                {item}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin}>
            <label className="label">Username</label>

            <input type="text" placeholder="Enter your username" required />

            <label className="label">Password</label>

            <input type="password" placeholder="Enter your password" required />

            <div className="form-options">
              <label>
                <input type="checkbox" />
                Remember me
              </label>

              <button type="button" className="forgot">
                Forgot password?
              </button>
            </div>

            <button className="login-button" type="submit">
              Sign In as {role}
            </button>
          </form>

          <p className="demo-text">
            Academic Project • AI-Assisted Fitness Guidance
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ASSESSMENT PAGE
========================================================= */

function AssessmentPage({ onBack, onAnalyze }) {
  const [formData, setFormData] = useState({
    student: "",
    assessmentDate: new Date().toISOString().split("T")[0],
    age: "",
    height: "",
    weight: "",
    sprint: "",
    shuttle: "",
    pushups: "",
    situps: "",
    plank: "",
    broadJump: "",
    flexibility: "",
    attendance: "",
    coachRating: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const heightInMeters = Number(formData.height) / 100;

  const bmi =
    formData.height && formData.weight && heightInMeters > 0
      ? (Number(formData.weight) / (heightInMeters * heightInMeters)).toFixed(1)
      : "--";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      /* ---------------------------------------------
         1. SAVE ASSESSMENT
      --------------------------------------------- */

      const assessmentResponse = await fetch(
        "http://localhost:5000/api/assessments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            bmi,
          }),
        },
      );

      const assessmentResult = await assessmentResponse.json();

      if (!assessmentResponse.ok) {
        throw new Error(
          assessmentResult.message || "Failed to save assessment",
        );
      }

      console.log("ASSESSMENT SAVED:", assessmentResult);

      const savedAssessment = assessmentResult.assessment;

      /* ---------------------------------------------
         2. PREPARE ML INPUT
         
         The current trained model expects a different
         feature schema than the portal form.

         These are prototype transformations for the
         academic MVP.
      --------------------------------------------- */

      const pushups = Number(formData.pushups || 0);
      const situps = Number(formData.situps || 0);
      const plank = Number(formData.plank || 0);
      const sprint = Number(formData.sprint || 0);
      const shuttle = Number(formData.shuttle || 0);
      const flexibility = Number(formData.flexibility || 0);
      const attendance = Number(formData.attendance || 0);
      const coachRating = Number(formData.coachRating || 0);

      const strengthScore = Math.min(
        100,
        Math.round(
          ((pushups / 40) * 100 + (situps / 40) * 100 + (plank / 120) * 100) /
            3,
        ),
      );

      const enduranceScore = Math.max(
        0,
        Math.min(100, Math.round(100 - ((shuttle - 8) / 12) * 100)),
      );

      const speedAgilityScore = Math.max(
        0,
        Math.min(100, Math.round(100 - ((sprint - 6) / 6) * 100)),
      );

      const skillsScore = Math.min(100, Math.round((coachRating / 10) * 100));

      const mlData = {
        assessment_id: savedAssessment.id,

        age: Number(formData.age),

        strength_score: strengthScore,

        endurance_score: enduranceScore,

        flexibility_score: flexibility,

        speed_agility_score: speedAgilityScore,

        bmi: Number(bmi),

        health_fitness_knowledge_score: 70,

        skills_score: skillsScore,

        attendance_rate: attendance,

        hours_physical_activity_per_week: 6,

        gender: "Female",

        grade_level: "11th",

        class_participation_level: "High",

        motivation_level: "High",

        previous_semester_pe_grade: "B",
      };

      console.log("ML INPUT:", mlData);

      /* ---------------------------------------------
         3. CALL REAL ML MODEL
      --------------------------------------------- */

      const predictionResponse = await fetch(
        "http://localhost:5000/api/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mlData),
        },
      );

      const predictionResult = await predictionResponse.json();

      if (!predictionResponse.ok) {
        throw new Error(predictionResult.message || "ML prediction failed");
      }

      console.log("REAL ML PREDICTION:", predictionResult);

      /* ---------------------------------------------
         4. SEND EVERYTHING TO RECOMMENDATION PAGE
      --------------------------------------------- */

      onAnalyze({
        ...savedAssessment,
        prediction: predictionResult.prediction,
      });
    } catch (error) {
      console.error("ASSESSMENT / ML ERROR:", error);

      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assessment-page">
      <div className="assessment-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>

        <div>
          <h1>New Fitness Assessment</h1>

          <p>Record the student&apos;s latest physical fitness assessment.</p>
        </div>
      </div>

      <form className="assessment-form" onSubmit={handleSubmit}>
        {/* STUDENT INFORMATION */}

        <section className="form-card">
          <h2>Student Information</h2>

          <p className="section-description">
            Select the student and assessment date.
          </p>

          <div className="form-grid">
            <div className="field full-width">
              <label>Student *</label>

              <select
                name="student"
                value={formData.student}
                onChange={handleChange}
                required
              >
                <option value="">Select Student</option>

                <option value="STU-001 - Arjun Sharma">
                  STU-001 - Arjun Sharma
                </option>

                <option value="STU-002 - Aman Singh">
                  STU-002 - Aman Singh
                </option>

                <option value="STU-003 - Simran Kaur">
                  STU-003 - Simran Kaur
                </option>

                <option value="STU-004 - Rahul Verma">
                  STU-004 - Rahul Verma
                </option>
              </select>
            </div>

            <div className="field">
              <label>Assessment Date *</label>

              <input
                type="date"
                name="assessmentDate"
                value={formData.assessmentDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Age *</label>

              <input
                type="number"
                name="age"
                placeholder="e.g. 15"
                min="8"
                max="20"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </section>

        {/* BODY MEASUREMENTS */}

        <section className="form-card">
          <h2>Body Measurements</h2>

          <p className="section-description">
            Enter height and weight. BMI is calculated automatically.
          </p>

          <div className="form-grid">
            <div className="field">
              <label>Height (cm) *</label>

              <input
                type="number"
                name="height"
                placeholder="e.g. 170"
                min="50"
                max="250"
                step="0.1"
                value={formData.height}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Weight (kg) *</label>

              <input
                type="number"
                name="weight"
                placeholder="e.g. 58"
                min="10"
                max="200"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>

            <div className="bmi-card">
              <span>Calculated BMI</span>

              <strong>{bmi}</strong>
            </div>
          </div>
        </section>

        {/* FITNESS TESTS */}

        <section className="form-card">
          <h2>Fitness Tests</h2>

          <p className="section-description">
            Enter the results from the student&apos;s fitness battery.
          </p>

          <div className="form-grid three-columns">
            <div className="field">
              <label>50m Sprint (sec) *</label>

              <input
                type="number"
                name="sprint"
                placeholder="e.g. 8.5"
                min="1"
                max="60"
                step="0.01"
                value={formData.sprint}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Shuttle Run (sec) *</label>

              <input
                type="number"
                name="shuttle"
                placeholder="e.g. 12.5"
                min="1"
                max="120"
                step="0.01"
                value={formData.shuttle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Push-ups (count) *</label>

              <input
                type="number"
                name="pushups"
                placeholder="e.g. 25"
                min="0"
                max="200"
                value={formData.pushups}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Sit-ups (count) *</label>

              <input
                type="number"
                name="situps"
                placeholder="e.g. 30"
                min="0"
                max="200"
                value={formData.situps}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Plank (seconds) *</label>

              <input
                type="number"
                name="plank"
                placeholder="e.g. 75"
                min="0"
                max="600"
                value={formData.plank}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Broad Jump (cm) *</label>

              <input
                type="number"
                name="broadJump"
                placeholder="e.g. 185"
                min="0"
                max="500"
                step="0.1"
                value={formData.broadJump}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Flexibility Score *</label>

              <input
                type="number"
                name="flexibility"
                placeholder="e.g. 70"
                min="0"
                max="100"
                step="0.1"
                value={formData.flexibility}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </section>

        {/* ADDITIONAL INFORMATION */}

        <section className="form-card">
          <h2>Additional Information</h2>

          <p className="section-description">
            Attendance and coach evaluation used by the guidance system.
          </p>

          <div className="form-grid">
            <div className="field">
              <label>Attendance Rate (%) *</label>

              <input
                type="number"
                name="attendance"
                placeholder="e.g. 92"
                min="0"
                max="100"
                step="0.1"
                value={formData.attendance}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Coach Rating (1–10) *</label>

              <input
                type="number"
                name="coachRating"
                placeholder="e.g. 8"
                min="1"
                max="10"
                value={formData.coachRating}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </section>

        {/* ACTIONS */}

        <div className="assessment-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onBack}
            disabled={loading}
          >
            Cancel
          </button>

          <button type="submit" className="analyze-button" disabled={loading}>
            {loading ? "Analyzing..." : "Save & Analyze →"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   SPORT RECOMMENDATION
========================================================= */

function calculateSportRecommendations(assessment) {
  const sprint = Number(assessment?.sprint || 0);
  const shuttle = Number(assessment?.shuttle || 0);
  const pushups = Number(assessment?.pushups || 0);
  const broadJump = Number(assessment?.broadJump || 0);
  const flexibility = Number(assessment?.flexibility || 0);

  const footballScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        40 +
          (broadJump / 250) * 20 +
          (pushups / 50) * 15 +
          Math.max(0, 100 - sprint * 5) * 0.25,
      ),
    ),
  );

  const athleticsScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        35 +
          Math.max(0, 100 - sprint * 5) * 0.3 +
          Math.max(0, 100 - shuttle * 4) * 0.2 +
          (broadJump / 250) * 15,
      ),
    ),
  );

  const basketballScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        35 +
          (broadJump / 250) * 20 +
          (pushups / 50) * 15 +
          Math.max(0, 100 - shuttle * 4) * 0.2,
      ),
    ),
  );

  const volleyballScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        35 +
          (broadJump / 250) * 25 +
          (flexibility / 100) * 15 +
          (pushups / 50) * 10,
      ),
    ),
  );

  return [
    {
      name: "Football",
      icon: "⚽",
      score: footballScore,
      reason: "Good combination of speed, power and strength.",
    },
    {
      name: "Athletics",
      icon: "🏃",
      score: athleticsScore,
      reason: "Suitable for developing speed and endurance.",
    },
    {
      name: "Basketball",
      icon: "🏀",
      score: basketballScore,
      reason: "Good potential for agility, jumping and court movement.",
    },
    {
      name: "Volleyball",
      icon: "🏐",
      score: volleyballScore,
      reason: "Suitable for jumping, mobility and upper-body strength.",
    },
  ]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

/* =========================================================
   RECOMMENDATION PAGE
========================================================= */

function generateFitnessReport(assessment) {
  const doc = new jsPDF();

  const prediction =
    assessment?.prediction?.predicted_fitness_level || "Not available";

  const confidence =
    assessment?.prediction?.model_confidence != null
      ? `${Math.round(assessment.prediction.model_confidence * 100)}%`
      : "Not available";

  const sports = calculateSportRecommendations(assessment);

  doc.setFontSize(20);
  doc.text("AI Sports Talent & Fitness Report", 20, 20);

  doc.setFontSize(12);
  doc.text(`Student: ${assessment.student || "N/A"}`, 20, 35);
  doc.text(`Assessment Date: ${assessment.assessmentDate || "N/A"}`, 20, 43);

  doc.setFontSize(15);
  doc.text("Assessment Results", 20, 58);

  doc.setFontSize(12);
  doc.text(`BMI: ${assessment.bmi || "N/A"}`, 20, 70);
  doc.text(`Sprint: ${assessment.sprint || "N/A"} sec`, 20, 78);
  doc.text(`Shuttle Run: ${assessment.shuttle || "N/A"} sec`, 20, 86);
  doc.text(`Push-ups: ${assessment.pushups || "N/A"}`, 20, 94);
  doc.text(`Sit-ups: ${assessment.situps || "N/A"}`, 20, 102);
  doc.text(`Plank: ${assessment.plank || "N/A"} sec`, 20, 110);
  doc.text(`Broad Jump: ${assessment.broadJump || "N/A"} cm`, 20, 118);
  doc.text(`Flexibility: ${assessment.flexibility || "N/A"} cm`, 20, 126);

  doc.setFontSize(15);
  doc.text("AI Fitness Prediction", 20, 145);

  doc.setFontSize(12);
  doc.text(`Fitness Level: ${prediction}`, 20, 157);
  doc.text(`Model Confidence: ${confidence}`, 20, 165);

  doc.setFontSize(15);
  doc.text("Recommended Sports", 20, 184);

  doc.setFontSize(12);

  sports.slice(0, 3).forEach((sport, index) => {
    doc.text(`${index + 1}. ${sport.name}`, 25, 197 + index * 10);
  });

  doc.setFontSize(10);
  doc.text(
    "Note: AI recommendations are decision-support suggestions and require coach review.",
    20,
    235,
  );

  doc.save(`Fitness_Report_${assessment.student || "Student"}.pdf`);
}

function RecommendationPage({ assessment, onBack, onReviewSaved }) {
  const [decision, setDecision] = useState(
    assessment?.coachDecision === "approved"
      ? "approved"
      : assessment?.coachDecision === "override"
        ? "override"
        : "pending",
  );

  const [reviewLoading, setReviewLoading] = useState(false);

  const topSports = calculateSportRecommendations(assessment);

  const handleReview = async (selectedDecision) => {
    try {
      setReviewLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/assessments/${assessment.id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            decision: selectedDecision,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save coach decision");
      }

      console.log("COACH REVIEW SAVED:", result);

      setDecision(selectedDecision);

      if (onReviewSaved) {
        onReviewSaved({
          ...result.assessment,
          prediction: assessment.prediction,
        });
      }
    } catch (error) {
      console.error("REVIEW ERROR:", error);

      alert(`Review error: ${error.message}`);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleApprove = () => {
    handleReview("approved");
  };

  const handleOverride = () => {
    handleReview("override");
  };

  const predictedLevel =
    assessment?.prediction?.predicted_fitness_level || "Pending";

  const confidence = assessment?.prediction?.model_confidence;

  return (
    <div className="recommendation-page">
      <div className="recommendation-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Assessment
        </button>

        <h1>AI Fitness Analysis</h1>

        <p>AI-assisted recommendation generated from the fitness assessment.</p>
      </div>

      {/* STUDENT */}

      <section className="recommendation-card student-summary">
        <div className="student-avatar large">
          {assessment?.student
            ? assessment.student.split(" - ")[1]?.charAt(0)
            : "S"}
        </div>

        <div>
          <span>Student</span>

          <h2>{assessment?.student || "Student"}</h2>

          <p>Age: {assessment?.age || "--"} years</p>
        </div>
      </section>

      {/* AI RESULT */}

      <section className="recommendation-card">
        <div className="card-title">
          <div>
            <h2>🤖 AI Recommendation</h2>

            <p>Preliminary result generated by the guidance system.</p>
          </div>

          <span className="pending-badge">
            {decision === "pending"
              ? "Pending Coach Review"
              : decision === "approved"
                ? "Coach Approved"
                : "Coach Override"}
          </span>
        </div>

        <div className="result-grid">
          <div className="result-box">
            <span>Fitness Level</span>

            <strong className="fitness-result">{predictedLevel}</strong>
          </div>

          <div className="result-box">
            <span>Model Confidence</span>

            <strong>
              {typeof confidence === "number"
                ? `${Math.round(confidence * 100)}%`
                : "--"}
            </strong>
          </div>

          <div className="result-box sport-result">
            <span>Recommended Sport</span>

            <strong>{topSports[0]?.name || "To Be Reviewed"}</strong>
          </div>
        </div>
      </section>

      {/* SPORTS */}

      <section className="recommendation-card">
        <h2>Recommended Sports</h2>

        <p className="section-description">
          Sports suggested using the current physical fitness profile.
        </p>

        <div className="sports-list">
          {topSports.map((sport) => (
            <div className="sport-item" key={sport.name}>
              <span>{sport.icon}</span>

              <div>
                <strong>{sport.name}</strong>

                <p>{sport.reason}</p>
              </div>

              <b>{sport.score}%</b>
            </div>
          ))}
        </div>
      </section>

      {/* IMPROVEMENT */}

      <section className="recommendation-card">
        <h2>Improvement Focus</h2>

        <p className="section-description">
          Areas that may benefit from additional training.
        </p>

        <div className="improvement-grid">
          <div className="improvement-item">
            <span>🏃</span>

            <strong>Sprint Speed</strong>

            <p>Work on acceleration and running technique.</p>
          </div>

          <div className="improvement-item">
            <span>💪</span>

            <strong>Core Strength</strong>

            <p>Improve plank and core endurance.</p>
          </div>

          <div className="improvement-item">
            <span>🫁</span>

            <strong>Endurance</strong>

            <p>Include regular aerobic conditioning.</p>
          </div>
        </div>
      </section>

      {/* COACH REVIEW */}

      <section className="coach-review-card">
        <div>
          <h2>Coach Review Required</h2>

          <p>
            This recommendation is AI-assisted and must be reviewed by the coach
            before being visible to the student or parent.
          </p>
        </div>

        {decision === "pending" && (
          <div className="review-actions">
            <button
              className="override-button"
              onClick={handleOverride}
              disabled={reviewLoading}
            >
              {reviewLoading ? "Saving..." : "Override Recommendation"}
            </button>

            <button
              className="approve-button"
              onClick={handleApprove}
              disabled={reviewLoading}
            >
              {reviewLoading ? "Saving..." : "✓ Approve Recommendation"}
            </button>
          </div>
        )}

        <button
          onClick={() => generateFitnessReport(assessment)}
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          📄 Download Fitness Report
        </button>

        {decision === "approved" && (
          <div className="decision-success">
            ✓ Recommendation approved by coach
          </div>
        )}

        {decision === "override" && (
          <div className="decision-warning">
            ⚠ Recommendation marked for coach override
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   STUDENT DASHBOARD
========================================================= */

function StudentDashboard({ assessment, onLogout }) {
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const isApproved = assessment?.coachApproved === true;

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/assessments");

        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to load assessment history");
        }

        const studentHistory = data
          .filter((item) => item.student === assessment?.student)
          .sort(
            (a, b) =>
              new Date(a.assessmentDate || a.createdAt) -
              new Date(b.assessmentDate || b.createdAt),
          );

        setHistory(studentHistory);
      } catch (error) {
        console.error("HISTORY ERROR:", error);
      } finally {
        setHistoryLoading(false);
      }
    };

    if (assessment?.student) {
      loadHistory();
    } else {
      setHistoryLoading(false);
    }
  }, [assessment?.student]);

  /*
   * Convert fitness levels into a simple progress
   * value for the academic prototype chart.
   */
  const fitnessValue = (level) => {
    if (level === "High Performer") {
      return 100;
    }

    if (level === "Average Performer") {
      return 70;
    }

    if (level === "Low Performer") {
      return 40;
    }

    return 0;
  };

  const approvedHistory = history.filter(
    (item) => item.coachApproved === true && item.prediction,
  );

  return (
    <div className="assessment-page">
      <div className="assessment-header">
        <div>
          <h1>Student Dashboard</h1>

          <p>View your fitness progress and coach-approved recommendations.</p>
        </div>

        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>

      {!assessment && (
        <section className="recommendation-card">
          <h2>No Assessment Available</h2>

          <p>Your latest fitness assessment has not been uploaded yet.</p>
        </section>
      )}

      {assessment && !isApproved && (
        <section className="coach-review-card">
          <div>
            <h2>🔒 Recommendation Not Available Yet</h2>

            <p>
              Your fitness assessment has been completed, but the AI-assisted
              recommendation is waiting for coach approval.
            </p>
          </div>
        </section>
      )}

      {assessment && isApproved && (
        <>
          {/* STUDENT SUMMARY */}

          <section className="recommendation-card student-summary">
            <div className="student-avatar large">
              {assessment.student
                ? assessment.student.split(" - ")[1]?.charAt(0)
                : "S"}
            </div>

            <div>
              <span>Student</span>

              <h2>{assessment.student}</h2>

              <p>Age: {assessment.age} years</p>
            </div>
          </section>

          {/* CURRENT RESULT */}

          <section className="recommendation-card">
            <h2>🤖 Your AI-Assisted Fitness Result</h2>

            <div className="result-grid">
              <div className="result-box">
                <span>Fitness Level</span>

                <strong className="fitness-result">
                  {assessment.prediction?.predicted_fitness_level ||
                    "Available"}
                </strong>
              </div>

              <div className="result-box">
                <span>Model Confidence</span>

                <strong>
                  {typeof assessment.prediction?.model_confidence === "number"
                    ? `${Math.round(
                        assessment.prediction.model_confidence * 100,
                      )}%`
                    : "--"}
                </strong>
              </div>
            </div>

            <p className="section-description">
              This recommendation has been reviewed and approved by your coach.
            </p>
          </section>

          {/* PROGRESS */}

          <section className="recommendation-card">
            <h2>📈 Fitness Progress</h2>

            <p className="section-description">
              Progress based on your coach-approved assessments.
            </p>

            {historyLoading && <p>Loading assessment history...</p>}

            {!historyLoading && approvedHistory.length === 0 && (
              <p>No approved assessment history available yet.</p>
            )}

            {!historyLoading && approvedHistory.length > 0 && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "18px",
                    height: "220px",
                    padding: "20px 10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {approvedHistory.map((item, index) => {
                    const level = item.prediction?.predicted_fitness_level;

                    const value = fitnessValue(level);

                    return (
                      <div
                        key={item.id}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          height: "100%",
                        }}
                      >
                        <strong
                          style={{
                            marginBottom: "8px",
                          }}
                        >
                          {value}
                        </strong>

                        <div
                          style={{
                            width: "55px",
                            height: `${Math.max(20, value * 1.5)}px`,
                            background: "#1976d2",
                            borderRadius: "8px 8px 0 0",
                            transition: "height 0.3s",
                          }}
                        />

                        <small
                          style={{
                            marginTop: "8px",
                          }}
                        >
                          Assessment {index + 1}
                        </small>

                        <small>{item.assessmentDate}</small>
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {approvedHistory.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        border: "1px solid #e1e6ed",
                        borderRadius: "8px",
                      }}
                    >
                      <span>{item.assessmentDate || "Assessment"}</span>

                      <strong>
                        {item.prediction?.predicted_fitness_level}
                      </strong>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* TRAINING GUIDANCE */}

          <section className="recommendation-card">
            <h2>Training Guidance</h2>

            <div className="improvement-grid">
              <div className="improvement-item">
                <span>🏃</span>

                <strong>Sprint Speed</strong>

                <p>Work on acceleration and running technique.</p>
              </div>

              <div className="improvement-item">
                <span>💪</span>

                <strong>Core Strength</strong>

                <p>Improve core stability and endurance.</p>
              </div>

              <div className="improvement-item">
                <span>🫁</span>

                <strong>Endurance</strong>

                <p>Include regular aerobic conditioning.</p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/* =========================================================
   PARENT DASHBOARD
========================================================= */

function ParentDashboard({ assessment, onLogout }) {
  const isApproved = assessment?.coachApproved === true;

  return (
    <div className="assessment-page">
      <div className="assessment-header">
        <div>
          <h1>Parent Dashboard</h1>

          <p>View coach-approved fitness guidance.</p>
        </div>

        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>

      {!assessment && (
        <section className="recommendation-card">
          <h2>No Assessment Available</h2>

          <p>No student assessment is currently available.</p>
        </section>
      )}

      {assessment && !isApproved && (
        <section className="coach-review-card">
          <div>
            <h2>🔒 Recommendation Pending</h2>

            <p>
              The AI-assisted fitness recommendation is currently under coach
              review. It will become available after approval.
            </p>
          </div>
        </section>
      )}

      {assessment && isApproved && (
        <section className="recommendation-card">
          <h2>Student Fitness Guidance</h2>

          <p className="section-description">
            This information has been reviewed and approved by the coach.
          </p>

          <div className="student-summary">
            <div className="student-avatar large">
              {assessment.student
                ? assessment.student.split(" - ")[1]?.charAt(0)
                : "S"}
            </div>

            <div>
              <span>Student</span>

              <h2>{assessment.student}</h2>

              <p>Age: {assessment.age} years</p>
            </div>
          </div>

          <div className="result-grid">
            <div className="result-box">
              <span>Fitness Level</span>

              <strong className="fitness-result">
                {assessment.prediction?.predicted_fitness_level || "Available"}
              </strong>
            </div>

            <div className="result-box">
              <span>Model Confidence</span>

              <strong>
                {typeof assessment.prediction?.model_confidence === "number"
                  ? `${Math.round(
                      assessment.prediction.model_confidence * 100,
                    )}%`
                  : "--"}
              </strong>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function AdminDashboard({ onLogout }) {
  return (
    <div className="assessment-page">
      <div className="assessment-header">
        <div>
          <h1>Admin Dashboard</h1>

          <p>Monitor portal usage and fitness assessment activity.</p>
        </div>

        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">👨‍🎓</div>

          <div>
            <span>Total Students</span>
            <strong>48</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">📝</div>

          <div>
            <span>Total Assessments</span>
            <strong>124</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">🤖</div>

          <div>
            <span>Pending Reviews</span>
            <strong>7</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">📊</div>

          <div>
            <span>System Status</span>
            <strong>Active</strong>
          </div>
        </div>
      </section>

      <section className="recommendation-card">
        <h2>System Analytics</h2>

        <p className="section-description">
          Detailed analytics will be connected to PostgreSQL during final
          integration.
        </p>
      </section>
    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const [role, setRole] = useState("");

  const [page, setPage] = useState("dashboard");

  const [assessmentData, setAssessmentData] = useState(null);

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setLoggedIn(true);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setRole("");
    setPage("dashboard");
  };

  /* ---------------------------------------------------------
     COACH
  --------------------------------------------------------- */

  if (loggedIn && role === "Coach") {
    if (page === "assessment") {
      return (
        <AssessmentPage
          onBack={() => setPage("dashboard")}
          onAnalyze={(data) => {
            setAssessmentData(data);
            setPage("recommendation");
          }}
        />
      );
    }

    if (page === "recommendation") {
      return (
        <RecommendationPage
          assessment={assessmentData}
          onBack={() => setPage("assessment")}
          onReviewSaved={(updatedAssessment) => {
            setAssessmentData(updatedAssessment);
          }}
        />
      );
    }

    return (
      <CoachDashboard
        onLogout={handleLogout}
        onNewAssessment={() => setPage("assessment")}
      />
    );
  }

  /* ---------------------------------------------------------
     STUDENT
  --------------------------------------------------------- */

  if (loggedIn && role === "Student") {
    return (
      <StudentDashboard assessment={assessmentData} onLogout={handleLogout} />
    );
  }

  /* ---------------------------------------------------------
     PARENT
  --------------------------------------------------------- */

  if (loggedIn && role === "Parent") {
    return (
      <ParentDashboard assessment={assessmentData} onLogout={handleLogout} />
    );
  }

  /* ---------------------------------------------------------
     ADMIN
  --------------------------------------------------------- */

  if (loggedIn && role === "Admin") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  /* ---------------------------------------------------------
     LOGIN
  --------------------------------------------------------- */

  return <Login onLogin={handleLogin} />;
}

export default App;
