export interface IUser {
    id: number;
    userName: string;
    permissionType: Permission;
}

export enum Permission {
    Admin = 1,
    Chauffeur
}
