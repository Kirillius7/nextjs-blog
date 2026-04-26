// створення файлу-точки підключення до БД завдяки налаштуванню обʼєкта Sequelize
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  // екземпляр підключення
  "ticketsresale",
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