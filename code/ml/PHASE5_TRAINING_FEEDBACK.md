# Phase 5: Personalized Training and Coach Feedback

## Training-plan generation

When a coach runs a prediction, FitForge creates a four-week draft plan from the same transparent input scores used in the explanation panel.

It ranks strength/core, endurance, speed/agility, and flexibility by their current 0–100 prototype scores, then selects the three lowest areas as the plan focus.

Each focus card shows the starting assessment result, a plain-language goal, three suitable general school-fitness activities, and a safety cue. The weekly rhythm contains three coach-supervised 20–25 minute sessions and rest between similar sessions.

## Coach control

The training plan starts as `draft`. A coach can add notes or adjustments in the recommendation screen.

The feedback is saved through `POST /api/assessments/:id/training-plan/review` and the plan becomes `coach-reviewed`.

The UI does not imply that a generic plan is safe for every student: coaches must adjust it for injury, disability, health needs, equipment, and the student’s response.

## Progress comparison

The recommendation page finds the previous assessment for the same student and compares push-ups, plank, sprint, and shuttle-run results.

It explicitly uses the correct direction of improvement: larger is better for push-ups and plank, while lower is better for sprint and shuttle times. The first assessment shows a reassessment prompt instead of fabricating progress.
