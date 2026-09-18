import { configureStore } from '@reduxjs/toolkit'; // підключення кастомних middleware (SAGA, розширення Redux)
import { createWrapper } from 'next-redux-wrapper'; // обгортка для інтеграції Redux із сервером Next.js (створення серверного Store під час SSR запиту, злиття з клієнтським за допомогою hydrate)
import { combineReducers } from 'redux'; // базова бібліотека Redux, обʼєднує всі reducers в один головний редюсер (Root Reducer) 
// middleware для обробки складних асинхронних операцій (запити до API, фонові процеси) за допомогою функцій-генераторів (function*)
// - createSagaMiddleware - створення проміжного шару у Redux Middleware для перехоплення заданих actions
// - fork(saga) ефект-оператор, який запускає SAGA у фоновому паралельному режимі (без блокування головного потоку), щоб Watcher "слухав" запити
// - all([...]) ефект-оператор (аналог Promise.all), який приймає масив фонових саг і запускає їх одночасно
import createSagaMiddleware from "redux-saga";
import { all, fork } from 'redux-saga/effects';
import "./Entities/ArtistEntity";
import BaseEntity from './Entities/BaseEntity';
import "./Entities/EventEntity";
import "./Entities/TicketEntity";

//import { errorReducer } from './errorReducer';
//import { authReducerContainer } from './Reducers/AuthReducer';
//import paginationReducer from './Reducers/PaginationReducer';
//import 
import {
    FLUSH, PAUSE, PERSIST, Persistor, persistReducer, persistStore,
    PURGE, REGISTER, REHYDRATE
} from 'redux-persist'; // "білий список" Redux Toolkit (запобігти помилки несеріалізованих даних у actions)
import storage from 'redux-persist/lib/storage'; // збереження даних в localStorage у якості клієнтського сховища 
//import type IContextContainer from "Server/DI/Interfaces/IContextContainer";
//import BaseContext from '../../Server/DI/BaseContext';
import BaseContext from './di/BaseContext';
import entityReducer from './entityReducer';
//import { authReducerContainer } from './Reducers/AuthReducer';
//import { authReducerContainer } from './auth/authReducer';
import { IClientContainer } from './di/IClientContainer';
import { Entities, IArtist, IEvent, ITicket } from "./types";

export type AppStore = ReturnType<ReturnType<ReduxStore["getMakeStore"]>>; // обʼєкт-екземпляр Redux Store
export type AppState = ReturnType<AppStore["getState"]> & { // використовується у useSelector для зчитування даних з Store (підказує поля обʼєкта)
    entities:{
        tickets: Record<string, ITicket>; // тип результату виконання store.getState() і об'єднує його (&) із конкретною структурою редюсерів
        artists: Record<string, IArtist>;
        events: Record<string, IEvent>;
    }
}
export type AppDispatch = AppStore["dispatch"]; // тип функції відправки aсtions (Dispatch)

export default class ReduxStore extends BaseContext { // успадкування BaseContext для доступу до this.di
    private mWrapper: ReturnType<typeof createWrapper>; // створення ізольованого Redux Store під кожен HTTP-запит на сервері
    private persistConfig; // об'єкт налаштувань для бібліотеки redux-persist в браузері (key + localStorage)
    private mState?: AppState // приватне посилання на створений розширений екземпляр Redux Store
    private mPersistor?: Persistor; // екземпляр контролера від redux-persist, керує процесом запису та відновлення стану з localStorage.
    public get state(){ 
        return this.mState;
    }

    public get wrapper(){
        return this.mWrapper;
    }

    public get persistor(){
        return this.mPersistor;
    }

    constructor(di: IClientContainer){
        super(di);
        this.mWrapper = this.createWrapper(); // процес створення Store
        this.persistConfig = {
            key: 'root',
            storage,
        };
    }

