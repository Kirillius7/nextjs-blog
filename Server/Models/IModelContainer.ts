import { asFunction } from "awilix";
/*
import type { ArtistType } from "./Artist";
import Artist from "./Artist";

import type { EventType } from "./Event";
import Event from "./Event";

import type { Event_ArtistType } from "./Event_Artist";
import EventArtist from "./Event_Artist";

import type { Event_SerieType } from "./Event_Series";
import EventSeries from "./Event_Series";

import type { OrderType } from "./Order";
import Order from "./Order";

import type { TicketType } from "./Ticket";
import Ticket from "./Ticket";

import type { UserType } from "./User";
import User from "./User";
*/

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
    EventArtist: Event_ArtistType;
    EventSeries: Event_SerieType;
    Artist: ArtistType;
} 

export const modelRegistrations = { 
    User: asFunction(User).singleton(), 
    Ticket: asFunction(Ticket).singleton(), 
    Order: asFunction(Order).singleton(), 
    Event: asFunction(Event).singleton(),
    EventArtist: asFunction(EventArtist).singleton(), 
    EventSeries: asFunction(EventSeries).singleton(), 
    Artist: asFunction(Artist).singleton(), 
}
