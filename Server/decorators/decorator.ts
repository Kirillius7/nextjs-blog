/* import {GRANT, IAllowDeny, IGrants} from "@/acl/types";
import {validate} from "@/Server/ajv/validate";
import {MethodHandler, Middleware} from "./types"
import "reflect-metadata";
import {rules} from "@/config.acl";
import BaseController from "@/Server/Controllers/BaseController";
import BaseContext from "../DI/BaseContext";
import IContextContainer from "../DI/Interfaces/IContextContainer";
type ActionDecorator = (route: string, allow?: IAllowDeny) => MethodDecorator;
const {getMetadata, defineMetadata} = Reflect;

type ActionDecoratorFactory = (
  method: "get" | "post" // 
) => ActionDecorator;

const endpointDecorator: ActionDecoratorFactory =
(method) => (route, pRules) => (target, propertyKey) => {
const endpoints: MethodHandler[] = Reflect.getMetadata(route, target) ?? [];
endpoints.push({ method, handler: propertyKey as string });
Reflect.defineMetadata(route, endpoints, target);

const endpoints2: Record<string, Record<string, string>> = Reflect.getMetadata('endpoints', target) ?? {};
if (!endpoints2[route]) endpoints2[route] = {};
endpoints2[route][method] = propertyKey as string;
Reflect.defineMetadata('endpoints', endpoints2, target);

if (pRules) {
const reg = /\[([a-zA-Z0-9_-]+)\]/g;
const routePattern = route.replace(reg, "*");
pRules = addMethodToRouteRules(pRules, GRANT.GET);
rules[routePattern] = mergeRules(pRules, rules[routePattern]);
}
const routes: [string, string][] = BaseController.getRoutes();
if (!routes.find(rc => rc[0] === route && rc[1] === target.constructor.name))
routes.push([route, target.constructor.name])
Reflect.defineMetadata('routes', routes, BaseController);
};

export const GET = endpointDecorator("get");
export const POST = endpointDecorator("post");
//export const PUT = endpointDecorator("put");
//export const DELETE = endpointDecorator("delete")

function addMethodToRouteRules(routeRules: IAllowDeny, method: GRANT) {
  if (routeRules.allow) {
    routeRules.allow = Object.entries(routeRules.allow).reduce(
      (acc, [key, value]) => {
        acc[key] = [...value, method];
        return acc;
      },
      {} as IGrants
    );
  }
  if (routeRules.deny) {
    routeRules.deny = Object.entries(routeRules.deny).reduce(
      (acc, [key, value]) => {
        acc[key] = [...value, method];
        return acc;
      },
      {} as IGrants
    );
  }
  return routeRules;
}

function mergeRules(
  a: IAllowDeny = { allow: {} },
  b: IAllowDeny = { allow: {} }
): IAllowDeny {
  return {
    allow: mergeGrants(a.allow, b.allow),
    deny: a.deny || b.deny ? mergeGrants(a.deny, b.deny) : undefined,
  };
}

function mergeGrants(a: IGrants = {}, b: IGrants = {}) {
  const result: IGrants = {};

  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

  for (const key of keys) {
    const valuesA = a[key] ?? [];
    const valuesB = b[key] ?? [];
    // Merge and remove duplicates
    result[key] = Array.from(new Set([...valuesA, ...valuesB]));
  }
  return result;
} */


// реєстрація метаданих роутингу, звʼязок маршрутів з acl правилами, реєстрація роута до контролера 
import {
    GRANT,
    IAllowDeny,
    IGrants // структура дозволів для кожної ролі, де ключ - роль, а значення - масив дозволів
} from "@/acl/types";

import "reflect-metadata";

import { rules } from "@/config.acl";
import BaseController from "@/Server/Controllers/BaseController";

// опис структури обробника
export interface MethodHandler { // третій крок - передача target (прототип контролера) та propertyKey (назву методу класу, наприклад "getAll")
    method: "get" | "post";
    handler: string;
    rules?: IAllowDeny;
}

type ActionDecorator = // другий крок у налаштуванні - передача шляху та правил доступу, повертає MethodDecorator
    (route: string, allow?: IAllowDeny) => MethodDecorator;


type ActionDecoratorFactory = 
    (method: "get" | "post") => ActionDecorator;


