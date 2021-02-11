export interface IUserCriteria {
  tags: Array<string>,
  cities: Array<string>,
  states: Array<string>,
  takenMonths: Array<string>,
  takenYears: Array<string>,
  categories: Array<string>
};

export class UserCriteria implements IUserCriteria{
  tags: string[] = [];
  cities: string[] = [];
  states: string[] = [];
  takenMonths: string[] = [];
  takenYears: string[] = [];
  categories: string[] = [];
}
export class FilterCriteria extends UserCriteria{
  fromDate: Date | null = null;
  toDate: Date | null = null;
}