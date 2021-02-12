import { db } from '../libs';
import { Memory } from '../interfaces';

export default class MemoryDao {
  ref: firebase.firestore.CollectionReference;
  memoryRef: firebase.firestore.DocumentReference | null = null;
  query: firebase.firestore.Query<firebase.firestore.DocumentData> | null = null;

  constructor(memoryID?: string) {
      this.ref = db.collection('memories');
      if(memoryID) this.memoryRef = this.ref.doc(memoryID);
  }

  setUser(userID: string) {
    this.query = this.ref.where('user', '==', userID);
  }

  setOrderBy(term: string, direction: 'asc' | 'desc' = 'asc') {
    this.query = this.query
      ? this.query.orderBy(term, direction)
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

  async addMemory(memory: Memory) {
    return await this.ref.add(memory);
  }
}