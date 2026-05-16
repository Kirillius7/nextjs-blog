// import User from "../../models/User.js";
import { createRouter } from 'next-connect';
//import ticketController from "../../Server/Controllers/TicketController";
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

// middleware для ініціалізації таблиці БД
/*router.use(async (req, res, next) => {
  req.models = {
    Ticket: TicketModel({ db: sequelize })
  };
  await next();
});*/

/*router.get(async (req, res) => {
  const { eventid, category } = req.query;
  //const { Ticket } = req.models;
  const {Ticket} = models;

  const whereClause = {
    statusticket: "available",
    ...(eventid != null && { eventid: Number(eventid) }), // якщо є id події - асигнування до змінної, інакше - не визначена
    ...(category && { category }), // визначення категорії типу квитка (vip, ordinary, special)
  };

  const data = await Ticket.findAll({
    where: whereClause,
    order: [["eventid", "ASC"]],
    raw: true,
  });

  //return res.status(200).json(data);
  return res.status(200).json({
    success: true,
    data
  });
});
*/

//router.get(ticketController.getTicketList);
router.get(container.cradle.ticketController.getTicketList);
export default router.handler();