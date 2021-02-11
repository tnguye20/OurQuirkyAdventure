import { Request, Response, NextFunction } from 'express';
import StatusCodes from 'http-status-codes';
import { logger } from 'firebase-functions';

import { auth } from '../libs';

const {
  BAD_REQUEST
} = StatusCodes;

const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization;
        const decodedToken = await auth.verifyIdToken(token);
        const { email, uid } = decodedToken;
        req.body = { ...req.body, email, uid };
        next();
      }
      else {
        throw new Error('Unauthorized');
      }
    }
    catch (error) {
      logger.error(error);
      res.status(BAD_REQUEST).json({
        isError: true,
        body: error.message
      });
    }
  }

export default verifyAuth;