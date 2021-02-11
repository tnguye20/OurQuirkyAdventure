import { logger, firestore } from 'firebase-functions';
import { UserCriteriaDao } from '../daos';
import { Memory, UserCriteria } from '../interfaces';

const userCriteriaUpdate = firestore.document('/memories/{id}').onWrite(async (change, context) => {
  logger.info('>>>Enter filterCriteriaUpdate');
  try {
    const after = { ...change.after.data() } as Memory;

    if (after) {
      // Extract User ID from memory record
      const user_id = after.user;
      logger.info(`Valid Memory Action with user ${user_id}`);

      // Get Criteria Record based on user ID
      const userCriteriaDao = new UserCriteriaDao(user_id);
      const userCriteria: UserCriteria = await userCriteriaDao.getUserCriteriaByUserID();

      // Attempt to create of update the criteria
      const tags = after.tags ? Array.from(new Set([...userCriteria.tags, ...after.tags])) : userCriteria.tags;
      const cities = after.city ? Array.from(new Set([...userCriteria.cities, after.city])) : userCriteria.cities;
      const states = after.state ? Array.from(new Set([...userCriteria.states, after.state])) : userCriteria.states;
      const takenMonths = after.takenMonth ? Array.from(new Set([...userCriteria.takenMonths, after.takenMonth])) : userCriteria.takenMonths;
      const takenYears = after.takenYear ? Array.from(new Set([...userCriteria.takenYears, after.takenYear])) : userCriteria.takenYears;
      const categories = after.category ? Array.from(new Set([...userCriteria.categories, after.category])) : userCriteria.categories;

      const updatedUserCriteria = {
        tags,
        cities,
        states,
        takenYears,
        takenMonths,
        categories
      }
      logger.info(updatedUserCriteria);

      await userCriteriaDao.updateUserCriteria({ ...updatedUserCriteria });
    }
  }
  catch (error) {
    logger.error(error);
  }
  finally {
    logger.info('<<<Exit filterCriteriaUpdate');
  }
});

export default userCriteriaUpdate;