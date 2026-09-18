// store/Reducers/EntityReducer.ts
import { HYDRATE } from "next-redux-wrapper";
export interface IEntityState {
    data: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: IEntityState = {
    data: null,
    loading: false,
    error: null,
};

// чиста Redux-функція, яка приймає стан та actions і повертає новий стан
export default function entityReducer(entityName: string) {
    return function reducer(state = initialState, action: any): IEntityState {
        // фабрика entityReducer(entityName) створює універсальний Reducer для конкретної сутності, яка під капотом знає:
        // - реагує тільки на динамічні actions з префіксом tickets/ (tickets/FETCH_START, tickets/FETCH_SUCCESS).
        // - повертає об'єкт стану у форматі { data, loading, error } для конкретного ключа state.entities.tickets.

        switch (action.type) { // метод приймає actions (dispatch запити), це може бути в ssr запиті чи worker generator
            case HYDRATE:
                return action.payload.entities?.[entityName] ?? state; // запис із серверного Store в клієнтський (за наявністю даних)
                // це дані, сформовані в combineReducers в Store
            case `${entityName}/FETCH_START`:
                return { ...state, loading: true, error: null };
            // payload - універсальний контейнер, що приймає і помилку, і дані з БД для зміни стану Store
            case `${entityName}/FETCH_SUCCESS`:
                return { ...state, loading: false, data: action.payload }; // action з worker generator, коли він отримав дані з БД
                
            case `${entityName}/FETCH_ERROR`:
                return { ...state, loading: false, error: action.payload }; // action з worker generator, коли виникла помилка
                
            default:
                return state; // повернення оновленого стану в обʼєкт Store
        }
    };
}
