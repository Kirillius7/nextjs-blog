import sequelize from "../../lib/sequelize";

export default async function handler(req, res) {
  try {
    await sequelize.authenticate();
    res.status(200).json({ message: "DB connected ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}