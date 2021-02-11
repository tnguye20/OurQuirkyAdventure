import { db } from '../libs';
import { UserCriteria } from '../interfaces';

export default class UserCriteriaDao {
  ref: firebase.firestore.CollectionReference;
  userCriteriaRef: firebase.firestore.DocumentReference | null = null;
  query: firebase.firestore.Query<firebase.firestore.DocumentData> | null = null;

  constructor(userID?: string) {
      this.ref = db.collection('user_criteria');
      if (userID) this.setUserID(userID);
  }

  setUserID(userID: string) {
    this.userCriteriaRef = this.ref.doc(userID);
  }

  async getUserCriteriaByUserID() {
     const userCriteria = await this.userCriteriaRef!.get();
      if (userCriteria.exists) {
          return {
              ...userCriteria.data()
          } as UserCriteria
      }
      return new UserCriteria();
  }

  async updateUserCriteria(fields: Record<string, Array<string> | null>) {
    this.userCriteriaRef!.set(fields, {
      merge: true
    });
  }
};