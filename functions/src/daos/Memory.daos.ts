import { Memory } from '../interfaces';
import { db } from '../libs';

export default class MemoryDao {
  ref: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  memoryRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | null = null;
  userRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> | null = null;
  refQuery: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> | null = null;

  constructor(memoryID?: string) {
    this.ref = db.collection('memories');
    if (memoryID) this.memoryRef = this.ref.doc(memoryID);
  }

  setUser(userID: string) {
    this.userRef = this.ref.where('user', '==', userID);
  }

  setDateRange(fromDate: Date, toDate: Date) {
    if (this.userRef) {
      this.userRef = this.userRef.startAfter(fromDate).endBefore(toDate);
    }
    else {
      this.refQuery = this.refQuery!.startAfter(fromDate).endBefore(toDate);
    }
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
      const memory = await this.memoryRef!.get();
      if (memory.exists) {
          return {
              id: memory.id,
              ...memory.data()
          } as Memory
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
        data.push(memory);
      });
    }
    return data;
  }

  async addMemory(memory: Memory) {
    return await this.ref.add(memory);
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

  async updateMemoryByFileName(filename: string, fields: Record<string, Record<string, any>>) {
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