import { MemoryDao, UserCriteriaDao } from '../daos';
import { UserCriteria } from '../interfaces';

const userCriteriaGenerate = async (uid: string) => {
  const memoryDao = new MemoryDao();
  memoryDao.setUser(uid);
  const memories = await memoryDao.getAll();

  const userCriteriaDao = new UserCriteriaDao(uid);
  const userCriteria = new UserCriteria();

  const tags = new Set<string>();
  const cities = new Set<string>();
  const states = new Set<string>();
  const takenMonths = new Set<string>();
  const takenYears = new Set<string>();
  const categories = new Set<string>();

  memories.forEach((memory) => {
    memory.tags.forEach(t => tags.add(t));
    if (memory.city) cities.add(memory.city);
    if (memory.state) states.add(memory.state);
    if (memory.takenMonth) takenMonths.add(memory.takenMonth);
    if (memory.takenYear) takenYears.add(memory.takenYear);
    if (memory.category) categories.add(memory.category);
  });

  userCriteria.tags = Array.from(tags);
  userCriteria.cities = Array.from(cities);
  userCriteria.states = Array.from(states);
  userCriteria.takenMonths = Array.from(takenMonths);
  userCriteria.takenYears = Array.from(takenYears);
  userCriteria.categories = Array.from(categories);

  await userCriteriaDao.updateUserCriteria({ ...userCriteria });
  return userCriteria;
};

export default userCriteriaGenerate;