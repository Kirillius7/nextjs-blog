// store/types.ts

// опис структури квитка
export interface ITicket {
    id: string;
    eventName: string;   
    price: number;       
    quantity: number;     
    date: string;      
}

export interface IArtist {
  getArtistList: any;
    
}

export interface IEvent {
  getEventList: any;
    
}

// 2. Описуємо карту всіх динамічних сутностей у вашому додатку.
// Коли ви додаватимете нові сутності (наприклад, orders), просто дописуйте їх сюди.
export interface Entities {
    tickets: Record<string, ITicket>;
    // orders?: Record<string, any>; // приклад для майбутнього
}
