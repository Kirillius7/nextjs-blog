// store/Entities/TicketEntity.ts
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { api } from '../../../lib/api'; // xFetch
import { AppState } from '../ReduxStore';
import BaseEntity from './BaseEntity';

// Реєстрація "tickets" в метадані для автоматичного створення редюсера
const existingReducers = Reflect.getMetadata("reducers", BaseEntity) ?? [];
Reflect.defineMetadata("reducers", [...existingReducers, "tickets"], BaseEntity);

export default class TicketEntity extends BaseEntity {
    
    // SAGA Worker, Side Effect
    private static *fetchTicketsSaga(action: any): Generator<any, void, any> {
        console.log('2. SAGA STARTED', action);
        try {
            yield put({ type: 'tickets/FETCH_START' }); // зміна стану loading для роботи з UI
            // SAGA Worker призупиняє роботу, sagaMiddleware отримує опис дії (об'єкт put), відбувається dispatch, 
            // запуск entityReducer -> зміна стану Store -> React компоненти "на підписці" змінюють дані -> 
            // sagaMiddleware викликає generator.next() для поновлення в роботі SAGA Worker (все це sync, на відміну від call - там async)
            const params = action.payload ?? {};
            const { eventid } = params;
            const cleanParams = Object.fromEntries(Object.entries(params).filter(
                ([_, value]) => value !== undefined && value !== null && value !== ""))

            const query = new URLSearchParams(cleanParams as Record <string, string>).toString();
            //const url = eventId != null ? `tickets?eventid=${eventId}` : "tickets";
            const url = query ? `tickets?${query}` : "tickets";
            console.log("url", url)
            console.log('3. REQUEST URL:', url);
            // Виклик xRead через SAGA
            const response = yield call(() => api.xRead(url)); 
            console.log("response", response)
            let currentPayload = response;

        // Якщо це точковий запит під конкретний eventId — виконуємо Merge
        if (eventid != null && response?.getTicketsList?.tickets) {
            const currentStateTickets: any = yield select(
                (state: AppState) => state.entities?.tickets?.data
            );

            const existingTickets = currentStateTickets?.getTicketsList?.tickets ?? {};
            const newTicketsForEvent = response.getTicketsList.tickets[eventid] ?? response.getTicketsList.tickets;

            currentPayload = {
                ...response,
                getTicketsList: {
                    ...response.getTicketsList,
                    tickets: {
                        ...existingTickets,            // Зберігаємо інші події (1, 2, 4)
                        [eventid]: newTicketsForEvent  // Оновлюємо лише подію 3
                    }
                }
            };
        }

        // 🟢 ВАЖЛИВО: yield put повинен бути ТУТ (поза блоком if)
        yield put({ type: 'tickets/FETCH_SUCCESS', payload: currentPayload });
             //console.log('4. API RESPONSE:', response);
             //console.log('4. API currentPayload:', currentPayload);

            // Запис отриманих дані в Redux
            //yield put({ type: 'tickets/FETCH_SUCCESS', payload: response }); // --> FETCH_SUCCESS "трігерить" Reducer, який змінює стан на основі отриманих даних
            
            //yield put({ type: 'tickets/FETCH_SUCCESS', payload: currentPayload });
        } catch (error: any) {
            yield put({ type: 'tickets/FETCH_ERROR', payload: error.message }); // --> FETCH_ERROR "трігерить" Reducer, який повідомляє про помилку (а "підписники" можуть її прочитати)
        }
    }

    // SAGA Watcher, Side Effect
    // виконання конструкції static одразу при зчитуванні класу, оскільки це є статичним блоком
    static {
        this.registerSaga(() => function* () { // передача в BaseEntity функцію-фабрику SAGA
            // ефект-оператор takeLatest скасує попередній запит, якщо користувач швидко перемикає івенти
            yield takeLatest('tickets/FETCH_REQUEST', TicketEntity.fetchTicketsSaga); // у разі запиту tickets/FETCH_REQUEST - виклик fetchTicketsSaga
        });
    }
}
