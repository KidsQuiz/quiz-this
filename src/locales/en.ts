
export const en = {
  // General
  appName: 'Kid Quiz',
  loading: 'Loading...',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  create: 'Create',
  update: 'Update',
  submit: 'Submit',
  close: 'Close',
  confirm: 'Confirm',
  user: 'User',
  error: 'Error',
  clone: 'Clone',
  success: 'Success',
  
  // Auth
  signIn: 'Sign In',
  signUp: 'Sign Up',
  signOut: 'Sign Out',
  signOutSuccess: 'You have been successfully logged out.',
  signOutError: 'Failed to log out. Please try again.',
  forgotPassword: 'Forgot Password',
  resetPassword: 'Reset Password',
  emailAddress: 'Email Address',
  password: 'Password',
  email: 'Email',
  
  // Auth messages
  accountCreated: 'Account Created',
  checkEmail: 'Please check your email to verify your account.',
  welcomeBack: 'Welcome Back',
  loginSuccess: 'You have successfully logged in.',
  authFailed: 'Authentication Failed',
  somethingWentWrong: 'Something went wrong. Please try again.',
  redirecting: 'Redirecting...',
  createAccount: 'Create Account',
  signUpToStart: 'Sign up to start using the app',
  signInToAccount: 'Sign in to your account',
  alreadyHaveAccount: 'Already have an account? Sign in',
  dontHaveAccount: "Don't have an account? Sign up",
  processing: 'Processing...',
  
  // Dashboard
  dashboard: 'Mathwondo',
  myKids: 'My Kids',
  addKid: 'Add Kid',
  noKids: 'No kids added yet',
  
  // Kids
  name: 'Name',
  age: 'Age',
  avatar: 'Avatar',
  avatarPreview: 'Avatar Preview',
  resetPoints: 'Reset Points',
  
  // Packages
  packages: 'Packages',
  package: 'Package',
  addPackage: 'Add Package',
  editPackage: 'Edit Package',
  packageName: 'Package Name',
  packageDescription: 'Package Description',
  noPackages: 'No packages created yet.',
  createFirstPackage: 'Create your first package',
  selectAll: 'Select All',
  deselectAll: 'Deselect All',
  selectQuestionPackages: 'Select Question Packages',
  assignPackages: 'Assign Packages',
  assignPackagesFirst: 'Please assign packages to this kid first',
  questionOrder: 'Question Order',
  sequential: 'Sequential',
  shuffle: 'Shuffle',
  
  // Questions
  questions: 'Questions',
  question: 'Question',
  addQuestion: 'Add Question',
  editQuestion: 'Edit Question',
  questionText: 'Question Text',
  questionPoints: 'Points',
  questionTimeLimit: 'Time Limit',
  answers: 'Answers',
  answerOptions: 'Answer Options',
  correctAnswer: 'Correct Answer',
  incorrectAnswer: 'Incorrect Answer',
  import: 'Import',
  importing: 'Importing...',
  importQuestions: 'Import Questions',
  importQuestionsInstructions: 'Import questions from a CSV file with the following structure:',
  csvMustContain: 'CSV must contain columns: question, answer1, answer2, answer3, answer4, correctAnswer, points, timelimit (optional)',
  csvExample: 'Example: correctAnswer should be 1, 2, 3, or 4 to indicate which answer is correct',
  csvCorrectAnswerNote: 'correctAnswer should be a number (1-4) corresponding to the correct answer option',
  clickToSelectCSV: 'Click to select a CSV file',
  onlyCSVSupported: 'Only CSV files are supported',
  deleteAll: 'Delete All',
  deleteAllQuestions: 'Delete All Questions',
  deleteAllQuestionsConfirmation: 'Are you sure you want to delete ALL questions in {package}?',
  thisActionCannotBeUndone: 'This action cannot be undone.',
  selectAllQuestions: 'Select All',
  deselectAllQuestions: 'Deselect All',
  deleteSelected: 'Delete Selected',
  deleteSelectedQuestions: 'Delete Selected Questions',
  deleteSelectedQuestionsConfirmation: 'Are you sure you want to delete the selected questions?',
  noQuestionsSelected: 'No questions selected',
  deletingQuestions: 'Deleting questions...',
  cloneQuestion: 'Clone Question',
  questionCloned: 'Question cloned successfully',
  
  // Quiz Session
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
  
  // Language
  language: 'Language',
  english: 'English',
  bulgarian: 'Bulgarian',
  
  // Footer
  designedWithPrecision: 'Designed with precision',
  
  // Milestone related translations
  milestones: "Milestones",
  milestonesDescription: "Create milestones to reward your kid's progress",
  currentStatus: "Current Status",
  currentMilestone: "Current Milestone",
  noMilestoneReached: "No milestone reached yet",
  pointsToNextMilestone: "points to next milestone",
  allMilestones: "All Milestones",
  addMilestone: "Add Milestone",
  addFirstMilestone: "Add First Milestone",
  noMilestones: "No milestones created yet",
  editMilestone: "Edit Milestone",
  milestoneName: "e.g. First 100 points",
  pointsRequired: "Points Required",
  icon: "Icon",
  confirmDeleteMilestone: "Are you sure you want to delete this milestone?",
  manageMilestones: "Manage Milestones",
  
  // Wrong Answers Dashboard
  wrongAnswersDashboard: "Wrong Answers Dashboard",
  viewWrongAnswers: "View Wrong Answers",
  wrongAnswersList: "Wrong Answers List",
  wrongAnswer: "Wrong Answer",
  date: "Date",
  statistics: "Statistics",
  allCorrect: "All Correct!",
  noWrongAnswers: "There are no wrong answers to display. Great job!",
  noWrongAnswersStats: "There are no wrong answers to analyze yet.",
  mostFrequentWrongAnswers: "Most Frequent Wrong Answers",
  wrongAnswersByTime: "Wrong Answers Over Time",
  topWrongAnswersDistribution: "Wrong Answers Distribution",
  wrongCount: "Wrong Count",
  notEnoughData: "Not enough data to display statistics",
  occurrences: "Occurrences",
  resetWrongAnswers: "Reset Wrong Answers",
  resetWrongAnswersConfirmation: "Are you sure you want to reset all wrong answers for {name}?",
  wrongAnswersResetSuccess: "Wrong answers have been reset successfully",
  errorResettingWrongAnswers: "There was an error resetting wrong answers",
  
  // Admin translations
  adminDashboard: 'Admin Dashboard',
  registeredUsers: 'Registered Users',
  totalRegisteredUsers: 'Total number of registered users',
  userRegistrationTimeline: 'User Registration Timeline',
  registrationsByMonth: 'Cumulative user registrations by month',
  registrationsByDay: 'Cumulative user registrations by day',
  users: 'users',
  admin: 'Admin',
  activeUsers: 'Active Users',
  usersWithActiveKids: 'Users with active kids (answered questions)',
  ofAllUsers: 'of all users',
  
  // Relaxation messages
  "dontWorry": "Don't worry!",
  "learningTakesTime": "Learning takes time.",
  "tryNextQuestion": "Let's try the next question!",
  
  // Debug messages
  "sessionFunctionsNotInitialized": "Session functions not initialized",
  "boomEffectVisible": "🎉 BoomEffect state is true, should be visible now",
  "boomEffectComplete": "🎉 BoomEffect onComplete called, hiding effect"
} as const;
