/*
import container from "../../Server/DI/container";

async function runMiddlewares(req, res, middlewares) {
  for (const middleware of middlewares) {
    await new Promise((resolve, reject) => { // створення промісу, з await, який є індикатором неможливості перейти на інший middleware, допоки поточний не виконано
      middleware(req, res, (err) => {
        if (err) return reject(err);
        resolve(); // коли middleware викликаний, то promise чекає зі статусом pending, коли middleware виконав дії -> виклик next, що змінює статус promise на resolve -> перехід до нової ітерації (і відповідно нового middleware)
      });
    });
  }
}

// експорт однієї головної асинхронної (завантаження файлу, робота redis, запит до БД, асинхронні бізнес задачі) сутності 
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end(); // перевірка на тип запиту для логінації

  try {

    // виведення екземпляру контролера для подальшої роботи з прототипом (на імʼя якого записані декоратори)
    const authController = container.resolve("authController");
    const prototype = Object.getPrototypeOf(authController);

    // зчитування декораторів, записаних на імʼя login для подальшого запуску логіки/методів, асигнованих до них
    // у цьому випадку логіка @USE(...doAuthMiddlewares) => де logMiddlewares проходить по асинхронним middlewares в sessionUserMiddlewares
    const regMiddleware = Reflect.getMetadata("middlewares", prototype, "login") || [];
    
    // перевірка cookie
    // запуск middlewares
    // 1. створення req.session, пошук даних сесії в redis на основі id в куки (або створення нової сесії з генерацією id)
    // 2. увімкнення passport з додаванням службових методів до req (req.login, req.logout)
    // 3. пошук ключа в req.session (+: redis знаходить дані на основі куки, -: passport.user пустий, тому next()), щоб passport міг виконати десеріалізацію користувача із записом в req.user 
    // 4. перевірка за допомогою localstrategy введних даних користувачем, у разі успіху - запис в req.user = user
    // 4. на цьому етапі, якщо сесія пуста-нова (не автентифікований користувач), то user.id записується в неї, вона змінюється і змінюються куки
    // 4. цього етапу взагалі може не бути, якщо користувач автентифікований, то десеріалізація відбувається на 3 кроці
    await runMiddlewares(req, res, regMiddleware);
    console.log("req.user!!!!", req.user)
    const result = await authController.login({
      req,
      res,
      body: req.body,
      user: req.user
    });

    // результат роботи з передачею фронтенду
    return res.status(200).json(result);

  } catch (error) {
    console.error("Помилка авторизації:", error);
    return res.status(401).json({ message: error.message || "Unauthorized" });
  }
}
*/


import container from "../../Server/DI/container";

export default container.resolve("authController").handler()
