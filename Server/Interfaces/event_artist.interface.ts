import { BuildOptions, Model } from "sequelize";

export interface IEvent_Artist extends Model{
    readonly event_id: number;
    readonly artist_id: number;
    performance: bigint;

}

export type Event_ArtistType = typeof Model & {
  new (values?: object, options?: BuildOptions): IEvent_Artist;
};