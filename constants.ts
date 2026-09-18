//import {AuthType, IIdentity, ROLE} from "./acl/types"
import { AuthType, IIdentity } from "./acl/types"

export enum UserRole{
    GUEST = 'guest',
    ADMIN = 'admin',
    CLIENT = 'client'
}

export enum UserStatus {
    ACTIVE = "active",
    BANNED = "banned",
}

export enum ClassStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    CLOSED = "closed"
}

export const GUEST_IDENTITY: IIdentity = {
    email: 'guest',
    authType: AuthType.Default,
    id: 0,
    role: UserRole.GUEST
}