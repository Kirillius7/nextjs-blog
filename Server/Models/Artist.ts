import { DataTypes } from "sequelize";
import sequelize from "../../lib/sequelize"; // підключення головного sequelize instance, об'єкт підключення до БД
//import { ArtistType } from "../Interfaces/artist.interface";
import { BuildOptions, Model } from "sequelize";

export interface IArtist extends Model {
    readonly id: number;
    stage_name: string;
    first_name: string;
    second_name: string;
    genre: string;
}

export type ArtistType = typeof Model & { // створення типу Artist, щоб мати статичні методи (create, findAll) та сам constructor для звернення до таблиці БД
      new (values?: object, options?: BuildOptions): IArtist; // опис створення екземпляру Artist на основі типу IArtist (з відповідними полями)
      // об’єкт можна викликати через new з можливістю передати values та options
}

/*
export const ArtistModel = (ctx: any) => {
    const Artist = <ArtistType>ctx.db.define("artists", {
        id:{
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        stageName:{
            field: "stage_name",
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                len: {
                args: [2, 255],
                msg: "Stage name must be between 2 and 255 characters in length",
                },
            },
        },
        firstName:{
            field: "first_name",
            allowNull: true,
            type: DataTypes.STRING,
            validate: {
                len: {
                args: [3, 255],
                msg: "First name must be between 2 and 255 characters in length",
                },
            },
        },
        secondName:{
            field: "second_name",
            allowNull: true,
            type: DataTypes.STRING,
            validate: {
                len: {
                args: [3, 255],
                msg: "First name must be between 3 and 255 characters in length",
                },
            },
        },
        genre:{
            field: "genre",
            allowNull: true,
            type: DataTypes.STRING,
            validate: {
                len: {
                args: [3, 255],
                msg: "Genre must be between 3 and 255 characters in length",
                },
            },
        },
    },{
    timestamps: false // Вимикаємо, бо в SQL схемі немає updated_at
  });

  return Artist;
}*/

export const Artist = <ArtistType>sequelize.define("artists", { // створення Sequelize-моделі типу ArtistType (з полями, методами)
        id:{
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        stageName:{
            field: "stage_name",
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                len: {
                args: [2, 255],
                msg: "Stage name must be between 2 and 255 characters in length",
                },
            },
        },
        firstName:{
            field: "first_name",
            allowNull: true,
            type: DataTypes.STRING,
            validate: {
                len: {
                args: [3, 255],
                msg: "First name must be between 2 and 255 characters in length",
                },
            },
        },
        secondName:{
            field: "second_name",
            allowNull: true,
            type: DataTypes.STRING,
            validate: {
                len: {
                args: [3, 255],
                msg: "First name must be between 3 and 255 characters in length",
                },
            },
        },
        genre:{
            field: "genre",
            allowNull: true,
            type: DataTypes.STRING,
            validate: {
                len: {
                args: [3, 255],
                msg: "Genre must be between 3 and 255 characters in length",
                },
            },
        },
    },{
    timestamps: false // Вимикаємо, бо в SQL схемі немає updated_at
  });