    /*
    public updateGuard(auth: AuthState){
        const {roles, rules} = auth;
        const role = auth.identity?.role;
        this.di.guard.update(roles, rules, role);

    }*/
    public get useWrappedStore(){ // використовується у _app.js для створення клієнтського Store та Hydration (переніс даних із серверного на браузерний Store)
        return this.mWrapper.useWrappedStore;
    }

    public get getServerSideProps(){ // заповнення даних на серверній частині Store під час ssr-запиту
        return this.mWrapper.getServerSideProps;
    }

    private *rootSaga(){ // SAGA очікує на дії користувача для перехоплення 
        // запуск SAGA у фоновому асинхронному режимі (кожна сутність має свій SAGA-Watcher, тому "обробка" виконується одночасно)
        const sagas = BaseEntity.sagas(this.di).map(saga => fork(saga));
        yield all([
            ...sagas
        ]);
        // всі SAGA-Watcher програми обгорнені у fork() (таким чином вони працюють паралельно і не блокують одна одну) 
        // і відбувається передача в all(), щоб rootSaga одночасно запустила весь фоновий моніторинг застосунку.
        // Цей варіант допомагає тим, що не потребує імпортувати купу SAGA-Watcher в 1 файл
    }

    private reducers(){ // метод для генерації reducers для кожного entity, який треба обробити
        const names: (keyof Entities)[] = Reflect.getMetadata("reducers", BaseEntity) ?? [];
        console.log("REGISTERED REDUCERS:", names);
        const reducers = names.reduce((acc, name) => ({
            ...acc,
            [name]: entityReducer(name) // entityReducer(tickets/users....) => tickets: function reducer(state, action) { ... },
        }), {} as Record<string, ReturnType<typeof entityReducer>>);
        return reducers 
        /* повернення 
        {
            tickets: function reducer(state, action) -> знає, що entityName === "tickets" }, -> при кожному виклику повинна повернути об'єкт { data, loading, error }
            users: function reducer(state, action) -> знає, що entityName === "users" }
        }
        */
    }


    // створення ізольованого Store (повертає getMakeStore кожний новий запит на сервері або під час ініціалізації)
    private getMakeStore(){
        const rootSaga = this.rootSaga.bind(this); // привʼязка rootSaga до this 
        const reducers = this.reducers(); // зчитування метаданих з BaseEntity
        const makeStore = () => { // обʼєднання reducers в одному місці (state), створення ізольованого Store
            const reducer = combineReducers({ 
            entities: combineReducers(reducers), // state.entities.tickets, state.entities.users / action.payload.entities
            //error: errorReducer,
            //auth: authReducerContainer(this.di),
            //pagination: paginationReducer
            })
        const persistedReducer = persistReducer(this.persistConfig, reducer); // логіка автоматичного збереження та відновлення стану з localStorage/sessionStorage
        const sagaMiddleware = createSagaMiddleware(); // cтворення екземпляру Middleware для Redux-Saga для перехоплення actions і роботи з side effects
        const store = configureStore({ // конфігурація store
            reducer: persistedReducer,
            middleware: (gDM) => gDM({
                thunk: false,
                serializableCheck: { // перевірка, щоб у стан та actions не потрапляли несеріалізовані дані (функції, проміси, класи).
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                }
            }).concat(sagaMiddleware), // додавання до ланцюжка обробки actions
            devTools: true,
        });
        const saga = sagaMiddleware.run(rootSaga); // запуск генератора SAGA
        const persistor = persistStore(store); // контролер для читання/запису з localStorage
        this.mPersistor = persistor; // змінна для роботи у _app.js
        const state = {
            ...store,
            _persistor: persistor,
            sagaTask: saga, // очікування всіх асинхронних операцій перед відправкою html 
        }
        this.mState = state as any; // посилання на розширений Store
        return state;
    }
    return makeStore;
}

    private createWrapper(){
        const makeStore = this.getMakeStore();
        return createWrapper(makeStore);
    }
}

