import { DataTypes } from "sequelize";
//import { UserType } from "../Interfaces/user.interface";
import sequelize from "@lib/sequelize";
import { BuildOptions, Model } from "sequelize";

export interface IUser extends Model {
  readonly id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'client';
  readonly createdAt: bigint;
}

export type UserType = typeof Model & { // тип, опис моделі User у sequelize
  new (values?: object, options?: BuildOptions): IUser;
};

// Припускаємо, що ctx — це ваш контекст бази даних
/*
export const UserModel = (ctx: any) => { // UserModel (w/o init)
  const User = <UserType>ctx.db.define("users", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 255],
          msg: "Username must be between 3 and 255 characters in length",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [6, 255],
          msg: "Email must be between 3 and 255 characters in length",
        },
        isEmail: {
          msg: "Email address must be valid",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 255],
          msg: "Password must be between 8 and 255 characters in length",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "client"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["admin", "client"]],
          msg: "Role valid values: admin, client",
        },
      },
    },
    createdAt: {
      field: "created_at",
      allowNull: false,
      type: DataTypes.BIGINT,
    },
  }, {
    timestamps: false // Вимикаємо, бо в SQL схемі немає updated_at
  });

  return User;
};*/


export const User = <UserType>sequelize.define("users", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 255],
          msg: "Username must be between 3 and 255 characters in length",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [6, 255],
          msg: "Email must be between 3 and 255 characters in length",
        },
        isEmail: {
          msg: "Email address must be valid",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 255],
          msg: "Password must be between 8 and 255 characters in length",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "client"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["admin", "client"]],
          msg: "Role valid values: admin, client",
        },
      },
    },
    createdAt: {
      field: "created_at",
      allowNull: false,
      type: DataTypes.BIGINT,
    },
  }, {
    timestamps: false // Вимикаємо, бо в SQL схемі немає updated_at
});
