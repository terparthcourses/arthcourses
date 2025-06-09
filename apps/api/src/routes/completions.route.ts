// Express
import { Router } from 'express';

// Controllers
import { completionsController } from '../controllers/completions.controller';

// Utilities
import { asyncHandler } from '../utils/async-handler';

// Router
const router: Router = Router();

router.get('/', asyncHandler(completionsController.getAllCompletionsForUser));
router.get('/:enrollmentId', asyncHandler(completionsController.getCompletionsByEnrollmentId));
router.put('/:completionId/complete', asyncHandler(completionsController.markCompletionAsCompleted));

export default router;