// store/Reducers/ErrorReducer.ts
/*
export interface IErrorState {
    message: string | null;
    statusCode: number | null;
}

const initialState: IErrorState = {
    message: null,
    statusCode: null,
};

export function errorReducer(state = initialState, action: any): IErrorState {
    switch (action.type) {
        case 'SET_GLOBAL_ERROR':
            return {
                ...state,
                message: action.payload.message,
                statusCode: action.payload.statusCode || null,
            };
            
        case 'CLEAR_GLOBAL_ERROR':
            return {
                ...initialState
            };
            
        default:
            if (action.type.endsWith('/FAILURE') || action.type.endsWith('/ERROR')) {
                return {
                    ...state,
                    message: action.payload || 'Something went wrong',
                };
            }
            return state;
    }
}
*/