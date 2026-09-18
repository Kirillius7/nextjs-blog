/*import { ArtistModel } from "./Artist";
import { EventModel } from "./Event";
import { Event_ArtistModel } from "./Event_Artist";
import { Event_SerieModel } from "./Event_Series";*/
//import { models } from "./index";
//import sequelize from "../../lib/sequelize";

//export function initAssociations(sequelize) {

/*export function initAssociations(models) {*/

  /*const Event = EventModel({ db: sequelize });
  const EventSeries = Event_SerieModel({ db: sequelize });
  const Artist = ArtistModel({ db: sequelize });
  const EventArtist = Event_ArtistModel({ db: sequelize });*/
import type { IModelContainer } from "./index";

//import { sequelizeModels } from "./createModels";
  //const { Ticket, Event, EventSeries, Artist, EventArtist, User, Order } = sequelizeModels;
export default function initAssociations(
  models: IModelContainer
) {

  
const {
    Ticket,
    Event,
    EventSeries,
    Artist,
    EventArtist,
    User,
    Order
  } = models;

  console.log("INIT ASSOCIATIONS CALLED");

  console.log("Event instance:", Event === (Event as any));
  console.log("Artist instance:", Artist === (Artist as any));

  console.log("Event.associations BEFORE:", Object.keys(Event.associations || {}));
  if (Event.associations && Event.associations.Performers) {
    return;
  }

  Event.belongsToMany(Artist, {
    through: EventArtist,
    foreignKey: "eventid",
    as: "Performers",
  });

  // зворотній звʼязок
  Artist.belongsToMany(Event, {
    through: EventArtist,
    foreignKey: "artistid",
  });

  console.log("Event.associations AFTER:", Object.keys(Event.associations || {}));

  
  Event.belongsTo(EventSeries, {
    foreignKey: "seriesid",
    as: "series",
  });

  

  Event.belongsTo(User, {
    foreignKey: "userid",
    as: "createdEvent"
  })



User.hasMany(Order, {
  foreignKey: "userid",
  sourceKey: "id",
  as: "orders"
});

Order.belongsTo(User, {
  foreignKey: "userid",
  targetKey: "id",
  as: "userOrder"
});



  Ticket.belongsTo(Order, {
    foreignKey: "orderid",
    as: "orderTicket"
  })

  

  Order.hasMany(Ticket, {
    foreignKey: "orderid",
    as: "tickets"
  })

  Ticket.belongsTo(Event, {
    foreignKey: "eventid",
    as: "eventTicket"
  })

  Ticket.belongsTo(User, {
    foreignKey: "userid",
    as: "userTicket"
  })

}
  

  //return { Event, EventSeries, Artist, EventArtist };
/*}*/