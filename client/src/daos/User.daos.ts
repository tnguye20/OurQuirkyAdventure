import { db } from '../libs';
import { User } from '../interfaces';

export default class UserDao {
    ref: firebase.firestore.CollectionReference;
    userRef: firebase.firestore.DocumentReference | null = null;

    constructor(userID?: string) {
        this.ref = db.collection('users');
        if(userID) this.setUID(userID);
    }

    setUID(uid: string) {
        this.userRef = this.ref.doc(uid);
    }

    async add(user: User) {
        if (!this.userRef) this.setUID(user.id);

        this.userRef!.set({ ...user });
    }

    async getUser(): Promise<User> {
        const user = await this.userRef!.get();
        if (user.exists) {
            const u = {
                ...user.data()
            } as User;
            u.id = user.id;
            return u;
        }
        throw new Error('Invalid User');
    }

    async updateUser(field: string, data: any) {
        this.userRef!.update({
            [field]: data
        });
    }
    
    // async addToCollections(newTags: Array<string>): Promise<User> {
    //     const user = await this.getUser();
    //     const totalTags = Array.from(new Set([...user!.collections, ...newTags]));
    //     await this.updateUser('collections', totalTags); 
    //     user.collections = totalTags;
    //     return user;
    // }
}
