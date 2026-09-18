if (typeof document !== 'undefined') {
    throw new Error('Do not import `config.js` from inside the client-side code.');
}

import { GRANT, IRoles, IRules } from './acl/types';
import { UserRole as ROLE } from "./constants";

export const SUPER = [ROLE.ADMIN];

export const roles: IRoles = {
    [ROLE.GUEST]: {
        display: 'guest',
        url: '/',
    },

    [ROLE.CLIENT]: {
        display: 'client',
        parent: [ROLE.GUEST],
        url: '/',
    },

    [ROLE.ADMIN]: {
        display: 'admin',
        parent: [ROLE.CLIENT],
        url: '/',
        private: true,
    },
};

export const rules: IRules = {
    /*****************************************************************************************
    ************************************* Other Resources ********************************
    ******************************************************************************************/

    // 'socket/*': {
    //     allow: {
    //         [ROLE.USER] : [GRANT.READ],
    //     }
    // },

    '/tickets/*': {
        allow: {
            [ROLE.GUEST]: [GRANT.READ, GRANT.GET],
            [ROLE.ADMIN]: [GRANT.WRITE], // Керування квитками
        }
    },
    'events/*': {
        allow: {
            [ROLE.GUEST]: [GRANT.READ], // Перегляд подій
            [ROLE.ADMIN]: [GRANT.WRITE, GRANT.GET]// Створення подій
        }
    },
    '/users/*': {
        allow: {
            [ROLE.ADMIN]: [GRANT.READ], // зчитування даних
        }
    },

    /*****************************************************************************************
    ************************************* MENU / NAVIGATION **********************************
    ******************************************************************************************/

    // Глобальний дозвіл на базове меню
    "NavigationMenu/*": {
        allow: {
            [ROLE.GUEST]: [GRANT.READ],
            [ROLE.CLIENT]: [GRANT.READ, GRANT.WRITE],
            [ROLE.ADMIN]: [GRANT.EXECUTE],
        },
    },

    // Окремо захищаємо пункти меню, які гість не повинен бачити взагалі
    "NavigationMenu/Users": {
        allow: {
            [ROLE.ADMIN]: [GRANT.READ] // Тільки адмін бачить вкладку користувачів
        }
    },

    "NavigationMenu/Orders": {
        allow: {
            [ROLE.CLIENT]: [GRANT.READ] // Тільки авторизовані бачать свої замовлення
        }
    },

    /*****************************************************************************************
    ************************************* ROUTES / URLs resources ****************************
    ******************************************************************************************/

    // Публічні сторінки (доступні абсолютно всім)
    '/': {
        allow: { [ROLE.GUEST]: [GRANT.READ, GRANT.GET] },
    },
    '/events': {
        allow: { [ROLE.GUEST]: [GRANT.READ, GRANT.GET] },
    },
    
    '/api/events': {
        allow: { [ROLE.GUEST]: [GRANT.READ, GRANT.GET] },
    },
    '/series': {
        allow: { [ROLE.GUEST]: [GRANT.READ, GRANT.GET], [ROLE.ADMIN]: [GRANT.WRITE] },
    },
    '/api/event_series': {
        allow: { [ROLE.GUEST]: [GRANT.READ, GRANT.GET], [ROLE.ADMIN]: [GRANT.POST] },
    },
    '/artists': {
        allow: { [ROLE.GUEST]: [GRANT.READ, GRANT.GET] },
    },
    '/api/artists': {
        allow: { [ROLE.GUEST]: [GRANT.READ, GRANT.GET] },
    },
    '/tickets': {
        allow: { [ROLE.GUEST]: [GRANT.READ, GRANT.GET] },
    },
    '/api/tickets': {
        allow: { [ROLE.GUEST]: [GRANT.READ, GRANT.GET] },
    },
    
    '/experience': {
        allow: { [ROLE.GUEST]: [GRANT.READ, GRANT.GET] },
    },

    '/users': {
        allow: { [ROLE.ADMIN]: [GRANT.READ, GRANT.GET] },
    },
    '/api/users': {
        allow: { [ROLE.ADMIN]: [GRANT.READ, GRANT.GET] },
    },

    '/login': {
        allow: { [ROLE.GUEST]: [GRANT.POST, GRANT.GET] },
    },
    '/api/login': {
        allow: { [ROLE.GUEST]: [GRANT.POST, GRANT.GET] },
    },
    '/api/logout': {
        allow: { [ROLE.CLIENT]: [GRANT.POST, GRANT.GET] },
    },
    '/registration': {
        allow: { [ROLE.GUEST]: [GRANT.POST, GRANT.GET] },
    },
    '/api/register': {
        allow: { [ROLE.GUEST]: [GRANT.POST, GRANT.GET] },
    },

    // Приватна сторінка користувача (лише для авторизованих)
    '/orders': {
        allow: {
            [ROLE.ADMIN]: [GRANT.READ, GRANT.GET] // Клієнт бачить свої замовлення, адмін теж (через parent)
        }
    },

    '/api/orders': {
        allow: {
            [ROLE.ADMIN]: [GRANT.READ, GRANT.GET] // Клієнт бачить свої замовлення, адмін теж (через parent)
        }
    },


    // Секретні сторінки адміна (повний замок для гостей та мемберів)
    
    /*'/users': {
        allow: {
            [ROLE.ADMIN]: [GRANT.READ] // Керування базою користувачів
        }
    }
    
    '/tickets/new': {
        allow: {
            [ROLE.ADMIN]: [GRANT.READ, GRANT.WRITE] // Сторінка, де адмін додає квитки
        }
    },*/


   

    // '/login': {
    //     allow: {
    //         [ROLE.GUEST]: [GRANT.READ, GRANT.GET],
    //     },
    // },
};
