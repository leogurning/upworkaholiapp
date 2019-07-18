export interface User {
    _id: string;
    userName: string;
    password: string;
    email: string;
    emailVerification: boolean;
    status: string;
    creationDate: Date;
    lastUpdatedDate: Date;
    lastLoginDate?: string;
    userType: string;
    vhash?: string;
    token?: string;
}
