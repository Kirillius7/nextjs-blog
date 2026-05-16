import { DataTypes } from "sequelize";
//import { TicketType } from "../Interfaces/ticket.interface";
import sequelize from "@lib/sequelize";
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

/*
export const TicketModel = (ctx: any) =>{
    const Ticket = <TicketType>ctx.db.define("tickets", {
        id:{
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        orderid:{
            field: "order_id",
            allowNull: true,
            type: DataTypes.INTEGER,
        },
        eventid:{
            field: "event_id",
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        userid:{
            field: "user_id",
            allowNull: true,
            type: DataTypes.INTEGER,
        },
        priceperticket:{
            field: "price_per_ticket",
            allowNull: false,
            type: DataTypes.DECIMAL(10,2),
            validate: {
                min: {
                args: [0.01],
                msg: "Price must be greater than 0",
                },
            },
        },
        statusticket: {
            field: "status_ticket",
            type: DataTypes.ENUM("available", "sold", "returned"),
            allowNull: false,
            validate: {
                isIn: {
                args: [["available", "sold", "returned"]],
                msg: "Status valid values: available, sold, returned"
                },
            },
        },
        category: {
            type: DataTypes.ENUM("vip", "ordinary", "special"),
            allowNull: false,
            validate: {
                isIn: {
                args: [["vip", "ordinary", "special"]],
                msg: "Status valid values: vip, ordinary, special"
                },
            },
        },
    }, {
    timestamps: false // Вимикаємо, бо в SQL схемі немає updated_at
  });

  return Ticket;
}*/

export const Ticket = <TicketType>sequelize.define("tickets", {
        id:{
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        orderid:{
            field: "order_id",
            allowNull: true,
            type: DataTypes.INTEGER,
        },
        eventid:{
            field: "event_id",
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        userid:{
            field: "user_id",
            allowNull: true,
            type: DataTypes.INTEGER,
        },
        priceperticket:{
            field: "price_per_ticket",
            allowNull: false,
            type: DataTypes.DECIMAL(10,2),
            validate: {
                min: {
                args: [0.01],
                msg: "Price must be greater than 0",
                },
            },
        },
        statusticket: {
            field: "status_ticket",
            type: DataTypes.ENUM("available", "sold", "returned"),
            allowNull: false,
            validate: {
                isIn: {
                args: [["available", "sold", "returned"]],
                msg: "Status valid values: available, sold, returned"
                },
            },
        },
        category: {
            type: DataTypes.ENUM("vip", "ordinary", "special"),
            allowNull: false,
            validate: {
                isIn: {
                args: [["vip", "ordinary", "special"]],
                msg: "Status valid values: vip, ordinary, special"
                },
            },
        },
    }, {
    timestamps: false // Вимикаємо, бо в SQL схемі немає updated_at
});