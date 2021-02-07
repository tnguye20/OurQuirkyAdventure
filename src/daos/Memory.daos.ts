import { db } from '../lib';
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

  setOrderBy(term: string, direction: 'asc' | 'desc' = 'desc') {
    this.query = this.query
      ? this.query.orderBy(term, direction)
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
}