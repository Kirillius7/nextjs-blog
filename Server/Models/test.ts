import { Sequelize } from "sequelize";

const sequelize = new Sequelize("ticketsresale", "ticketsresale", "ticketsresale", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  logging: false,
});

export default sequelize;