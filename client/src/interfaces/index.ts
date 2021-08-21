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

export interface ActionButton {
  icon: React.ReactNode,
  name: string,
  cb: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  condition: boolean
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

export type Action = {
  type: 'delete',
  index: number
} | {
  type: 'init',
  memories: Memory[]
} | {
  type: 'dateUpdate'
} | {
  type: 'check',
  memory: Memory
} | {
  type: 'uncheck',
  memory: Memory
}

export type State = {
  memories: Memory[],
  checked_memories: { [id: string]: Memory }
};
