import * as React from 'react';
import { FilterCriteria } from '../interfaces';

const useFilter = () => {
  const [filterCriteria, setFilterCriteria] = React.useState<FilterCriteria>(new FilterCriteria());
  const [filterState, setOpenFilter] = React.useState<boolean>(false);

  const openFilter = () => {
    setOpenFilter(true);
  }

  const closeFilter = () => {
    setOpenFilter(false);
  }

  const isFilterEmpty = (): boolean => {
    return Object.values(filterCriteria).reduce((prev, curr) => {
      if (Array.isArray(curr)) {
        return prev && curr.length === 0
      }
      return prev && curr === null;
    }, true);
  }

  const saveFilterCriteria = (f: FilterCriteria) => {
    setFilterCriteria(f);
    localStorage.setItem("filterCriteria", JSON.stringify(f));
  }
  const resetFilterCriteria = () => {
    setFilterCriteria(new FilterCriteria());
    localStorage.removeItem('filterCriteria');
  }

  React.useEffect(() => {
    let c = localStorage.getItem('filterCriteria');
    if (c) {
      try {
        const cache = JSON.parse(c) as FilterCriteria;
        setFilterCriteria(cache);
      }
      catch (error) {
        console.log(error);
      }
    }
  }, []);

  return {
    filterState,
    openFilter,
    closeFilter,
    filterCriteria,
    saveFilterCriteria,
    resetFilterCriteria,
    isFilterEmpty
  }
}

export default useFilter;