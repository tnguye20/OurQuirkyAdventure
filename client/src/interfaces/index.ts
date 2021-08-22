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
  ids: Array<string>
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
} | {
  type: 'edit'
} | {
  type: 'check_all'
} | {
  type: 'uncheck_all'
} | {
  type: 'edit_close'
} | {
  type: 'edit_done',
  updated_content: Record<string, any>
}

export type State = {
  memories: Memory[],
  checked_memories: { [id: string]: Memory },
  editOpen: boolean
};

export interface FirebaseTimestamp {
  _seconds: number,
  _nanoseconds: number
}