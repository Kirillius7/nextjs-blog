import container from "../../Server/DI/container";
/*export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end(); 

  try {
    // використання прототипа класу AuthController, використовуючи container
    const authController = container.resolve("authController");
    const prototype = Object.getPrototypeOf(authController);

    // доступ до метаданих прототипу класу
    const regMiddlewares = Reflect.getMetadata("middlewares", prototype, "register") || [];
    
    // робота з валідацією @body методу реєстрації
    const bodyValidator = regMiddlewares[0];

    const actionProps = { body: req.body, query: req.query, headers: req.headers, req, res };

    if (bodyValidator) {
      await new Promise((resolve, reject) => {
        bodyValidator(actionProps, (err) => {
          if (err) return reject(err); // якщо в тілі немає email чи password, то виникає виклик помилки
          resolve();
        });
      });
    }

    // якщо валідація успішна — виклик методу реєстрації в контролері
    const result = await authController.register(actionProps);
    return res.status(200).json(result);

  } catch (error) {
    console.error("Register validation/execution error:", error);
    return res.status(400).json({ message: error.message || "Validation failed" });
  }
}*/


export default container.resolve("authController").handler();