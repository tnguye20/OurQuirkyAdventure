import React, { useState, useEffect } from 'react';
import { Memory } from '../interfaces';
// import { MemoryDao } from '../daos';
import { useAuthValue } from '../contexts';
import { getMemoryByUser } from '../api';

const useMemory = () => {
  const { authUser } = useAuthValue();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [filter, setFilter] = useState<string>();
  
  useEffect(() => {
    // const memoryDao = new MemoryDao();
    // memoryDao.setUser(authUser.uid!);
    // memoryDao.setOrderBy('takenDate');

    // const unsubscribe = memoryDao.query!.onSnapshot((snapshot) => {
    //   const data = snapshot.docs.map((memory) => {
    //     return {
    //       id: memory.id,
    //       ...memory.data()
    //     } as Memory;
    //   });
    //   console.log(data);
    //   setMemories(data);
    // });

    // return () => unsubscribe();
    const init = async () => {
      const data = await getMemoryByUser(authUser.idToken!);
      console.log(data);

      setMemories(data);
    };
    init();
  }, []);

  return {
    memories
  };
};

export default useMemory;