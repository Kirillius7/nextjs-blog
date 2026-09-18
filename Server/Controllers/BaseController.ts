import Guard from "@/acl/Guard";
import BaseContext from "Server/DI/BaseContext";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserRole as ROLE } from "../../constants";
//import {rules} from "../../config.acl"
import { createRouter } from 'next-connect';
import { IControllerContainer } from ".";
import { GRANT } from '../../acl/types';
import { AccessDeniedError, InternalServerError, NotFound } from "../Exceptions";
export interface ActionProps{ // захист від деструктурізації req зловмисниками
    body?: any, // payload - дані з форм, json-обʼєкти для обробки post/put
    params?: any, // динамічні сегменти url (id)
    query?: any, // фільтрація та впорядкування даних 
    guard?: any,
    user?: any,
    session?: any, // контекст авторизованого користувача (id, роль, права доступу)
}

export default class BaseController extends BaseContext {
    constructor(opts) {
        super(opts);
        console.log("BaseController constructor");
        //this.WrapExpressMethods();
    }

    protected async prepareSessionAndGuard(
        req, res, route, isSSR: "ssr" | "api"
    ){
        /*
        if(!req.identity){
            this.di.logger.debug()
            req.identity = await getIdentityFromAPI(req,res)
        }*/
       console.log("req.identity", req.identity)
       console.log("user::::", req.user?.role)
       
       /*
       if(!req.identity){
        try{
        req.identity = {
            role: req.user?.role ?? ROLE.GUEST}
        console.log("req.user.role", req.identity?.role)
        }
        catch(e){
            console.log(e.error)
        }
       }
       */
      if(!req.identity){
        req.identity = req.user;
      }
       console.log("GUARD: start");
       if(!req.guard){        //this.di.logger.debug();
        console.log("in guard")
        console.log("req.identity", req.identity)
        req.guard = new Guard(this.di.roles, this.di.rules, req.identity?.role ?? ROLE.GUEST)
        console.log("after guard");
        //console.log("context", req.req)
        //console.log("req", req)

       }
       console.log("GUARD: role =", req.guard.role);
        console.log("GUARD: resource =", route);
        console.log("GUARD: method =", req.method);
        if (!req.guard.allow(req.method as GRANT,route)) { // get
            /*let message = "";
            if(route.includes("/api"))
                message = "You don't have the rights to proceed the operation"

            throw new AccessDeniedError(message);*/
            if(isSSR === "api")
                throw new AccessDeniedError("You don't have the rights to proceed the operation");
            else
                throw new AccessDeniedError();
        }
        console.log("GUARD: ACCESS ALLOWED");
    }

    /*
    private createActionProps(req:any, route: string):ActionProps{ // розподіл між ssr/api запитами (де req.req - context.req (ssr), req - req (api))

        const actualReq = req.req ?? req; // перевірка для асигнування справжнього http-обʼєкта запиту
        const isSSR = !!req.req; // перевірка на ssr запит, якщо існує - (! false, !! true), інакше (! true, !! false)
        if(!req.guard) throw new AccessDeniedError();
        req.guard.resource = route;
        console.log("req.guard.resource = route;", req.guard)

        return{
            body: actualReq.body,
            query: (isSSR ? req.query : actualReq.query) ?? {}, 
            // вкладення, оскільки context.query/context.params існує, а context.body - ні, тому треба context.req.body
            user: req.user ? {id: req.user.id, username: req.user.username, email: req.user.email, role: req.user.role} : undefined, 
            params: (isSSR ? req.params : actualReq.params) ?? {},
            guard: req.guard,
            session: actualReq.session,
        };
    }*/

