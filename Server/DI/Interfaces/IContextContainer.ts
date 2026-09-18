import type { IControllerContainer } from "Server/Controllers/index";
import type { IModelContainer } from "Server/Models/IModelContainer";
import type { IServiceContainer } from "Server/Services/index";
import { roles, rules } from "../../../config.acl";
import type Sequelize from "../../../lib/sequelize";
// TypeScript contract контейнера, опис речей, які має cradle
// файл лише реєструє blueprint, вказує Awilix як їх створювати, але реальне створення відбувається lazy.
export default interface IContextContainer 
    extends IModelContainer, 
        IServiceContainer, 
        IControllerContainer { 
    config: any; 
    db: typeof Sequelize;
    
    logger: {
    debug(message?: string, ...meta: any[]): void;
    info(message?: string, ...meta: any[]): void;
    error(message?: string, ...meta: any[]): void;
    };

    roles: typeof roles; 
    rules: typeof rules; 

}