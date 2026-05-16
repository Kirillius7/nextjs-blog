
/*<------------------------------------------------------------------------------------------------------------------------------>*/

/* структура проекту
src/

├── pages/
│    └── api/
│         └── orders.ts
│
├── lib/ - awilix реалізація 
│    └── container.ts
│
├── controllers/
│    └── OrderController.ts
│
├── services/
│    └── OrderService.ts
│
└── models/
     └── index.ts

*/

/*<------------------------------------------------------------------------------------------------------------------------------>*/

/* container.ts
-> імпорт awilix інструментів 
import {
   createContainer, // створення DI-контейнера (для збереження сервісів, створення обʼєктів, керуванням життєвим циклом)
   asClass, // підхід для створення class instance через new (asClass(OrderService -> new OrderService()) 
   InjectionMode // режими визначення принципу як залежності передаються в класи 
   // (сlassic - важливий порядок, без імен залежностей, proxy - більш сучасний, без врахування порядку, передача 1 параметром)
} from "awilix";

// імпорт моделей для створення залежностей 
import { OrderController }
   from "@/controllers/EventSeriesController";

import { OrderService }
   from "@/services/EventSeriesService";


// створення контейнера 
const container = createContainer({

   // додавання (inject) dependencies через object

   injectionMode:
      InjectionMode.PROXY,

   strict: true
});


// реєстрація опису як створювати залежності/класів у разі необхідності
container.register({

   // контролер із визначеним життєвим циклом, створення на основі OrderController (на основі new)
   eventSeriesController: asClass(OrderController).singleton(),


   // сервіс із визначеним життєвим циклом, створення на основі OrderService (на основі new)
   eventSeriesService: sClass(OrderService).transient(),
});

// делегування створення/отримання обраного сервісу (dependency) (пошук класу, створення або вибір готової моделі)
const serviceExample = container.resolve("orderService"); -> пошук dependency по ключу, перегляд життєвого шляху, створення instance

// експорт контейнера
export default container;
*/

/*<------------------------------------------------------------------------------------------------------------------------------>*/

/* api.js
router.get(
   container.cradle.eventSeriesController.getEventSeriesList // awilix шукає у реєстрі контролер (клас контролера), 
   // відбувається аналіз що для нього ще потрібно (створення обʼєкта сервісу) -> рекурсивне створення залежностей (модель + сервіс)
   // Awilix створює екземпляр контролера для того, щоб потім отримати доступ до методу обʼєкта getEventSeriesList
);

Resolve — це  прямий і активний запит до контейнера для того, щоб отримати конкретний об'єкт прямо зараз (пошук класу, створення instance, підставляє залежності)
Cradle — це зручне «вікно» або проксі-об'єкт, який дозволяє звертатися до залежностей просто як до звичайних властивостей, 
автоматично викликаючи resolve під капотом у той момент, коли йде взаємодія з іменем потрібного сервісу, наявне автодоповнення списку контролерів
Awilix не створює контролер у ту ж секунду, як побачив цей рядок, лише коли роутер реально звернеться до властивості, cradle викличе resolve

    Awilix -> resolve:

    знаходить userController
    бачить asClass(UserController)
    створює клас
    бачить залежність userService
    створює service
    бачить залежність db
    створює db
    передає все у правильному порядку
*/

/*<------------------------------------------------------------------------------------------------------------------------------>*/

/* controller
export class EventSeriesController {

   constructor({ eventSeriesService }) { // конструктор приймає обʼєкт (cradle), який йому передає awilix, це є інʼєкцією DI
   // відбувається деструктурізація з урахуванням лише обʼєкту eventSeriesService (оскільки controller залежить від service)

      this.eventSeriesService = eventSeriesService;
   }

   getEventSeriesList = async(req, res) => {

      const data =
         await this.eventSeriesService.getEventSeries(
            req.query // передача (делегування) параметрів http-запитів до service для обробки бізнес-логіки
         );

      return res.status(200).json({
         success: true,
         data
      });
   }
}
*/

/*<------------------------------------------------------------------------------------------------------------------------------>*/

/* service
export class EventSeriesService { // виконання бізнес логіки, яка раніше була частиною controller, а тепер є правильною! частиною service
// service отримує дані від http-запиту, який передав controller, виконує бізнес-логіку і повертає controller результат виконаної роботи

   async getEventSeries(filters: any) {

      const { audienceType, venueType, scale } = filters;

      const whereClause: any = {};

      if (audienceType) {
         whereClause.audienceType = audienceType;
      }

      if (venueType) {
         whereClause.venueType = venueType;
      }

      if (scale) {
         whereClause.scale = scale;
      }

      return models.EventSeries.findAll({
         where: whereClause,
         raw: true
      });
   }
}
*/
/*<------------------------------------------------------------------------------------------------------------------------------>*/

import { models } from "Server/Models";
import { Op } from "sequelize";

export class ArtistService{
   public getArtistList = async(filters) => {
      const { stageName } = filters; // зчитування параметрів із запиту URL 
            const {Event, Artist} = models;
            let eventIdsWithFilteredArtist: number[] | null  = null;
        
            // 1. Пошук ID подій, де бере участь виконавець, на основі якого відбувається фільтрація
            if (stageName) {
                const eventsWithArtist = await Event.findAll({ // запит від sequelize до таблиці 
                    attributes: ['id'], // робота лише з полем id
                    include: [{ // join таблиці М:М (Event + Artist)
                        model: Artist,
                        as: "Performers", // alias (назва звʼязку)
                        where: {
                            stage_name: { [Op.like]: `%${stageName}%` } // пошук виконавців на основі певних даних 
                            // до пошуку залучений оператор like -> який буде фільтрувати дані, на основі слова "всередині"
                        },
                        attributes: [], // ID подій, без додаткових даних 
                        through: { attributes: [] } // приховування проміжної таблиці М:М 
                    }],
                    raw: true // повернення простого json-обʼєкта
                });
                
                // Створення масиву ID: [1, 5, 12...]
                eventIdsWithFilteredArtist = eventsWithArtist.map(e => e.id);
            }
        
            // 2. Основний запит
            const whereClause:any = { status_event: "active" }; // фільтр для пошуку лише активних подій
        
            // Пустий масив у разі відсутніх даних 
            if (stageName && eventIdsWithFilteredArtist?.length === 0) {
                //return res.status(200).json([]);

                /*
                return res.status(200).json({
                    success: true,
                    data: []
                })
               */
              return [];
            }
        
            // Фільтр по знайдених ID
            if (eventIdsWithFilteredArtist) {
                whereClause.id = { [Op.in]: eventIdsWithFilteredArtist }; // додавання фільтру для подій з певним id (список in)
            }
        
            const events = await Event.findAll({ // запит до таблиці 
                where: whereClause, // фільтри (номера id + активний статус)
                order: [["id", "ASC"]],
                include: [ // підключення таблиці Artist через alias 
                    {
                        model: Artist,
                        as: "Performers",
                        attributes: ["id", "stage_name"], // вибірка полів
                        through: { attributes: [] }, // приховування проміжної таблиці М:М 
                        required: false // Параметр false, щоб завантажити всіх інших артистів, з якими бере участь "відфільтрований"
                    },
                ],
            });
        
            //return res.status(200).json(events);

            /*
            return res.status(200).json({
                success: true,
                data: events
            })
            */
           return events;

   }
}