import { createRouter } from 'next-connect';
//import sequelize from "../../lib/sequelize";
//import { initAssociations } from '../../Server/Models/associations';
//import { models } from "../../Server/Models/index";

//import eventController from "../../Server/Controllers/EventController";

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
        message: `Method ${req.method} is not allowed!`
    });
  },
});

/*router.use(async (req, res, next) => {
    const {Event, EventSeries} = initAssociations(sequelize)
  req.models = {
    Event, EventSeries
  };
  await next();
});*/

/*router.get(async (req, res) => {
  //const { audienceType, venueType, scale } = req.query;
  const { audienceType, venueType, scale, seriesId } = req.query;
  //const { Event, EventSeries } = req.models;
  const {Event, EventSeries} = models;
  const seriesWhere = {};
  if (audienceType) seriesWhere.audienceType = audienceType;
  if (venueType) seriesWhere.venueType = venueType;
  if (scale) seriesWhere.scale = scale;
  if (seriesId) {
    seriesWhere.id = Number(seriesId);
  }
  const hasFilters = Object.keys(seriesWhere).length > 0; // підрахунок кількості ключів у фільтрах, якщо більше 0 - true
  const include = {
    model: EventSeries,
    as: "series", // alias звʼязок між таблицями 1:М між Event та EventSeries
    required: false, // виведення всіх подій, навіть якщо деякі з них не мають серій
  };

  if (hasFilters) {
    include.required = true; // виведення подій, тільки якщо вони є частиною серій
    include.where = seriesWhere;
  }

  const data = await Event.findAll({
    where: { statusevent: "active" },
    include: [include], // додавання до таблиці Event поле series з відповідними параметрами
    order: [["id", "ASC"]],
  });

  //return res.status(200).json(data);
  return res.status(200).json({
    success: true,
    data
  })
});
*/

//router.get(eventController.getEventList);

router.get(container.cradle.eventController.getEventList)

export default router.handler();