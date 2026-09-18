// store/Entities/BaseEntity.ts
//import IContextContainer from '../../Server/DI/Interfaces/IContextContainer';
//import IContextContainer from "../../../Server/DI/Interfaces/IContextContainer";
import { IClientContainer } from "../di/IClientContainer";
export default abstract class BaseEntity { // шаблон-каркас для конкретних сутностей і успадкування спільної логіки

    // сховище для entity функцій-фабрик saga
    protected static mSagas: ((di: IClientContainer) => any)[] = [];

    // 
    public static sagas(di: IClientContainer) {
        return this.mSagas.map(sagaFactory => sagaFactory(di)); // повернення згенерованих та готових до запуску SAGA-функцій.
    }

    // Реєстратор саг для нащадків
    protected static registerSaga(sagaFactory: (di: IClientContainer) => any) {
        this.mSagas.push(sagaFactory);
    }
}