    private createActionProps(context:any, route: string):ActionProps{ // розподіл між ssr/api запитами (де req.req - context.req (ssr), req - req (api))

        const actualReq = context.req ?? context; // перевірка для асигнування справжнього http-обʼєкта запиту
        if(!actualReq.guard) throw new AccessDeniedError();
        actualReq.guard.resource = route;
        //console.log("req.guard.resource = route;", req.guard)

        return{
            body: actualReq.body,
            query: (context.query ?? actualReq.query) ?? {}, 
            // вкладення, оскільки context.query/context.params існує, а context.body - ні, тому треба context.req.body
            user: actualReq.user ? {id: actualReq.user.id, username: actualReq.user.username, email: actualReq.user.email, role: actualReq.user.role} : undefined, 
            params: (context.params ?? actualReq.params) ?? {},
            guard: actualReq.guard,
            session: actualReq.session,
        };
    }
    public static getInvokeOutput(req: NextApiRequest): string { // метод для вилучення шляху для його використання у разі неявного запису шляху
        const error = new Error('UnknownRouteErrorMessage'); // обробка помилки
        const symbols = Object.getOwnPropertySymbols(req); // повернення масиву унікальних символів, захованих у req

        /*symbols всередині об'єкта req ->
        req = { 
            "method": "GET",
            "url": "/series?page=1",
            "headers": { ... },
            
            [Symbol(NextInternalRequestMeta)]: {
                "match": { "route": "/series" },
                "invokePath": "/series",
                "invokeOutput": "/series",
                "initUrl": "/series?page=1",
                "isSharedRuntime": true
            }
        }*/
        
        const metaSymbol = symbols.find( // пошук символа-масива, що відповідає умові (неможливо просто взяти символ, оскільки це створить інший, з подібним значенням)
            (sym) => sym.toString() === "Symbol(NextInternalRequestMeta)"
        );

        if (!metaSymbol) throw error; // виклик помилки, якщо такий символ відсутній 
        
        const meta = (req as any)[metaSymbol]; // 
        if (!meta?.invokeOutput) throw error;
        //return meta.invokeOutput as string; // звернення до поля всередині масиву [Symbol(NextInternalRequestMeta)], повернення шляху у якості рядка
        let route = meta.invokeOutput as string;
        route = route.replace(/\[([^\]]+)\]/g, ":$1");

