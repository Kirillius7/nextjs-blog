// import User from "../../models/User.js";
import { createRouter } from 'next-connect';
//import userController from "../../Server/Controllers/UserController";
/*export default async function handler(req, res) {
  try {
    const User = UserModel({ db: sequelize });
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}*/

import container from '../../lib/container';
const router = createRouter({
  // Глобальний обробник помилок
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ 
      success: false,
      message: err.message || "Internal Server Error"
    });
  },

  // Обробка випадків, коли метод не знайдено (код 405)
  onNoMatch: (req, res) => {
    res.status(405).json({
      success: false, 
      message: `Method ${req.method} is not allowed` 
    });
  },
});


{/*
router.get(async(req, res) => {
    const { eventName, categoryTicket } = req.query;
    const {User, Order, Ticket, Event} = models;

    const eventsWhere = {};
    const ticketsWhere = {};

    if(eventName) eventsWhere.eventName = eventName;
    if(categoryTicket) ticketsWhere.category = categoryTicket;

    const users = await User.findAll({
    where: {role: "client"},
    include:[{
      model: Order,
      as: "orders",
      required: true,
      include:[{
        model: Ticket,
        as: "tickets",
        required: true,
        where: Object.keys(ticketsWhere).length ? ticketsWhere : undefined,
        include:[{
          model: Event,
          as: "eventTicket",
          attributes: ["eventName"],
          where: Object.keys(eventsWhere).length ? eventsWhere : undefined,
          required: true
        }]
      }],
      attributes: ["id", "userid"],
      //through: { attributes: [] },
      //required: false, // виведення всіх подій, навіть якщо деякі з них не мають серій
    }],
  });
  
  return res.status(200).json({
            success: true,
            data: users
          });
})*/}

//router.get(userController.getUsersList);
router.get(container.cradle.userController.getUserList)
export default router.handler();
