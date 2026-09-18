import "reflect-metadata";

export default function Body(schema: { required: string[]; properties?: any; type?: string }) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // 1. Створюємо функцію-middleware, яка перевірятиме дані
    const validationMiddleware = (actionProps: any, next: (err?: any) => void) => {
      const { body } = actionProps;

      // Перевіряємо кожне обов'язкове поле із програми ментора
      for (const field of schema.required) {
        if (!body || body[field] === undefined || body[field] === null || body[field] === "") {
          return next(new Error(`Field "${field}" is required`));
        }
      }

      // Якщо перевірка пройшла успішно, рухаємося далі
      next();
    };

    // 2. Дістаємо поточний масив middlewares для цього методу або створюємо новий
    const existingMiddlewares = Reflect.getMetadata("middlewares", target, propertyKey) || [];

    // 3. Записуємо наш валідатор у початок масиву
    existingMiddlewares.unshift(validationMiddleware);

    // 4. Зберігаємо оновлений масив назад у метадані методу
    Reflect.defineMetadata("middlewares", existingMiddlewares, target, propertyKey);
  };
}