//import Guard from "../../../acl/Guard";
//import { roles, rules } from "../../../config.acl";

// оголошення які саме сервіси та конфігурації повинні бути доступні додаткам.
export interface IClientContainer {
 config: any;

    logger: {
        debug(message?: string, ...meta: any[]): void;
        info(message?: string, ...meta: any[]): void;
        error(message?: string, ...meta: any[]): void;
    };
    /*
    roles: typeof roles;
    rules: typeof rules;

    guard: Guard;*/
}