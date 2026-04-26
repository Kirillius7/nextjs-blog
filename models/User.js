import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: DataTypes.STRING,
    role: DataTypes.ENUM("admin", "client"),
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    created_at: DataTypes.DATE,
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

export default User;