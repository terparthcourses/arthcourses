// Express
import { Router } from 'express';

// Controllers
import { enrollmentsController } from '../controllers/enrollments.controller';

// Utilities
import { asyncHandler } from '../utils/async-handler';

const router: Router = Router();

// Create enrollment
router.post('/', asyncHandler(enrollmentsController.createEnrollment));
router.get('/', asyncHandler(enrollmentsController.getEnrollmentsByUser));

export default router;