//->import { createRouter } from 'next-connect';

//import sequelize from "../../lib/sequelize";
//import { Event_SerieModel } from "../../Server/Models/Event_Series";


//import eventSeriesController from "../../Server/Controllers/EventSeriesController";

//->import container from 'Server/DI/container';

/*->
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
*/

//->router.get(container.cradle.eventSeriesController.getEventSeriesList);

//router.get(container.cradle.)

//->export default router.handler()

import container from 'Server/DI/container';

export default container
  .resolve("eventSeriesController")
  //.handler("/api/event_series");
  .handler();