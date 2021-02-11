import { Request } from 'express';
import { FilterCriteria } from '../interfaces';
import { getMemoryByUser } from '../usecases';

const getMemoryByUserController = async (req: Request) => {
  const { uid } = req.body;
  let filterCriteria: FilterCriteria | null = null;
  if (req.body.filter) {
    filterCriteria = req.body.filter;
    Object.values(filterCriteria!)
      .forEach((criteria: Array<string>) => {if (criteria.length > 10) throw new Error('Filter can only be at most 10 items')});
  }
  const response = await getMemoryByUser(uid, filterCriteria);

  return {
    body: response
  };
}

export default getMemoryByUserController;