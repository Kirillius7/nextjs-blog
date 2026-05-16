import { DataTypes } from "sequelize";
//import { Event_SerieType } from "../Interfaces/event_serie.interface";
import { BuildOptions, Model } from "sequelize";
import sequelize from "../../lib/sequelize";

export interface IEvent_Serie extends Model{
    readonly id: number;
    name: string;
    description: string;
    audienceType: 'general' | 'youth' | 'adult' | 'professional' | 'niche';
    venueType: 'indoor' | 'outdoor' | 'mixed'
    scale: 'local' | 'regional' | 'international' | 'global'
}

export type Event_SerieType = typeof Model & {
  new (values?: object, options?: BuildOptions): IEvent_Serie;
};
/*
export const Event_SerieModel = (ctx: any) => {
    const Event_Serie = <Event_SerieType>ctx.db.define("event_series", {
        id:{
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                args: [3, 255],
                msg: "Name must be between 3 and 255 characters in length",
                },
            },
        },
        description:{
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                len: {
                args: [10, 255],
                msg: "Description must be between 10 and 255 characters in length",
                },
            },
        },
        audienceType: {
        field: "audience_type",
        type: DataTypes.ENUM("general", "youth", "adult", "professional", "niche"),
        allowNull: false,
        validate: {
            isIn: {
                args: [["general", "youth", "adult", "professional", "niche"]],
                msg: "Role valid values: general, youth, adult, professional, niche",
            },
            },
        },
        venueType: {
        field: "venue_type",
        type: DataTypes.ENUM("indoor", "outdoor", "mixed"),
        allowNull: false,
        validate: {
            isIn: {
                args: [["indoor", "outdoor", "mixed"]],
                msg: "Role valid values: indoor, outdoor, mixed",
            },
            },
        },
        scale: {
        field: "scale",
        type: DataTypes.ENUM("local", "regional", "international", "global"),
        allowNull: false,
        validate: {
            isIn: {
                args: [["local", "regional", "international", "global"]],
                msg: "Role valid values: local, regional, international, global",
            },
            },
        },
    },{
    timestamps: false // Вимикаємо, бо в SQL схемі немає updated_at
  });

  return Event_Serie;
}*/

export const EventSeries = <Event_SerieType>sequelize.define("event_series", {
        id:{
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                args: [3, 255],
                msg: "Name must be between 3 and 255 characters in length",
                },
            },
        },
        description:{
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                len: {
                args: [10, 255],
                msg: "Description must be between 10 and 255 characters in length",
                },
            },
        },
        audienceType: {
        field: "audience_type",
        type: DataTypes.ENUM("general", "youth", "adult", "professional", "niche"),
        allowNull: false,
        validate: {
            isIn: {
                args: [["general", "youth", "adult", "professional", "niche"]],
                msg: "Role valid values: general, youth, adult, professional, niche",
            },
            },
        },
        venueType: {
        field: "venue_type",
        type: DataTypes.ENUM("indoor", "outdoor", "mixed"),
        allowNull: false,
        validate: {
            isIn: {
                args: [["indoor", "outdoor", "mixed"]],
                msg: "Role valid values: indoor, outdoor, mixed",
            },
            },
        },
        scale: {
        field: "scale",
        type: DataTypes.ENUM("local", "regional", "international", "global"),
        allowNull: false,
        validate: {
            isIn: {
                args: [["local", "regional", "international", "global"]],
                msg: "Role valid values: local, regional, international, global",
            },
            },
        },
    },{
    timestamps: false // Вимикаємо, бо в SQL схемі немає updated_at
});
