import BaseController from "Server/Controllers/BaseController"; // Вкажи свій точний шлях до BaseController
import container from "Server/DI/container";
//
import ReduxStore from "Server/Store/ReduxStore";
import clientContainer from "../Store/di/containter";
//const reduxStore = new ReduxStore(container.cradle);
const reduxStore = new ReduxStore(clientContainer); // створення обʼєкта ReduxStore
/*
import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import { Session } from "next-auth";
import { GUEST_IDENTITY } from "@/constants";*/
//import { setAuth } from "./auth/authReducer";
//
/*
type ControllerConfig = {
  controller: string;
  route?: string;
};*/

type ControllerConfig = {
    controller: string;
    route?: string;
    redux?: string;
};

/*
export default class Store {
  
  public static getServerSideProps( // внаслідок closure ці дані зберігаються всередині
    //container,
    //route: string,
    //controllerName: string | string[]
    controllerName: string | string[] | ControllerConfig[]
  ) {
    //return async (context) => { 
    return reduxStore.getServerSideProps(
       (store) => async (context) => {
      // на етапі створення сервера callback ініціалізується і асигнується до змінної та файлу
      // коли користувач переходить на сторінку або виконує запит, програма вже знає маршрутизацію і викликає потрібну функцію
      const items = Array.isArray(controllerName) ? controllerName : [controllerName];
      console.log("itmes", items)

      // response як null або пустий об'єкт, для гнучкого визначення його типу
      let response: any = null;
      try{
        // ініціалізація контролеров у якості instances (переважно контролер 1, але можуть бути випадки декількох для 1 сторінки)
        //for (let i = 0; i < items.length; i++) {
        for (const i of items) {
          const controllerName = typeof i === "string" ? i : i.controller;

          const route = typeof i === "string" ? undefined : i.route;
          // поліморфізм для повернення типу instance контролера (специфіка di контейнерів)
          //const controller = container.resolve(items[i]) as BaseController; // створення instance контролера на основі controllerName
          const controller = container.resolve(controllerName) as BaseController; 
          console.log("controller", controller)
          const res = await ( // початок роботи з instance і handler, який є методом батьківського класу, js автоматично ставить this
            controller.handler(route) as (context: any) => Promise<any> // створення і повернення SSR-handler (приймає context та повертає Promise) в BaseController
          )(context); // запуск SSR-handler з context (req,res) -> handler повертає масив даних у вигляді res (res.props.data)
          // оскільки controllers наслідують basecontroller, то виклик відбувається через controller.handler, а система бачить this === контролер instance
          console.log("HANDLER RESPONSE:", res);

          if(res && res.redirect){
            return {
              redirect: res.redirect
            }
          }

          response = {
            ...response,
            ...res
          }
        }

        return {
          props: {
            data: response 
          }
        };
      }
      /*
      catch(error){
        console.log("error such:", error?.message || error)
        console.log("ERROR:", error);
        console.log("ERROR CODE:", error?.code);
        let destination: string;
        switch(error?.code){
          case 400: 
            destination = `/400?message=${encodeURIComponent(error.message)}`
            break;
          case 401: 
            destination = `/401?message=${encodeURIComponent(error.message)}`
            break;
          case 500:
            default:
            destination = `/500?message=${encodeURIComponent(error.message)}`
            break;
        }
        return{
          redirect:{
            //destination: `/500?message=${encodeURIComponent(error.message)}`,
            destination,
            // pathParams - унікальний id конкретного ресурсу, headers - метадані запиту (токени безпеки, конфігурація запиту)
            // query - фільтрація, пошук, передача даних, encodeURIComponent - метод, що забезпечує від помилок виведення тексту помилки
            // текст повідомлення про помилку може мати різні символи (?, &, пробіл, / тощо), метод encodeURIComponent перетворює символи на безпечні соти
            permanent: false
          }
        }
      }*/



      /*
      catch(error){
        return{
          redirect: {
            destination: `/error?code=${error.code ?? 500}&message=${encodeURIComponent
              (error.message ?? "Internal Server Error")}`
          }
        }
         
      }
    
    };
  
  }

}*/

/*
      catch(error){
        return {
          redirect: {
            destination: `/error?code=${error.code ?? 500}&message=${encodeURIComponent(
              error.message ?? "Internal Server Error"
            )}`
          }
        };
      }
    }
  );
  }
}*/

