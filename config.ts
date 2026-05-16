import merge from "lodash/merge"; // функція для обʼєднання обʼєктів (базова конфігурія + локальні налаштування)
import { Logger } from "./Server/logger"; // кастомний логер для відображення помилок або дебагінгу config.local

// браузер завантажує html/css/js (client-side), створюючи спеціальні api (document, window, localStorage)
// браузер створює document, який представляє dom, html-дерево, елементи сторінки, якщо document = undefined, то робота - всередині сервера
// запобіжник від client-side роботи з config, де документ існує лише в браузері (React), а не на сервері (Next API, Node.js)
// у разі імпорту config.js Next.js відправить код браузеру, той спробує виконати код require, process.env.DB_PASS, отримає доступ до SSR речей
// така поведінка може спричинити витік секретів або runtime error через доступ до даних за допомогою DevTools
if (typeof document !== "undefined") {
  throw new Error(
    "Do not import config.js from inside the client-side code. !!!!!!"
  );
}

// .env - локальний файл кожного розробника, який не пушиться в git, 
// config.ts має спільний код для команди (з даними від кожного розробника), виконує типізацію рядків і перевірку на null
// такий підхід допомагає обʼєднати зусилля розробників, кожний з яких має своє середовище
const isDev = process.env.ENVIRONMENT !== "prod"; // визначення середовища, чи це dev, чи це prod
// у dev локальні змінні, БД, налаштування, потрібні debug logs
// у prod немає локальних overrides, все повинно працювати стабільно і бути передбачуваним (без тестових даних, config.local, debug logs)

const prodConfig = { // централізований обʼєкт конфігурації застосунку на основі env variables для імпорту даних до серверних файлів налаштування (sequelize)
  dev: isDev, // прапор для логіки
  baseUrl: process.env.BASE_URL,
  apiUrl: process.env.API_STRING,
  database: process.env.DB_NAME!, // ! означає що є впевненість, що значення НЕ undefined 
  username: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  host: process.env.DB_HOST!,
  dialect: "mysql",
  port: Number(process.env.DB_PORT),
};

// блок перевизначення конфігурації на основі config.local, оскільки одного env може бути недостатньо, бо там дані - текст
// config.local - файл/шар, який може містити js код для визначення логіки, умов, функцій, обчислених значень 
let localConfig = {};

if (isDev) { // local overrides дозволені лише у development середовищі
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    localConfig = require("./config.local"); // спроба підключити файл ( dynamic require використовується тому, що файл може бути відсутнім)
  } catch (ex) {
    Logger.error(ex);
    Logger.error("config.local does not exist.");
  }
}

// обʼєднання основної конфігурації + локальної, що є "коректором" шарів змін для створення обʼєкту з усіма побажаннями
// local overrides мають пріоритет над base config
export default merge({}, prodConfig, localConfig ?? {}); // створення нової моделі (а не зміна в prodConfig), тому {}