import * as React from 'react';
import { Memory } from '../interfaces';
import { useMemory } from '../hooks';

const { createContext, useContext } = React;

export const MemoryContext = createContext<any>({});

export const MemoryContextProvider: React.FC<any> = ({ children }) => {
    const { memories, setMemories } = useMemory();

    return (
        <MemoryContext.Provider value={{
            memories,
            setMemories
        }}>
            { children }
        </MemoryContext.Provider>
    )
};

export const useMemoryValue = () => useContext(MemoryContext);