// Express
import { Router } from 'express';

// Controllers
import { coursesController } from '../controllers/courses.controller';

// Utilities
import { asyncHandler } from '../utils/async-handler';

// Router
const router: Router = Router();

router.post('/', asyncHandler(coursesController.createCourse));
router.get('/', asyncHandler(coursesController.getCoursesByUser));
router.get('/:courseId', asyncHandler(coursesController.getCourseById));
router.put('/:courseId', asyncHandler(coursesController.updateCourse));
router.delete('/:courseId', asyncHandler(coursesController.deleteCourse));

export default router;