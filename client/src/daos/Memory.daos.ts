import { db } from '../libs';
import { FilterCriteria, Memory } from '../interfaces';
// import { getDateFromTimestamp } from '../utils';
const CriteriaMapper = {
  tags: 'tags',
  cities: 'city',
  states: 'state',
  takenMonths: 'takenMonth',
  takenYears: 'takenYear',
  categories: 'category',
  fromDate: 'fromDate',
  toDate: 'toDate'
}
export default class MemoryDao {
  ref: firebase.firestore.CollectionReference;
  memoryRef: firebase.firestore.DocumentReference | null = null;
  userRef: firebase.firestore.Query<firebase.firestore.DocumentData> | null = null;
  refQuery: firebase.firestore.Query<firebase.firestore.DocumentData>;

  constructor(memoryID?: string) {
    this.ref = db.collection('memories');
    this.refQuery = this.ref;
    if (memoryID) this.setMemoryID(memoryID);
  }
  
  setMemoryID(memoryID: string) {
    this.memoryRef = this.ref.doc(memoryID);
  }

  setUser(userID: string) {
    this.userRef = this.ref.where('user', '==', userID);
  }

  setLimit(limit: number, lastRecord?: any) {
    if (this.userRef) {
      if (lastRecord) this.userRef = this.userRef.startAfter({ ...lastRecord });
      this.userRef = this.userRef.limit(limit);
    }
    else {
      if (lastRecord) this.refQuery = this.refQuery.startAfter({ ...lastRecord });
      this.refQuery = this.refQuery.limit(limit);
    }
  }

  setStartAt(m: any) {
    if (this.userRef) {
      this.userRef = this.userRef.startAt(m);
    }
    else {
      this.refQuery = this.refQuery.startAt(m);
    }
  }
  setStartAfter(m: any) {
    if (this.userRef) {
      this.userRef = this.userRef.startAfter(m);
    }
    else {
      this.refQuery = this.refQuery.startAfter(m);
    }
  }
  setEndBefore(m: any) {
    if (this.userRef) {
      this.userRef = this.userRef.endBefore(m);
    }
    else {
      this.refQuery = this.refQuery.endBefore(m);
    }
  }
  setEndAt(m: any) {
    if (this.userRef) {
      this.userRef = this.userRef.endAt(m);
    }
    else {
      this.refQuery = this.refQuery.endAt(m);
    }
  }

  setDateRange(fromDate: Date, toDate: Date) {
    this.setEndAt(fromDate);
    this.setEndAt(toDate);
  }

  setTagsFilter(tags: Array<string>) {
    if (this.userRef) {
      this.userRef = this.userRef.where('tags', 'array-contains-any', tags);
    }
    else {
      this.refQuery = this.ref.where('tags', 'array-contains-any', tags);
    }
  }

  setOrderBy(term: string, direction: 'asc' | 'desc' = 'asc') {
    this.userRef = this.userRef
      ? this.userRef.orderBy(term, direction)
      : this.ref.orderBy(term, direction);
  }
    
  async getMemory(): Promise<Memory> {
      const m = await this.memoryRef!.get();
      if (m.exists) {
        const memory = {
          ...m.data()
        } as Memory;
        memory.id = m.id;
        return memory;
      }
      throw new Error('Invalid Memory');
  }

  async getAll(filterCriteria?: FilterCriteria): Promise<Memory[]> {
    const ref = this.userRef ? this.userRef : this.ref;
    let memories = await ref.get();
    const data: Memory[] = [];

    if (filterCriteria) {
      const criterias = Object.entries(filterCriteria);
      for (const criteria of criterias) {
        const [k, v] = criteria;
        const filterKey = k as keyof FilterCriteria;
        const filterValue = v as Array<string> | null;

        if (Array.isArray(filterValue)) {
          if (filterValue.length > 0) {
            const field = CriteriaMapper[filterKey];
            const query = memories.query.where(
              field,
              field !== 'tags' ? 'in' : 'array-contains-any',
              filterValue
            );

            memories = await query.get();
          }
        }
      }
    }

    if (!memories.empty) {
      memories.forEach((m) => {
        const memory = {
          ...m.data()
        } as Memory;
        memory.id = m.id;
        // memory.takenDate = getDateFromTimestamp(memory.takenDate);
        // memory.uploadedDate = getDateFromTimestamp(memory.uploadedDate);
        data.push(memory);
      });
    }
    return data;
  }

  async addMemory(memory: Memory) {
    return await this.ref.add(memory);
  }
  async update(fields: Record<string, any>) {
    return await this.memoryRef!.update({...fields});
  }

  async getByFileName(filename: string): Promise<Memory | null> {
    const memories = await this.ref.where('name', '==', filename).get();
    if (!memories.empty) {
      if (memories.size === 1) {
        let memory: Memory | null = null;
        memories.forEach((m) => {
          memory = {
            ...m.data()
          } as Memory;
          memory.id = m.id;
        });

        return memory;
      }
    }
    return null;
  }

  async updateByFileName(filename: string, fields: Record<string, Record<string, any>>) {
    const memory = await this.getByFileName(filename);
    if (memory) {
      const _memoryRef = this.ref.doc(memory.id!);
      await _memoryRef.update(fields)
    }
    else {
      throw new Error(`Failed to update memory with filename ${filename}`)
    }
  }

  async delete(memoryID?: string) {
    if (memoryID) {
      this.setMemoryID(memoryID)
    }

    if (this.memoryRef) {
      this.memoryRef.delete();
    }
    else {
      throw new Error(`Faild to delete. No memory specified.`)
    }
  }
}