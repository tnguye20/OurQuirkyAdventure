import { Memory } from '../interfaces';
import { db } from '../libs';

export default class MemoryDao {
  ref: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  memoryRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | null = null;
  userRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> | null = null;
  refQuery: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;

  constructor(memoryID?: string) {
    this.ref = db.collection('memories');
    this.refQuery = this.ref;
    if (memoryID) this.memoryRef = this.ref.doc(memoryID);
  }

  setUser(userID: string) {
    this.userRef = this.ref.where('user', '==', userID);
  }

  setLimit(limit: number) {
    if (this.userRef) {
      this.userRef = this.userRef.limit(limit);
    }
    else {
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

  async getAllMemories(): Promise<Memory[]> {
    const ref = this.userRef ? this.userRef : this.ref;
    const memories = await ref.get();
    const data: Memory[] = [];

    if (!memories.empty) {
      memories.forEach((m) => {
        const memory = {
          ...m.data()
        } as Memory;
        memory.id = m.id;
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

  async getMemoryByFileName(filename: string): Promise<Memory | null> {
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
    const memory = await this.getMemoryByFileName(filename);
    if (memory) {
      const _memoryRef = this.ref.doc(memory.id!);
      await _memoryRef.update(fields)
    }
    else {
      throw new Error(`Failed to update memory with filename ${filename}`)
    }
  }
}