export default class Store {
  
    public static getServerSideProps(
        controllerName: string | string[] | ControllerConfig[]
    ) {

        // тимчасовий серверний екземпляр Redux Store для поточного HTTP-запиту, wrapper (makeStore - функція-фабрика очікує запиту, створюється до запиту, а після - виклик іншого коду з getServerSideProps)
        return reduxStore.getServerSideProps(
            (store) => async (context) => { // (store) -> екземпляр Redux Store на сервері для запиту, (context) -> обʼєкти HTTP-запиту


              /*
              const req = Object.assign(context.req, {
                query: context.query,
                body: {},
                session: null
              });

              req.session = await getServerSession<AuthOptions, Session>(req, context.res);
              const [acl, identity] = req.session
                ? [req.session.acl, req.session.identity]
                : [guestRulesNRoles(ctx.rules,ctx.roles), GUEST_IDENTITY]
                const auth: AuthState | null = {...(acl), identity};
                store.dispatch(setAuth(auth))
              

                const req = Object.assign(context.req, {
                    query: context.query,
                    body: {},
                    
                }) as any;

                console.log("=== GSSP AUTH ===");
                console.log("GSSP req.user:", req.user);

                const identity = req.user ?? null;

                console.log("GSSP identity:", identity);

                store.dispatch(setAuth({
                    identity,
                    roles: {},
                    rules: {},
                }));

                console.log("GSSP AUTH DISPATCHED");
                console.log("Redux auth:", store.getState().auth);
              */
                const items = Array.isArray(controllerName)
                    ? controllerName
                    : [controllerName];

                console.log("items", items);

                let response: any = null;

                try {  
                    for (const i of items) { // цикл-проходження по параметрам (контролери, api-шляхи, redux-шляхи)

                        const config = typeof i === "string" 
                            ? { controller: i } // якщо переданий 1 параметр у вигляді контролера, то створюється обʼєкт з полем контролера
                            : i;

                        const controllerName = config.controller;
                        const route = config.route;

                        const controller = container.resolve(controllerName) as BaseController; // di-контейнер повертає готовий екземпляр з усіма залежностями

                        console.log("controller", controller);

                        const res = await (controller.handler(route) as (context: any) => Promise<any>)(context);
                        // створення функції-обробника для конкретного роута контролера, context - виклик обробника і передача параметрів, асинхронне повернення даних

                        console.log("HANDLER RESPONSE:", res);

                        if (res && res.redirect) { // перенаправлення у разі повернення redirect
                            return {
                                redirect: res.redirect
                            };
                        }
                        if (config.redux) {
                              console.log("REDUX DISPATCH:", {
                            entity: config.redux,
                            response: res
                        });
                            // запит виконався, але watcher не зареєстрував type, то SAGA не перехопить dispatch
                            // по завершенню роботи getServerSideProps відбувається серіалізація поточного стану серверного Store із записом в HTML-код (створеного під час запису reduxStore)
                            // браузер завантажує цей HTML починає виконуватися JS-код Next.js і next-redux-wrapper -> новий клієнтський Store 
                            // wrapper зчитує JSON-стан із тегу <script id="__NEXT_DATA__">, АВТОМАТИЧНО робить dispatch() з hydrate, спрацьовує case Hydrate -> клієнтський Store має дані серверного
                            store.dispatch({ // оскільки виконався запит до БД і є дані у вигляді res -> ці дані передаються 
                            // у вигляді dispatch (action) для зміни стануStore
                                type: `${config.redux}/FETCH_SUCCESS`,
                                payload: res
                            });

                        }

                        response = { // комплексний запис відповіді, може мати масиви декількох контролерів (users, tickets)
                            ...response,
                            ...res
                        };
                    }
                  
                    return { // повернення props на сторінку у вигляді props.data для подальшої роботи
                        props: {
                            data: response
                        }
                    };

                } catch (error: any) {

                    return {
                        redirect: {
                            destination: `/error?code=${
                                error.code ?? 500
                            }&message=${
                                encodeURIComponent(
                                    error.message ?? "Internal Server Error"
                                )
                            }`
                        }
                    };
                }
            }
        );
    }
}