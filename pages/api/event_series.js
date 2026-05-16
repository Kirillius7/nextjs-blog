import { createRouter } from 'next-connect';
//import sequelize from "../../lib/sequelize";
//import { Event_SerieModel } from "../../Server/Models/Event_Series";


//import eventSeriesController from "../../Server/Controllers/EventSeriesController";

import container from "../../lib/container";

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
        message: `Method ${req.method} is not allowed!`
    });
  },
});

/*router.use(async (req, res, next) =>{
  req.models = { 
    // ініціалізація доступу до таблиці БД з прикріпленням до обʼєкта req для подальшого використання в route handler
    Event_Serie: Event_SerieModel({ db: sequelize }) // створення моделі для запиту в таблицю БД
  };

  await next();
})*/

/*router.get(async (req, res) => {
  const { audienceType, venueType, scale } = req.query;
  //const {Event_Serie} = req.models;
  const{EventSeries} = models;
  // Створюємо об'єкт фільтрації
  const whereClause = {};
  
  // Асигнування умови лише якщо вони передані в запиті
  if (audienceType) whereClause.audienceType = audienceType;
  if (venueType) whereClause.venueType = venueType;
  if (scale) whereClause.scale = scale;

  const data = await EventSeries.findAll({
    where: whereClause,
    raw: true // повернення простого json-обʼєкта (без методів, без стану та можливості взаємодіяти з БД)
  });

  //return res.status(200).json(data);
  return res.status(200).json({
    success: true,
    data
  })
});*/

//router.get(eventSeriesController.getEventSeriesList);
router.get(container.cradle.eventSeriesController.getEventSeriesList);
//router.get(container.cradle.)
export default router.handler()