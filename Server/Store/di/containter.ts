//import { roles, rules } from "../../../config.acl";
import { IClientContainer } from "./IClientContainer";

// конкретний JS-об'єкт (екземпляр), який імплементує інтерфейс IClientContainer.
// він збирає в одному місці всі працюючі інструменти (екземпляри класів, налаштування), які потрібні для виконання коду в браузері
const clientContainer: IClientContainer = {
    config: {
        apiUrl: "http://localhost:3000"
    },

    logger: {
        debug: (...args: any[]) => console.debug(...args),
        info: (...args: any[]) => console.info(...args),
        error: (...args: any[]) => console.error(...args)
    },
    /*
    roles,
    rules,

    guard: new Guard(roles, rules)*/
};

export default clientContainer;