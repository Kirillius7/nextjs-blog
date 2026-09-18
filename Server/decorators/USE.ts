import "reflect-metadata";

export type Middleware = (req: any, res: any, next: (err?: any) => any) => any; // типізація-визначення Middleware
// next може приймати помилку, якщо на якомусь pipe етапі вона виникне, то middleware викличе повідомлення

// під час запуску програми перехід до use (з блоком middleware), перехід і виклик return (куди nextjs записує параметри)
// перейшовши до return, програма опрацьовує логічний блок, реєструючи в метаданих блок middleware - саме його користувач викличе під час http-запиту
export const USE = (...middlewaresToRegister: (Middleware|any)[]) => { // константа функції, яка приймає параметри 
  return (target: any, propertyKey?: string) => { // внутрішня функція-декоратор, що викликається js і приймає target (клас чи метод) і propertyKey (назва методу)
    // рушій js самостійно визначає, де записаний декоратор use і тим самим записує target та propertyKey

    // Якщо propertyKey є — це метод. МетаданіTarget асигнуються на target (прототип класу).
    // Якщо propertyKey undefined — це клас, target у цьому випадку це конструктор класу, тому метаданіKey асигнуються на target.prototype (теж прототип класу).
    const metadataTarget = propertyKey ? target : target.prototype;
    const metadataKey = propertyKey ?? ""; // для класу ключ порожній рядок

    // Робота з метаданими під назвою middlewares, з визначенням чи є записи, чи ні (тоді з [])
    let middlewares: Middleware[] =
      Reflect.getMetadata(
        "middlewares", // "папка-розділення між декораторами та middlewares"
        metadataTarget, // прототип класу - головний параметр, що визначає які є декоратори чи middlewares
        metadataKey // назва методу (за наявності), до неї асигнується масив middlewares
      ) ?? [];

    middlewares = middlewares.concat(middlewaresToRegister);

    // Запис оновленого масиву в метадані
    Reflect.defineMetadata(
      "middlewares",
      middlewares,
      metadataTarget,
      metadataKey
    );
  };
};