const endpointDecorator: ActionDecoratorFactory = // 
    (method) => (route, pRules) => (target, propertyKey) => {

        // запис метаданих для виклику методу: шлях, прототип класу, цей підхід створює масив за ключем route методи певного target

        // зчитування існуючих метаданих для даного маршруту (route) з прототипу класу (target)
        const endpoints: MethodHandler[] =
            Reflect.getMetadata(route, target) ?? [];

        // додавання нового обʼєкта з методом та назвою обробника (propertyKey) до масиву endpoints
        endpoints.push({
            method,
            handler: propertyKey as string
        });

        // перезапис оновленого масиву endpoints (кожен http метод і handler є окремим обʼєктом) у метадані для даного маршруту (route) з прототипу класу (target)
        Reflect.defineMetadata(
            route,
            endpoints,
            target
        );

        // створення загальної карти endpoints, де зазначено шляхи та http-методи
        const endpoints2:
            Record<string, Record<string, string>> = // структура: { [route]: { [method]: handlerName } }
            Reflect.getMetadata("endpoints", target) ?? {};

        if (!endpoints2[route]) { // якщо структура endpoints2 не має ключа для даного маршруту (route), створюється порожній обʼєкт для цього маршруту
            endpoints2[route] = {};
        }

        endpoints2[route][method] = // Запис назви методу класу за відповідним HTTP-методом: endpoints2["/artists"]["get"] = "getArtistsList"
            propertyKey as string;

        Reflect.defineMetadata( // збереження оновленої структури endpoints2 у метадані
            "endpoints",
            endpoints2,
            target
        );


        // ==========================================
        // 3. ACL
        // ==========================================

        if (pRules) { // якщо передані правила доступу (pRules) з http-методом, то вони обробляються для даного маршруту

            const reg = /\[([a-zA-Z0-9_-]+)\]/g; // пошук параметрів у квадратних дужках (як от для id => /api/users/[id] ) у маршруті

            const routePattern =
                route.replace(reg, "*"); // правило заміни /api/users/15 на /api/users/* (робота wildcard)
            
            pRules = addMethodToRouteRules(pRules, method.toUpperCase() as GRANT) // додавання http-методу до правил доступу (pRules) для даного маршруту

            rules[routePattern] = // обʼєднання нового, створеного та доданого правила до вже існуючих за певною адресою 
                mergeRules(
                    pRules,
                    rules[routePattern]
                );
        }


        // ==========================================
        // 4. Реєстрація route → controller
        // ==========================================

        const routes: [string, string][] = // отримання поточного списку зареєстрованих маршрутів та контролерів ([ ["/artists", "ArtistController"], ["/users", "UserController"] ])
            BaseController.getRoutes();

        if (
            !routes.find( // перевірка, чи вже існує запис для даного маршруту та контролера, щоб уникнути дублювання (@GET("/artists") і @POST("/artists") - в цьому разі спрацює лише 1 раз)
                ([registeredRoute, controllerName]) =>
                    registeredRoute === route &&
                    controllerName === target.constructor.name
            )
        ) {
            routes.push([// додавання нового запису до масиву маршрутів та контролерів ([route, target.constructor.name])
                route,
                target.constructor.name
            ]);
        }

        Reflect.defineMetadata( // збереження оновленого масиву маршрутів та контролерів у метадані класу BaseController
            "routes",
            routes,
            BaseController
        );
    };

// створення сигнатури http запиту, перший крок у записі ендпоінта з поверненням ActionDecorator

export const GET = endpointDecorator("get"); 

export const POST = endpointDecorator("post");


// ==========================================
// method → ACL grant
// ==========================================

/*
function getGrant(
    method: "get" | "post"
): GRANT {

    switch (method) {

        case "get":
            return GRANT.GET;

        case "post":
            return GRANT.POST;
    }
}*/


// ==========================================
// Додавання HTTP grant до ACL
// ==========================================

function addMethodToRouteRules( // додавання HTTP-методу до правил доступу (ACL) для певного маршруту
    // якщо додано http-метод до action controller  
    routeRules: IAllowDeny,
    method: GRANT
) {

    if (routeRules.allow) { // перевірка секції в обʼєкті правил

        routeRules.allow =
            Object.entries(routeRules.allow) // розбиття обʼєкта на масив пар [ключ, значення] для подальшої обробки
                .reduce(
                    (acc, [key, value]) => { 
                        // акумулятор (acc) - це обʼєкт, який формується на основі попередніх значень, key - роль користувача, value - масив дозволів для цієї ролі

                        acc[key] = [ // додавання до масиву дозволів для даної ролі (key) нового HTTP-методу (method)
                            ...value,
                            method
                        ];

                        return acc;
                    },
                    {} as IGrants
                );
    }


    if (routeRules.deny) {

        routeRules.deny =
            Object.entries(routeRules.deny)
                .reduce(
                    (acc, [key, value]) => {

                        acc[key] = [
                            ...value,
                            method
                        ];

                        return acc;
                    },
                    {} as IGrants
                );
    }

    return routeRules;
}


// ==========================================
// Merge ACL
// ==========================================

function mergeRules(
    a: IAllowDeny = { allow: {} },
    b: IAllowDeny = { allow: {} }
): IAllowDeny {

    return {

        allow: mergeGrants( // обʼєднання дозволів для ролей з обʼєктів
            a.allow,
            b.allow
        ),

        deny: // обʼєднання заборон для ролей з обʼєктів, якщо вони існують (нові правила або існуючі правила)
            a.deny || b.deny
                ? mergeGrants(
                    a.deny,
                    b.deny
                )
                : undefined
    };
}


function mergeGrants(
    a: IGrants = {},
    b: IGrants = {}
) {

    const result: IGrants = {};

    const keys = // створення множини ключів (ролей) з обʼєктів a та b, щоб уникнути дублювання (завдяки Set)
        new Set([
            ...Object.keys(a),
            ...Object.keys(b)
        ]);


    for (const key of keys) { // ітерація по кожному ключу (ролі) з обʼєктів a та b

        // створення 2 масивів дозволів для ролі (key), 1 - з нових правил (a), 2 - з існуючих правил (b)
        const valuesA = 
            a[key] ?? [];

        const valuesB =
            b[key] ?? [];

        result[key] = // обʼєднання двох масивів дозволів для ролі (key) та видалення дублікатів за допомогою Set
            Array.from(
                new Set([
                    ...valuesA,
                    ...valuesB
                ])
            );
    }

    return result;
}