export interface IAuthToken {
    uid: string | null,
    idToken: string | null
}

export class AuthToken implements IAuthToken {
    constructor(public uid: string | null, public idToken: string | null) {
        this.uid = uid;
        this.idToken = idToken;
    }
}
