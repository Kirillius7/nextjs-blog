/* eslint-disable @typescript-eslint/no-explicit-any */
//import { UserRole as ROLE } from '../'
import { UserRole as ROLE } from '@/constants';
// export enum ROLE {
//     GUEST = 'guest',
//     MACHINE = 'machine',
//     USER = 'user',
//     OWNER = 'owner',
//     ROOT = 'root',
// }

// export enum ROLE{
//     GUEST = 'guest',
//     ADMIN = "admin",
//     TEACHER = "teacher",
//     STUDENT = "student",
//   };

export enum GRANT {
    // бізнес-логіка 
    READ = 'read',
    WRITE = 'write',
    EXECUTE = 'execute',

    // http запити
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export enum AuthType {
    GitHub = 'git-hub',
    Default = 'email/password',
}


export interface ISecretRole {
    role: ROLE;
    secret: string;
}

export interface IIdentity  {
    id: any;
    firstName?: string;
    lastName?: string;
    role: ROLE;
    email: string;
    token?: string;
    secret?: string;
    locale?: string;
    timezone?: string;
    languageCode?: string;
    countryCode?: string;
    authType: AuthType;
}

export interface IRoleData { // структура даних ролі, визначення батьківсько-дочірнього звʼязку
    display: string;
    url: string;
    parent?: ROLE[];
    private?: boolean;
}

export interface IRoles { // визначення ієрархії ролей та їхніх властивостей
    [role: string]: IRoleData;
}

export interface IGrants { // визначення дозволів для кожної ролі
    [role: string]: string[];
}

export interface IAllowDeny { // визначення дозволів та заборон для кожної ролі
    allow: IGrants;
    deny?: IGrants;
}

export interface IRules { // правила доступу до ресурсів, визначення дозволів та заборон для кожної ролі
    [resource: string]: IAllowDeny;
}

export interface IIdentityACL {
    user: IIdentity;
    roles: IRoles;
    rules: IRules;
}

