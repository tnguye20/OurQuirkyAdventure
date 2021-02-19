import React, { useState, useEffect } from 'react';
import { Memory } from '../interfaces';
import { useAuthValue, useFilterValue } from '../contexts';
import { getMemoryByUser } from '../api';
import { MemoryDao } from '../daos';

const useMemory = (limit?: number) => {
  const { authUser } = useAuthValue();
  const { filterCriteria, filterLoaded } = useFilterValue()!;
  const [memories, setMemories] = useState<Memory[]>([]);
  const memoryDao = new MemoryDao();
  
  useEffect(() => {
    const init = async () => {
      try {
        const data = await getMemoryByUser({ idToken: authUser.idToken!, filterCriteria, limit });
        setMemories(data);
      }
      catch (error) {
        console.error(error);
      }
    };

    if (filterLoaded && authUser.idToken) init();
    
    // const init = async () => {
    //   if (authUser.uid && filterLoaded) {
    //     memoryDao.setUser(authUser.uid);
    //     memoryDao.setOrderBy('takenDate');
    //     const ms = await memoryDao.getAll(filterCriteria);
    //     console.log(ms);
    //   }
    // };

    // init();
  }, [filterCriteria, filterLoaded, authUser, limit]);

  return {
    memories,
    setMemories
  };
};

export default useMemory;
