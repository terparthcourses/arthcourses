// Express
import { Router } from 'express';

// Controllers
import { usersController } from '../controllers/users.controller';

// Utilities
import { asyncHandler } from '../utils/async-handler';

// Router
const router: Router = Router();

router.get('/get-user', asyncHandler(usersController.getUser));
router.post('/sign-in', asyncHandler(usersController.signIn));
router.post('/sign-up', asyncHandler(usersController.signUp));
router.post('/sign-out', asyncHandler(usersController.signOut));

export default router;