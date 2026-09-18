
//-> main
/*
import { Artist } from "../../Server/Models/Artist";
import { Event } from "../../Server/Models/Event";
import { EventSeries } from "../../Server/Models/Event_Series";
import { Ticket } from "../../Server/Models/Ticket";
import { EventArtist } from "./Event_Artist";
import { Order } from "./Order";
import { User } from "./User";
*/



//import { asFunction } from "awilix";
//import User, {UserType} from "./User";

// 1. створюємо моделі
//const Ticket = TicketModel({ db: sequelize });
//const Event = EventModel({ db: sequelize });
//const EventSeries = Event_SerieModel({ db: sequelize });
//const Artist = ArtistModel({ db: sequelize });
//const User = UserModel({ db: sequelize });
//const Order = OrderModel({ db: sequelize });
//const EventArtist = Event_ArtistModel({ db: sequelize });
// 2. окремо асоціації

//-> main
/*
const models = {
  Ticket, Event, EventSeries, Artist, User, Order, EventArtist
};
*/


/*
//initAssociations({ Ticket, Event, EventSeries, Artist, User, Order, EventArtist });
//initAssociations({ Ticket });
//initAssociations({ Event, EventSeries, Artist });
*/


//-> main
/*
import { initAssociations } from "./associations";
initAssociations(models);
export { models };
*/


// 3. експортуємо

/*

export const models = {
  Ticket, Event, EventSeries, Artist, User, Order, EventArtist
};*/


import { asFunction } from "awilix";

import Artist, { ArtistType } from "./Artist";
import Event, { EventType } from "./Event";
import EventArtist, { Event_ArtistType } from "./Event_Artist";
import EventSeries, { Event_SerieType } from "./Event_Series";
import Order, { OrderType } from "./Order";
import Ticket, { TicketType } from "./Ticket";
import User, { UserType } from "./User";

export interface IModelContainer {
  User: UserType;
  Ticket: TicketType;
  Order: OrderType;
  Event: EventType;
  Artist: ArtistType;
  EventArtist: Event_ArtistType;
  EventSeries: Event_SerieType
}

export default {
  User: asFunction(User).singleton(),
  Ticket: asFunction(Ticket).singleton(),
  Order: asFunction(Order).singleton(),
  Event: asFunction(Event).singleton(),
  Artist: asFunction(Artist).singleton(),
  EventArtist: asFunction(EventArtist).singleton(),
  EventSeries: asFunction(EventSeries).singleton(),
};