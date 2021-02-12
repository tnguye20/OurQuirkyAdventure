import { Request } from 'express';
import { FilterCriteria } from '../interfaces';
import { getMemoryByUser } from '../usecases';
import { logger } from 'firebase-functions';

const getMemoryByUserController = async (req: Request) => {
  logger.info('>>>Enter getMemoryByUserController');
  const { uid, email } = req.body;
  logger.info(`Querying for user ${uid} with email - ${email}`);

  let filterCriteria: FilterCriteria | null = null;
  if (req.body.filter) {
    filterCriteria = req.body.filter;
    Object.values(filterCriteria!)
        .forEach((criteria: Array<string> | Date | null) => {
          if (Array.isArray(criteria)) {
            if (criteria.length > 10) {
              throw new Error('Filter can only be at most 10 items');
            }
          }
        });
  }
  logger.info('Filter Criteria: ', filterCriteria);
  const response = await getMemoryByUser(uid, filterCriteria);

  logger.info('<<<Exit getMemoryByUserController');
  return {
    body: response
  };
}

export default getMemoryByUserController;