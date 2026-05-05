import User from "../models/user.model";
export interface ICreateConnection {
    firstName: string;
    lastName: string;
    linkedinUrl: string;
    email: string;
    companyName: string;
    title: string;
    connectedAt: string;
    user: User;
}
