import sequelize from "../lib/sequelize";

//import "./Models/initModels";

export default async function bootstrap() {

  await sequelize.authenticate();

  console.log("Database connected");
}