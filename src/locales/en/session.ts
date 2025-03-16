
export const session = {
  startSession: 'Start Session',
  sessionComplete: 'Session Complete!',
  greatJob: 'Great job',
  totalPointsEarned: 'Total Points Earned',
  correct: 'Correct!',
  incorrect: 'Incorrect',
  points: 'points',
  correctFeedback: 'Correct! +{points} points 🎉',
  incorrectFeedback: 'Incorrect. The correct answer is highlighted.',
  youAnswered: 'You answered {correct} out of {total} questions correctly.',
  noPackagesSelected: 'No packages selected',
  pleaseSelectPackages: 'Please select at least one question package to start.',
  autoClosingIn: 'Auto-closing in a moment',
  fantastic: 'FANTASTIC!',
  allCorrectAnswers: 'You answered all questions correctly!',
  clickToDismiss: 'Click anywhere to dismiss',
  timeUp: "Time's Up!",
  nextQuestionIn: "Next question in",
  seconds: "seconds",
  correctAnswerShown: "The correct answer is highlighted. Next question in 5 seconds...",
  
  // Session Error Messages
  requestTimedOut: "Request timed out. Please try again.",
  noPackagesAssigned: "No packages assigned",
  pleaseAssignPackages: "Please assign packages to this kid first"
} as const;
