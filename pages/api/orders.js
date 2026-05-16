import { createRouter } from "next-connect";
/*
export default async function handler(req, res) {
  try {
    const Order = OrderModel({ db: sequelize });
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}*/

import container from "../../lib/container";

//import orderController from "../../Server/Controllers/OrderController";
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

/*
router.get(async(req, res) =>{
  const { eventName, categoryTicket,orderid } = req.query;

  const {Order, User, Event, Ticket} = models;
  
  const eventsWhere = {};
  const ticketWhere = {};

  if(eventName) eventsWhere.eventName = eventName;
  if(categoryTicket) ticketWhere.category = categoryTicket;

  console.log("Object.keys(eventsWhere).length", Object.keys(eventsWhere).length)
  console.log("Object.keys(ticketWhere).length", Object.keys(ticketWhere).length)

  const orders = await Order.findAll({
    where: {statusorder: "paid", ...(orderid && {id: orderid})},
    include: [{
      model: Ticket,
      as: "tickets",
      required: true,
      where: Object.keys(ticketWhere).length ? ticketWhere : undefined,
      

      include: [{
        model: Event,
        as: "eventTicket",
        attributes: ["eventName"],
        required: true,
        where: Object.keys(eventsWhere).length ? eventsWhere : undefined,
        
      }]
    }]
  })

  return res.status(200).json({
    sucess: true,
    data: orders
  });
});
*/

//router.get(orderController.getOrdersList);
router.get(container.cradle.orderController.getOrdersList);
export default router.handler();
