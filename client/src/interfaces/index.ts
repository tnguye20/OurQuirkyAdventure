import { User } from './User';
import { Memory, Category } from './Memory';
import { AuthToken } from './AuthToken';
import { UserCriteria, FilterCriteria } from './UserCriteria';
 
export interface FileInfo {
  title: string,
  src: string,
  category: keyof typeof Category,
  checked: boolean,
  edited: boolean,
  tags: Array<string>
}
export interface GetMemoryByUserParams {
  idToken: string,
  filterCriteria: FilterCriteria | null,
  limit?: number,
  startAt?: any,
  startAfter?: any,
  endAt?: any,
  endBefore?: any,
}

enum ALERT_TYPE {
  success = 'success', 
  info = 'info', 
  warning = 'warning', 
  error = 'error', 
}

export {
    User,
    AuthToken,
    Memory,
    Category,
    UserCriteria,
    FilterCriteria,
    ALERT_TYPE
};
