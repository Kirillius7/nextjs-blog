import { createRouter } from 'next-connect';
//import sequelize from "../../lib/sequelize";
//import { initAssociations } from '../../Server/Models/associations';

//import artistController from "../../Server/Controllers/ArtistController";

import container from '../../lib/container';
const router = createRouter({
  // Глобальний обробник помилок
  onError: (err, req, res) => {
    console.error(err.stack);
    //res.status(err.statusCode || 500).json({ error: err.message });
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    })
  },

  // Обробка випадків, коли метод не знайдено (код 405)
  onNoMatch: (req, res) => {
    //res.status(405).json({ error: req.method });
    res.status(405).json({
        success: false,
        message: `Method ${req.method} is not allowed!`
    })
  },
});

// middleware для ініціалізації таблиці БД
/*router.use(async (req, res, next) => {
    const {Event, Artist} = initAssociations(sequelize)
  req.models = {
    Event, Artist
  };
  await next();
});*/

//router.get(artistController.getArtistList);
router.get(container.cradle.artistController.getArtistList)
export default router.handler(); // функція-точка запуску API в next-connect, де зібрані всі обʼєкти

