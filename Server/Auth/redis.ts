import { RedisStore } from "connect-redis"; // бібліотека для створення "містку" між сесіями та redis (дозволяє працювати незалежно від перезапуску сервера)
import session from "express-session";
import { createClient } from "redis";

// створення клієнт-підключення до redis зі стандартною адресою (містить стандартні методи для роботи з БД - збереження ключів та значень)
export const redisClient = createClient({
  url: 'redis://localhost:6379' // стандартний локальний порт без паролів
});

redisClient.connect().catch((e) => {
  console.error("Session Redis Connection Error:", e);
});

// налаштування сховища сесій в Redis (надає переклад для низькорівневого redisClient додаткові методи (get, set)) з префіксом sess:
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "sess:", // префікс на сервері для того, щоб відрізнити сесії від інших даних користувача (кеш товарів або повідомлень)
});

export const SESSION_COOKIE_NAME = "connect.sid"; // назва куки для відображення в браузері
export const SESSION_COOKIE_PATH = "/";

// створення (з описом правил поведінки сервера та браузера) та експорт middleware сесії
// розшифровка куки, приймає рішення про безпеку, звертання до redis, формування обʼєкту req.session, оновлення куки для браузера
export const customSession = session({
  store: redisStore,
  secret: "my-practice-secret-key-123", // секрет (підпис) для створення куку на основі криптографічного хешу (щоб користувач не підмінив власноруч)
  resave: false, // економія ресурсів за рахунок відсутності перезапису в redis даних, якщо вони не оновлені
  saveUninitialized: false, // запобіжник від створення "пустих сесій" (коли користувач не автентифікувався і його порожня сесія не збережена)
  name: SESSION_COOKIE_NAME,
  cookie: {
    httpOnly: true, // захист від XSS (JS-скрипти не зможуть прочитати куку в браузері)
    secure: false,  // false для розробки на http://localhost, щоб кука зберігалась і на звичайному зʼєднанні http:// 
    maxAge: 24 * 60 * 60 * 1000, // термін дії куки (24 години)
    sameSite: "lax", // захист від CSRF-атак (запобіжник переходу на сайт з іншого потенційного шкідливого сайту)
  },
});