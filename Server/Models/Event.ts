import { DataTypes } from "sequelize";
//import { EventType } from "../Interfaces/event.interface";
import { BuildOptions, Model } from "sequelize";
import sequelize from "../../lib/sequelize";
export interface IEvent extends Model{
    readonly id: number;
    user_id: number;
    series_id: number;
    name_event: string;
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

/*
export const EventModel = (ctx: any) => {
    const Event = <EventType>ctx.db.define("events", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        userid:{
            field: "user_id",
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        seriesid:{
            field: "series_id",
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        eventName: {
            field: "event_name",
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                args: [3, 45],
                msg: "Location name must be between 3 and 45 characters in length",
                },
            },
        },
        locationName: {
            field: "location_name",
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                args: [3, 255],
                msg: "Location name must be between 3 and 255 characters in length",
                },
            },
        },
        locationAddress: {
            field: "location_address",
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                args: [3, 255],
                msg: "Location address must be between 3 and 255 characters in length",
                },
            },
        },
        locationCapacity:{
            field: "location_capacity",
            allowNull: false,
            type: DataTypes.INTEGER,
            validate: {
                min: {
                args: [0.01],
                msg: "Capacity must be greater than 0",
                },
            },
        },
        startDate: {
            field: "start_date",
            allowNull: false,
            type: DataTypes.BIGINT,
        },
        endDate: {
            field: "end_date",
            allowNull: true,
            type: DataTypes.BIGINT,
        },
        statusevent: {
            field: "status_event",
            type: DataTypes.ENUM("active", "postponed", "cancelled", "draft"),
            allowNull: false,
            validate: {
                isIn: {
                args: [["active", "postponed", "cancelled", "draft"]],
                msg: "Status valid values: active, postponed, cancelled, draft"
                },
            },
        },
        createdAt: {
            field: "created_at",
            allowNull: false,
            type: DataTypes.BIGINT,
        },
        publishedAt: {
            field: "published_at",
            allowNull: true,
            type: DataTypes.BIGINT,
        },
    },{
        timestamps: false // Вимикаємо, бо в SQL схемі немає updated_at
    });

    /*const EventSeries = ctx.initEvent_SerieModel
        ? ctx.initEvent_SerieModel(ctx)
        : require("./Event_Series").initEvent_SerieModel(ctx);

    Event.belongsTo(EventSeries, {
        foreignKey: "seriesid", // 👈 у тебе так називається поле
        as: "series" // 👈 ключове!
    });*/

    //return Event;
//}

export const Event = <EventType>sequelize.define("events", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        userid:{
            field: "user_id",
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        seriesid:{
            field: "series_id",
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        eventName: {
            field: "event_name",
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                args: [3, 45],
                msg: "Location name must be between 3 and 45 characters in length",
                },
            },
        },
        locationName: {
            field: "location_name",
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                args: [3, 255],
                msg: "Location name must be between 3 and 255 characters in length",
                },
            },
        },
        locationAddress: {
            field: "location_address",
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                args: [3, 255],
                msg: "Location address must be between 3 and 255 characters in length",
                },
            },
        },
        locationCapacity:{
            field: "location_capacity",
            allowNull: false,
            type: DataTypes.INTEGER,
            validate: {
                min: {
                args: [0.01],
                msg: "Capacity must be greater than 0",
                },
            },
        },
        startDate: {
            field: "start_date",
            allowNull: false,
            type: DataTypes.BIGINT,
        },
        endDate: {
            field: "end_date",
            allowNull: true,
            type: DataTypes.BIGINT,
        },
        statusevent: {
            field: "status_event",
            type: DataTypes.ENUM("active", "postponed", "cancelled", "draft"),
            allowNull: false,
            validate: {
                isIn: {
                args: [["active", "postponed", "cancelled", "draft"]],
                msg: "Status valid values: active, postponed, cancelled, draft"
                },
            },
        },
        createdAt: {
            field: "created_at",
            allowNull: false,
            type: DataTypes.BIGINT,
        },
        publishedAt: {
            field: "published_at",
            allowNull: true,
            type: DataTypes.BIGINT,
        },
    },{
        timestamps: false // Вимикаємо, бо в SQL схемі немає updated_at
});