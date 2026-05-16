import { DataTypes } from "sequelize";
//import { Event_ArtistType } from "../Interfaces/event_artist.interface";
import { BuildOptions, Model } from "sequelize";
import sequelize from "../../lib/sequelize";


export interface IEvent_Artist extends Model{
    readonly event_id: number;
    readonly artist_id: number;
    performance: bigint;

}

export type Event_ArtistType = typeof Model & {
  new (values?: object, options?: BuildOptions): IEvent_Artist;
};
/*
export const Event_ArtistModel = (ctx: any) => { // створення функції для моделі-таблиці sequelize, де ctx - обʼєкт db
    const Event_Artist = <Event_ArtistType>ctx.db.define("event_artists", {
        eventid:{
            field: "event_id",
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        artistid:{
            field: "artist_id",
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        performancetime:{
            field: "artist_id",
            allowNull: true,
            type: DataTypes.BIGINT
        }
    },{
    timestamps: false // Вимикаємо, бо в SQL схемі немає updated_at
  });

  return Event_Artist;
}
*/

export const EventArtist = <Event_ArtistType>sequelize.define("event_artists", {
        eventid:{
            field: "event_id",
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        artistid:{
            field: "artist_id",
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        performancetime:{
            field: "artist_id",
            allowNull: true,
            type: DataTypes.BIGINT
        }
    },{
    timestamps: false // Вимикаємо, бо в SQL схемі немає updated_at
  });