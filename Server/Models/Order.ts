import { DataTypes } from "sequelize";
//import { OrderType } from "../Interfaces/order.interface";
import sequelize from "@lib/sequelize";
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
/*
export const OrderModel = (ctx: any) => {
    const Order = <OrderType>ctx.db.define("orders", {
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
        statusorder: {
            field: "status_order",
            type: DataTypes.ENUM("pending", "paid", "cancelled"),
            allowNull: false,
            validate: {
                isIn: {
                args: [["pending", "paid", "cancelled"]],
                msg: "Status valid values: pending, paid, cancelled"
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

    return Order;
}*/
export const Order = <OrderType>sequelize.define("orders", {
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
        statusorder: {
            field: "status_order",
            type: DataTypes.ENUM("pending", "paid", "cancelled"),
            allowNull: false,
            validate: {
                isIn: {
                args: [["pending", "paid", "cancelled"]],
                msg: "Status valid values: pending, paid, cancelled"
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