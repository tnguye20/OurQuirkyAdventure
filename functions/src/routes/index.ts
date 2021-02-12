import { Router, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import {
  expressCallback,
  verifyAuth
} from '../middlewares';
import {
  getMemoryByUserController,
  userCriteriaGenerateController
} from '../controllers';

// Init router and path
const router = Router();

router.get('/', (req : Request, res: Response) => {
  res.status(StatusCodes.OK).json('Welcome to Our Quirky Adventure API system');
});
router.post('/', (req : Request, res: Response) => {
  res.status(StatusCodes.OK).json('Welcome to Our Quirky Adventure API system');
});

/**
 * AUTH ROUTES
 */
router.post('/getMemoryByUser', verifyAuth, expressCallback(getMemoryByUserController));
router.post('/userCriteriaGenerate', verifyAuth, expressCallback(userCriteriaGenerateController));

// Export the base-router
export default router;
