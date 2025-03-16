
export const bg = {
  appName: 'Детска Викторина',
  loading: 'Зареждане...',
  save: 'Запази',
  cancel: 'Отказ',
  delete: 'Изтрий',
  edit: 'Редактирай',
  create: 'Създай',
  update: 'Обнови',
  submit: 'Изпрати',
  close: 'Затвори',
  confirm: 'Потвърди',
  user: 'Потребител',
  error: 'Грешка',
  clone: 'Клонирай',
  success: 'Успех',
  
  signIn: 'Вход',
  signUp: 'Регистрация',
  signOut: 'Изход',
  signOutSuccess: 'Успешно излязохте от системата.',
  signOutError: 'Грешка при излизане. Опитайте отново.',
  forgotPassword: 'Забравена парола',
  resetPassword: 'Промяна на парола',
  emailAddress: 'Имейл адрес',
  password: 'Парола',
  email: 'Имейл',
  
  accountCreated: 'Акаунтът е създаден',
  checkEmail: 'Моля, проверете имейла си, за да потвърдите акаунта си.',
  welcomeBack: 'Добре дошли обратно',
  loginSuccess: 'Успешно влязохте в системата.',
  authFailed: 'Неуспешна автентикация',
  somethingWentWrong: 'Нещо се обърка. Моля, опитайте отново.',
  redirecting: 'Пренасочване...',
  createAccount: 'Създайте акаунт',
  signUpToStart: 'Регистрирайте се, за да започнете',
  signInToAccount: 'Влезте в акаунта си',
  alreadyHaveAccount: 'Вече имате акаунт? Влезте',
  dontHaveAccount: 'Нямате акаунт? Регистрирайте се',
  processing: 'Обработка...',
  
  dashboard: 'Матуондо',
  myKids: 'Моите деца',
  addKid: 'Добави дете',
  noKids: 'Все още няма добавени деца',
  
  name: 'Име',
  age: 'Възраст',
  avatar: 'Аватар',
  avatarPreview: 'Преглед на аватар',
  resetPoints: 'Нулиране на точки',
  
  packages: 'Пакети',
  package: 'Пакет',
  addPackage: 'Добави пакет',
  editPackage: 'Редактирай пакет',
  packageName: 'Име на пакета',
  packageDescription: 'Описание на пакета',
  noPackages: 'Няма създадени пакети.',
  createFirstPackage: 'Създайте вашия първи пакет',
  selectAll: 'Избери всички',
  deselectAll: 'Отмаркирай всички',
  selectQuestionPackages: 'Избери пакети с въпроси',
  assignPackages: 'Задай пакети',
  assignPackagesFirst: 'Моля, първо задайте пакети на това дете',
  questionOrder: 'Ред на въпросите',
  sequential: 'Последователно',
  shuffle: 'Разбъркано',
  
  questions: 'Въпроси',
  question: 'Въпрос',
  addQuestion: 'Добави въпрос',
  editQuestion: 'Редактирай въпрос',
  questionText: 'Текст на въпроса',
  questionPoints: 'Точки',
  questionTimeLimit: 'Времеви лимит',
  answers: 'Отговори',
  answerOptions: 'Опции за отговор',
  correctAnswer: 'Правилен отговор',
  incorrectAnswer: 'Грешен отговор',
  import: 'Импортирай',
  importing: 'Импортиране...',
  importQuestions: 'Импортирай въпроси',
  importQuestionsInstructions: 'Импортирайте въпроси от CSV файл със следната структура:',
  csvMustContain: 'CSV трябва да съдържа колони: question, answer1, answer2, answer3, answer4, correctAnswer, points, timelimit (по избор)',
  csvExample: 'Пример: correctAnswer трябва да е 1, 2, 3 или 4, за да покаже ��ой отговор е пра��илен',
  csvCorrectAnswerNote: 'correctAnswer трябва да е число (1-4), съответстващо на правилния отговор',
  clickToSelectCSV: 'Кликнете, за да изберете CSV файл',
  onlyCSVSupported: 'Поддържат се само CSV файлове',
  deleteAll: 'Изтрий всички',
  deleteAllQuestions: 'Изтрий всички въпроси',
  deleteAllQuestionsConfirmation: 'Сигурни ли сте, че искате да изтриете ВСИЧКИ въпроси в {package}?',
  thisActionCannotBeUndone: 'Това действие не може да бъде отменено.',
  selectAllQuestions: 'Избери всички',
  deselectAllQuestions: 'Отмаркирай всички',
  deleteSelected: 'Изтрий избраните',
  deleteSelectedQuestions: 'Изтрий избраните въпроси',
  deleteSelectedQuestionsConfirmation: 'Сигурни ли сте, че искате да изтриете избраните въпроси?',
  noQuestionsSelected: 'Няма избрани въпроси',
  deletingQuestions: 'Изтриване на въпроси...',
  cloneQuestion: 'Клонирай въпрос',
  questionCloned: 'Въпросът е клониран успешно',
  
  startSession: 'Започни сесия',
  sessionComplete: 'Сесията завърши!',
  greatJob: 'Браво',
  totalPointsEarned: 'Общо спечелени точки',
  correct: 'Правилно!',
  incorrect: 'Грешно',
  points: 'точки',
  correctFeedback: 'Правилно! +{points} точки 🎉',
  incorrectFeedback: 'Грешно. Правилният отговор е маркиран.',
  youAnswered: 'Ти отговори правилно на {correct} от {total} въпроса.',
  noPackagesSelected: 'Няма избрани пакети',
  pleaseSelectPackages: 'Моля, изберете поне един пакет с въпроси, за да започнете.',
  autoClosingIn: 'Автоматично затваряне след момент',
  fantastic: 'ФАНТАСТИЧНО!',
  allCorrectAnswers: 'Отговори правилно на всички въпроси!',
  clickToDismiss: 'Кликнете където и да е, за да затворите',
  timeUp: "Времето изтече!",
  correctAnswerShown: "Правилният отговор е маркиран. Следващият въпрос след 5 секунди...",
  
  language: 'Език',
  english: 'Английски',
  bulgarian: 'Български',
  
  designedWithPrecision: 'Проектирано с прецизност',
  
  milestones: "Етапи",
  milestonesDescription: "Създайте етапи, за да възнаградите напредъка на детето си",
  currentStatus: "Текущ статус",
  currentMilestone: "Текущ етап",
  noMilestoneReached: "Все още не е достигнат етап",
  pointsToNextMilestone: "точки до следващия етап",
  allMilestones: "Всички етапи",
  addMilestone: "Добави етап",
  addFirstMilestone: "Добави първи етап",
  noMilestones: "Все още няма създадени етапи",
  editMilestone: "Редактирай етап",
  milestoneName: "напр. Първи 100 точки",
  pointsRequired: "Необходими точки",
  icon: "Икона",
  confirmDeleteMilestone: "Сигурни ли сте, че искате да изтриете този етап?",
  manageMilestones: "Управление на етапи",
  
  wrongAnswersDashboard: "Табло с грешни отговори",
  viewWrongAnswers: "Преглед на грешни отговори",
  wrongAnswersList: "Списък с грешни отговори",
  wrongAnswer: "Грешен отговор",
  date: "Дата",
  statistics: "Статистика",
  allCorrect: "Всички са верни!",
  noWrongAnswers: "Няма грешни отговори за показване. Браво!",
  noWrongAnswersStats: "Все още няма грешни отговори за анализ.",
  mostFrequentWrongAnswers: "Най-чести грешни отговори",
  wrongAnswersByTime: "Гре��ни отговори във вр��мето",
  topWrongAnswersDistribution: "Разпределение на грешните отговори",
  wrongCount: "Брой грешки",
  notEnoughData: "Недостатъчно данни за показване на статистика",
  occurrences: "Брой срещания",
  resetWrongAnswers: "Нулиране на грешни отговори",
  resetWrongAnswersConfirmation: "Сигурни ли сте, че искате да нулирате всички грешни отговори за {name}?",
  wrongAnswersResetSuccess: "Грешните отговори бяха успешно нулирани",
  errorResettingWrongAnswers: "Възникна грешка при нулирането на грешните отговори",
  
  // Admin translations
  adminDashboard: 'Административен Панел',
  registeredUsers: 'Регистрирани Потребители',
  totalRegisteredUsers: 'Общ брой регистрирани потребители',
  userRegistrationTimeline: 'График на регистрациите',
  registrationsByMonth: 'Натрупване на потребителски регистрации по месеци',
  registrationsByDay: 'Натрупване на потребителски регистрации по дни',
  users: 'потребители',
  admin: 'Админ',
  activeUsers: 'Активни Потребители',
  usersWithActiveKids: 'Потребители с активни деца (отговорили на въпроси)',
  ofAllUsers: 'от всички потребители',
  
  // Relaxation messages
  "dontWorry": "Не се притеснявайте!",
  "learningTakesTime": "Ученето отнема време.",
  "tryNextQuestion": "Нека опитаме следващия въпрос!",
  
  // Debug messages
  "sessionFunctionsNotInitialized": "Функциите на сесията не са инициализирани",
  "boomEffectVisible": "🎉 BoomEffect състоянието е вярно, трябва да се вижда сега",
  "boomEffectComplete": "🎉 BoomEffect onComplete е извикан, скриване на ефекта"
} as const;
