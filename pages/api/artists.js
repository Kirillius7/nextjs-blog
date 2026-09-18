// pages/api/artists.js
/*
import * as awilix from "awilix";
import config from "config";
import { createDB } from "db";*/

//->import { createRouter } from 'next-connect';
//->import container from 'Server/DI/container';

// файл, де браузер формує http запит на url, який бачить next.js і шукає відповідний файл
// коли next.js знайшов потрібний файл, він його виконує (api створює router)
// реєстрація handlers (get, put), підбір http методів, виклик потрібного callback

/*->
const router = createRouter({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
  },
  onNoMatch: (req, res) => {
    res.status(405).json({
        success: false,
        message: `Method ${req.method} is not allowed!`
    });
  },
});
*/

// get/post/put/delete - express router methods, що очікують handler function (обробка http request, яка отримує req, res, next і повертає response)
// awilix шукає регістрацію artistController у контейнері (який туди додали з index.ts), cradle - awilix container object

//router.get(container.cradle.artistController.getArtistList); // виклик instance класу

/*->
router.get(
    container.cradle.artistController
        .handler("/api/artists")
);
*/

// router.get отримує reference на метод controller, next-connect зберігає його як callback handler
// при HTTP request next-connect викликає handler(req, res) оскільки method передається окремо від object,
// context this втрачається, bind(this) створює нову функцію, де this назавжди привʼязаний до instance controller

// awilix на основі зареєстрованих даних контейнера створює dependency object 
// і викликає обʼєкт контроллера з передачею параметрів opts (db, controllers, service, config)

import container from 'Server/DI/container';
console.log("artistsapi.ts")
export default container
  .resolve("artistController")
  .handler("/api/artists"); // створення router, пошук по ключу у metadata, побудова routing map, повернення handler (req,res)
// "/api/artists"

//->export default router.handler(); // handler - метод, що оброблює http-запит