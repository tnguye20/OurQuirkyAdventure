import { MemoryDao } from '../daos';
import { FilterCriteria, GetMemoryByUserParams } from '../interfaces';
import { logger } from 'firebase-functions';
import { filterMemory, getLastDoc, isFilterEmpty } from '../utils';
import config from "../config";

const { CriteriaMapper } = config;

const getMemoryByUser = async (params: GetMemoryByUserParams, isRecurse: boolean = false) => {
  logger.info('>>>Enter getMemoryByUser');

  const { uid, filterCriteria, limit, startAfter } = params;

  const memoryDao = new MemoryDao();
  memoryDao.setUser(uid);
  memoryDao.setOrderBy('takenDate');

  /**
   * Filter And Limit response
   * Since tags is a heavy lifter, we will use native firestore to filter it
   * If there is no tags, we will use the first catergory of the filter
   */
  if (!isFilterEmpty(filterCriteria) && filterCriteria) {
    const { tags, fromDate, toDate } = filterCriteria;
    if (tags.length > 0) {
      logger.info(`Filter with tags: ${tags}`);
      memoryDao.setTagsFilter(tags);
    }
    else {
      for (const k of Object.keys(filterCriteria)) {
        const key = k as keyof FilterCriteria;
        if (filterCriteria[key] && key !== 'fromDate' && key !== 'toDate') {
          const values = filterCriteria[key];
          if (Array.isArray(values)) {
            if (values.length > 0) {
              memoryDao.setOtherFilter(CriteriaMapper[key], values);
              break;
            }
          }
        }
      }
    }

    if (
      fromDate !== null &&
      toDate !== null
    ) {
      logger.info(`Filter with date range ${fromDate.toString()} - ${toDate.toString()}`);
      memoryDao.setDateRange(fromDate, toDate);
    }
  }

  // Set Limit and Pagination
  if (startAfter) {
    if (startAfter.id) {
      const lastDoc = await getLastDoc(startAfter.id);
      memoryDao.setStartAfter(lastDoc);
    }
  }
  if (limit) memoryDao.setLimit(limit);

  // Get The results
  const memories = await memoryDao.getAll();
  logger.info(`Length of memories after main filter: ${memories.length}`);

  // Manual filter other criterias
  let filteredMemories = filterMemory(memories, filterCriteria ? filterCriteria : new FilterCriteria());
  logger.info(`Length of memories after all filters: ${filteredMemories.length}`);
  /**
   *  If the filtered result is empty and there is a limit
   *  There is a chance that the limit cut the filter before relavent items
   *  Attempt to get the next page recursively
   */
  if (limit && filterCriteria && (isRecurse || !startAfter)) {
    if (memories.length >= limit && filteredMemories.length === 0) {
      const lastMemory = memories.pop()!;
      const lastDocID = lastMemory.id!;
      logger.info(`Recursive Loading with last doc ${lastDocID}`);

      filteredMemories = await getMemoryByUser({
        startAfter: { id: lastDocID },
        filterCriteria: filterCriteria,
        limit: limit,
        uid: uid
      }, true);
    }
  }

  logger.info('<<<Exit getMemoryByUser');
  return filteredMemories;
};

export default getMemoryByUser;
