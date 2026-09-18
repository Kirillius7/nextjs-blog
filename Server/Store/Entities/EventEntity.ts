import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from '../../../lib/api'; // xFetch
import BaseEntity from './BaseEntity';

// Реєстрація "tickets" в метадані для автоматичного створення редюсера
const existingReducers = Reflect.getMetadata("reducers", BaseEntity) ?? [];
Reflect.defineMetadata("reducers", [...existingReducers, "events"], BaseEntity);

export default class EventEntity extends BaseEntity {
    
    // SAGA Worker, Side Effect
    private static *fetchEventsSaga(action: any): Generator<any, void, any> {
        console.log('2. SAGA STARTED', action);
        try {
            yield put({type: 'events/FETCH_START'});

            //const { currentFilters } = action.payload ?? {};
            //const { seriesID } = action.payload ?? {};
const params = action.payload ?? {};
        
        // 1. Безпечно витягуємо currentFilters з дефолтним порожнім об'єктом {} для Reset
        const currentFilters = params.currentFilters ?? {};
        const { seriesId } = params;

        console.log("currentFilters:", currentFilters);
        console.log("seriesId:", seriesId);

        // 2. Фільтруємо пусті значення (працює і для фільтрів, і для пустого об'єкта при reset)
        const cleanFilters = Object.fromEntries(
            Object.entries(currentFilters).filter(
                ([_, value]) => value !== undefined && value !== null && value !== ""
            )
        ) as Record<string, string>;

        // 3. Додаємо seriesId, якщо він є
        if (seriesId) {
            cleanFilters.seriesId = String(seriesId);
        }

        const query = new URLSearchParams(cleanFilters).toString();
            //console.log(query) 
            //console.log(seriesID) 
            const url = query ? `events?${query}` : 'events';
            console.log('3. REQUEST URL:', url);

            const response = yield call(() => api.xRead(url));

            console.log('4. API RESPONSE:', response);


            yield put({type: 'events/FETCH_SUCCESS', payload: response});
        }
        catch(error: any){
            yield put({type: 'events/FETCH_ERROR', payload: error.message});
        }
    }

    static {
        this.registerSaga(() => function*() {
            yield takeLatest('events/FETCH_REQUEST', EventEntity.fetchEventsSaga); // у разі запиту tickets/FETCH_REQUEST - виклик fetchTicketsSaga
        })

    }
}