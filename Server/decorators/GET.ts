import 'reflect-metadata';
/*
export interface RouteOptions{
  allow?: Record<string, string[]>;
  [key: string]: any;
}*/
//export default function GET(routeName: string = '*', options?: RouteOptions) { // під час startup-app першого запуску


export default function GET(routeName: string = '*'){
  return (target: object, propertyKey: string) => {
    let properties: any = Reflect.getMetadata(routeName, target);

     
    if (Array.isArray(properties?.GET)) { // робота вже з існуючим масивом, тому defineMetadata не всередині блоку кода
      properties.GET.push(propertyKey);
    } else {
      properties = {
        ...properties,
        GET: [propertyKey]
       // GET: [actionData]
      };

      Reflect.defineMetadata(routeName, properties, target); // оскільки GET масив лише треба створити - цей рядок є частиною коду
    }
  };
}


/*
import { GRANT, ROLE } from '../../acl/types'; // Твої типи

// Тип для конфігу декоратора
interface IRouteOptions {
  allow?: Partial<Record<ROLE, GRANT[]>>;
  deny?: Partial<Record<ROLE, GRANT[]>>;
}

export default function GET(routeName: string = '*', options?: IRouteOptions) {
  return (target: object, propertyKey: string) => {
    // Отримуємо поточні метадані для target
    let properties: any = Reflect.getMetadata(routeName, target) || {};

    // Формуємо об'єкт із даними про поточний Action/метод
    const actionData = {
      methodName: propertyKey,
      ...(options?.allow && { allow: options.allow }),
      ...(options?.deny && { deny: options.deny }),
    };

    if (Array.isArray(properties.GET)) {
      properties.GET.push(actionData);
    } else {
      properties = {
        ...properties,
        GET: [actionData],
      };
    }

    // Записуємо метадані назад
    Reflect.defineMetadata(routeName, properties, target);
  };
}*/