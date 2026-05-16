import { BuildOptions, Model } from "sequelize";

export interface IOrder extends Model{
    readonly id: number;
    user_id: number;
    status_order: 'pending' | 'paid' | 'cancelled';
    created_at: bigint;
    published_at: bigint;
}

export type OrderType = typeof Model & {
  new (values?: object, options?: BuildOptions): IOrder;
};