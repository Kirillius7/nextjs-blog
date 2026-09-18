// store/Entities/TicketEntity.ts
import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from '../../../lib/api'; // xFetch
import BaseEntity from './BaseEntity';

// Реєстрація "tickets" в метадані для автоматичного створення редюсера
const existingReducers = Reflect.getMetadata("reducers", BaseEntity) ?? [];
Reflect.defineMetadata("reducers", [...existingReducers, "orders"], BaseEntity);

export default class OrderEntity extends BaseEntity {
    
    // SAGA Worker, Side Effect
    private static *fetchOrdersSaga(action: any): Generator<any, void, any> {
        console.log('2. SAGA STARTED', action);
        try {
            yield put({ type: 'orders/FETCH_START' }); // зміна стану loading для роботи з UI
            // SAGA Worker призупиняє роботу, sagaMiddleware отримує опис дії (об'єкт put), відбувається dispatch, 
            // запуск entityReducer -> зміна стану Store -> React компоненти "на підписці" змінюють дані -> 
            // sagaMiddleware викликає generator.next() для поновлення в роботі SAGA Worker (все це sync, на відміну від call - там async)
            
            // Зчитування eventId з payload action
            const { orderid } = action.payload ?? {};
            const url = orderid ? `orders?orderid=${orderid}` : "orders";

            console.log('3. REQUEST URL:', url);
            // Виклик xRead через SAGA
            const response = yield call(() => api.xRead(url)); 
             console.log('4. API RESPONSE:', response);
            // Запис отриманих дані в Redux
            yield put({ type: 'orders/FETCH_SUCCESS', payload: response }); // --> FETCH_SUCCESS "трігерить" Reducer, який змінює стан на основі отриманих даних
        } catch (error: any) {
            yield put({ type: 'orders/FETCH_ERROR', payload: error.message }); // --> FETCH_ERROR "трігерить" Reducer, який повідомляє про помилку (а "підписники" можуть її прочитати)
        }
    }

    // SAGA Watcher, Side Effect
    // виконання конструкції static одразу при зчитуванні класу, оскільки це є статичним блоком
    static {
        this.registerSaga(() => function* () { // передача в BaseEntity функцію-фабрику SAGA
            // ефект-оператор takeLatest скасує попередній запит, якщо користувач швидко перемикає івенти
            yield takeLatest('orders/FETCH_REQUEST', OrderEntity.fetchOrdersSaga); // у разі запиту tickets/FETCH_REQUEST - виклик fetchTicketsSaga
        });
    }
}
