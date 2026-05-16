if (typeof document !== "undefined") {
  throw new Error("config.local.ts can only be used on server-side");
}

// локальні перевизначення конфігурації (override layer)
// тут визначаються лише ті зміни, які потрібні цьому розробнику

const localConfig = {
  port: 3307, // інший порт для локальної БД

  database: "dev_database", // інша база даних для розробки

  // перемикач функцій у застосунку (відображення логів, debug info, тестові панелі) у режимі dev
  features: {
    debugMode: true,
  },
};

export default localConfig;