import * as React from 'react';
import { useFilter } from '../hooks';
import { FilterCriteria } from '../interfaces';

const { createContext, useContext } = React;

interface  FilterContextValue {
    filterState: boolean,
    openFilter: () => void,
    closeFilter: () => void,
    saveFilterCriteria: (f: FilterCriteria) => void,
    resetFilterCriteria: () => void,
    isFilterEmpty: () => boolean,
    filterCriteria: FilterCriteria,
}

export const FilterContext = createContext<FilterContextValue | null>(null);
 
export const FilterContextProvider: React.FC = ({ children }) => {
    const { 
      filterState,
      openFilter,
      closeFilter,
      saveFilterCriteria,
      resetFilterCriteria,
      isFilterEmpty,
      filterCriteria,
    } = useFilter();

    return (
        <FilterContext.Provider value={{
          filterState,
          openFilter,
          closeFilter,
          saveFilterCriteria,
          resetFilterCriteria,
          isFilterEmpty,
          filterCriteria
        }}>
            { children }
        </FilterContext.Provider>
    )
}

export const useFilterValue = () => useContext(FilterContext);