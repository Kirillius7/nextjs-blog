import { BuildOptions, DecimalDataType, Model } from "sequelize";

export interface ITicket extends Model{
    readonly id: number,
    order_id: number;
    event_id: number;
    used_it: number;
    price_per_ticket: DecimalDataType;
    status_ticket: 'available' | 'sold' | 'returned';
    category: 'ordinary' | 'special' | 'vip';
}

export type TicketType = typeof Model & {
  new (values?: object, options?: BuildOptions): ITicket;
};