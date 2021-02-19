import { MemoryDao } from '../daos';
import { FilterCriteria, Memory, GetMemoryByUserParams } from '../interfaces';
import { logger } from 'firebase-functions';
import { isFilterEmpty } from '../utils';

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

const getMemoryByUser = async (params: GetMemoryByUserParams) => {
  logger.info('>>>Enter getMemoryByUser');

  const { uid, filterCriteria, limit, startAfter } = params;

  const memoryDao = new MemoryDao();
  memoryDao.setUser(uid);
  memoryDao.setOrderBy('takenDate');

  // Filter And Limit response
  // Since tags is a heavy lifter, we will use native firestore to filter it
  if (filterCriteria) {
    const { tags, fromDate, toDate } = filterCriteria;
    if (tags.length > 0) {
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
  if (startAfter) {
    if (startAfter.id) {
      const ref = new MemoryDao(startAfter.id);
      const lastDoc = await ref.memoryRef!.get();
      memoryDao.setStartAfter(lastDoc);
    }
  }
  if (limit && isFilterEmpty(filterCriteria)) {
    memoryDao.setLimit(limit);
  }

  // Get The results
  let memories = await memoryDao.getAll();
  logger.info(`Length of memories after tags filter: ${memories.length}`);

  // Manual filter other criterias
  if (filterCriteria) {
    memories = filterMemory(memories, filterCriteria);
    if (limit) memories = memories.slice(0, limit);
  }

  logger.info(`Length of memories after all filters: ${memories.length}`);
  logger.info('<<<Exit getMemoryByUser');
  return memories;
};

const filterMemory = (memories: Memory[], filterCriteria: FilterCriteria): Memory[] => {
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

  return included;
}

export default getMemoryByUser;