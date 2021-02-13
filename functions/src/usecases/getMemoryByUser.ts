import { MemoryDao } from '../daos';
import { FilterCriteria, Memory } from '../interfaces';
import { logger } from 'firebase-functions';

const CriteriaMapper = {
  tags: 'tags',
  cities: 'city',
  states: 'state',
  takenMonths: 'takenMonth',
  takenYears: 'takenYear',
  categories: 'category',
  fromDate: 'fromDate',
  toDate: 'toDate'
}

const getMemoryByUser = async (uid: string, filterCriteria: FilterCriteria | null, limit?: number, startAfter?: number) => {
  logger.info('>>>Enter getMemoryByUser');
  const memoryDao = new MemoryDao();
  memoryDao.setUser(uid);
  memoryDao.setOrderBy('takenDate');

  // Filter And Limit response
  // Since tags is a heavy lifter, we will use native firestore to filter it
 if (filterCriteria) {
   const { tags, fromDate, toDate } = filterCriteria;
    if (tags.length > 0 ) {
      logger.info(`Filter with tags: ${tags}`);
      memoryDao.setTagsFilter(tags);
    }
   if (
     fromDate !== null &&
     toDate !== null
   ) {
      logger.info(`Filter with date range ${fromDate.toString()} - ${toDate.toString()}`);
      memoryDao.setDateRange(fromDate, toDate);
    }
  }

  // Set Limit
  if (limit) {
    memoryDao.setLimit(limit);
  }

  // Get The results
  let memories = await memoryDao.getAllMemories();
  logger.info(`Length of memories after tags filter: ${memories.length}`);

  // Manual filter other criterias
  if (filterCriteria) {
    const included: Memory[] = memories.filter((memory: Memory) => {
      const included = Object.entries(filterCriteria)
        .filter((entry) => {
          const [k, v] = entry;
          const filterKey = k as keyof FilterCriteria;
          const filterValue = v as Array<string> | null;
          if (filterKey === "tags") return false;
          if (filterValue === null) {
            return false;
          }
          else if (filterValue.length === 0) {
            return false;
          }
          return true;
        })
        .reduce((included, currentValue) => {
          const [k, v] = currentValue;
          const filterKey = k as keyof FilterCriteria;
          const filterValue = v as Array<string> | null;
          const tmpMemory: Record<string, any> = {...memory};

          if (
            tmpMemory[CriteriaMapper[filterKey]] !== undefined &&
            tmpMemory[CriteriaMapper[filterKey]] !== null
          ) {
            return included &&
              filterValue!.indexOf(tmpMemory[CriteriaMapper[filterKey]]) !== -1;
          }

          return false;
      }, true);

      return included;
    });

    memories = included;
  }

  logger.info(`Length of memories after all filters: ${memories.length}`);
  logger.info('<<<Exit getMemoryByUser');
  return memories;
};

export default getMemoryByUser;
