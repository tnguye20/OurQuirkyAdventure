import * as React from 'react';
import { Memory } from '../interfaces';
import { useMemory } from '../hooks';

const { createContext, useContext } = React;

export const MemoryContext = createContext<Record<string, Memory[]>>({});

export const MemoryContextProvider: React.FC = ({ children }) => {
    const { memories } = useMemory();

    return (
        <MemoryContext.Provider value={{
            memories
        }}>
            { children }
        </MemoryContext.Provider>
    )
};

export const useMemoryValue = () => useContext(MemoryContext);