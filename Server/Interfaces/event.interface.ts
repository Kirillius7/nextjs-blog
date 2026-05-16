import { BuildOptions, Model } from "sequelize";

export interface IEvent extends Model{
    readonly id: number;
    user_id: number;
    series_id: number;
    location_name: string;
    location_address: string;
    location_capacity: number;
    start_date: bigint;
    end_date: bigint;
    status_event: 'active' | 'postponed' | 'cancelled' | "draft";
    created_at: bigint;
    published_at: bigint;
}

export type EventType = typeof Model & {
  new (values?: object, options?: BuildOptions): IEvent;
};