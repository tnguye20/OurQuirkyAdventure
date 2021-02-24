import { FilterCriteria, Memory } from "../interfaces";
import config from "../config";

const { CriteriaMapper } = config;

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

export default filterMemory;