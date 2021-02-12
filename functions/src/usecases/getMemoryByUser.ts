import { MemoryDao } from '../daos';
import { FilterCriteria, Memory } from '../interfaces';

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

const getMemoryByUser = async (uid: string, filterCriteria: FilterCriteria | null, limit?: number) => {
  const memoryDao = new MemoryDao();
  memoryDao.setUser(uid);
  memoryDao.setOrderBy('takenDate');

  // Filter And Limit response
  // Since tags is a heavy lifter, we will use native firestore to filter it
 if (filterCriteria) {
    if (filterCriteria.tags.length > 0 ) {
      memoryDao.setTagsFilter(filterCriteria.tags);
    }
    if (filterCriteria.fromDate && filterCriteria.toDate) {
      memoryDao.setDateRange(filterCriteria.fromDate, filterCriteria.toDate);
    }
  }

  // Get The results
  let memories = await memoryDao.getAllMemories();

  // Manual filter other criterias
  if (filterCriteria) {
    const included: Memory[] = memories.filter((memory: Memory) => {
      const included = Object.entries(filterCriteria).reduce((included, currentValue) => {
        const [k, v] = currentValue;
        const filterKey = k as keyof FilterCriteria;
        const filterValue = v as Array<string>;
        const tmpMemory: Record<string, any> = { ...memory };

        if (filterKey === "tags") return included;

        if (tmpMemory[CriteriaMapper[filterKey]] !== undefined){
          return included && filterValue.indexOf(tmpMemory[CriteriaMapper[filterKey]]) !== -1;
        }

        return false;
      }, true);

      return included;
    });

    memories = included;
  }

  return memories;
};

export default getMemoryByUser;
