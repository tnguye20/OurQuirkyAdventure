import { db } from '../lib';
import { User } from '../interfaces';

export default class UserDao {
    ref: firebase.firestore.CollectionReference;
    userRef: firebase.firestore.DocumentReference | null = null;

    constructor(userID?: string) {
        this.ref = db.collection('users');
        if(userID) this.userRef = this.ref.doc(userID);
    }
    
    async getUser(): Promise<User> {
        const user = await this.userRef!.get();
        if (user.exists) {
            return {
                id: user.id,
                ...user.data()
            } as User
        }
        throw new Error('Invalid User');
    }

    async updateUser(field: string, data: any) {
        this.userRef!.update(data);
    }
    
    async addToCollections(newTags: Array<string>): Promise<User> {
        const user = await this.getUser();
        const updatedCollections = [...user.collections, ...newTags];
        await this.updateUser('collections', updatedCollections); 
        user.collections = updatedCollections;
        return user;
    }
}