        return route;
    }

    /*
    private async execution(action, context){
        const callback = this[action].bind(this);
        return await callback({
            query: context.query || {},
            body: context.body || {},
            params: context.params || {}
        })
    }
    // виклик методу під час запиту користувача, де є порівняння зареєстрованих даних у таблиці (http-методи і шлях)
    public handler(routeName: string) { 
        // routeName - шлях для роботи Controller (ssr -> сторінка, api -> endpoint)
        console.log("routeName =", routeName);
        // виведення всіх методів за шляхом (вказаним у декораторі) та прототипом this контролера (де метадані і зберігають всі дані, а не в instance) 
        const members: any = Reflect.getMetadata(routeName, Object.getPrototypeOf(this)); // this === controller --> this.di.service
        console.log("meta =", members);

        if (!routeName.startsWith("/api")) { // розподіл запитів на ssr та api 
            console.log(`[BaseController] Ініціалізація SSR-хендлера для: ${routeName}`);

            // робота з асинхронною функцією, яку повертає handler, у форматі async => {return {props: {}}}
            // Store.getServerSideProps - метод, який буде викликати функцію, що повернув handler
            return async (context: any) => {
                console.log("=== SSR EXECUTION START ===");

                // Оскільки для сторінок використовується декоратор @GET, дані лежать у ключі GET, тому треба перевірити наповнення
                if (!members || !Array.isArray(members.GET) || members.GET.length === 0) {
                    throw new Error(`No GET action found for SSR route: ${routeName}`);
                }
                
                let response = {};
                for(const action of members.GET){
                    response[action] = await this.execution(action, context);
                }

                return response;
            }
        }
        console.log(`[BaseController] Ініціалізація API-роутера для: ${routeName}`);
        // диспетчер-таблиця маршрутів (перевірка http-методів (get, put, delete) та маршрутів для виклику функцій (/api/event_series))
        const router = createRouter<NextApiRequest, NextApiResponse>(); 

        Object.keys(members).forEach((method) => { // members - [get, put, post], method - get, put 
            const methodName: string = method.toLowerCase(); 
            //const action = members[method][i]; // getList, createElement (одиничний елемент метода)
            //const callback = this[action].bind(this); // створення метода з біндінгом до поточного instance контролера
            if (typeof router[methodName] !== "function") return;

            const routerMethod = (router as any)[methodName]; // ініціалізація router.get/router.post
            // реєстрація маршруту, який використовується під час виклику routerMethod з передачею req,res
            routerMethod(routeName, async (req: any, res: any) => { // express стиль запису, де метод отримує (req, res) і відправляє лише req
                console.log(`=== API HIT: ${method} ${routeName} ===`);                
                try
                {
                    let response = {}; // обʼєкт відповіді
                    for(const action of members[method]){ // проходження по action в http-методах шляху (шлях[метод] = ["action1", "action2"])
                        const data = await this.execution(action, req);
 
                        response[action] = data; // {action1: [{},{}], action2: [{}, {}]}
                    }
                    console.log(response);
                    const statusCode = req["response"]?.statusCode || 200;
                    return res.status(statusCode).json({success: true, data: response})
                }
                catch(error)
                {
                    const statusCode = req["errorResponse"]?.statusCode || 500;
                        //return this.fail(res, error.message || "Internal Server Error", statusCode);
                    return res.status(statusCode).json({ success: false, message: error.message || "Internal Server Error"});
                }              
            });     
        })

        return router.handler({
            onError: (err, apiReq, apiRes) => {
                console.error("Router Error:", err);
                apiRes.status(500).json({ success: false, message: "Internal Server Error" });
            },
            onNoMatch: (apiReq, apiRes) => {
                apiRes.status(405).json({ success: false, message: `Method ${apiReq.method} is not allowed!` });
            },
        });
    }
    */

    // створення методу, що повертає router у якості типу даних
    /*
    private ApiRequestRouter(routeName: string, members: any, isSSR: boolean): ReturnType<typeof createRouter<NextApiRequest, NextApiResponse>> {
        const router = createRouter<NextApiRequest, NextApiResponse>();
        console.log("mda")
        Object.keys(members).forEach((method) => {
            const methodName = method.toLowerCase();
            if (typeof (router as any)[methodName] !== "function") return;

            const routerMethod = (router as any)[methodName];

            routerMethod(routeName, async (req: any, res: any) => {
                console.log(`=== API HIT: ${method} ${routeName} ===`);

                    if (req.body && typeof req.body === 'string') {
                        req.body = JSON.parse(req.body);
                    }

                    const actualReq = req.req ?? req;
                    const actualRes = req.res ?? res;
                    console.log("actualReq.query:", actualReq.query);
                    console.log("actualReq.params:", actualReq.params);

                    const classMiddlewares = Reflect.getMetadata("middlewares", Object.getPrototypeOf(this), "") ?? [];
                    if (classMiddlewares.length > 0) {
                        //await this.runMiddlewares(classMiddlewares, req, res);
                        //await this.runMiddlewares(classMiddlewares, req.req ?? req, req.res ?? res)
                        await this.runMiddlewares(classMiddlewares, actualReq, actualRes)
                    }

                    let response: any = {};
                    
                    for (const actionName of members[method]) {
                        //const actionName = typeof action === 'string' ? action : action.actionName;
                        
                        // Локальний Middleware для кожного конкретного екшену
                        //const methodMiddlewares = Reflect.getMetadata("middlewares", Object.getPrototypeOf(this), actionName) ?? [];
                        const methodMiddlewares = Reflect.getMetadata("middlewares", Object.getPrototypeOf(this), actionName) ?? [];
                        
                        if (methodMiddlewares.length > 0) {
                            
                            // коли promise повертає resolve - handler повертає собі процес керування
                            //const allowed = await this.runMiddlewares(methodMiddlewares, req, res);
                            //const allowed = await this.runMiddlewares(methodMiddlewares, req.req ?? req, req.res ?? res);
                            const allowed = await this.runMiddlewares(methodMiddlewares, actualReq, actualRes);

                            if (!allowed) {
                                continue; 
                                // перейти до наступного action, якщо поміж методів розташований "чутливий" action, який має права доступу
                            }
                        }
                        //const actionProps = this.createActionProps(req);
                        //await this.prepareSessionAndGuard(req, res, routeName);
                        await this.prepareSessionAndGuard(actualReq, actualRes, routeName);
                        console.log("USER", actualReq.user)
                        const actionProps = this.createActionProps(actualReq, routeName);
                        
                        console.log("actionProps", actionProps)                                   
                        response[actionName] = await (this as any)[actionName](actionProps); 
                        //response[action] = await (this as any)[action](actionProps); 
                    }

                    const statusCode = req["response"]?.statusCode || 200;
                    return res.status(statusCode).json({ success: true, data: response });
            });
        });

        return router;
    }
    */
    
    private ApiRequestRouter(routeName: string, members: any[]): 
        ReturnType<typeof createRouter<NextApiRequest, NextApiResponse>> {

    const router = createRouter<NextApiRequest, NextApiResponse>();


    for (const member of members) {

        const methodName = member.method.toLowerCase();
        const actionName = member.handler;

        if (typeof (router as any)[methodName] !== "function") {
            console.warn(`Unsupported HTTP method: ${member.method}`);
            continue;
        }

        const routerMethod = (router as any)[methodName];

        routerMethod(routeName, async (req: any, res: any) => {
            console.log(`=== API HIT: ${member.method} ${routeName} ===`);
            console.log("action:", actionName);
        //try{


            if (req.body && typeof req.body === "string") {
                req.body = JSON.parse(req.body);
            }
            const isSSR = !req.method && req.req; // перевірка на тип запиту (context містить req як внутрішній обʼєкт)
            const actualReq = req.req ?? req;
            const actualRes = req.res ?? res;

            console.log("actualReq.query:", actualReq.query);
            console.log("actualReq.params:", actualReq.params);

            console.log("classMiddlewares")
            const classMiddlewares =
                Reflect.getMetadata(
                    "middlewares",
                    Object.getPrototypeOf(this),
                    ""
                ) ?? [];

            if (classMiddlewares.length > 0) {
                await this.runMiddlewares(classMiddlewares, actualReq, actualRes);
            }

            await this.prepareSessionAndGuard(actualReq, actualRes, routeName, "api");

            console.log("methodMiddlewares")

            const methodMiddlewares =
                Reflect.getMetadata(
                    "middlewares",
                    Object.getPrototypeOf(this),
                    actionName
                ) ?? [];

            if (methodMiddlewares.length > 0) {

                const allowed = await this.runMiddlewares(methodMiddlewares, actualReq, actualRes);

                if (!allowed) {
                    return res.status(403).json({
                        success: false,
                        message: "Access denied"
                    });
                }
            }

            console.log("prepareSessionAndGuard")

            //await this.prepareSessionAndGuard(actualReq, actualRes, routeName);

            const actionProps = this.createActionProps(actualReq, routeName);

            console.log("actionProps:", actionProps);


            const result =
                await (this as any)[actionName](actionProps);

            if (result === undefined) {
                throw new InternalServerError(
                    `Controller action "${actionName}" returned undefined for API route "${routeName}".`
                );
            }

            const statusCode = req["response"]?.statusCode || 200;

            return res.status(statusCode).json({ // серіалізація під капотом, додавання HTTP-заголовка, відправка у мережевий сокет
                success: true,
                data: {
                    [actionName]: result
                }
            });
            // на цьому етапі відбувається завершення обробки запиту, і відповідь відправляється клієнту. 
            // Nodejs Garbage Collector звільняє памʼять, що була використана для обробки запиту, включаючи обʼєкти req та res, а також будь-які локальні змінні всередині цього блоку коду.
        
       /* }
        catch(err: any)
        {
            console.error(`[API Error on ${routeName}]:`, err);

            const statusCode = err?.code ?? err?.statusCode ?? 403;

            return res.status(statusCode).json({
                success: false,
                message: err?.message || "Access denied",
                error: err?.options || undefined
            });
        }*/
        });
    }

    return router;
}
    
    // factory-функція, що обслуговує 2 різних джерела виклику (ssr/api) і повертає функцію на етапі початку роботи сервера
    public handler(route?: string) {

        return async (req: any, res?: NextApiResponse) => { // callback, який визначає, з яким типом запиту треба працювати (req,res / context)

            // api: browser -> http-запит (get /api/event_series) -> nextjs -> handler(req,res)
            // у api випадку обʼєкт req містить method (put, get), body, query, url ("/api/event_series?scale=local"), cookies
            // api (nextjs api engine): http-запит -> генерація json, nextjs (nextjs ssr engine): http-запит (query, params, locale, resolvedUrl) -> генерація props 
            // ssr: відкриття page -> браузер робить get /series -> nextjs переходить до pages/series.tsx -> виклик getServerSideProps(context)
            // у ssr випадку context містить req, res, query, params, resolvedUrl ("/series"). Запит: http-request, додаткова інформація, можливості nextjs
            
            const isSSR = !req.method && req.req; // перевірка на тип запиту (context містить req як внутрішній обʼєкт)
            
            //const actualReq = req.req ?? req; // SSR: req -> context (HTTP-запит у context.req), API: req -> NextApiRequest

            //const actionProps = this.createActionProps(req, isSSR)
            const routeName = route ?? BaseController.getInvokeOutput(req.req ?? req);

            console.log("controller:", this.constructor.name);

            console.log("routeName:", routeName);

            console.log("metadata keys:", Reflect.getMetadataKeys(Object.getPrototypeOf(this)));
            console.log("training: ", req.user)
            // виведення всіх методів за шляхом (вказаним у декораторі) та прототипом this контролера (де метадані і зберігають всі дані, а не в instance) 
            
            /*const metadataRouteName = routeName.replace(
                /\[([^\]]+)\]/g,
                ":$1"
            );*/

            //console.log("routeName:", routeName);
            //console.log("metadataRouteName:", metadataRouteName);

            /*const members: any = Reflect.getMetadata(
                metadataRouteName,
                Object.getPrototypeOf(this)
            );*/
            const members = Reflect.getMetadata(routeName, Object.getPrototypeOf(this));
            
            //const members: any = Reflect.getMetadata(routeName, Object.getPrototypeOf(this));
            console.log("members", members);
            if (!members) {
                if (isSSR) 
                    //throw new Error(`Metadata not found for ${routeName}`);
                    throw new NotFound(`Metadata not found for ${routeName}`)

                return res?.status(404).json({ success: false, message: `Metadata not found` });
            }

            if (isSSR) { // обробка SSR-запиту
                /*
                if (!members.GET || !Array.isArray(members.GET) || members.GET.length === 0) {
                    throw new Error(`No GET action found for SSR route: ${routeName}`);
                }*/
                console.log("before find")
                const getAction = members.find(member => member.method.toLowerCase() === "get");
                console.log("after find")

                if (!getAction) {
                    //throw new Error(`No GET action found for SSR route: ${routeName}`);
                    throw new InternalServerError(`No GET action found for SSR route: ${routeName}`);
                }

                const actualReq = req.req ?? req;

                const actualRes = req.res ?? res;
                // збір глобального middlewares для класу на основі пустого targetkey (що відповідає за назву метода)
                const classMiddlewares = Reflect.getMetadata("middlewares", Object.getPrototypeOf(this), "") ?? [];
                if (classMiddlewares.length > 0) {
                    // асинхронний виклик, оскільки middleware повинен працювати першим для потенційного доступу до методу
                    //await this.runMiddlewares(classMiddlewares, req.req ?? req, req.res ?? res);
                    
                    await this.runMiddlewares(classMiddlewares, actualReq, actualRes);
                }
                await this.prepareSessionAndGuard(actualReq, actualRes, routeName, "ssr")

                let response: any = {};
                //for (const actionName of members.GET) {
                for(const action of members){
                    if (action.method.toLowerCase() !== "get") {continue;}

                    const actionName = action.handler;
                    /*
                    console.log("actionName",actionName)
                    console.log("actionName.methodName",actionName.methodName)
                    
                    const actionName1 = typeof actionName === 'string' ? actionName : actionName.methodName;
                    const actionAllow = typeof actionName === 'object' ? actionName.allow : undefined;
                    const actionDeny = typeof actionName === 'object' ? actionName.deny : undefined;*/

                    //

                    //const methodMiddlewares = Reflect.getMetadata("middlewares", Object.getPrototypeOf(this), actionName) ?? [];
                    const methodMiddlewares = Reflect.getMetadata("middlewares", Object.getPrototypeOf(this), actionName) ?? [];
                    console.log("as",methodMiddlewares)          
                    if (methodMiddlewares.length > 0) {
                        
                        // promise чекає поки всі middlewares не виконають роботу (у метода може бути 1+ middlewares для pipeline)
                        // коли promise повертає resolve - handler повертає собі процес керування
                        //const allowed = await this.runMiddlewares(methodMiddlewares, req.req ?? req, req.res ?? res);
                        const allowed = await this.runMiddlewares(methodMiddlewares, actualReq, actualRes);

                        if (!allowed) {
                            continue; // перейти до наступного action, якщо resolve(false)
                        }
                    }
                    console.log("before prepare");
                    //await this.prepareSessionAndGuard(req,res,routeName)
                    console.log("========== REQUEST DEBUG ==========");
                    console.log("req.user:", req.user);
                    console.log("req.req?.user:", req.req?.user);

                    console.log("req.session:", req.session);
                    console.log("req.req?.session:", req.req?.session);
                    console.log("actualReq === req:", actualReq === req);
                    console.log("actualReq === req.req:", actualReq === req.req);
                    console.log("actualReq.user:", actualReq.user);
                    console.log("actualReq.session:", actualReq.session);
                    console.log("==================================");
                    //await this.prepareSessionAndGuard(actualReq, actualRes, routeName)
                    console.log("after prepare");
                    console.log("req.query", req.query);
                    console.log("req.req.query", req.req.query);
                    console.log("req.user", req.user);
                    console.log("actualReq.user", actualReq.user);

                    //const actionProps = this.createActionProps(req, routeName);
                    const actionProps = this.createActionProps(req, routeName);
                    
                    //const actionProps = this.createActionProps(actualReq);


                    //const result = await (this as any)[actionName](actionProps) // get rid of req (hide it) передача параметрів, body, session
                    
                    
                    //console.log("ACTION PROPS:", actionProps);
                    //const result = await (this as any)[action](actionProps) // get rid of req (hide it) передача параметрів, body, session 
                    console.log("actionProps",actionProps)              
                    //const result = await (this as any)[actionName1](actionProps)
                    const result = await (this as any)[actionName](actionProps)
                    
                    if (result === undefined) {
                        //throw new Error(`Controller action "${actionName}" returned undefined for SSR route "${routeName}".`);
                        throw new InternalServerError(`Controller action "${actionName}" returned undefined for SSR route "${routeName}".`);
                    }
                    if (result === null) {
                        //throw new Error(`Controller action "${actionName}" returned undefined for SSR route "${routeName}".`);
                        throw new NotFound(`Data for SSR route "${routeName}" was not found.`);
                    }
                    if(result && typeof result === "object" && "redirect" in result){
                        return result;
                    }
                    response[actionName] = result;
                    //response[actionName1] = result;
                }
                // return response.
                console.log("req.identity",actualReq.identity)
                return {
                    ...response,
                    identity: actualReq.identity ?? null
                };
            }

            const router = this.ApiRequestRouter(routeName, members); // обробка api-запиту
            // у даному випадку реєстрація всіх router[method] буде відбуватись в рамках запиту, але виконається лише 1 за умовами метод

            return router.handler({
                onError: (err: any, apiReq, apiRes) => {
                    console.error("Router Error:", err);
                    apiRes.setHeader("X-Error-Handling", err?.answer);
                    apiRes.status(err?.code ?? StatusCodes.INTERNAL_SERVER_ERROR).
                    /*json({ success: false, code: err?.code ?? StatusCodes.INTERNAL_SERVER_ERROR, 
                        message: err?.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR, details: err?.details || undefined, answer: err?.answer || undefined});*/
                    
                    /*json({ success: false, message: err?.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR, 
                            error: err?.options || undefined});*/
                    json({ success: false, message: err?.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR, 
                            error: {code: err?.code, details: err?.details || undefined}});

                },
                onNoMatch: (apiReq, apiRes) => {
                    apiRes.status(StatusCodes.METHOD_NOT_ALLOWED).json({ success: false, message: `Method ${apiReq.method} not allowed!` });
                },
            })(req, res!); // Передача поточних req та res в роутер з обробниками для виклику після запиту користувача і повернення callback 
        };
    }

    private async runMiddlewares(
        middlewares: any[],
        req: any,
        res: any
        ): Promise<boolean> {
        return new Promise((resolve, reject) => { // const allowed = await runMiddlewares -> створення головного Promise у стані очікування
            let index = 0;

            const next = (result?: boolean | Error) => { 
            // у next можна передати помилку (яку треба явно вказувати як next(error)) -> це явно вплине на подальше проходження по рекурсії

                if(result instanceof Error)
                    return reject(result);

                if(result === false)
                    return resolve(false);

                if(index >= middlewares.length)
                    return resolve(true);

                const middleware = middlewares[index++];

                try{
                    middleware(req,res,next); // виклик анонімного метода, параметр next() повертає на початок функції next = (result?: boolean | Error)
                }
                catch(e){
                    reject(e); // обробка від неконтрольованої помилки (яку не передали через next(error))
                    // місце, де обробляється помилка middleware, коли в ній throw error -> зміна стану головного promise з pending на reject
                }

            };

            next(); // перший запуск, що забезпечує подальше проходження по рекурсії після виклику runMiddlewares і створення головного Promise

        });
    }

    public static getRoutes(){
        const routes: [string, keyof IControllerContainer][] = 
        Reflect.getMetadata ("routes", BaseController) ?? [];
        return routes;
    }
}