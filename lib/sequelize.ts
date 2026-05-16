// створення файлу-точки підключення до БД завдяки налаштуванню обʼєкта Sequelize
import { Sequelize } from "sequelize";
// import {config} from "config"

/*
const sequelize = new Sequelize(
  // екземпляр підключення
  "ticketsresale",
  
  // config.database
  
  "ticketsresale",
  "ticketsresale",
  // конфігурація підключення
  {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    logging: false,
  }
);

export default sequelize;
*/

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,

  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    logging: false
  }
);

export default sequelize;