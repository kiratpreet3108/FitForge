# Phase 4: White-Box Explanations

## What is shown to a coach

Each newly predicted assessment now stores an `explanation` object alongside
the model result. The recommendation screen shows:

- the recorded push-ups, sit-ups, plank, sprint, shuttle-run, flexibility,
  and coach-rating values;
- the exact conversion used to create each model input score;
- the derived strength/core, endurance, speed/agility, flexibility, and
  skills scores on a 0–100 scale;
- calibrated probability for every fitness class;
- contextual inputs, including attendance, activity hours, fitness knowledge,
  BMI, participation, and motivation;
- explicit limitations and the requirement for a coach review.

For example, a plank result is not silently turned into a conclusion. The
screen says that the strength/core score is the average of push-ups ÷ 40,
sit-ups ÷ 40, and plank seconds ÷ 120, capped at 100, and displays the
student's own values next to that formula.

## Sport guidance boundary

The current sport cards are deliberately labelled **transparent prototype
rules**, not ML recommendations. Each card names the actual inputs and the
fixed weighted rule used for its indicative match score. This avoids claiming
that a trained sport-recommendation model exists before sport-labelled,
coach-validated data has been collected.

## Safety boundary

These prototype thresholds are not medical or age-specific norms. The fitness
model and sport cards are decision-support inputs only: the coach must review
or override every output, and no output may be used to select, reject, or label
a student's talent.
