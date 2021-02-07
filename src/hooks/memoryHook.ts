import React, { useState, useEffect } from 'react';
import { Memory } from '../interfaces';
import { MemoryDao } from '../daos';
import { useAuthValue } from '../contexts';

const useMemory = () => {
  const { authUser } = useAuthValue();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [filter, setFilter] = useState<string>();
  console.log('useMemory Loaded')
  
  useEffect(() => {
    const memoryDao = new MemoryDao();
    memoryDao.setUser(authUser.uid!);
    memoryDao.setOrderBy('takenDate');

    const unsubscribe = memoryDao.query!.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((memory) => {
        return {
          id: memory.id,
          ...memory.data()
        } as Memory;
      });
      console.log(data);
      setMemories(data);
      // setMemories(data.filter(m => m.category === 'video'));
    });

    return () => unsubscribe();
  }, []);

  return {
    memories
  };
};

export default useMemory;