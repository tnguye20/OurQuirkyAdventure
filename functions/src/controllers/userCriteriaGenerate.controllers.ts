import { Request } from 'express';
import { logger } from 'firebase-functions';
import { userCriteriaGenerate } from '../usecases';

const userCriteriaGenerateController = async (req: Request) => {
  logger.info('>>>Enter guserCriteriaGenerateController');
  const { uid, email } = req.body;
  logger.info(`Querying for user ${uid} with email: ${email}`);

  const response = await userCriteriaGenerate(uid);
  
  logger.info('<<<Exit userCriteriaGenerateController');
  return {
    body: response
  };
};

export default userCriteriaGenerateController;