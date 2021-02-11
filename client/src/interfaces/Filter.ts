import { Category } from ".";

export interface FilterCriteria {
  tags?: Array<string>,
  cities?: Array<string>,
  states?: Array<string>,
  takenMonth?: Array<string>,
  takenYeah?: Array<string>,
  category?: keyof typeof Category | 'all',
  fromDate?: firebase.firestore.Timestamp,
  toDate?: firebase.firestore.Timestamp
}