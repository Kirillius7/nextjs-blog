/*import { ArtistModel } from "./Artist";
import { EventModel } from "./Event";
import { Event_ArtistModel } from "./Event_Artist";
import { Event_SerieModel } from "./Event_Series";*/
//import { models } from "./index";
//import sequelize from "../../lib/sequelize";

//export function initAssociations(sequelize) {
export function initAssociations(models) {
  /*const Event = EventModel({ db: sequelize });
  const EventSeries = Event_SerieModel({ db: sequelize });
  const Artist = ArtistModel({ db: sequelize });
  const EventArtist = Event_ArtistModel({ db: sequelize });*/
  const { Ticket, Event, EventSeries, Artist, EventArtist, User, Order } = models;

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

  Event.belongsTo(EventSeries, {
    foreignKey: "seriesid",
    as: "series",
  });

  // 

  Event.belongsTo(User, {
    foreignKey: "userid",
    as: "createdEvent"
  })

  //
  /*Order.belongsTo(User, {
    foreignKey: "userid",
    as: "userOrder"
  })

  User.hasMany(Order, {
    foreignKey: "userid",
    as: "orders"
  })*/
//  

//
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

//

  Ticket.belongsTo(Order, {
    foreignKey: "orderid",
    as: "orderTicket"
  })

  // 

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

  
  

  //return { Event, EventSeries, Artist, EventArtist };
}