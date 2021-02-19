import { FilterCriteria } from "../interfaces";

const isFilterEmpty = (filterCriteria: FilterCriteria | null): boolean => {
  if (filterCriteria === null) return true;

  return Object.values(filterCriteria).reduce((prev, curr) => {
    if (Array.isArray(curr)) {
      return prev && curr.length === 0
    }
    return prev && curr === null;
  }, true);
}

export default isFilterEmpty;