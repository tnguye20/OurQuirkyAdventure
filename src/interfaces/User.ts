export interface IUser {
    id: string,
    email: string,
    displayName: string,
    collections: Array<string>
}

export class User implements IUser {
    id: string;
    email: string;
    displayName: string;
    collections: Array<string> = [];

    constructor(id: string, email: string, displayName: string, collections?: Array<string>) {
        this.id = id;
        this.email = email;
        this.displayName = displayName;
        if(collections) this.collections = collections;
    }
}