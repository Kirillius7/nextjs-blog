import { validate } from "../ajv/validate";
import { USE } from "./USE";

const validateDecorator = // фабрікатор декораторів
  (target: "body" | "query" | "params") => // приймає цільову область HTTP-запиту, яку треба валідувати
  //(target: "body" | "query") =>
  (schema: object, ...schemas: object[]) => // приймає JSON-схеми для валідації
    USE(validate([schema, ...schemas], target)); // виклик функції validate з поверненням middleware, яка обгортається в use (ланцюжок виконання)

export const Query = validateDecorator("query");
export const Body = validateDecorator("body");
export const Params = validateDecorator("params");


/*

КРОК 1: компіляція програми
--
перехід до файлу validateDecorator, створення експортних змінних Body, Query, Params
асигнування до змінних коду (target: "body" | "query" | "params") => (schema: object, ...schemas: object[]) => USE(validate([schema, ...schemas], target));
--
перехід до файлу validate, перетворення json схеми на готову JavaScript-функцію валідації з closure для кожного декоратора метода контролера
повернення метода return (req: any, res: any, next: any) в USE -> USE прикріпляє в метадані всі декоратори метода для виконання, щоб потім запустити їх перед викликом метода
більше файли validate, validateDecorator тощо вже ніде не фігурують, вони виконали свою логіку і передали метод (req: any, res: any, next: any)
цей метод декоратор use прикріпив до метода контролера для виклику middleware pipeline перед викликом метода контролера

КРОК 2: виклик метода від користувача
оскільки всі декоратори прикріплені USE до метода контролера, до виклику метода на основі Reflect.getMetadata відбувається виклик декораторів
(req: any, res: any, next: any) з передачею даних http-обʼєкта запиту та closure (даних, які були додані під час компіляції) відбуваються зазначені в методі операції
ajv перевіряє введені дані (json) із зазначеною schema - якщо пройшли валідацію -> next, інакше - зупинка


порядок виконання на етапі виклику метода користувачем
const executionQueue = [ 
  function_1_query_validation(req, res, next),   // анонімна функція з validate.ts (#1)
  function_2_params_validation(req, res, next),  // анонімна функція з validate.ts (#2)
  function_3_getUserList(reqData)                // метод бізнес-логіки
];

*/
