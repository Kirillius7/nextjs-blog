import { BuildOptions, Model } from "sequelize";

export interface IUser extends Model {
  readonly id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'client';
  readonly createdAt: bigint;
}

export type UserType = typeof Model & { // тип, опис моделі User у sequelize
  new (values?: object, options?: BuildOptions): IUser;
};