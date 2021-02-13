import React, { useState, useEffect } from 'react';
import { Memory } from '../interfaces';
import { useAuthValue, useFilterValue } from '../contexts';
import { getMemoryByUser } from '../api';

const useMemory = (limit?: number) => {
  const { authUser } = useAuthValue();
  const { filterCriteria, filterLoaded } = useFilterValue()!;
  const [memories, setMemories] = useState<Memory[]>([]);
  
  useEffect(() => {
    const init = async () => {
      const data = await getMemoryByUser({ idToken: authUser.idToken!, filterCriteria, limit });
      setMemories(data);
    };

    if (filterLoaded) init();
  }, [filterCriteria, filterLoaded]);

  return {
    memories,
    setMemories
  };
};

export default useMemory;