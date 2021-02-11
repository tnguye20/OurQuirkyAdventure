import { User } from './User';
import { Memory, Category } from './Memory';
import { AuthToken } from './AuthToken';
import { FilterCriteria } from './Filter';
 
export interface FileInfo {
  title: string,
  src: string,
  category: keyof typeof Category,
  checked: boolean,
  edited: boolean,
  tags: Array<string>
}

export type {
  FilterCriteria
};

export {
    User,
    AuthToken,
    Memory,
    Category,
};
