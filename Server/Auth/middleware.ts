/* eslint-disable @typescript-eslint/no-explicit-any */
import { promisify } from "util"; // перетворення callbacks на promises (req.login(), req.logout())
import { UnauthorizedError } from "../Exceptions";
import passport, { passportLocalLogin } from "./passport"; // менеджер авторизації користувача (req.login(), reqlogout())
import {
  customSession,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_PATH,
} from "./redis";
// ========================================== //
//    Допоміжні обгортки для Middleware      //
// ========================================== //

export class AuthError extends Error {
  public status: number;
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "AuthError";
    this.status = 401; // Світ розуміє 401 як помилку авторизації
  }
}

export type Middleware<R = any> = (
  req: any,
  res: any,
  next: () => Promise<R>
) => Promise<R>;

export const middlewaresArrayWrapper: (mds: Middleware[]) => Middleware = (mds) => async (req, res, next) => {
  for (const md of mds) {
    let success = false;
    await md(req, res, async () => {
      success = true;
    });
    if (!success) {
      throw new Error("Middleware ended without calling next() or throwing error!");
    }
  }
  return await next();
}

// метод приймає Express middleware ((req, res, next) => { ... }, bodyParser.json() тощо) та name для логів
// і повертає Middleware (next-connect підхід). Метод реєструє callback, який потім буде викликаний 
function wrapExpressMiddleware(mw: any, name?: string): Middleware { // адаптер для роботи через await (замість старих callbacks)
  return async (req: any, res: any, next: () => Promise<any>) => {
    if (name) console.debug(`Middleware: ${name}`);
    // асинхронний блок, який чекає на виконання методу (customSession, passport.initialize()/session()) перед зміною стану і переходу до іншого методу middleware
    // якщо б блок був без Promise, то після початку виконання mw(req,res), був би виклик return await next() (race condition)
    await new Promise<void>((resolve, reject) => { // створення проміс вручну для зупинки на await (await - прапорець на невиконання наступного рядка, поки цей не є готовим)
      try {
        console.log("Executing MW:", mw.name || "anonymous");
        console.log("req is defined?", !!req, "req.url:", req?.url);
        mw(req, res, (err?: any) => { // виклик старого Express-middleware з передачею параметрів, () => {...} - callback, який є показником, що middleware закінчив роботу
          if (err) reject(err);
          else resolve(); // у разі успішного виконання - проміс виконується (зміна pending на resolve)
        });
      } catch (err) {
        reject(err);
      }
    });
    return await next(); // return запобігає поверненню Promise<void> або відсутність результата останнього middleware
  };
}

// ========================================== //
//             Логування та Налагодження      //
// ========================================== //

// виведення даних в кінці конвейера
export async function logSessionMw(req: any, res: any, next: () => Promise<any>) {
  console.debug("req.session:", req.session);
  console.debug("req.user:", req.user);
  return await next(); // очікування проходження по всьому pipeline для того, щоб повернути результат (запит: a -> b -> c; a <- b <- c: відповідь)
}

export function getLogMessageMiddleware(message: string = "-----> logs from middleware") {
  return async (req: any, res: any, next: any) => { // factory function (створення middleware)
    console.debug(message);
    return await next();
  };
}

export function logMiddlewares(mds: Middleware | Middleware[], label?: string) {
  const middlewares = Array.isArray(mds) ? mds : [mds];
  return [
    getLogMessageMiddleware(`Start ${label || "auth"} middlewares`),
    ...middlewares,
    getLogMessageMiddleware(`End ${label || "auth"} middlewares`),
    logSessionMw,
  ];
}

// ========================================== //
//                 Логіка авторизації         //
// ========================================== //

/**
 * Очищення сесії + вихід (logout) та видалення куки.
 */
async function logoutMiddleware(req: any, res: any, next: () => Promise<any>) { // функція з описом подій під час виходу користувача із системи
  console.debug("Logout middleware");
  
  if (typeof req.logout === "function") { // процес для стирання даних користувача з поточного запиту в памʼяті nodejs
    try {
      const logoutAsync = promisify(req.logout).bind(req);
      await logoutAsync();
    } catch (err) {
      console.warn("logout error:", err);
    }
  } else {
    try {
      delete req.user;
    } catch {}
  }

  if (req.session) { // процес видалення ключа сесії з redis 
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err?: any) => (err ? reject(err) : resolve()));
    }).catch((err) => {
      console.warn("session.destroy error:", err);
    });
  }

  if (typeof (res as any).clearCookie === "function") { // видалення даних куку sid в браузері 
    (res as any).clearCookie(SESSION_COOKIE_NAME, {
      path: SESSION_COOKIE_PATH,
      httpOnly: true,
      sameSite: "lax",
    });
  } else {
    res.setHeader(
      "Set-Cookie",
      `${SESSION_COOKIE_NAME}=; Path=${SESSION_COOKIE_PATH}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`
    );
  }

  req.user = undefined;
  return await next();
}

// перевірка автентифікації користувача через попередні middleware (сесія + паспорт) 
export async function authGuardMw(req: any, res: any, next: (err?: any) => Promise<any>) { // сучасний асинхронний метод
  //console.debug("Auth Guard middleware");
  console.log("Auth Guard middleware");
  if (!req.user) {
    //return await next(new AuthError()); // Якщо немає req.user, кидаємо помилку доступу
    return await next(new UnauthorizedError());
  }
  return await next();
}

// ========================================== //
//          Експорт готових ланцюжків         //
// ========================================== //

// стандартні Express middlewares загорнуті в асинхронні обгортки
// customSession (express -> callback -> next()), wrapExpressMiddleware (express -> promise -> await)
export const sessionMw = wrapExpressMiddleware(customSession, "session"); // пошук сесії з redis
const passportInitWrappedMw = wrapExpressMiddleware(passport.initialize(), "passport init"); // увімкнення паспорта
const passportSessionWrappedMw = wrapExpressMiddleware(passport.session(), "passport session"); // десеріалізація користувача
const passportLocalAuthWrappedMw = wrapExpressMiddleware(passportLocalLogin, "passport local auth"); // 4 крок проходження по middlewares

// розпізнавання користувача на сторінках сайту, якщо користувач не автентифікований, то перегляд анонімний (якщо є дані в системі - автентифікація)
export const sessionUserMiddlewares = [
  sessionMw, //  == return async (req: any, res: any, next: () => Promise<any>) з customSession всередині як middleware
  passportInitWrappedMw,
  passportSessionWrappedMw,
];
export const sessionUserMiddleware = middlewaresArrayWrapper(sessionUserMiddlewares);

// процес розпізнавання під час процесу входу в систему (логін), спочатку створення сесії, потім перевірка даних
export const doAuthMiddlewares = logMiddlewares(
  [...sessionUserMiddlewares, passportLocalAuthWrappedMw],
  "login"
);

// процес виходу користувача з системи, з виходом з сесії redis, стираючи дані
export const doLogoutMiddlewares = logMiddlewares(
  [...sessionUserMiddlewares, logoutMiddleware],
  "logout"
);

// підхід для захисту приватних роутів (використовується в приватних ендпоінтах)
export const authGuardMiddlewares = logMiddlewares(
  [...sessionUserMiddlewares, authGuardMw],
  "guard"
);