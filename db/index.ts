console.log("tse pochatok? (db/index.ts)")
import sequelize from "../lib/sequelize";



export const createDB = () => {
  return sequelize;
};