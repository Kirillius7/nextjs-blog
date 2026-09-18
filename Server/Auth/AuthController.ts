import { Body } from "../decorators/validateDecorator";
/*import GET from "Server/decorators/GET";
import POST from "Server/decorators/POST";*/
import { USE } from "Server/decorators/USE";
import { GET, POST } from "../decorators/decorator";

import {
  //authGuardMiddlewares,
  doAuthMiddlewares,
  doLogoutMiddlewares,
  sessionUserMiddlewares,
} from "../Auth/middleware";
import BaseController from "../Controllers/BaseController";
//import { type ActionProps } from "../types";
// Описуємо структуру параметрів, які твій роутер передає в методи контролера
export interface ActionProps {
  body?: any;    // Для отримання полів при реєстрації: body.email, body.password
  user?: any;    // Для Passport: щоб дістати авторизованого юзера { user }
  query?: any;   // На випадок, якщо знадобляться GET-параметри
  params?: any;  // На випадок параметрів у шляху (наприклад, :id)
  req?: any;     // Оригінальний запит Express
  res?: any;     // Оригінальна відповідь Express
}

@USE(...sessionUserMiddlewares)
export class AuthController extends BaseController {

  // вхід в аккаунт, використовуючи ланцюжок middleware (Redis -> Passport -> LocalStrategy)
  @POST("/api/login")
  @USE(...doAuthMiddlewares)
  @Body({
    type: "object",
    properties: {
      email: { 
        type: "string", 
        //format: "email", 
        minLength: 5, 
        maxLength: 24
    },
      password: { 
        type: "string", 
        minLength: 8, 
        maxLength: 24 
      },
    },
    required: ["email", "password"],
    additionalProperties: false
    
  })

  public async login({ user }: ActionProps) {
    console.log("sweet escape", user)
    if (!user) {
      throw new Error("Невірний логін або пароль");
    }
    
    // повернення даних користувача на фронтенд 
    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  }

  @GET('/login')
  public async getLoginPage(props: ActionProps){
    if(props.user)
      return {
        redirect: { destination: '/', permanent: false}
    }

    return {};
  }

  // реєстрація, створення нового користувача у БД через UserService
  @POST("/api/register")
  
  @Body({
    type: "object",
    properties: {
      email: { 
        type: "string",
        format: "email",
        minLength: 10, 
        maxLength: 24,
      },
      password: { 
        type: "string", 
        minLength: 8, 
        maxLength: 24,
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).+$"
      },
      username: { 
        type: "string",
        minLength: 2,
        maxLength: 100,
        pattern: "^[A-Za-z0-9_]+$"
      },
      role: { 
        type: "string",
        enum: ["client", "admin"] 
      },
    },
    required: ["email", "password", "username", "role"],
  })
  public async register({ body }: ActionProps) {
    const { email, password, username, role } = body;

    const newUser = await this.di.UserService.createUser({
      email,
      password, 
      username,
      role,
    });
    console.log(newUser.toJSON());
    console.log(newUser.isNewRecord);
    const user = await this.di.User.findByPk(newUser.id);
    console.log(user);
    return {
      id: newUser.id,
      email: newUser.email,
    };
  }

  @GET('/registration')
  public async getRegistrationPage(props: ActionProps){
    if(props.user)
      return {
        redirect: { destination: '/', permanent: false}
    }

    return {};
  }

  /**
   * 3. ВИХІД З АКАУНТУ (Logout)
   * Знищує сесію в Redis та очищує куку в браузері
   */
  @POST("/api/logout")
  @USE(...doLogoutMiddlewares)
  public async logout() {
    return { success: true };
  }

  /**
   * 4. ПЕРЕВІРКА СТАТУСУ АВТОРИЗАЦІЇ (Me / Session check)
   * Допомагає фронтенду при перезавантаженні сторінки миттєво дізнатися,
   * чи є у користувача активна сесія.
   */
  @GET("/api/auth/me")
  @USE(...sessionUserMiddlewares)
  public async getCurrentUser({ user }: ActionProps) {
    if (!user) {
      return { isAuthenticated: false };
    }
    return {
      isAuthenticated: true,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}