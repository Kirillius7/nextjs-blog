//import { ArtistModel } from "../../Server/Models/Artist";
import { Artist } from "../../Server/Models/Artist";
import { Event } from "../../Server/Models/Event";
import { EventSeries } from "../../Server/Models/Event_Series";
import { Ticket } from "../../Server/Models/Ticket";
import { EventArtist } from "./Event_Artist";
import { Order } from "./Order";
import { User } from "./User";

// 1. створюємо моделі
//const Ticket = TicketModel({ db: sequelize });
//const Event = EventModel({ db: sequelize });
//const EventSeries = Event_SerieModel({ db: sequelize });
//const Artist = ArtistModel({ db: sequelize });
//const User = UserModel({ db: sequelize });
//const Order = OrderModel({ db: sequelize });
//const EventArtist = Event_ArtistModel({ db: sequelize });
// 2. окремо асоціації

const models = {
  Ticket, Event, EventSeries, Artist, User, Order, EventArtist
};


//initAssociations({ Ticket, Event, EventSeries, Artist, User, Order, EventArtist });



//initAssociations({ Ticket });
//initAssociations({ Event, EventSeries, Artist });

import { initAssociations } from "./associations";
initAssociations(models);
export { models };
// 3. експортуємо

/*
export const models = {
  Ticket, Event, EventSeries, Artist, User, Order, EventArtist
};*/