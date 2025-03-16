
import { general } from './general';
import { auth } from './auth';
import { dashboard } from './dashboard';
import { kids } from './kids';
import { packages } from './packages';
import { questions } from './questions';
import { session } from './session';
import { milestones } from './milestones';
import { wrongAnswers } from './wrongAnswers';
import { admin } from './admin';
import { footer } from './footer';
import { debug } from './debug';

export const en = {
  ...general,
  ...auth,
  ...dashboard,
  ...kids,
  ...packages,
  ...questions,
  ...session,
  ...milestones,
  ...wrongAnswers,
  ...admin,
  ...footer,
  ...debug,
} as const;
