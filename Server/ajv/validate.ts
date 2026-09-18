import Ajv from "ajv";
import type { Middleware } from "../Auth/middleware";
// console.log('container imported inside ajv/validate');
import { ValidateError } from "@/Server/Exceptions";
import addFormats from "ajv-formats";
import parseUrl from "parseurl"; // або стандартний require('url').parse
import querystring from "querystring";
import { AnswerType } from "../Exceptions";
const ajv = new Ajv({coerceTypes: true, allErrors: true});
addFormats(ajv);
/*
export function validate(
  schema: object | object[],
  target: "body" | "query" | "params"
): Middleware {
  return (req, res, next) => {
    if (process.env.NODE_ENV !== 'production')
      console.log(JSON.stringify({"schema": schema, "value": req[target]}, null, 2));

    const schemas = Array.isArray(schema) ? schema : [schema];
    let valid = false;
    schemas.forEach(s => {
      const validate = ajv.compile(s);
      if(validate(req[target])) valid = true;
    })
    if (!valid) {
      throw new ValidateError()
    };
    return next();
  };
}*/


/*
export function validate(
  schema: object | object[],
  target: "body" | "query" | "params"
): Middleware {
  // 🚀 Скомпілюємо схеми 1 раз при старті, а не при кожному HTTP-запиті
  const schemas = Array.isArray(schema) ? schema : [schema];
  const compiledValidators = schemas.map((s) => ajv.compile(s));

  return (req: any, res: any, next: any) => {
    let dataToValidate = req[target];

    // FIX для Next.js: якщо перевіряємо query, потрібно відфільтрувати роут-параметри,
    // які Next.js автоматично закидає в req.query.
    if (target === "query" && req.query) {
      const paramsKeys = Object.keys(req.params || {});
      dataToValidate = { ...req.query };
      
      // Видаляємо з query всі ключі, які насправді є URL-параметрами (params)
      paramsKeys.forEach((key) => {
        delete dataToValidate[key];
      });
    }

    // Якщо перевіряємо params, але req.params порожній/відсутній, 
    // беремо дані з req.query (бо Next.js кладе [userid] саме в req.query)
    if (target === "params" && (!req.params || Object.keys(req.params).length === 0)) {
      dataToValidate = req.query || {};
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`[AJV Validation - ${target}]:`, JSON.stringify({ schema, value: dataToValidate }, null, 2));
    }

    // Перевіряємо, чи підходить хоча б під одну зі схем
    const isValid = compiledValidators.some((validator) => validator(dataToValidate));

    if (!isValid) {
      throw new ValidateError();
    }

    return next();
  };
}*/

// на етапі компіляції створення валідатора для перевірки вказаної schema
export function validate( // фабрика middleware (створює і повертає іншу функцію middleware). Отримує схему і target - повертає handler запиту
  schema: object | object[], // json-схеми (обʼєкти) для подальшої валідації 
  target: "body" | "query" | "params"
  //target: "body" | "query"
): Middleware {
  const schemas = Array.isArray(schema) ? schema : [schema]; // ajv працює зі схемами по одній, приведення до формату масиву
  const compiledValidators = schemas.map((s) => ajv.compile(s)); 
  // json-схема перетворюється на готову JavaScript-функцію валідації, closure допомагає зберегти функції-валідатори
  // на кожний таргет створюється окремий validate -> use для формування validate + closure

  return (req: any, res: any, next: any) => {
    let dataToValidate: any = {};

    if (target === "query") {
      if (req.query) { // перевірка типу запиту (якщо це api, то вбудовані парсери вже мають структуру req.query)
        dataToValidate = { ...req.query }; // поверхнева копія для мутування даних ("10" в 10)
      } else if (req.url) { // якщо це ssr запит, то req.query може ще не існувати (сирий Node.js IncomingMessage)
        const parsedUrl = parseUrl(req); // зчитування запиту (/tickets?category=tech&page=2) і розбиття на частини
        dataToValidate = querystring.parse(parsedUrl?.query || ""); // { category: 'tech', page: '2' }
      }

      // Видалення роут-параметрів (req.params з об'єкта query-валідних даних), у разі випадкового потрапляння в query, тим самим створюючи обʼєкт зі справжніми url query-параметрами
      if (req.params) {
        Object.keys(req.params).forEach((key) => {
          delete dataToValidate[key];
        });
      }
    } else if (target === "params") {
      dataToValidate = req.params || req.query || {};
    } else {
      dataToValidate = req.body || {};
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`[SSR/API AJV Validation - ${target}]:`, JSON.stringify(dataToValidate, null, 2));
    }
    /*
    const isValid = compiledValidators.some((validator) => validator(dataToValidate)); // перевірка валідності даних на основі хоч 1 вказаної schema (які підготували під час compiledValidators)

    if (!isValid) {
      throw new ValidateError();
    }
    */

    let isValid = false;
    const ajvErrors: any[] = [];

    for (const validator of compiledValidators) { // прохід ітераційно по схемам (найчастіше прохід 1)
      const valid = validator(dataToValidate); // порівняння введених даних зі схемою
      if (valid) {
        isValid = true;
        break; // якщо хоч 1 схема підходить для проходження - ітерації завершуються
      } else if (validator.errors) { // у разі помилки під час валідації схем - перехід до запису помилок ajv
        ajvErrors.push(...validator.errors);
      }
    }

    if (!isValid) {
      // передача зібрані деталі в ValidateError
      throw new ValidateError(
        "The request contains invalid or incomplete data",
        {
          details: ajvErrors,
          answer: AnswerType.Log
        }
      );
    }


    // використання типізації middleware з promise не так важливе, це стандартизація, цей код виконується синхронно і міг би працювати з void у якості return
    return next(); // повертає undefined для проходження по pipeline middlewares, щоб запустити новий middlewares і так дійти до кінцевого статусу головного Promise (resolve/reject)
  };
}

/*
export function validate(
  schema: object | object[],
  target: "body" | "query" | "params"
): Middleware {
  const schemas = Array.isArray(schema) ? schema : [schema];
  const compiledValidators = schemas.map((s) => ajv.compile(s));

  return (req: any, res: any, next: any) => {
    let dataToValidate: any = {};

    // 1. Отримуємо params з req.params АБО з req.query (бо Next.js кладе [userid] у req.query)
    const routeParams = req.params || {};
    if (req.query && Object.keys(routeParams).length === 0) {
      // Якщо в req.params порожньо, спробуємо витягти відомі роут-параметри з req.query
      if (req.query.userid) {
        routeParams.userid = req.query.userid;
      }
    }

    if (target === "params") {
      dataToValidate = routeParams;
    } 
    else if (target === "query") {
      // Для QUERY створюємо копію req.query, але ВИДАЛЯЄМО звідти URL-параметри (наприклад, userid)
      dataToValidate = { ...(req.query || {}) };
      
      // Видаляємо всі ключі, які є в params, щоб @Query з additionalProperties: false не падав
      Object.keys(routeParams).forEach((paramKey) => {
        delete dataToValidate[paramKey];
      });
    } 
    else if (target === "body") {
      dataToValidate = req.body || {};
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`[AJV Validation - ${target}]:`, JSON.stringify(dataToValidate, null, 2));
    }

    // Перевірка
    const isValid = compiledValidators.some((validator) => validator(dataToValidate));

    if (!isValid) {
      console.error(`[AJV Error in ${target}]: Validation failed for`, dataToValidate);
      throw new ValidateError();
    }

    return next();
  };
}*/